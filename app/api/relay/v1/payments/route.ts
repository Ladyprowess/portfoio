import { authenticate, createPayment, fail, isResult, readBody } from '@/lib/relay'
import { preflight, respond } from '../../respond'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const denied = authenticate(req.headers.get('authorization'))
  if (denied) return respond(denied)
  const body = await readBody(req)
  if (isResult(body)) return respond(body)
  return respond(createPayment(body, req.headers.get('idempotency-key')))
}

export async function GET(req: Request) {
  const denied = authenticate(req.headers.get('authorization'))
  if (denied) return respond(denied)
  return respond(fail(405, 'method_not_allowed', 'Use POST /v1/payments to create a payment, or GET /v1/payments/{id} to retrieve one.'))
}

export const OPTIONS = preflight
