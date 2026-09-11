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

// Supabase returns at most 1000 rows per request, so larger reads are paged.
// The path should include an order so pages do not overlap.
export async function dbAll(path: string, pageSize = 1000) {
  const rows: Row[] = []
  const separator = path.includes('?') ? '&' : '?'
  for (let offset = 0; ; offset += pageSize) {
    const page = await db(`${path}${separator}limit=${pageSize}&offset=${offset}`)
    rows.push(...page)
    if (page.length < pageSize) return rows
  }
}

export async function dbCount(path: string) {
  const { url, key } = config()
  const separator = path.includes('?') ? '&' : '?'
  const response = await fetch(`${url}/rest/v1/${path}${separator}limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}`, Prefer: 'count=exact' },
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Database error: ${await response.text()}`)
  return Number(response.headers.get('content-range')?.split('/')[1]) || 0
}
