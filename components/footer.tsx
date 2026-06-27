import Link from 'next/link'
import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react'
import { tools } from '@/lib/tools'

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-sky-400" />
              <span className="text-xl font-bold text-white">Snaptoria</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">
              20 browser-based image and document tools. Your files never leave your browser.
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

          <div>
            <h3 className="font-semibold text-white mb-4">Image Tools</h3>
            <ul className="space-y-2 text-sm">
              {tools.slice(0, 6).map((tool) => (
                <li key={tool.id}>
                  <Link href={`/tools/${tool.id}`} className="hover:text-white transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">More Tools</h3>
            <ul className="space-y-2 text-sm">
              {tools.slice(6, 12).map((tool) => (
                <li key={tool.id}>
                  <Link href={`/tools/${tool.id}`} className="hover:text-white transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Document Tools</h3>
            <ul className="space-y-2 text-sm">
              {tools.slice(12).map((tool) => (
                <li key={tool.id}>
                  <Link href={`/tools/${tool.id}`} className="hover:text-white transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
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
