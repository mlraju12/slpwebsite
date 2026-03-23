/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/thank-you.html', destination: '/cloudfish/thank-you', permanent: true },
      { source: '/purchase.html', destination: '/cloudfish/purchase', permanent: true },
      { source: '/login.html', destination: '/login', permanent: true },
      { source: '/signup.html', destination: '/signup', permanent: true },
      { source: '/cloudfish/login', destination: '/login', permanent: false },
      { source: '/cloudfish/signup', destination: '/signup', permanent: false },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
