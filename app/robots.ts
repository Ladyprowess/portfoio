import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin/', '/api/', '/compose/', '/unsubscribe/'] },
    sitemap: 'https://ladyprowess.com/sitemap.xml',
    host: 'https://ladyprowess.com',
  }
}
