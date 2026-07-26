const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  async rewrites() {
    const settingsApiUrl = process.env.NEXT_PUBLIC_SETTINGS_API_URL || 'http://localhost:3002/api';
    const baseUrl = settingsApiUrl.replace(/\/api$/, '').replace(/\/api\/$/, '');
    return [
      {
        source: '/api/settings-service/:path*',
        destination: `${settingsApiUrl}/:path*`,
      },
      {
        source: '/settings-service/:path*',
        destination: `${baseUrl}/:path*`,
      },
    ];
  },
}

export default nextConfig
