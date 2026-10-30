// Shared rules for the cold-email outreach tracker (admin only).

export type LeadStatus = 'new' | 'sent' | 'opened' | 'clicked' | 'replied' | 'bounced' | 'stopped'

export type Lead = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  title: string | null
  company: string | null
  website: string | null
  linkedin: string | null
  country: string | null
  industry: string | null
  status: LeadStatus
  notes: string
  follow_ups: number
  first_sent_at: string | null
  last_sent_at: string | null
  opened_at: string | null
  clicked_at: string | null
  replied_at: string | null
  bounced_at: string | null
  created_at: string
}

export type OutreachSettings = {
  daily_limit: number
  follow_up_days: number
  max_follow_ups: number
  subject: string
  body: string
  follow_up_body: string
}

export type Reply = { id: number; lead_id: string | null; from_email: string; subject: string | null; snippet: string | null; received_at: string }

/** Progress only moves forward; replied, bounced and stopped end the sequence. */
const RANK: Record<LeadStatus, number> = { new: 0, sent: 1, opened: 2, clicked: 3, replied: 4, bounced: 5, stopped: 5 }
export const isFinished = (s: LeadStatus) => s === 'replied' || s === 'bounced' || s === 'stopped'
export const advance = (current: LeadStatus, next: LeadStatus): LeadStatus => (isFinished(current) || RANK[next] <= RANK[current] ? current : next)

export const DEFAULT_SETTINGS: OutreachSettings = {
  daily_limit: 20,
  follow_up_days: 3,
  max_follow_ups: 2,
  subject: 'Clearer docs for {company}?',
  body: `Hi {first_name},

I came across {company} and liked what you're building.

I'm Ngozi, a technical writer and content strategist for fintech and Web3 products. At txFusion I wrote the API documentation and integration guides for their payment systems, which improved developer satisfaction by 25% and cut support queries by 15%.

If {company} has docs, onboarding or product education that could be easier to follow, I'd love to help.

Would you be open to a short chat this week? You can see my work at ladyprowess.com.

Ngozi

P.S. If this isn't relevant, just reply "no thanks" and I won't email you again.`,
  follow_up_body: `Hi {first_name},

Bringing this back to the top of your inbox in case it got buried. I'd be happy to share a couple of writing samples relevant to {company}, if that would help.

Ngozi`,
}

/** Fills {first_name}, {last_name}, {company} and {title}. A missing first name becomes "there". */
export function personalise(template: string, lead: Pick<Lead, 'first_name' | 'last_name' | 'company' | 'title'>) {
  const fields: Record<string, string> = {
    first_name: lead.first_name?.trim() || 'there',
    last_name: lead.last_name?.trim() || '',
    company: lead.company?.trim() || 'your team',
    title: lead.title?.trim() || '',
  }
  return template.replace(/\{(first_name|last_name|company|title)\}/g, (_, key: string) => fields[key])
}

const escape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Plain text with blank lines becomes simple HTML paragraphs; bare URLs and domains become links. */
export function textToHtml(text: string) {
  return text.trim().split(/\n{2,}/).map(block => {
    const html = escape(block).replace(/\n/g, '<br>')
      .replace(/\b(https?:\/\/[^\s<]+|ladyprowess\.com[^\s<]*)/g, m => `<a href="${m.startsWith('http') ? m : `https://www.${m}`}" style="color:#2563EB;">${m}</a>`)
    return `<p style="margin:0 0 14px;">${html}</p>`
  }).join('')
}

/** Midnight in Lagos (UTC+1), so the daily limit resets at the start of Ngozi's day. */
export function startOfToday() {
  const lagos = new Date(Date.now() + 60 * 60 * 1000)
  lagos.setUTCHours(0, 0, 0, 0)
  return new Date(lagos.getTime() - 60 * 60 * 1000).toISOString()
}

/** True when a lead has waited long enough for its next follow-up. */
export function followUpDue(lead: Lead, s: OutreachSettings, now = Date.now()) {
  if (isFinished(lead.status) || lead.status === 'new' || !lead.last_sent_at) return false
  if (lead.follow_ups >= s.max_follow_ups) return false
  return now - new Date(lead.last_sent_at).getTime() >= s.follow_up_days * 86_400_000
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
