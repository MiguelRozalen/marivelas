import type {NextConfig} from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  assetPrefix: isProd ? '/marivelas' : '',
  basePath: isProd ? '/marivelas' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? '/marivelas' : '',
  },
  output: 'export', 
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // Disable default image optimization

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
    // If you have other remote image sources, add their patterns here.
  },
};

export default nextConfig;
