import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { tools } from '@/lib/tools'
import {
  Sparkles,
  Shield,
  Zap,
  Lock,
  Check,
  Star,
  ArrowRight
} from 'lucide-react'
import * as Icons from 'lucide-react'

export default function HomePage() {
  const LucideIcon = (name: string) => {
    const iconName = name as keyof typeof Icons
    const Icon = Icons[iconName] as React.ComponentType<{ className?: string }>
    return Icon ? <Icon className="h-8 w-8" /> : <Icons.Image className="h-8 w-8" />
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-sky-50 via-white to-blue-50 py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNlMmU4ZjAiIGZpbGwtb3BhY2l0eT0iMC40Ij48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-60" />
        <div className="container relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              Privacy-first image tools
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              20 Tools, One Subscription.
              <br />
              <span className="text-sky-500">Files Never Leave Your Browser.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Compress, resize, convert, and edit images 100% client-side.
              No uploads to servers. No privacy concerns. Just powerful tools that work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools">
                <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white px-8">
                  Explore All Tools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" className="px-8">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-gray-900 py-6">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <Shield className="h-5 w-5 text-sky-400" />
              <span className="text-sm font-medium">100% Client-Side</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <Zap className="h-5 w-5 text-sky-400" />
              <span className="text-sm font-medium">Instant Processing</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <Lock className="h-5 w-5 text-sky-400" />
              <span className="text-sm font-medium">Zero Data Collection</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-gray-300">
              <Sparkles className="h-5 w-5 text-sky-400" />
              <span className="text-sm font-medium">20+ Tools</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Grid */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Your Image Tools in One Place
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From compression to conversion, DPI checking to PDF generation. Every tool you need, nothing you don&apos;t.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link key={tool.id} href={`/tools/${tool.id}`}>
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 border border-gray-200 group">
                  <CardContent className="p-6">
                    <div className="bg-sky-50 rounded-lg p-3 w-fit mb-4 text-sky-600 group-hover:bg-sky-100 transition-colors">
                      {LucideIcon(tool.icon)}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {tool.description}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/tools">
              <Button variant="outline" size="lg">
                View all 20 tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Snaptoria */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Snaptoria?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unlike other tools that upload your files to servers, everything here runs in your browser.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-sky-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Lock className="h-8 w-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Privacy</h3>
                <p className="text-gray-600">
                  Your images never leave your device. No servers, no uploads, no tracking. What you process stays yours.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-sky-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Blazing Fast</h3>
                <p className="text-gray-600">
                  No waiting for uploads or downloads. Everything happens instantly in your browser using modern web APIs.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8 text-center">
                <div className="bg-sky-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Sparkles className="h-8 w-8 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">20 Tools, One Price</h3>
                <p className="text-gray-600">
                  Stop paying for 10 separate subscriptions. Get all the tools you need with a single flat-rate plan.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border border-gray-200 relative">
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Free</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-4">$0<span className="text-lg font-normal text-gray-500">/mo</span></div>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="h-5 w-5 text-green-500" />
                      10 actions per day
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="h-5 w-5 text-green-500" />
                      All 20 tools included
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="h-5 w-5 text-green-500" />
                      Client-side processing
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="h-5 w-5 text-green-500" />
                      No signup required
                    </li>
                  </ul>
                  <Link href="/tools">
                    <Button variant="outline" className="w-full">
                      Start Free
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="border-2 border-sky-500 relative bg-gradient-to-br from-sky-50 to-white">
              <div className="absolute top-0 right-0 bg-sky-500 text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                POPULAR
              </div>
              <CardContent className="p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro</h3>
                  <div className="text-4xl font-bold text-gray-900 mb-4">$9<span className="text-lg font-normal text-gray-500">/mo</span></div>
                  <ul className="text-left space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="h-5 w-5 text-sky-500" />
                      Unlimited actions
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="h-5 w-5 text-sky-500" />
                      All 20 tools included
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="h-5 w-5 text-sky-500" />
                      Usage history & analytics
                    </li>
                    <li className="flex items-center gap-2 text-gray-600">
                      <Check className="h-5 w-5 text-sky-500" />
                      Priority support
                    </li>
                  </ul>
                  <Link href="/signup">
                    <Button className="w-full bg-sky-500 hover:bg-sky-600">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by Creators
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See what our users have to say about Snaptoria.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  &quot;Finally, an image tool that respects privacy. I use it daily for my design work and it&apos;s incredibly fast.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-sky-100 rounded-full w-10 h-10 flex items-center justify-center text-sky-600 font-semibold">
                    SK
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Sarah K.</div>
                    <div className="text-sm text-gray-500">Freelance Designer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  &quot;The fact that my files never leave my browser is a game-changer. I recommend Snaptoria to all my clients.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-sky-100 rounded-full w-10 h-10 flex items-center justify-center text-sky-600 font-semibold">
                    MJ
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Michael J.</div>
                    <div className="text-sm text-gray-500">Wedding Photographer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-white">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-6">
                  &quot;20 tools for the price of one? This saved me hundreds compared to my previous subscriptions.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="bg-sky-100 rounded-full w-10 h-10 flex items-center justify-center text-sky-600 font-semibold">
                    EL
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Emma L.</div>
                    <div className="text-sm text-gray-500">Content Creator</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-sky-500">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-sky-100 mb-8 max-w-xl mx-auto">
            Join thousands of creators who trust Snaptoria for their image processing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/tools">
              <Button size="lg" variant="secondary" className="bg-white text-sky-600 hover:bg-gray-100">
                Try Free Tools
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-sky-600">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
