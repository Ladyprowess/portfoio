import { NextResponse } from 'next/server'
import type { RelayResult } from '@/lib/relay'

// Open to any origin, so the docs' curl commands also work from a reader's own machine.
export const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type, Idempotency-Key',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

export const respond = (r: RelayResult) => NextResponse.json(r.body, { status: r.status, headers: { ...cors, 'Cache-Control': 'no-store' } })
export const preflight = () => new NextResponse(null, { status: 204, headers: cors })
