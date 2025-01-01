/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // This will create a static export
  images: {
    unoptimized: true, // Required for static export
  },
}

module.exports = nextConfig