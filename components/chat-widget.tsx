'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'

interface ChatWidgetProps {
  isOpen?: boolean
  onToggle?: () => void
}

export function ChatWidget({ isOpen: externalIsOpen, onToggle }: ChatWidgetProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([
    { role: 'bot', content: 'Hi! I\'m Snaptoria\'s assistant. How can I help you today?' }
  ])

  const isOpen = externalIsOpen ?? internalIsOpen
  const setIsOpen = onToggle ?? setInternalIsOpen

  const handleSend = () => {
    if (!message.trim()) return

    setMessages([...messages, { role: 'user', content: message }])
    setMessage('')

    // Simulated response for now
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', content: 'Thanks for your message! This chat will be connected to our AI assistant soon. For now, feel free to explore our tools!' }
      ])
    }, 1000)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-sky-500 hover:bg-sky-600"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-6 right-6 w-80 md:w-96 shadow-xl z-50">
      <CardHeader className="bg-sky-500 text-white rounded-t-lg flex flex-row items-center justify-between py-3 px-4">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          <CardTitle className="text-base">Snaptoria Assistant</CardTitle>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-sky-600 h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-72 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'bot' && (
                <div className="bg-sky-100 rounded-full p-2 h-8 w-8 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-sky-600" />
                </div>
              )}
              <div
                className={`rounded-lg px-3 py-2 text-sm max-w-[80%] ${
                  msg.role === 'user'
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {msg.content}
              </div>
              {msg.role === 'user' && (
                <div className="bg-gray-200 rounded-full p-2 h-8 w-8 flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-3 border-t flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="bg-sky-500 hover:bg-sky-600">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
