import { fail } from '@/lib/relay'
import { preflight, respond } from '../respond'

export const dynamic = 'force-dynamic'

const unknown = (req: Request) => respond(fail(404, 'unknown_endpoint', `${req.method} ${new URL(req.url).pathname.replace('/api/relay', '')} does not exist. See the API reference for available endpoints.`))

export const GET = unknown
export const POST = unknown
export const OPTIONS = preflight
