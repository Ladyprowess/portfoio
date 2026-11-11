import { authenticate, isResult, readBody, refundPayment } from '@/lib/relay'
import { preflight, respond } from '../../../../respond'

export const dynamic = 'force-dynamic'

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const denied = authenticate(req.headers.get('authorization'))
  if (denied) return respond(denied)
  const body = await readBody(req)
  if (isResult(body)) return respond(body)
  return respond(refundPayment(params.id, body))
}

export const OPTIONS = preflight
