/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hjzaqkmrmsoltytsxmup.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'unbemrwqevcofbsxrohg.supabase.co',
      },
    ],
  },
  eslint: {
    // Disable ESLint during builds to avoid blocking on style issues
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
