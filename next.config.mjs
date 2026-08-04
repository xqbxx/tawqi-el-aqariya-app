/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mcxkglaxpegfdjpdzjkk.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/properties-images/**',
      },
    ],
  },
}

export default nextConfig
