import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, X, Sparkles } from 'lucide-react'

const features = [
  { name: 'Image Compressor', free: true, pro: true },
  { name: 'Image Resizer', free: true, pro: true },
  { name: 'Image Cropper', free: true, pro: true },
  { name: 'Format Converter', free: true, pro: true },
  { name: 'Image to PDF', free: true, pro: true },
  { name: 'DPI Checker', free: true, pro: true },
  { name: 'EXIF Viewer', free: true, pro: true },
  { name: 'Color Palette', free: true, pro: true },
  { name: 'All 20 Tools', free: true, pro: true },
  { name: 'Client-side Processing', free: true, pro: true },
  { name: 'Daily Actions', free: '10/day', pro: 'Unlimited' },
  { name: 'Usage History', free: false, pro: true },
  { name: 'Priority Support', free: false, pro: true },
  { name: 'API Access', free: false, pro: 'Coming Soon' },
]

export default function PricingPage() {
  return (
    <div className="container py-12 md:py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Start free with no commitment. Upgrade to Pro for unlimited usage when you&apos;re ready.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
        {/* Free Plan */}
        <Card className="border border-gray-200 relative">
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
              <div className="text-5xl font-bold text-gray-900">
                $0
                <span className="text-lg font-normal text-gray-500">/month</span>
              </div>
              <p className="text-gray-500 mt-2">Perfect for occasional use</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="h-5 w-5 text-green-500" />
                All 20 tools included
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="h-5 w-5 text-green-500" />
                10 actions per day
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="h-5 w-5 text-green-500" />
                100% client-side processing
              </li>
              <li className="flex items-center gap-2 text-gray-600">
                <Check className="h-5 w-5 text-green-500" />
                No signup required
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <X className="h-5 w-5" />
                Usage history
              </li>
              <li className="flex items-center gap-2 text-gray-400">
                <X className="h-5 w-5" />
                Priority support
              </li>
            </ul>

            <Link href="/tools" className="block">
              <Button variant="outline" className="w-full" size="lg">
                Start Free
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className="border-2 border-sky-500 relative bg-gradient-to-br from-sky-50 to-white">
          <div className="absolute top-0 right-0 bg-sky-500 text-white text-xs font-medium px-4 py-1.5 rounded-bl-lg rounded-tr-lg">
            RECOMMENDED
          </div>
          <CardContent className="p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                Pro
                <Sparkles className="h-5 w-5 text-sky-500" />
              </h2>
              <div className="text-5xl font-bold text-gray-900">
                $9
                <span className="text-lg font-normal text-gray-500">/month</span>
              </div>
              <p className="text-gray-500 mt-2">For power users and professionals</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="h-5 w-5 text-sky-500" />
                All 20 tools included
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="h-5 w-5 text-sky-500" />
                <span className="font-semibold">Unlimited actions</span>
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="h-5 w-5 text-sky-500" />
                100% client-side processing
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="h-5 w-5 text-sky-500" />
                Usage history & analytics
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="h-5 w-5 text-sky-500" />
                Priority email support
              </li>
              <li className="flex items-center gap-2 text-gray-700">
                <Check className="h-5 w-5 text-sky-500" />
                API access (coming soon)
              </li>
            </ul>

            <Link href="/signup" className="block">
              <Button className="w-full bg-sky-500 hover:bg-sky-600" size="lg">
                Get Started with Pro
              </Button>
            </Link>
            <p className="text-center text-sm text-gray-500 mt-3">
              No credit card required to start
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Feature Comparison</h2>
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-medium text-gray-600">Feature</th>
                  <th className="text-center p-4 font-medium text-gray-600">Free</th>
                  <th className="text-center p-4 font-medium text-gray-600 bg-sky-50">Pro</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, i) => (
                  <tr key={i} className="border-b last:border-b-0">
                    <td className="p-4 text-gray-900">{feature.name}</td>
                    <td className="p-4 text-center">
                      {typeof feature.free === 'boolean' ? (
                        feature.free ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-gray-600">{feature.free}</span>
                      )}
                    </td>
                    <td className={`p-4 text-center ${i % 2 === 0 ? 'bg-sky-50' : 'bg-sky-50/50'}`}>
                      {typeof feature.pro === 'boolean' ? (
                        feature.pro ? (
                          <Check className="h-5 w-5 text-sky-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )
                      ) : (
                        <span className="text-sky-600 font-medium">{feature.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Do I need to create an account?</h3>
              <p className="text-gray-600">No! You can use all tools without signing up. Simply visit any tool page and start processing. Accounts are only needed for Pro features like usage history.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">How does the 10 actions/day limit work?</h3>
              <p className="text-gray-600">Each time you use a tool (e.g., compress an image, resize an image), it counts as one action. The limit resets every 24 hours.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Is my data safe?</h3>
              <p className="text-gray-600">Absolutely. All image processing happens directly in your browser. Your files are never uploaded to any server. We take privacy seriously.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your Pro subscription at any time. You&apos;ll continue to have access until the end of your billing period.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
