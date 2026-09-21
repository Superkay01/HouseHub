// utils/sendPush.ts
import { supabase } from '@/supabaseClient'

export async function sendPushToUser(opts: {
  user_id: string
  title: string
  body: string
  url?: string
  tag?: string
}) {
  const { data, error } = await supabase.functions.invoke('send-push', {
    body: opts,
  })

  if (error) {
    console.error('send-push error:', error)
    return false
  }
  return data
}