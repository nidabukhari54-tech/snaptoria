'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import {
  Menu,
  X,
  Sparkles,
  User,
  LogOut,
  LayoutDashboard
} from 'lucide-react'

interface HeaderProps {
  user?: { id: string; email: string } | null
}

export function Header({ user }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { toast } = useToast()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.'
    })
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-sky-500" />
          <span className="text-xl font-bold text-gray-900">Snaptoria</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/tools" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            All Tools
          </Link>
          <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Pricing
          </Link>
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-600">
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                Sign In
              </Link>
              <Link href="/signup">
                <Button size="sm" className="bg-sky-500 hover:bg-sky-600">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </nav>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <nav className="flex flex-col gap-4 mt-8">
              <Link href="/tools" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-600 hover:text-gray-900">
                All Tools
              </Link>
              <Link href="/pricing" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-600 hover:text-gray-900">
                Pricing
              </Link>
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-600 hover:text-gray-900">
                    Dashboard
                  </Link>
                  <Button variant="ghost" onClick={handleSignOut} className="justify-start">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsOpen(false)} className="text-lg font-medium text-gray-600 hover:text-gray-900">
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>
                    <Button className="w-full bg-sky-500 hover:bg-sky-600">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
