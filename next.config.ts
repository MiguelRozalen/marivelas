import type {NextConfig} from 'next';

//const isProd = process.env.NODE_ENV === 'production';
const isGithub = process.env.GITHUB_PAGES === 'true';


const nextConfig: NextConfig = {
  reactStrictMode: true,
  
  assetPrefix: isGithub ? '/marivelas' : '',
  basePath: isGithub ? '/marivelas' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithub ? '/marivelas' : '',
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
