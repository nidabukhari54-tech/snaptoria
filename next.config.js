/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  webpack: (config) => {
    // pdfjs-dist optionally requires the Node "canvas" package for server-side
    // rendering. The PDF DPI Checker only parses PDFs in the browser, so the
    // optional dependency is aliased out instead of being installed.
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    }
    return config
  },
}

module.exports = nextConfig;
