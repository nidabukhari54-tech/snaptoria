import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    flowType: 'pkce',
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

export type Profile = {
  id: string
  email: string | null
  plan: 'free' | 'pro'
  created_at: string
}

export type UsageLog = {
  id: string
  user_id: string
  tool_name: string
  used_at: string
}

export type ChatLead = {
  id: string
  email: string | null
  message: string
  created_at: string
}
