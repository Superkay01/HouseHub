
  // src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bfjgmbxjgmfmhdixthzd.supabase.co"
const supabaseAnonKey = "sb_publishable_oo_HeWa8vORkzI5f-d9HpQ_9VMnU4Cy"   

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
})