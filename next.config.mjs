/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Use webpack instead of turbopack for build */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'lqektqdsolnmtjcgquib.supabase.co',
      },
    ],
  },
};

export default nextConfig;
