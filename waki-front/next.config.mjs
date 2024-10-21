/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'media.api-sports.io',
          port: '',
          pathname: '/**',
        },
      ],
    },
  };
  
  export default nextConfig;
  