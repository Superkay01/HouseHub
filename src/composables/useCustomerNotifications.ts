import { ref, onMounted, onBeforeUnmount } from 'vue'
import { supabase } from '@/supabaseClient'
import { playNotificationSound } from '@/utils/notificationSound'

const unreadCount = ref(0)
let channel: any = null
let started = false

async function loadSettings(userId: string) {
  const { data } = await supabase
    .from('customer_settings')
    .select('notification_sound_enabled, notification_sound')
    .eq('customer_id', userId)
    .maybeSingle()

  return {
    enabled: data?.notification_sound_enabled ?? true,
    sound: data?.notification_sound ?? 'default',
  }
}

async function refreshUnreadCount(userId: string) {
  const { count } = await supabase
    .from('customer_notifications')
    .select('*', { count: 'exact', head: true })
    .eq('customer_id', userId)
    .eq('is_read', false)

  unreadCount.value = count || 0
}

export function useCustomerNotifications() {
  const startNotificationListener = async () => {
    if (started) return
    started = true

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    await refreshUnreadCount(user.id)

    channel = supabase
      .channel(`customer-notifications-${user.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'customer_notifications',
          filter: `customer_id=eq.${user.id}`,
        },
        async (payload) => {
          // Increase unread badge
          unreadCount.value += 1

          // Play sound based on customer settings
          const settings = await loadSettings(user.id)
          if (settings.enabled && settings.sound !== 'none') {
            playNotificationSound(settings.sound)
          }

          // Optional: browser notification
          // if (Notification.permission === 'granted') {
          //   new Notification(payload.new.title, { body: payload.new.message })
          // }

          console.log('New notification:', payload.new)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'customer_notifications',
          filter: `customer_id=eq.${user.id}`,
        },
        async () => {
          await refreshUnreadCount(user.id)
        }
      )
      .subscribe()
  }

  const stopNotificationListener = () => {
    if (channel) {
      supabase.removeChannel(channel)
      channel = null
    }
    started = false
  }

  return {
    unreadCount,
    startNotificationListener,
    stopNotificationListener,
    refreshUnreadCount,
  }
}