'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { X, Send, User, ArrowRight } from 'lucide-react'
import { getChatAnswer, QUICK_CHIPS, type ChatLink } from '@/lib/chatbot'

interface ChatWidgetProps {
  isOpen?: boolean
  onToggle?: () => void
}

interface ChatMessage {
  role: 'user' | 'bot'
  content: string
  links?: ChatLink[]
}

const WELCOME: ChatMessage = {
  role: 'bot',
  content:
    "Hi! I'm the Snaptoria Assistant. Tell me what you'd like to do — like \"crop a photo\", \"shrink a file\" or \"check DPI\" — and I'll take you straight to the right tool. Everything is free and runs 100% in your browser, so your files never leave your device.",
}

export function ChatWidget({ isOpen: externalIsOpen, onToggle }: ChatWidgetProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const scrollRef = useRef<HTMLDivElement>(null)

  const isOpen = externalIsOpen ?? internalIsOpen
  const setIsOpen = onToggle ?? setInternalIsOpen

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, isOpen])

  const send = (raw: string) => {
    const text = raw.trim()
    if (!text) return

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setMessage('')

    // Keyword-matched answer, computed locally — no AI, no API call.
    const answer = getChatAnswer(text)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: answer.text, links: answer.links },
      ])
    }, 350)
  }

  const handleSend = () => send(message)

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-sky-500 hover:bg-sky-600 z-50 overflow-hidden p-0"
        size="icon"
        aria-label="Open Snaptoria Assistant"
      >
        <Image
          src="/mascot-shutter.webp"
          alt=""
          width={56}
          height={56}
          className="h-full w-full rounded-full object-cover"
        />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 md:w-96 shadow-xl z-50">
      <CardHeader className="bg-sky-500 text-white rounded-t-lg flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2.5">
          <span className="bg-white rounded-lg p-1 flex items-center justify-center shrink-0">
            <Image src="/logo.svg" alt="Snaptoria" width={26} height={26} />
          </span>
          <div>
            <CardTitle className="text-base leading-tight">Snaptoria Assistant</CardTitle>
            <p className="text-xs text-sky-100 leading-tight">Find the right tool in seconds</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-sky-600 h-8 w-8"
          aria-label="Close chat"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={scrollRef} className="h-72 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'bot' && (
                <Image
                  src="/mascot-shutter.webp"
                  alt=""
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full object-cover ring-1 ring-sky-100 shrink-0"
                />
              )}
              <div
                className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p>{msg.content}</p>
                {msg.links && msg.links.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {msg.links.map((link) => (
                      <Link
                        key={link.href + link.label}
                        href={link.href}
                        className="inline-flex items-center gap-1 rounded-full bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-600 transition-colors"
                      >
                        {link.label}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
              {msg.role === 'user' && (
                <div className="bg-gray-200 rounded-full p-2 h-8 w-8 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}

          {messages.length === 1 && (
            <div className="flex flex-wrap gap-1.5 pl-10">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => send(chip)}
                  className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 hover:bg-sky-100 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="p-3 border-t flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me what you want to do..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="bg-sky-500 hover:bg-sky-600" aria-label="Send message">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
