<template>
  <div class="min-h-screen bg-[var(--light-blue)] pb-12 sm:pb-16">
    <div class="max-w-2xl mx-auto px-3 sm:px-4 pt-5 sm:pt-6 md:pt-8">
      <div class="mb-5 sm:mb-6 md:mb-8">
        <h1 class="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[var(--royal-blue)]">Settings</h1>
        <p class="text-xs sm:text-sm md:text-base text-[var(--steel-blue)] mt-1">
          Manage your notification preferences
        </p>
      </div>

      <div v-if="loading" class="flex justify-center py-16 sm:py-20">
        <div class="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-b-4 border-[var(--royal-blue)]"></div>
      </div>

      <div v-else class="bg-white rounded-xl sm:rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
        <!-- Notification Sound Toggle -->
        <div class="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
          <div class="min-w-0 flex-1">
            <h3 class="font-semibold text-sm sm:text-base text-gray-900">Notification Sound</h3>
            <p class="text-[11px] sm:text-xs md:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-snug">
              Play a sound when a new notification arrives
            </p>
          </div>

          <button
            type="button"
            @click="toggleSound"
            class="relative w-10 h-6 sm:w-12 sm:h-7 md:w-14 md:h-8 rounded-full transition-colors flex-shrink-0"
            :class="settings.notification_sound_enabled ? 'bg-[var(--royal-blue)]' : 'bg-gray-300'"
          >
            <span
              class="absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-white rounded-full shadow transition-transform"
              :class="settings.notification_sound_enabled ? 'translate-x-4 sm:translate-x-5 md:translate-x-6' : 'translate-x-0'"
            />
          </button>
        </div>

        <!-- Sound Choice -->
        <div v-if="settings.notification_sound_enabled" class="pt-1 sm:pt-2">
          <h3 class="font-semibold text-sm sm:text-base text-gray-900 mb-2 sm:mb-3">Choose Sound</h3>

          <div class="grid grid-cols-3 gap-1.5 sm:gap-2 md:gap-3">
            <button
              v-for="sound in soundOptions"
              :key="sound.value"
              type="button"
              @click="selectSound(sound.value)"
              class="px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl border text-[10px] sm:text-xs md:text-sm font-medium transition leading-tight"
              :class="
                settings.notification_sound === sound.value
                  ? 'border-[var(--royal-blue)] bg-[#f0f7ff] text-[var(--royal-blue)]'
                  : 'border-gray-200 hover:bg-gray-50 text-gray-700'
              "
            >
              {{ sound.label }}
            </button>
          </div>

          <button
            type="button"
            @click="previewSound"
            class="mt-3 sm:mt-4 text-xs sm:text-sm font-medium text-[var(--royal-blue)] hover:underline"
          >
            ▶ Preview sound
          </button>
        </div>

        <!-- Email Notifications -->
        <div class="flex items-center justify-between gap-2 sm:gap-3 md:gap-4 pt-3 sm:pt-4 md:pt-5 lg:pt-6 border-t border-gray-100">
          <div class="min-w-0 flex-1">
            <h3 class="font-semibold text-sm sm:text-base text-gray-900">Email Notifications</h3>
            <p class="text-[11px] sm:text-xs md:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-snug">
              Receive important updates by email
            </p>
          </div>

          <button
            type="button"
            @click="toggleEmail"
            class="relative w-10 h-6 sm:w-12 sm:h-7 md:w-14 md:h-8 rounded-full transition-colors flex-shrink-0"
            :class="settings.email_notifications ? 'bg-[var(--royal-blue)]' : 'bg-gray-300'"
          >
            <span
              class="absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-white rounded-full shadow transition-transform"
              :class="settings.email_notifications ? 'translate-x-4 sm:translate-x-5 md:translate-x-6' : 'translate-x-0'"
            />
          </button>
        </div>

        <!-- Browser Push -->
        <div class="pt-3 sm:pt-4 md:pt-5 lg:pt-6 border-t border-gray-100 space-y-2 sm:space-y-3 md:space-y-4">
          <div class="flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
            <div class="min-w-0 flex-1">
              <h3 class="font-semibold text-sm sm:text-base text-gray-900">Browser Push Notifications</h3>
              <p class="text-[11px] sm:text-xs md:text-sm text-gray-500 mt-0.5 sm:mt-1 leading-snug">
                Get system notifications even when the app is in the background
              </p>
            </div>

            <button
              type="button"
              @click="toggleBrowserPush"
              class="relative w-10 h-6 sm:w-12 sm:h-7 md:w-14 md:h-8 rounded-full transition-colors flex-shrink-0"
              :class="pushEnabled ? 'bg-[var(--royal-blue)]' : 'bg-gray-300'"
            >
              <span
                class="absolute top-0.5 sm:top-1 left-0.5 sm:left-1 w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 bg-white rounded-full shadow transition-transform"
                :class="pushEnabled ? 'translate-x-4 sm:translate-x-5 md:translate-x-6' : 'translate-x-0'"
              />
            </button>
          </div>

          <button
            type="button"
            @click="toggleBrowserPush"
            class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl bg-[var(--royal-blue)] text-white text-xs sm:text-sm hover:bg-[#001fa3] transition self-start sm:self-auto"
          >
            {{ pushEnabled ? 'Disable Browser Push' : 'Enable Browser Push' }}
          </button>

          <p class="text-[10px] sm:text-xs text-gray-400">
            Status: {{ pushEnabled ? 'Enabled' : 'Disabled' }}
          </p>
        </div>

        <p v-if="saveMessage" class="text-xs sm:text-sm text-green-600 pt-2">
          {{ saveMessage }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { supabase } from '@/supabaseClient'
import { playNotificationSound } from '@/utils/notificationSound'
import {
  enablePushNotifications,
  disablePushNotifications,
} from '@/utils/pushNotifications'

const router = useRouter()
const loading = ref(true)
const saveMessage = ref('')
const saving = ref(false)
const pushEnabled = ref(false)

const settings = reactive({
  notification_sound_enabled: true,
  notification_sound: 'default',
  email_notifications: true,
  push_notifications: true,
})

const soundOptions = [
  { value: 'default', label: 'Default Bell' },
  { value: 'soft', label: 'Soft Message' },
  { value: 'chime', label: 'SMS Chime' },
  { value: 'arcade', label: 'Arcade' },
  { value: 'level', label: 'Level Up' },
  { value: 'incoming', label: 'Incoming' },
  { value: 'new', label: 'New Alert' },
  { value: 'verse', label: 'Verse' },
  { value: 'viberating', label: 'Vibrating' },
  { value: 'none', label: 'No Sound' },
]

const loadSettings = async () => {
  loading.value = true
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('customer_settings')
      .select('*')
      .eq('customer_id', user.id)
      .maybeSingle()

    if (error) throw error

    if (data) {
      settings.notification_sound_enabled = data.notification_sound_enabled
      settings.notification_sound = data.notification_sound || 'default'
      settings.email_notifications = data.email_notifications
      settings.push_notifications = data.push_notifications
    } else {
      const { error: insertError } = await supabase
        .from('customer_settings')
        .insert({
          customer_id: user.id,
          notification_sound_enabled: true,
          notification_sound: 'default',
          email_notifications: true,
          push_notifications: true,
        })

      if (insertError) throw insertError
    }

    const { count } = await supabase
      .from('push_subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('role', 'customer')

    pushEnabled.value = (count || 0) > 0
  } catch (err) {
    console.error('Load settings error:', err)
    alert('Failed to load settings')
  } finally {
    loading.value = false
  }
}

const saveSettings = async () => {
  if (saving.value) return
  saving.value = true
  saveMessage.value = ''

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('customer_settings')
      .upsert(
        {
          customer_id: user.id,
          notification_sound_enabled: settings.notification_sound_enabled,
          notification_sound: settings.notification_sound,
          email_notifications: settings.email_notifications,
          push_notifications: settings.push_notifications,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'customer_id' }
      )

    if (error) throw error

    saveMessage.value = 'Settings saved'
    setTimeout(() => {
      saveMessage.value = ''
    }, 2000)
  } catch (err) {
    console.error('Save settings error:', err)
    alert('Failed to save settings')
  } finally {
    saving.value = false
  }
}

const toggleSound = async () => {
  settings.notification_sound_enabled = !settings.notification_sound_enabled
  await saveSettings()
}

const selectSound = async (value: string) => {
  settings.notification_sound = value
  await saveSettings()
  if (value !== 'none') playNotificationSound(value)
}

const previewSound = () => {
  if (settings.notification_sound !== 'none') {
    playNotificationSound(settings.notification_sound)
  }
}

const toggleEmail = async () => {
  settings.email_notifications = !settings.email_notifications
  await saveSettings()
}

const toggleBrowserPush = async () => {
  try {
    if (pushEnabled.value) {
      await disablePushNotifications()
      pushEnabled.value = false
      settings.push_notifications = false
      await saveSettings()
      alert('Browser push disabled')
    } else {
      await enablePushNotifications('customer')
      pushEnabled.value = true
      settings.push_notifications = true
      await saveSettings()
      alert('Browser push enabled')
    }
  } catch (err: any) {
    console.error(err)
    alert(err.message || 'Failed to update push settings')
  }
}

onMounted(loadSettings)
</script>