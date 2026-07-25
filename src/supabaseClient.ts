
  // src/supabaseClient.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://kmkcrttmchdvnpggqwey.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtta2NydHRtY2hkdm5wZ2dxd2V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4NjE4ODksImV4cCI6MjEwMDQzNzg4OX0.kcKAibpHYkgNyWoW4NNK6JxKm64rjQmTEIQ-i_tB35k"   

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  }
})

