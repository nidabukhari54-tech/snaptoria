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
  LayoutDashboard,
  ChevronDown
} from 'lucide-react'
import { tools, type Tool } from '@/lib/tools'

const topToolIds = [
  'image-compressor',
  'image-resizer',
  'image-cropper',
  'image-format-converter',
  'dpi-checker'
]

const topTools = topToolIds
  .map((id) => tools.find((tool) => tool.id === id))
  .filter((tool): tool is Tool => tool !== undefined)

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
          <div className="relative group">
            <button
              type="button"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 py-2"
            >
              Top Tools
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-1 hidden group-hover:block group-focus-within:block z-50">
              <div className="bg-white border border-gray-200 rounded-xl shadow-lg py-2 w-60">
                {topTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.id}`}
                    className="block px-4 py-2 text-sm text-gray-600 hover:bg-sky-50 hover:text-gray-900 transition-colors"
                  >
                    {tool.name}
                  </Link>
                ))}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <Link
                    href="/tools"
                    className="block px-4 py-2 text-sm font-medium text-sky-600 hover:bg-sky-50 transition-colors"
                  >
                    View all {tools.length} tools
                  </Link>
                </div>
              </div>
            </div>
          </div>
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
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-3">
                  Top Tools
                </p>
                <div className="flex flex-col gap-3">
                  {topTools.map((tool) => (
                    <Link
                      key={tool.id}
                      href={`/tools/${tool.id}`}
                      onClick={() => setIsOpen(false)}
                      className="text-base font-medium text-gray-600 hover:text-gray-900"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
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
