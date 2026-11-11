// The Relay sandbox API behind the /docs pages. It is stateless: a payment's
// details are encoded in its ID, and its status is worked out from how long
// ago it was created, so it settles on its own without a database.

export const RELAY_TEST_KEY = 'sk_test_relay_4eC39HqLyjWD'
export const CURRENCIES = ['NGN', 'USD', 'GHS', 'KES'] as const
const CONFIRMED_AFTER = 8_000
const SETTLED_AFTER = 16_000

type Stored = { t: number; amount: number; currency: string; reference: string | null }
export type RelayResult = { status: number; body: unknown }

export const fail = (status: number, code: string, message: string, param?: string): RelayResult => ({
  status,
  body: { error: { type: status === 401 ? 'authentication_error' : 'invalid_request_error', code, message, ...(param ? { param } : {}) } },
})

export function authenticate(header: string | null): RelayResult | null {
  if (!header) return fail(401, 'missing_api_key', 'No API key provided. Send it in the Authorization header: Bearer sk_test_...')
  const key = header.replace(/^Bearer\s+/i, '').trim()
  if (key !== RELAY_TEST_KEY) return fail(401, 'invalid_api_key', `Invalid API key: ${key.slice(0, 12)}${key.length > 12 ? '...' : ''}`)
  return null
}

const encode = (p: Stored) => 'pay_' + Buffer.from(`${p.t}.${p.amount}.${p.currency}.${p.reference ?? ''}`).toString('base64url')

function decode(id: string): Stored | null {
  if (!/^pay_[A-Za-z0-9_-]+$/.test(id)) return null
  const [t, amount, currency, ...ref] = Buffer.from(id.slice(4), 'base64url').toString().split('.')
  const p = { t: Number(t), amount: Number(amount), currency, reference: ref.join('.') || null }
  if (!Number.isFinite(p.t) || !Number.isInteger(p.amount) || !(CURRENCIES as readonly string[]).includes(currency)) return null
  return p
}

function view(p: Stored, now = Date.now()) {
  const age = now - p.t
  const status = age < CONFIRMED_AFTER ? 'pending' : age < SETTLED_AFTER ? 'confirmed' : 'settled'
  return {
    id: encode(p),
    object: 'payment',
    amount: p.amount,
    currency: p.currency,
    status,
    reference: p.reference,
    created_at: new Date(p.t).toISOString(),
    settled_at: status === 'settled' ? new Date(p.t + SETTLED_AFTER).toISOString() : null,
  }
}

// Best effort: an idempotency key returns the first payment while this server
// instance is alive. Capped so it cannot grow without bound.
const seen = new Map<string, string>()

export function createPayment(input: Record<string, unknown>, idempotencyKey: string | null): RelayResult {
  if (idempotencyKey && seen.has(idempotencyKey)) {
    const first = decode(seen.get(idempotencyKey)!)
    if (first) return { status: 200, body: view(first) }
  }
  const amount = Number(input.amount)
  const currency = String(input.currency ?? '').toUpperCase()
  const reference = input.reference == null || input.reference === '' ? null : String(input.reference)

  if (input.amount === undefined || input.amount === '') return fail(422, 'parameter_missing', 'amount is required.', 'amount')
  if (!Number.isInteger(amount) || amount <= 0) return fail(422, 'invalid_amount', 'amount must be a positive whole number in the smallest currency unit, e.g. 12500 for NGN 125.00.', 'amount')
  if (amount > 100_000_000) return fail(422, 'amount_too_large', 'amount cannot be more than 100000000.', 'amount')
  if (!currency) return fail(422, 'parameter_missing', 'currency is required.', 'currency')
  if (!(CURRENCIES as readonly string[]).includes(currency)) return fail(422, 'unsupported_currency', `${currency} is not supported. Use one of ${CURRENCIES.join(', ')}.`, 'currency')
  if (reference && (reference.length > 64 || reference.includes('.'))) return fail(422, 'invalid_reference', 'reference must be 64 characters or fewer and cannot contain a full stop.', 'reference')

  // With an idempotency key the creation time is rounded to a 5-second window, so a
  // retry rebuilds the same ID even when another server instance answers it.
  const now = Date.now()
  const payment = view({ t: idempotencyKey ? now - (now % 5000) : now, amount, currency, reference })
  if (idempotencyKey) {
    if (seen.size > 1000) seen.delete(seen.keys().next().value as string)
    seen.set(idempotencyKey, payment.id)
  }
  return { status: 201, body: payment }
}

export function getPayment(id: string): RelayResult {
  const p = decode(id)
  return p ? { status: 200, body: view(p) } : fail(404, 'resource_missing', `No such payment: ${id}`, 'id')
}

export function refundPayment(id: string, input: Record<string, unknown>): RelayResult {
  const p = decode(id)
  if (!p) return fail(404, 'resource_missing', `No such payment: ${id}`, 'id')
  const payment = view(p)
  if (payment.status !== 'settled') return fail(409, 'payment_not_settled', `This payment is ${payment.status}. You can refund it once it is settled.`)
  const amount = input.amount === undefined || input.amount === '' ? p.amount : Number(input.amount)
  if (!Number.isInteger(amount) || amount <= 0 || amount > p.amount) return fail(422, 'invalid_amount', `amount must be a whole number between 1 and ${p.amount}.`, 'amount')
  return {
    status: 201,
    body: { id: `re_${payment.id.slice(4, 18)}`, object: 'refund', payment: payment.id, amount, currency: p.currency, status: 'succeeded', created_at: new Date().toISOString() },
  }
}

/** Reads a JSON or form-encoded body (curl -d sends form data by default). */
export async function readBody(req: Request): Promise<Record<string, unknown> | RelayResult> {
  const text = await req.text()
  if (!text.trim()) return {}
  if ((req.headers.get('content-type') ?? '').includes('application/json') || text.trim().startsWith('{')) {
    try { return JSON.parse(text) } catch { return fail(400, 'invalid_json', 'The request body is not valid JSON.') }
  }
  return Object.fromEntries(new URLSearchParams(text))
}

export const isResult = (v: unknown): v is RelayResult => typeof v === 'object' && v !== null && 'status' in v && 'body' in v && typeof (v as RelayResult).status === 'number'
