/**
 * The canonical origin, always with the `www` host.
 *
 * The bare domain 307-redirects to www, and the crawlers that fetch `og:image`
 * do not follow redirects — WhatsApp drops the image entirely and falls back to
 * the favicon. The same is true of one-click unsubscribe requests from email
 * apps. Any URL handed to another service must come from here, never the apex.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.ladyprowess.com"
).replace(/\/$/, "");
