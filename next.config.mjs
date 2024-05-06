/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'proclad-construction.vercel.app',
      },
    ],
  },
};

export default nextConfig;
