/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['bcslaoindjadawhkdrhk.supabase.co'],
    unoptimized: true,
  },
  eslint: {
    // Disable ESLint during builds to avoid blocking on style issues
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
