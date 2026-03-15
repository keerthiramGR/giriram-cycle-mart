/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Use webpack instead of turbopack for build */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
