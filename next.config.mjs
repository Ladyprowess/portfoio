/** @type {import('next').NextConfig} */
const nextConfig = {
  // The OG image routes read these font files at runtime through a path built
  // at call time, which the output tracer cannot follow on its own.
  outputFileTracingIncludes: {
    '/opengraph-image': ['./lib/og/fonts/**'],
    '/blog/opengraph-image': ['./lib/og/fonts/**'],
    '/blog/[slug]/opengraph-image': ['./lib/og/fonts/**'],
  },
}
export default nextConfig
