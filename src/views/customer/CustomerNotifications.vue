<template>
  <div class="min-h-screen bg-[var(--light-blue)] pb-12 sm:pb-16">
    <div class="max-w-3xl mx-auto px-3 sm:px-4 pt-5 sm:pt-6 md:pt-8">
      <div class="flex items-center justify-between gap-2 sm:gap-3 mb-5 sm:mb-6 md:mb-8">
        <div class="min-w-0">
          <h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[var(--royal-blue)]">
            Notifications
          </h1>
          <p class="text-xs sm:text-sm md:text-base text-[var(--steel-blue)] mt-1">
            Stay updated on inspections, requests, and reports
          </p>
        </div>

        <button
          v-if="unreadCount > 0"
          @click="markAllAsRead"
          class="text-xs sm:text-sm font-medium text-[var(--royal-blue)] hover:underline flex-shrink-0 whitespace-nowrap"
        >
          Mark all as read
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-16 sm:py-20">
        <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 border-[var(--royal-blue)]"></div>
      </div>

      <!-- Empty -->
      <div
        v-else-if="notifications.length === 0"
        class="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl border border-gray-100 p-6 sm:p-10 md:p-12 text-center"
      >
        <p class="text-3xl sm:text-4xl mb-2 sm:mb-3">🔔</p>
        <p class="text-base sm:text-lg font-medium text-gray-800">No notifications yet</p>
        <p class="text-xs sm:text-sm text-gray-500 mt-1">Updates about your inspections will appear here</p>
      </div>

      <!-- List -->
      <div v-else class="space-y-2 sm:space-y-3">
        <div
          v-for="item in notifications"
          :key="item.id"
          class="relative bg-white rounded-xl sm:rounded-2xl md:rounded-3xl border p-3 sm:p-4 md:p-5 transition hover:shadow-md"
          :class="item.is_read ? 'border-gray-100' : 'border-[var(--royal-blue)] bg-[#f0f7ff]'"
        >
          <!-- Card content (clickable) -->
          <button
            type="button"
            @click="openNotification(item)"
            class="w-full text-left"
          >
            <div class="flex items-start gap-2 sm:gap-3 md:gap-4 pr-8 sm:pr-10">
              <div
                class="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 text-sm sm:text-base"
                :class="item.is_read ? 'bg-gray-100' : 'bg-[var(--royal-blue)] text-white'"
              >
                {{ typeIcon(item.type) }}
              </div>

              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between gap-2 sm:gap-3">
                  <h3 class="font-semibold text-sm sm:text-base text-gray-900 leading-snug">{{ item.title }}</h3>
                  <span class="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap flex-shrink-0">
                    {{ formatTime(item.created_at) }}
                  </span>
                </div>
                <p class="text-xs sm:text-sm text-gray-600 mt-1 line-clamp-2 leading-relaxed">{{ item.message }}</p>
                <p v-if="!item.is_read" class="text-[10px] sm:text-xs text-[var(--royal-blue)] font-medium mt-1.5 sm:mt-2">
                  New
                </p>
              </div>
            </div>
          </button>

          <!-- Delete button (absolute, top-right) -->
          <button
            type="button"
            @click.stop="deleteNotification(item)"
            :disabled="deletingId === item.id"
            class="absolute top-2 right-2 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition disabled:opacity-50"
            title="Delete notification"
            aria-label="Delete notification"
          >
            <!-- Spinner while deleting -->
            <svg
              v-if="deletingId === item.id"
              class="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" opacity="0.25" />
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4" stroke-linecap="round" />
            </svg>
            <!-- Trash icon -->
            <svg
              v-else
              class="w-3.5 h-3.5 sm:w-4 sm:h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
              <path d="M10 11v6M14 11v6" />
              <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'
import { playNotificationSound } from '@/utils/notificationSound'


const deletingId = ref<string | null>(null)   // ← ADD THIS


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
      .is('deleted_at', null)  
      .order('created_at', { ascending: false })

    if (error) throw error
    notifications.value = data || []
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const deleteNotification = async (item: any) => {
  if (deletingId.value) return

  const confirmed = window.confirm('Delete this notification? This cannot be undone.')
  if (!confirmed) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  deletingId.value = item.id

  // Optimistic update: remove from UI immediately
  const index = notifications.value.findIndex(n => n.id === item.id)
  const removed = index !== -1 ? notifications.value.splice(index, 1)[0] : null

  try {
    const { error } = await supabase
      .from('customer_notifications')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', item.id)
      .eq('customer_id', user.id)

    if (error) throw error
  } catch (err) {
    console.error('Delete failed:', err)
    // Restore on failure
    if (removed && index !== -1) notifications.value.splice(index, 0, removed)
    alert('Could not delete notification. Please try again.')
  } finally {
    deletingId.value = null
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