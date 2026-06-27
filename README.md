# Snaptoria

**20 browser-based image and document tools. All processing happens locally on your device - your files never leave your browser.**

## Live Demo

Visit the live application to try all 20 tools without uploading your files to any server.

## Features

### 20 Client-Side Tools

| # | Tool | Description |
|---|------|-------------|
| 1 | Image Compressor | Reduce image file size with adjustable quality |
| 2 | Image Resizer | Resize by pixels or percentage |
| 3 | Image Cropper | Drag-to-crop interface |
| 4 | Image Format Converter | Convert between JPG, PNG, WebP, GIF |
| 5 | Image to PDF | Combine images into a PDF document |
| 6 | DPI Checker | Check DPI, dimensions, and resolution |
| 7 | EXIF Viewer & Stripper | View and remove metadata |
| 8 | Color Palette Extractor | Extract dominant colors from images |
| 9 | Corrupt Image Detector | Validate image integrity |
| 10 | Image Rotator/Flipper | Rotate and flip images |
| 11 | Base64 Converter | Encode/decode images as Base64 |
| 12 | Favicon Generator | Generate multi-size favicon sets |
| 13 | Image Splitter | Split images into grids |
| 14 | Collage Maker | Combine multiple images |
| 15 | Aspect Ratio Cropper | Social media preset crops |
| 16 | Image Filters | Brightness, contrast, sepia, grayscale |
| 17 | Text Watermark | Add custom watermarks |
| 18 | QR Code Reader | Decode QR codes from images |
| 19 | Invoice Generator | Create professional invoices |
| 20 | Receipt Generator | Generate transaction receipts |

### Key Features

- **100% Client-Side Processing**: All image manipulation happens in your browser using Canvas API and FileReader
- **Privacy First**: Files never leave your device - no server uploads
- **User Authentication**: Sign up with email/password or Google OAuth
- **Dashboard**: Track your usage history and plan status
- **Responsive Design**: Works on desktop and mobile
- **SEO Optimized**: Sitemap, robots.txt, and Schema.org structured data

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Auth + Database + Storage)
- **Libraries**: 
  - `browser-image-compression` - Image compression
  - `react-easy-crop` - Image cropping
  - `jsPDF` - PDF generation
  - `JSZip` - ZIP file creation
  - `jsQR` - QR code decoding
  - `exifr` - EXIF metadata extraction

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account (free tier works)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/nidabukhari54-tech/snaptoria.git
   cd snaptoria
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API and copy your URL and anon key
   - Create a `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

### Database Setup

The required tables (`profiles`, `usage_logs`, `chat_leads`) are created via the migration in `supabase/migrations/`. To apply:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the contents of `supabase/migrations/20260626151329_001_create_profiles_and_usage_logs.sql`

Or use the Supabase CLI:
```bash
npx supabase db push
```

### Google OAuth Setup (Optional)

1. Go to Supabase Dashboard > Authentication > Providers
2. Enable Google provider
3. Add your Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)

## Project Structure

```
app/
├── auth/callback/        # OAuth callback handler
├── dashboard/            # User dashboard
├── login/                # Login page
├── pricing/              # Pricing page
├── signup/               # Signup page
├── tools/                # All 20 tool pages
│   ├── image-compressor/
│   ├── image-resizer/
│   └── ... (18 more)
├── layout.tsx            # Root layout
├── page.tsx              # Homepage
├── sitemap.ts            # Dynamic sitemap
└── robots.ts            # Robots.txt config

components/
├── ui/                   # shadcn/ui components
├── chat-widget.tsx       # Floating chat widget
├── file-dropzone.tsx     # File upload component
├── footer.tsx            # Site footer
├── header.tsx            # Site header
├── schema.tsx            # Schema.org structured data
└── tool-layout.tsx       # Tool page layout wrapper

lib/
├── supabase.ts           # Supabase client
├── tools.ts              # Tool registry
└── utils.ts              # Utility functions

supabase/
└── migrations/           # Database migrations
```

## Pricing Tiers

| Feature | Free | Pro |
|---------|------|-----|
| All 20 tools | Yes | Yes |
| Daily actions | 10 | Unlimited |
| Client-side processing | Yes | Yes |
| Usage history | No | Yes |
| Priority support | No | Yes |

## Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/nidabukhari54-tech/snaptoria)

1. Click the button above
2. Add your environment variables
3. Deploy!

### Netlify

The project includes a `netlify.toml` for easy deployment:

```bash
npm run build
# Deploy the .next folder to Netlify
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key | Yes |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Supabase](https://supabase.com/) for the backend infrastructure
- [Lucide](https://lucide.dev/) for the icon set
