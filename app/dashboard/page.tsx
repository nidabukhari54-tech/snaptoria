'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Sparkles, LayoutDashboard, History, Settings, Crown, Loader2 } from 'lucide-react'
import { supabase, type UsageLog, type Profile } from '@/lib/supabase'
import { tools } from '@/lib/tools'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [usageLogs, setUsageLogs] = useState<UsageLog[]>([])
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.push('/login')
        return
      }

      setUser({ id: session.user.id, email: session.user.email || '' })

      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle()

      if (profileData) {
        setProfile(profileData as Profile)
      } else {
        // Create profile
        const { data: newProfile } = await supabase
          .from('profiles')
          .insert({ id: session.user.id, email: session.user.email })
          .select()
          .single()
        if (newProfile) setProfile(newProfile as Profile)
      }

      // Fetch usage logs
      const { data: logs } = await supabase
        .from('usage_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('used_at', { ascending: false })
        .limit(50)

      setUsageLogs((logs as UsageLog[]) || [])
      setLoading(false)
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSession()
    })

    return () => subscription.unsubscribe()
  }, [router])

  const upgradeToPro = async () => {
    // Placeholder for Stripe integration
    alert('Stripe integration coming soon! For now, Pro features are enabled for demo purposes.')
    // In production, this would redirect to Stripe Checkout
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-sky-500" />
      </div>
    )
  }

  const todayUsage = usageLogs.filter((log) => {
    const logDate = new Date(log.used_at)
    const today = new Date()
    return logDate.toDateString() === today.toDateString()
  }).length

  const isPro = profile?.plan === 'pro'

  return (
    <div className="container py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <LayoutDashboard className="h-8 w-8 text-sky-500" />
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.email}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Plan Status */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
                    {isPro && <Crown className="h-5 w-5 text-yellow-500" />}
                  </div>
                  <p className={isPro ? 'text-sky-600 font-medium' : 'text-gray-600'}>
                    {isPro ? 'Pro Plan - Unlimited' : 'Free Plan - Limited'}
                  </p>
                </div>
                {!isPro && (
                  <Button onClick={upgradeToPro} className="bg-sky-500 hover:bg-sky-600">
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                )}
              </div>

              {!isPro && (
                <div className="mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Today&apos;s Usage</span>
                    <span className="text-sm font-medium">{todayUsage} / 10 actions</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${todayUsage >= 10 ? 'bg-red-500' : 'bg-sky-500'}`}
                      style={{ width: `${Math.min(todayUsage / 10 * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Usage History */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <History className="h-5 w-5 text-gray-600" />
                <h2 className="text-xl font-semibold text-gray-900">Usage History</h2>
              </div>

              {usageLogs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No usage history yet.</p>
                  <Link href="/tools">
                    <Button variant="outline" className="mt-4">
                      Explore Tools
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {usageLogs.slice(0, 20).map((log) => {
                    const tool = tools.find((t) => t.id === log.tool_name)
                    const date = new Date(log.used_at)
                    return (
                      <div key={log.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                        <div className="flex items-center gap-3">
                          <div className="bg-sky-50 p-2 rounded-lg">
                            <Sparkles className="h-4 w-4 text-sky-500" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {tool?.name || log.tool_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {date.toLocaleDateString()} at {date.toLocaleTimeString()}
                            </div>
                          </div>
                        </div>
                        <Link href={`/tools/${log.tool_name}`}>
                          <Button variant="ghost" size="sm">
                            Use Again
                          </Button>
                        </Link>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <Link href="/tools/image-compressor" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Compress Image
                  </Button>
                </Link>
                <Link href="/tools/image-resizer" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Resize Image
                  </Button>
                </Link>
                <Link href="/tools/image-to-pdf" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    Image to PDF
                  </Button>
                </Link>
                <Link href="/tools" className="block">
                  <Button variant="outline" className="w-full justify-start">
                    View All Tools
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Pro Benefits */}
          {!isPro && (
            <Card className="bg-gradient-to-br from-sky-50 to-white border-sky-200">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-500" />
                  Pro Benefits
                </h2>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-centergap-2">
                    <span className="text-green-500">Unlimited daily actions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">Usage history & analytics</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">API access (coming soon)</span>
                  </li>
                </ul>
                <Button className="w-full mt-4 bg-sky-500 hover:bg-sky-600" onClick={upgradeToPro}>
                  Upgrade for $9/mo
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Settings Link */}
          <Card>
            <CardContent className="p-6">
              <Link href="/settings" className="flex items-center gap-3 text-gray-700 hover:text-gray-900">
                <Settings className="h-5 w-5" />
                <span className="font-medium">Account Settings</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
