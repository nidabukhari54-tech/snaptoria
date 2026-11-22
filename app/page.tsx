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
  ArrowRight,
  MousePointerClick,
  Cpu,
  Download,
  Printer,
  Globe,
  Briefcase,
  Minus,
  X
} from 'lucide-react'
import { OrganizationSchema, WebsiteSchema, ToolListSchema, FaqSchema } from '@/components/schema'
import { ToolGridTabs } from '@/components/tool-grid-tabs'
import { HeroTool } from '@/components/hero-tool'
import { ToolCardVisual } from '@/components/tool-card-visual'

const homeFaqs = [
  {
    question: 'How do I check the DPI of an image?',
    answer:
      'Open the Image DPI Checker and add your image — it reads the file in your browser and shows its DPI, pixel dimensions and the size it will print at 300 DPI. Print work is generally produced at 300 DPI, so if your image falls short at the size you need, the checker tells you before anything goes to press.',
    href: '/tools/dpi-checker',
    linkLabel: 'Open the Image DPI Checker'
  },
  {
    question: 'How can I check the DPI of a PDF before printing?',
    answer:
      'The PDF DPI Checker inspects every image embedded in your PDF and works out the effective DPI of each one at the size it will print. Images below 300 DPI are flagged, so you can spot the weak spots in a print file before sending it to the printer.',
    href: '/tools/pdf-dpi-checker',
    linkLabel: 'Open the PDF DPI Checker'
  },
  {
    question: 'How can I tell if an image file is corrupted?',
    answer:
      'Add the file to the Corrupt Image Detector and it will try to decode the image in your browser and check its structure. If the file is damaged, the tool explains the likely cause — an interrupted download, a bad copy or a failing memory card are common ones.',
    href: '/tools/corrupt-image-detector',
    linkLabel: 'Open the Corrupt Image Detector'
  },
  {
    question: 'Is it safe to compress images online?',
    answer:
      "It depends on how the tool works. Upload-based compressors send your image to a company's server, where a copy sits until it is deleted. Snaptoria's Image Compressor runs entirely in your browser, so your image never leaves your device and there is no server copy to worry about.",
    href: '/tools/image-compressor',
    linkLabel: 'Open the Image Compressor'
  },
  {
    question: 'Where are my files processed?',
    answer:
      'Entirely in your browser, on your own device. Snaptoria\u2019s tools read your file locally and process it in the tab — nothing is uploaded, transmitted or stored on a server, and closing the tab clears everything from memory.',
    href: '/tools',
    linkLabel: 'Browse all the tools'
  },
  {
    question: 'Do I need an account to use Snaptoria?',
    answer: `No. Every tool works without an account — just open one and start. Free use includes 10 actions per day across all ${tools.length} tools, and the optional Pro plan ($9/month) removes the daily limit and adds usage history.`,
    href: '/pricing',
    linkLabel: 'See pricing'
  },
  {
    question: 'Can I turn photos into a PDF for free?',
    answer:
      'Yes. The Image to PDF Converter combines JPG, PNG and WebP images into a single PDF right in your browser — add your photos, arrange them and download the finished document. It is free and needs no signup.',
    href: '/tools/image-to-pdf',
    linkLabel: 'Open the Image to PDF Converter'
  },
  {
    question: 'How do I remove location data from a photo?',
    answer:
      'Photos often carry EXIF metadata — camera details, settings and sometimes the GPS location where the photo was taken. The EXIF Viewer shows you exactly what is stored in your photo, and the same tool can strip the metadata and download a cleaned copy that is safe to share.',
    href: '/tools/exif-viewer',
    linkLabel: 'Open the EXIF Viewer'
  }
]

const useCaseGroups = [
  {
    icon: Printer,
    title: 'For Print & Photography',
    copy: 'Sending work to print or checking photos against a deadline? Verify resolution and DPI first, and know exactly what metadata your photos carry.',
    toolIds: ['dpi-checker', 'pdf-dpi-checker', 'image-resolution-checker', 'exif-viewer']
  },
  {
    icon: Globe,
    title: 'For Web & Social',
    copy: 'Lighter pages, faster loads and posts cropped to every platform\u2019s shape — without installing an app or uploading your images anywhere.',
    toolIds: ['image-compressor', 'image-resizer', 'aspect-ratio-cropper', 'image-splitter', 'collage-maker']
  },
  {
    icon: Briefcase,
    title: 'For Documents & Business',
    copy: 'Turn phone photos into tidy PDFs, raise professional invoices and receipts, and decode QR codes from screenshots.',
    toolIds: ['image-to-pdf', 'invoice-generator', 'receipt-generator', 'qr-code-reader']
  }
]

const specialistToolIds = ['dpi-checker', 'pdf-dpi-checker', 'corrupt-image-detector', 'image-resolution-checker']

const comparisonRows = [
  {
    typicalMark: 'minus',
    label: 'Where your files are processed',
    snaptoria: 'In your browser, on your own device',
    typical: 'Uploaded to the company\u2019s servers'
  },
  {
    typicalMark: 'minus',
    label: 'Copies of your files on a server',
    snaptoria: 'None — nothing is uploaded, so nothing is stored',
    typical: 'Kept on their servers for a period before deletion — from around an hour to 48 hours in the published policies of popular tools'
  },
  {
    typicalMark: 'minus',
    label: 'Free-plan limits',
    snaptoria: `10 actions per day across all ${tools.length} tools; Pro ($9/month) is unlimited`,
    typical: 'Per-task file-count and size caps are common — for example, 1 file per crop or 20 images per session on popular tools'
  },
  {
    typicalMark: 'x',
    label: 'Specialist checkers (image DPI, PDF DPI, corrupt files)',
    snaptoria: 'Built in',
    typical: 'Not offered by the major image suites'
  }
]

function SectionHost({ src, line }: { src: string; line: string }) {
  return (
    <div className="mb-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
      <div className="hero-float shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt="Snaptoria mascot"
          width={72}
          height={72}
          loading="lazy"
          className="h-[72px] w-[72px] rounded-full object-cover shadow-lg ring-4 ring-white"
        />
      </div>
      <div className="relative max-w-xs rounded-2xl bg-white px-4 py-2.5 text-center text-sm font-medium text-gray-700 shadow-md ring-1 ring-gray-900/5 sm:text-left">
        <span
          aria-hidden
          className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45 bg-white sm:hidden"
        />
        <span
          aria-hidden
          className="absolute -left-1.5 top-1/2 hidden h-3 w-3 -translate-y-1/2 rotate-45 bg-white sm:block"
        />
        {line}
      </div>
    </div>
  )
}

function WaveDivider({
  fillClass,
  flip = false,
  gapClass = 'mt-6'
}: {
  fillClass: string
  flip?: boolean
  gapClass?: string
}) {
  return (
    <div aria-hidden className={`relative ${gapClass} -mb-px leading-none`}>
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className={`block h-8 w-full md:h-10 ${fillClass} ${flip ? '-scale-x-100' : ''}`}
      >
        <path
          d="M0,36 C240,66 480,4 720,26 C960,48 1200,10 1440,34 L1440,60 L0,60 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}

function SurfWave({
  backClass,
  frontClass,
  flip = false,
  heightClass = 'h-[110px] md:h-[130px]'
}: {
  backClass: string
  frontClass: string
  flip?: boolean
  heightClass?: string
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute bottom-0 left-1/2 w-screen -translate-x-1/2 ${heightClass} ${
        flip ? '-scale-x-100' : ''
      }`}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={`absolute inset-0 block h-full w-full ${backClass}`}
      >
        <path
          d="M0,58 C240,104 480,14 720,48 C960,82 1200,24 1440,64 L1440,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={`absolute inset-0 block h-full w-full ${frontClass}`}
      >
        <path
          d="M0,82 C260,118 520,46 780,74 C1040,102 1240,58 1440,90 L1440,120 L0,120 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}

export default function HomePage() {
  return (
    <>
      <OrganizationSchema />
      <WebsiteSchema />
      <ToolListSchema />
      <FaqSchema faqs={homeFaqs} />
      <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-sky-600">
        {/* Rich backdrop: layered gradient, soft glows */}
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 via-sky-600 to-blue-800" />
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-sky-300/30 blur-3xl" />
        <div className="absolute -bottom-48 right-0 h-[28rem] w-[28rem] rounded-full bg-blue-400/25 blur-3xl" />
        <div className="absolute top-1/3 -left-24 h-72 w-72 rounded-full bg-cyan-300/20 blur-3xl" />
        {/* Floating sample accents (wide screens only) */}
        <div aria-hidden className="pointer-events-none absolute left-[3.5%] top-44 hidden w-44 -rotate-6 2xl:block">
          <div className="hero-float">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/samples/sample-flower-field.jpg"
              alt=""
              className="rounded-2xl shadow-2xl ring-1 ring-white/40"
              loading="lazy"
            />
          </div>
        </div>
        <div aria-hidden className="pointer-events-none absolute right-[3.5%] top-72 hidden w-52 rotate-3 2xl:block">
          <div className="hero-float-delay">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/samples/sample-mountain-lake.jpg"
              alt=""
              className="rounded-2xl shadow-2xl ring-1 ring-white/40"
              loading="lazy"
            />
          </div>
        </div>

        <div className="container relative pt-10 pb-10 md:pt-14 md:pb-12">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white ring-1 ring-white/30 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              Privacy-first image tools
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              {tools.length} Tools, One Subscription.
              <br />
              <span className="text-sky-200">Files Never Leave Your Browser.</span>
            </h1>
            <p className="text-lg md:text-xl text-sky-100 max-w-2xl mx-auto">
              Compress, resize, convert, and check images 100% client-side.
              No uploads to servers and no signup needed to use the tools. Just powerful tools that work right in your browser.
            </p>
          </div>

          <HeroTool />

          <p className="relative z-10 mt-7 text-center text-sm text-sky-100">
            <Link href="/tools" className="font-medium text-white underline decoration-sky-300 underline-offset-4 hover:decoration-white">
              Explore all {tools.length} tools
            </Link>
            <span className="mx-2 text-sky-300">·</span>
            <Link href="/pricing" className="font-medium text-white underline decoration-sky-300 underline-offset-4 hover:decoration-white">
              See pricing
            </Link>
          </p>
        </div>

        {/* Wave into the stats strip */}
        <WaveDivider fillClass="text-gray-900" gapClass="mt-0" />
      </section>

      {/* Features Strip */}
      <section className="bg-gray-900 pt-6">
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
              <span className="text-sm font-medium">{tools.length} Tools</span>
            </div>
          </div>
        </div>
        <WaveDivider fillClass="text-white" flip gapClass="mt-4" />
      </section>

      {/* Tool Grid */}
      <section className="pt-14 md:pt-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <SectionHost src="/mascot.webp" line={`All ${tools.length} run right here in your browser. Pick one and try it!`} />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              All Your Image Tools in One Place
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From compression to conversion, DPI checking to PDF generation. Every tool you need, nothing you don&apos;t.
            </p>
          </div>
          <ToolGridTabs />
          <div className="text-center mt-8">
            <Link href="/tools">
              <Button variant="outline" size="lg">
                View all {tools.length} tools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <WaveDivider fillClass="text-sky-50" />
      </section>

      {/* How Snaptoria Works */}
      <section className="relative overflow-hidden pt-14 md:pt-16 bg-sky-50">
        <div className="container">
          <div className="text-center mb-12">
            <SectionHost src="/mascot-shutter.webp" line="Three steps, that's it. No uploads, no waiting rooms." />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How Snaptoria Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No uploads, no queues, no server in the middle. Three steps, all inside your browser tab.
            </p>
          </div>
          <div className="relative">
            <SurfWave backClass="text-sky-300/40" frontClass="text-sky-200" />
            <div className="relative z-10 grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="rounded-2xl border border-sky-100 bg-white px-6 py-8 text-center shadow-md">
              <div className="bg-sky-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <MousePointerClick className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. Pick a tool</h3>
              <p className="text-gray-600">
                Choose from {tools.length} tools — compress, convert, check DPI, build a PDF and more. Every tool opens instantly, with no account and nothing to install.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-white px-6 py-8 text-center shadow-md">
              <div className="bg-sky-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Cpu className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Your browser does the work</h3>
              <p className="text-gray-600">
                Modern browsers can read and process files locally, so your file is handled on your own device. It is never uploaded to a server — there is no server copy at any point.
              </p>
            </div>
            <div className="rounded-2xl border border-sky-100 bg-white px-6 py-8 text-center shadow-md">
              <div className="bg-sky-100 rounded-full p-4 w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                <Download className="h-8 w-8 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Download the result</h3>
              <p className="text-gray-600">
                Save the finished file straight from your browser. Nothing is stored anywhere, so closing the tab leaves nothing behind.
              </p>
            </div>
            </div>
          </div>
        </div>
        <WaveDivider fillClass="text-white" flip />
      </section>

      {/* Why Snaptoria */}
      <section className="relative overflow-hidden pt-14 md:pt-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Snaptoria?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unlike other tools that upload your files to servers, everything here runs in your browser.
            </p>
          </div>
          <div className="relative">
            <SurfWave backClass="text-sky-100" frontClass="text-sky-200" flip />
            <div className="relative z-10 grid md:grid-cols-3 gap-8">
            <Card className="rounded-2xl border border-sky-100 bg-white shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-md">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Privacy</h3>
                <p className="text-gray-600">
                  Your images never leave your device. No servers, no uploads, no tracking. What you process stays yours.
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-sky-100 bg-white shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-md">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Blazing Fast</h3>
                <p className="text-gray-600">
                  No waiting for uploads or downloads. Everything happens instantly in your browser using modern web APIs.
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-2xl border border-sky-100 bg-white shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-full w-16 h-16 mx-auto mb-6 flex items-center justify-center shadow-md">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{tools.length} Tools, One Price</h3>
                <p className="text-gray-600">
                  Stop paying for 10 separate subscriptions. Get all the tools you need with a single flat-rate plan.
                </p>
              </CardContent>
            </Card>
            </div>
          </div>
        </div>
        <WaveDivider fillClass="text-sky-500" />
      </section>

      {/* Privacy */}
      <section className="relative overflow-hidden pt-14 md:pt-16 bg-gradient-to-br from-sky-500 via-blue-600 to-blue-800">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <SectionHost src="/mascot-photo.webp" line="Your files stay on your device. That's the whole point." />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why &ldquo;Never Uploaded&rdquo; Matters
              </h2>
            </div>
            <div className="space-y-5 text-sky-100 text-lg leading-relaxed">
              <p>
                Most online image tools work by uploading your file to a company&apos;s server, processing it there,
                and letting you download the result. That means a copy of your photo or document sits on someone
                else&apos;s computer — and you are relying on their deletion policy, their security and their
                promises about what happens to it.
              </p>
              <p>
                Snaptoria removes the copy entirely. Your file is read by your own browser and processed in the
                tab&apos;s memory on your device. Nothing is transmitted, so there is nothing stored on a server,
                nothing waiting to be deleted, and nothing that could be exposed in a server breach.
              </p>
              <p>
                That matters most for the files people hesitate to hand over: family photos with location data,
                scanned documents, client work and business records. With Snaptoria they never leave your hands.
              </p>
            </div>
            <div className="relative mt-12">
              <SurfWave
                backClass="text-white/15"
                frontClass="text-white/25"
                heightClass="h-[100px] md:h-[110px]"
              />
              <div className="relative z-10 grid justify-items-center gap-8 sm:grid-cols-3">
                <div className="flex h-52 w-52 flex-col items-center justify-center rounded-full bg-white/10 px-6 text-center ring-1 ring-white/40 backdrop-blur-sm">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                    <Shield className="h-6 w-6 text-sky-200" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">Nothing transmitted</h3>
                  <p className="text-[13px] leading-snug text-sky-100">Your file never travels across the internet to reach a server.</p>
                </div>
                <div className="flex h-52 w-52 flex-col items-center justify-center rounded-full bg-white/10 px-6 text-center ring-1 ring-white/40 backdrop-blur-sm">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                    <Lock className="h-6 w-6 text-sky-200" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">No server storage</h3>
                  <p className="text-[13px] leading-snug text-sky-100">There is no uploaded copy kept anywhere — closing the tab clears everything.</p>
                </div>
                <div className="flex h-52 w-52 flex-col items-center justify-center rounded-full bg-white/10 px-6 text-center ring-1 ring-white/40 backdrop-blur-sm">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/30">
                    <Zap className="h-6 w-6 text-sky-200" />
                  </div>
                  <h3 className="font-semibold text-white mb-1">Nothing to wait for</h3>
                  <p className="text-[13px] leading-snug text-sky-100">No upload or download queues — processing starts the moment you add a file.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <WaveDivider fillClass="text-white" flip />
      </section>

      {/* Use Cases */}
      <section className="relative overflow-hidden pt-14 md:pt-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Made for the Job at Hand
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Different work needs different tools. Here is where each group of Snaptoria tools earns its keep.
            </p>
          </div>
          <div className="relative">
            <SurfWave backClass="text-sky-100" frontClass="text-sky-200" />
            <div className="relative z-10 grid md:grid-cols-3 gap-8">
            {useCaseGroups.map((group) => (
              <Card key={group.title} className="rounded-2xl border border-sky-100 shadow-lg bg-white">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-full w-16 h-16 mb-6 flex items-center justify-center shadow-md">
                    <group.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{group.title}</h3>
                  <p className="text-gray-600 mb-6">{group.copy}</p>
                  <ul className="space-y-2">
                    {group.toolIds.map((toolId) => {
                      const tool = tools.find((t) => t.id === toolId)
                      if (!tool) return null
                      return (
                        <li key={tool.id}>
                          <Link
                            href={`/tools/${tool.id}`}
                            className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                          >
                            {tool.name}
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        </div>
        <WaveDivider fillClass="text-gray-50" />
      </section>

      {/* Specialist Tools */}
      <section className="pt-14 md:pt-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Specialist Checkers the Big Suites Skip
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Most image suites stop at compress, resize and convert. These specialist checkers answer the
              questions that decide whether a file is actually usable — and you won&apos;t find them in the usual
              image suites.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {specialistToolIds.map((toolId) => {
              const tool = tools.find((t) => t.id === toolId)
              if (!tool) return null
              return (
                <Link key={tool.id} href={`/tools/${tool.id}`}>
                  <Card className="h-full rounded-3xl shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl border border-sky-100 bg-white group">
                    <CardContent className="p-7">
                      <ToolCardVisual toolId={tool.id} />
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-3">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </div>
        <WaveDivider fillClass="text-sky-50" flip />
      </section>

      {/* Comparison */}
      <section className="pt-14 md:pt-16 bg-sky-50">
        <div className="container">
          <div className="text-center mb-12">
            <SectionHost src="/mascot.webp" line="Same jobs, no server copies. See for yourself." />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Snaptoria vs. Upload-Based Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The difference is not the tool list — it is where your files go when you use them.
            </p>
          </div>
          <div className="max-w-4xl mx-auto overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-sky-100">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left border-collapse">
                <thead>
                  <tr className="border-b border-sky-100">
                    <th className="px-6 py-4 w-1/4"></th>
                    <th className="px-6 py-4 w-[37.5%] bg-gradient-to-r from-sky-500 to-blue-600 text-base font-bold text-white">
                      <span className="inline-flex items-center gap-1.5">
                        <Star aria-hidden className="h-4 w-4 fill-current" />
                        Snaptoria
                      </span>
                    </th>
                    <th className="px-6 py-4 w-[37.5%] bg-gray-50 text-base font-semibold text-gray-500">Typical upload-based tools</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-100">
                  {comparisonRows.map((row, i) => (
                    <tr key={row.label} className={`align-top ${i % 2 === 1 ? 'bg-sky-50' : 'bg-white'}`}>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-900">{row.label}</th>
                      <td className={`px-6 py-4 text-sm text-gray-700 ${i % 2 === 1 ? 'bg-sky-100/60' : 'bg-sky-50/70'}`}>
                        <span className="flex items-start gap-2">
                          <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-sky-500" />
                          <span>{row.snaptoria}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        <span className="flex items-start gap-2">
                          {row.typicalMark === 'x' ? (
                            <X aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                          ) : (
                            <Minus aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
                          )}
                          <span>{row.typical}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <WaveDivider fillClass="text-gray-50" />
      </section>

      {/* Pricing Preview */}
      <section className="pt-14 md:pt-16 bg-gray-50">
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
                      All {tools.length} tools included
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
                      All {tools.length} tools included
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
        <WaveDivider fillClass="text-white" flip />
      </section>

      {/* Testimonials */}
      <section className="pt-14 md:pt-16 bg-white">
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
                  &quot;{tools.length} tools for the price of one? This saved me hundreds compared to my previous subscriptions.&quot;
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
        <WaveDivider fillClass="text-gray-50" />
      </section>

      {/* FAQ */}
      <section id="faq" className="pt-14 md:pt-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <SectionHost src="/mascot-shutter.webp" line="Stuck on something? Answers below — or ask the assistant, bottom-right." />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Straight answers about DPI, damaged files, privacy and how Snaptoria works.
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-5">
            {homeFaqs.map((faq) => (
              <div key={faq.question} className="flex gap-4 rounded-2xl border border-sky-100 bg-white p-6 shadow-md">
                <span
                  aria-hidden
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-500 text-base font-bold text-white shadow-sm"
                >
                  ?
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 mb-3">{faq.answer}</p>
                  <Link
                    href={faq.href}
                    className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700 transition-colors"
                  >
                    {faq.linkLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <WaveDivider fillClass="text-sky-500" flip />
      </section>

      {/* CTA */}
      <section className="pt-14 md:pt-16 bg-sky-500">
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
        <WaveDivider fillClass="text-gray-900" />
      </section>
    </div>
    </>
  )
}
