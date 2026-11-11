import { authenticate, getPayment } from '@/lib/relay'
import { preflight, respond } from '../../../respond'

export const dynamic = 'force-dynamic'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const denied = authenticate(req.headers.get('authorization'))
  return respond(denied ?? getPayment(params.id))
}

export const OPTIONS = preflight
