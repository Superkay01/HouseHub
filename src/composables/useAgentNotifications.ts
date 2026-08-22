import { ref } from 'vue'
import { supabase } from '@/supabaseClient'
import { playNotificationSound } from '@/utils/notificationSound'

const unreadCount = ref(0)
let channel: any = null
let started = false

async function loadSettings(agentId: string) {
  const { data } = await supabase
    .from('agent_settings')
    .select('notification_sound_enabled, notification_sound')
    .eq('agent_id', agentId)
    .maybeSingle()

  return {
    enabled: data?.notification_sound_enabled ?? true,
    sound: data?.notification_sound ?? 'default',
  }
}

async function refreshUnreadCount(agentId: string) {
  const { count } = await supabase
    .from('agent_notifications')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', agentId)
    .eq('is_read', false)

  unreadCount.value = count || 0
}

export function useAgentNotifications() {
  const startNotificationListener = async () => {
    if (started) return
    started = true

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await refreshUnreadCount(user.id)

    channel = supabase
      .channel(`agent-notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'agent_notifications',
          filter: `agent_id=eq.${user.id}`,
        },
        async () => {
          unreadCount.value += 1
          const settings = await loadSettings(user.id)
          if (settings.enabled && settings.sound !== 'none') {
            playNotificationSound(settings.sound)
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'agent_notifications',
          filter: `agent_id=eq.${user.id}`,
        },
        async () => {
          await refreshUnreadCount(user.id)
        }
      )
      .subscribe()
  }

  const stopNotificationListener = () => {
    if (channel) supabase.removeChannel(channel)
    channel = null
    started = false
  }

  return {
    unreadCount,
    startNotificationListener,
    stopNotificationListener,
    refreshUnreadCount,
  }
}