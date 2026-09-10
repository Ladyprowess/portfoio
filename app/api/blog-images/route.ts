import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

const allowedTypes = new Map([
  ['image/jpeg', 'jpg'],
  ['image/png', 'png'],
  ['image/webp', 'webp'],
  ['image/gif', 'gif'],
])

export async function POST(request: Request) {
  const payload = await request.json().catch(() => ({}))
  if (!process.env.COMPOSE_PASSWORD || payload.password !== process.env.COMPOSE_PASSWORD) return NextResponse.json({ error: 'Wrong password.' }, { status: 401 })

  const extension = allowedTypes.get(String(payload.type || ''))
  if (!extension || !payload.content) return NextResponse.json({ error: 'Choose a JPG, PNG, WEBP, or GIF image.' }, { status: 400 })
  const bytes = Buffer.from(String(payload.content), 'base64')
  if (bytes.length > 4 * 1024 * 1024) return NextResponse.json({ error: 'The image must be smaller than 4 MB.' }, { status: 400 })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return NextResponse.json({ error: 'Image storage is not configured.' }, { status: 500 })

  const safeName = String(payload.name || 'image').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const objectName = `${Date.now()}-${safeName || 'image'}.${extension}`
  const response = await fetch(`${url}/storage/v1/object/blog-images/${objectName}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, apikey: key, 'Content-Type': String(payload.type), 'x-upsert': 'false' },
    body: bytes,
  })
  if (!response.ok) return NextResponse.json({ error: `Image upload failed: ${await response.text()}` }, { status: 500 })
  return NextResponse.json({ url: `${url}/storage/v1/object/public/blog-images/${objectName}` })
}
