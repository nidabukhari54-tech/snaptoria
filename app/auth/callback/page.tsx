'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error.message)
          router.push('/login?error=auth_callback_failed')
          return
        }

        if (data.session) {
          router.push('/dashboard')
          return
        }

        // No session yet - wait briefly and check again
        setTimeout(async () => {
          const { data: retryData, error: retryError } = await supabase.auth.getSession()
          if (retryData?.session) {
            router.push('/dashboard')
          } else {
            router.push('/login?error=auth_callback_failed')
          }
        }, 2000)

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
