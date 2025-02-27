import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'lrtcczklgngprpbdspkn.supabase.co', // Supabase storage domain
    ],
  },
  async headers() {
    return [
      {
        source: '/widget-loader.js',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }
        ],
      },
      {
        source: '/widget/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' }
        ],
      }
    ]
  },
};

export default nextConfig;