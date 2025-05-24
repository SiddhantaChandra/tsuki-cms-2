import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['bcslaoindjadawhkdrhk.supabase.co'],
  },
  eslint: {
    // Disable ESLint during builds to avoid blocking on style issues
    ignoreDuringBuilds: true,
  },
  env: {
    // These will be replaced at build time with actual values from Cloudflare Pages
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NODE_VERSION: process.env.NODE_VERSION,
  },
};

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
}

export default nextConfig;
