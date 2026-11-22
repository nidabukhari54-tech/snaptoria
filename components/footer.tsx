import Link from 'next/link'
import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react'
import { tools } from '@/lib/tools'

const categoryOrder = ['Image Processing', 'Image Analysis', 'Document Tools']
const toolCategories = categoryOrder.filter((category) =>
  tools.some((tool) => tool.category === category)
)

const companyLinks = [
  { href: '/tools', label: 'All Tools' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/login', label: 'Sign In' },
  { href: '/signup', label: 'Sign Up' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/contact', label: 'Contact' }
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="col-span-2 md:col-span-3 lg:col-span-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mascots-family.webp"
              alt="The Snaptoria mascot family"
              loading="lazy"
              className="h-20 w-auto rounded-2xl object-cover shadow-lg ring-2 ring-white/20 mb-4"
            />
            <div className="flex items-center gap-3 mb-4">
              <Link href="/" className="flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-sky-400" />
                <span className="text-xl font-bold text-white">Snaptoria</span>
              </Link>
            </div>
            <p className="text-sm text-gray-400 mb-4 max-w-xs">
              {tools.length} browser-based image and document tools. Your files never leave your browser.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {toolCategories.map((category) => (
            <div key={category}>
              <h3 className="font-semibold text-white mb-4">{category}</h3>
              <ul className="space-y-2 text-sm">
                {tools
                  .filter((tool) => tool.category === category)
                  .map((tool) => (
                    <li key={tool.id}>
                      <Link href={`/tools/${tool.id}`} className="hover:text-white transition-colors">
                        {tool.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} Snaptoria. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
