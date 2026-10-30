// Service worker for the installed admin app (scope: /admin).
// It never caches anything: admin pages and API responses are private and must
// always be fresh. Its only job is to show a friendly page when there's no
// connection, instead of the browser's error screen.

const OFFLINE_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><title>You're offline</title>
<style>
  :root{color-scheme:light dark}
  body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:20px;
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;background:#F8F9FB;color:#111827}
  .card{max-width:360px;width:100%;background:#fff;border:1px solid #E5E7EB;border-radius:24px;padding:28px;text-align:center}
  h1{font-size:22px;margin:16px 0 8px;letter-spacing:-.02em}
  p{margin:0;color:#6B7280;font-size:14px;line-height:1.6}
  button{margin-top:20px;border:0;border-radius:999px;background:#2563EB;color:#fff;font-weight:600;font-size:14px;padding:12px 22px}
  @media (prefers-color-scheme:dark){body{background:#0B0F19;color:#F3F4F6}.card{background:#111827;border-color:#1F2937}p{color:#9CA3AF}}
</style></head><body><div class="card">
<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563EB" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8.8a15 15 0 0 1 20 0M5 12.5a10 10 0 0 1 14 0M8.5 16a5 5 0 0 1 7 0"/><path d="M12 19.5h.01"/><path d="M3 3l18 18"/></svg>
<h1>You're offline</h1>
<p>Your admin needs a connection to load emails, contacts and posts. Nothing has been lost.</p>
<button onclick="location.reload()">Try again</button>
</div></body></html>`

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))

self.addEventListener('fetch', event => {
  if (event.request.mode !== 'navigate') return
  event.respondWith(fetch(event.request).catch(() => new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } })))
})
