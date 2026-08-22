<template>
  <div class="min-h-screen bg-[var(--light-blue)] pb-16">
    <div class="max-w-3xl mx-auto px-4 pt-8">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-bold text-[var(--royal-blue)]">Notifications</h1>
          <p class="text-[var(--steel-blue)] mt-1">
            Stay updated on inspections, requests, and reports
          </p>
        </div>

        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="text-sm font-medium text-[var(--royal-blue)] hover:underline"
        >
          Mark all as read
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[var(--royal-blue)]"></div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="notifications.length === 0"
        class="bg-white rounded-3xl border border-gray-100 p-12 text-center"
      >
        <p class="text-4xl mb-3">🔔</p>
        <p class="text-lg font-medium text-gray-800">No notifications yet</p>
        <p class="text-sm text-gray-500 mt-1">Updates about your inspections will appear here</p>
      </div>

      <!-- List -->
      <div v-else class="space-y-3">
        <button
          v-for="item in notifications"
          :key="item.id"
          @click="openNotification(item)"
          class="w-full text-left bg-white rounded-3xl border p-5 transition hover:shadow-md"
          :class="item.is_read ? 'border-gray-100' : 'border-[var(--royal-blue)] bg-[#f0f7ff]'"
        >
          <div class="flex items-start gap-4">
            <div
              class="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
              :class="item.is_read ? 'bg-gray-100' : 'bg-[var(--royal-blue)] text-white'"
            >
              {{ typeIcon(item.type) }}
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-start justify-between gap-3">
                <h3 class="font-semibold text-gray-900">{{ item.title }}</h3>
                <span class="text-xs text-gray-400 whitespace-nowrap">
                  {{ formatTime(item.created_at) }}
                </span>
              </div>
              <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ item.message }}</p>
              <p v-if="!item.is_read" class="text-xs text-[var(--royal-blue)] font-medium mt-2">
                New
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'
import { playNotificationSound } from '@/utils/notificationSound'

const router = useRouter()

const loading = ref(true)
const notifications = ref<any[]>([])
const soundEnabled = ref(true)
const soundName = ref('default')
let channel: any = null

const unreadCount = computed(() => notifications.value.filter(n => !n.is_read).length)

const typeIcon = (type: string) => {
  const map: Record<string, string> = {
    inspection_update: '🏠',
    request_update: '📋',
    report_ready: '📄',
    payment: '💳',
    system: 'ℹ️',
    general: '🔔',
  }
  return map[type] || '🔔'
}

const formatTime = (date: string) => {
  const d = new Date(date)
  return d.toLocaleString('en-NG', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const loadSettings = async (userId: string) => {
  const { data, error } = await supabase
    .from('customer_settings')
    .select('notification_sound_enabled, notification_sound')
    .eq('customer_id', userId)
    .maybeSingle()

  if (error) {
    console.error('Settings load error:', error)
    return
  }

  if (data) {
    soundEnabled.value = !!data.notification_sound_enabled
    soundName.value = data.notification_sound || 'default'
  } else {
    await supabase.from('customer_settings').insert({
      customer_id: userId,
      notification_sound_enabled: true,
      notification_sound: 'default',
    })
    soundEnabled.value = true
    soundName.value = 'default'
  }

  console.log('Sound settings:', {
    enabled: soundEnabled.value,
    sound: soundName.value,
  })
}

const playSoundFromSettings = async (userId: string) => {
  // Always reload latest settings before playing
  await loadSettings(userId)

  if (!soundEnabled.value || soundName.value === 'none') {
    console.log('Sound disabled in settings')
    return
  }

  console.log('Playing sound:', soundName.value)
  playNotificationSound(soundName.value)
}

const fetchNotifications = async () => {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    await loadSettings(user.id)

    const { data, error } = await supabase
      .from('customer_notifications')
      .select('*')
      .eq('customer_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    notifications.value = data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const markAsRead = async (id: string) => {
  await supabase
    .from('customer_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('id', id)

  const item = notifications.value.find(n => n.id === id)
  if (item) {
    item.is_read = true
    item.read_at = new Date().toISOString()
  }
}

const markAllAsRead = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('customer_notifications')
    .update({ is_read: true, read_at: new Date().toISOString() })
    .eq('customer_id', user.id)
    .eq('is_read', false)

  notifications.value = notifications.value.map(n => ({
    ...n,
    is_read: true,
    read_at: new Date().toISOString(),
  }))
}

const openNotification = async (item: any) => {
  if (!item.is_read) await markAsRead(item.id)

  if (item.related_type === 'inspection' && item.related_id) {
    router.push('/customer/inspections')
  } else if (item.related_type === 'property_request' && item.related_id) {
    router.push(`/customer/requests/${item.related_id}`)
  } else if (item.property_id) {
    router.push(`/customer/properties/${item.property_id}`)
  }
}

// Temporary test button helper
const testSound = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await playSoundFromSettings(user.id)
}

const setupRealtime = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (channel) {
    await supabase.removeChannel(channel)
  }

  channel = supabase
    .channel(`customer-notifications-page-${user.id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'customer_notifications',
        filter: `customer_id=eq.${user.id}`,
      },
      async (payload) => {
        console.log('Realtime notification received:', payload.new)
        notifications.value.unshift(payload.new)
        await playSoundFromSettings(user.id)
      }
    )
    .subscribe((status) => {
      console.log('Realtime status:', status)
    })
}

onMounted(async () => {
  await fetchNotifications()
  await setupRealtime()
})

onBeforeUnmount(() => {
  if (channel) supabase.removeChannel(channel)
})
</script>