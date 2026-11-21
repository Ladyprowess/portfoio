/** @type {import('next').NextConfig} */
const nextConfig = {
  // AVIF is ~20-30% lighter than WebP; optimised images are cached for 30 days.
  images: { formats: ['image/avif', 'image/webp'], minimumCacheTTL: 60 * 60 * 24 * 30 },
  // The Builds page became Work; keep old links working.
  async redirects() {
    return [{ source: '/builds', destination: '/work', permanent: true }]
  },
}
export default nextConfig
