import { NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: '' }))
  if (!process.env.COMPOSE_PASSWORD) {
    return NextResponse.json({ error: 'COMPOSE_PASSWORD is not set on the server.' }, { status: 500 })
  }
  if (password !== process.env.COMPOSE_PASSWORD) {
    return NextResponse.json({ error: 'Wrong password.' }, { status: 401 })
  }
  return NextResponse.json({ ok: true })
}
