'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
          {
            auth: {
              flowType: 'pkce',
              autoRefreshToken: true,
              persistSession: true,
              detectSessionInUrl: true,
              storage: window.localStorage
            }
          }
        )

        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (!code) {
          router.push('/login?error=no_code')
          return
        }

        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
          console.error('Exchange error:', error.message)
          router.push('/login?error=auth_callback_failed')
        } else {
          router.push('/dashboard')
        }
      } catch (err) {
        console.error('Callback error:', err)
        router.push('/login?error=auth_callback_failed')
      }
    }

    handleCallback()
  }, [router])

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500 mx-auto mb-4" />
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    </div>
  )
}
