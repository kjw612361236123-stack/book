import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'www.notion.so' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 's3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: 'prod-files-secure.s3.us-west-2.amazonaws.com' },
      { protocol: 'https', hostname: 'contents.kyobobook.co.kr' },
      { protocol: 'http', hostname: 'image.kyobobook.co.kr' },
      { protocol: 'https', hostname: 'image.kyobobook.co.kr' },
      { protocol: 'https', hostname: 'contents.kyobobook.com' },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
