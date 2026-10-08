// Single source of truth for the site's canonical URL.
// Set NEXT_PUBLIC_SITE_URL in the hosting dashboard when a custom domain goes live.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://snaptoria.vercel.app').replace(/\/$/, '')

export const SITE_NAME = 'Snaptoria'
