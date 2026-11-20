/** @type {import('next').NextConfig} */
const nextConfig = {
  // The Builds page became Work; keep old links working.
  async redirects() {
    return [{ source: '/builds', destination: '/work', permanent: true }]
  },
}
export default nextConfig
