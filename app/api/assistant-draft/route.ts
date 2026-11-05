import { NextResponse } from 'next/server'

export const runtime = 'nodejs'
export const maxDuration = 30

type Payload = {
  password?: string
  request?: string
  context?: string
  tone?: string
}

const MAX_INPUT = 5_000
const ALLOWED_TONES = new Set([
  'Natural and direct',
  'Professional',
  'Warm but concise',
  'Formal',
  'Persuasive',
  'Friendly',
])

function extractOutputText(response: Record<string, unknown>): string {
  if (typeof response.output_text === 'string') return response.output_text
  const output = Array.isArray(response.output) ? response.output : []
  return output.flatMap((item: unknown) => {
    if (!item || typeof item !== 'object') return []
    const content = (item as { content?: unknown }).content
    if (!Array.isArray(content)) return []
    return content.flatMap((part: unknown) => {
      if (!part || typeof part !== 'object') return []
      const value = part as { type?: unknown; text?: unknown }
      return value.type === 'output_text' && typeof value.text === 'string' ? [value.text] : []
    })
  }).join('\n')
}

export async function POST(request: Request) {
  let payload: Payload
  try {
    payload = await request.json() as Payload
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const adminPassword = process.env.COMPOSE_PASSWORD
  if (!adminPassword || payload.password !== adminPassword) {
    return NextResponse.json({ error: 'Your admin session has expired. Sign in again.' }, { status: 401 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'AI drafting is not configured yet. Add OPENAI_API_KEY to your Vercel environment variables, then redeploy.' }, { status: 503 })
  }

  const userRequest = String(payload.request ?? '').trim()
  const context = String(payload.context ?? '').trim()
  if (userRequest.length < 8) return NextResponse.json({ error: 'Describe the email you need in a little more detail.' }, { status: 400 })
  if (userRequest.length > MAX_INPUT || context.length > MAX_INPUT) {
    return NextResponse.json({ error: 'Instructions and extra context must each be 5,000 characters or fewer.' }, { status: 400 })
  }

  const tone = ALLOWED_TONES.has(String(payload.tone)) ? String(payload.tone) : 'Natural and direct'
  const model = process.env.OPENAI_EMAIL_MODEL || 'gpt-6-luna'
  const input = [
    `Email request:\n${userRequest}`,
    context ? `Additional context:\n${context}` : '',
    `Requested tone: ${tone}`,
  ].filter(Boolean).join('\n\n')

  try {
    const response = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        instructions: [
          'You are an email-writing assistant for Lady Prowess.',
          'Write clear, natural emails in straightforward English. Keep the tone controlled and practical.',
          'Follow the requested tone. Do not make the email sound inflated, theatrical, generic, or excessively formal.',
          'Do not invent names, dates, job titles, companies, promises, achievements, figures, attachments, or facts.',
          'When essential information is missing, use a short bracketed placeholder rather than inventing it.',
          'Return only a JSON object with exactly two string fields: subject and body.',
          'The body must be plain text with normal paragraph breaks. Do not include HTML, Markdown fences, or an email signature.',
          'Do not include the recipient email address in the body unless the user explicitly asks for it.',
        ].join(' '),
        input,
        max_output_tokens: 1200,
        text: {
          format: {
            type: 'json_schema',
            name: 'email_draft',
            strict: true,
            schema: {
              type: 'object',
              properties: { subject: { type: 'string' }, body: { type: 'string' } },
              required: ['subject', 'body'],
              additionalProperties: false,
            },
          },
        },
      }),
      cache: 'no-store',
    })

    const data = await response.json().catch(() => ({})) as Record<string, unknown>
    if (!response.ok) {
      const detail = data.error && typeof data.error === 'object'
        ? String((data.error as { message?: unknown }).message || '')
        : ''
      return NextResponse.json(
        { error: detail ? `Draft generation failed: ${detail}` : 'Draft generation failed. Check your OpenAI API key and API account.' },
        { status: response.status === 401 ? 503 : 502 },
      )
    }

    const outputText = extractOutputText(data)
    let parsed: { subject?: unknown; body?: unknown }
    try {
      parsed = JSON.parse(outputText)
    } catch {
      return NextResponse.json({ error: 'The AI returned a draft in an unexpected format. Please generate it again.' }, { status: 502 })
    }

    const subject = typeof parsed.subject === 'string' ? parsed.subject.trim().slice(0, 300) : ''
    const body = typeof parsed.body === 'string' ? parsed.body.trim().slice(0, 20_000) : ''
    if (!subject || !body) {
      return NextResponse.json({ error: 'The AI returned an incomplete draft. Please add more details and try again.' }, { status: 502 })
    }

    return NextResponse.json({ subject, body, model })
  } catch {
    return NextResponse.json({ error: 'Could not reach the AI drafting service. Please try again.' }, { status: 502 })
  }
}
