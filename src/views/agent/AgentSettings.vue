<template>
  <div class="min-h-screen bg-[var(--light-blue)] pb-16">
    <div class="max-w-2xl mx-auto px-4 pt-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-[var(--royal-blue)]">Settings</h1>
        <p class="text-[var(--steel-blue)] mt-1">
          Manage your notification preferences
        </p>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-[var(--royal-blue)]"></div>
      </div>

      <div v-else class="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 space-y-8">
        <!-- Notification Sound Toggle -->
        <div class="flex items-center justify-between gap-4">
          <div>
            <h3 class="font-semibold text-gray-900">Notification Sound</h3>
            <p class="text-sm text-gray-500 mt-1">
              Play a sound when a new notification arrives
            </p>
          </div>

          <button
            type="button"
            @click="toggleSound"
            class="relative w-14 h-8 rounded-full transition-colors"
            :class="settings.notification_sound_enabled ? 'bg-[var(--royal-blue)]' : 'bg-gray-300'"
          >
            <span
              class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform"
              :class="settings.notification_sound_enabled ? 'translate-x-6' : 'translate-x-0'"
            />
          </button>
        </div>

        <!-- Sound Choice -->
        <div v-if="settings.notification_sound_enabled" class="pt-2">
          <h3 class="font-semibold text-gray-900 mb-3">Choose Sound</h3>

          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <button
              v-for="sound in soundOptions"
              :key="sound.value"
              type="button"
              @click="selectSound(sound.value)"
              class="px-4 py-3 rounded-2xl border text-sm font-medium transition"
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
            class="mt-4 text-sm font-medium text-[var(--royal-blue)] hover:underline"
          >
            ▶ Preview sound
          </button>
        </div>

        <!-- Email Notifications -->
        <div class="flex items-center justify-between gap-4 pt-6 border-t border-gray-100">
          <div>
            <h3 class="font-semibold text-gray-900">Email Notifications</h3>
            <p class="text-sm text-gray-500 mt-1">
              Receive important updates by email
            </p>
          </div>

          <button
            type="button"
            @click="toggleEmail"
            class="relative w-14 h-8 rounded-full transition-colors"
            :class="settings.email_notifications ? 'bg-[var(--royal-blue)]' : 'bg-gray-300'"
          >
            <span
              class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform"
              :class="settings.email_notifications ? 'translate-x-6' : 'translate-x-0'"
            />
          </button>
        </div>

        <!-- Push Notifications -->
        <div class="flex items-center justify-between gap-4 pt-6 border-t border-gray-100">
          <div>
            <h3 class="font-semibold text-gray-900">Push Notifications</h3>
            <p class="text-sm text-gray-500 mt-1">
              Allow browser push notifications (coming soon)
            </p>
          </div>

          <button
            type="button"
            @click="togglePush"
            class="relative w-14 h-8 rounded-full transition-colors"
            :class="settings.push_notifications ? 'bg-[var(--royal-blue)]' : 'bg-gray-300'"
          >
            <span
              class="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow transition-transform"
              :class="settings.push_notifications ? 'translate-x-6' : 'translate-x-0'"
            />
          </button>
        </div>

        <p v-if="saveMessage" class="text-sm text-green-600 pt-2">
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

const router = useRouter()
const loading = ref(true)
const saveMessage = ref('')
const saving = ref(false)

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
      .from('agent_settings')
      .select('*')
      .eq('agent_id', user.id)
      .maybeSingle()

    if (error) throw error

    if (data) {
      settings.notification_sound_enabled = data.notification_sound_enabled
      settings.notification_sound = data.notification_sound || 'default'
      settings.email_notifications = data.email_notifications
      settings.push_notifications = data.push_notifications
    } else {
      const { error: insertError } = await supabase
        .from('agent_settings')
        .insert({
          agent_id: user.id,
          notification_sound_enabled: true,
          notification_sound: 'default',
          email_notifications: true,
          push_notifications: true,
        })

      if (insertError) throw insertError
    }
  } catch (err) {
    console.error('Load agent settings error:', err)
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
      .from('agent_settings')
      .upsert(
        {
          agent_id: user.id,
          notification_sound_enabled: settings.notification_sound_enabled,
          notification_sound: settings.notification_sound,
          email_notifications: settings.email_notifications,
          push_notifications: settings.push_notifications,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'agent_id' }
      )

    if (error) throw error

    saveMessage.value = 'Settings saved'
    setTimeout(() => {
      saveMessage.value = ''
    }, 2000)
  } catch (err) {
    console.error('Save agent settings error:', err)
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

const togglePush = async () => {
  settings.push_notifications = !settings.push_notifications
  await saveSettings()
}

onMounted(loadSettings)
</script>