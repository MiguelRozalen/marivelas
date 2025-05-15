import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // remotePatterns configuration for placehold.co is removed
    // as candle images are now local.
    // If you have other remote image sources, add their patterns here.
  },
};

export default nextConfig;
