type Row = Record<string, unknown>

function config() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('The database is not configured.')
  return { url, key }
}

export async function db(path: string, init: RequestInit = {}) {
  const { url, key } = config()
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', Prefer: 'return=representation', ...(init.headers || {}) },
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Database error: ${await response.text()}`)
  const text = await response.text()
  return text ? JSON.parse(text) as Row[] : []
}
