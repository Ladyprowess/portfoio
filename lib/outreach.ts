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
  source: string
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

/** Sending rules, set in admin. (Email wording lives in templates.) */
export type OutreachSettings = { daily_limit: number; follow_up_days: number; max_follow_ups: number }

export type Template = { id: string; name: string; subject: string; body: string }

/** One email in a contact's history. */
export type SentEmail = { id: string; lead_id: string; subject: string; sent_at: string; status: 'sent' | 'scheduled' | 'cancelled' | 'failed' | 'preparing' | 'logged'; kind: string }

export type Reply = { id: number; lead_id: string | null; from_email: string; subject: string | null; snippet: string | null; received_at: string }

/** Where a contact came from. */
export const SOURCES = [
  { key: 'apollo', label: 'Apollo' },
  { key: 'linkedin', label: 'LinkedIn' },
  { key: 'referral', label: 'Referral' },
  { key: 'event', label: 'Event' },
  { key: 'website', label: 'Website' },
  { key: 'other', label: 'Other' },
] as const

/** Progress only moves forward; replied, bounced and stopped end the sequence. */
const RANK: Record<LeadStatus, number> = { new: 0, sent: 1, opened: 2, clicked: 3, replied: 4, bounced: 5, stopped: 5 }
export const isFinished = (s: LeadStatus) => s === 'replied' || s === 'bounced' || s === 'stopped'
export const advance = (current: LeadStatus, next: LeadStatus): LeadStatus => (isFinished(current) || RANK[next] <= RANK[current] ? current : next)

export const DEFAULT_SETTINGS: OutreachSettings = { daily_limit: 20, follow_up_days: 3, max_follow_ups: 2 }

/** Added to the library the first time it is empty. Edit or delete them freely. */
export const STARTER_TEMPLATES: Omit<Template, 'id'>[] = [
  {
    name: 'Technical writing pitch',
    subject: 'Clearer docs for {company}?',
    body: `Hi {first_name},

I came across {company} and liked what you're building.

I'm Ngozi, a technical writer and content strategist for fintech and Web3 products. At txFusion I wrote the API documentation and integration guides for their payment systems, which improved developer satisfaction by 25% and cut support queries by 15%.

If {company} has docs, onboarding or product education that could be easier to follow, I'd love to help.

Would you be open to a short chat this week? You can see my work at ladyprowess.com.

Ngozi

P.S. If this isn't relevant, just reply "no thanks" and I won't email you again.`,
  },
  {
    name: 'Job application',
    subject: 'Application: {title} role at {company}',
    body: `Hi {first_name},

I'd like to apply for the role at {company}. My CV is attached and my portfolio is at ladyprowess.com.

I bring nearly three years of hands-on customer support, plus years of technical writing and product education for fintech and Web3 products, so I know both sides: the questions customers ask, and the documentation that answers them.

For a quick overview, my one-page summary is at ladyprowess.com/recruiter.

Thank you for your time. I'd love to help {company} look after its customers.

Ngozi Peace Okafor`,
  },
  {
    name: 'LinkedIn connection',
    subject: 'Following up from LinkedIn',
    body: `Hi {first_name},

Thanks for connecting on LinkedIn. I wanted to follow up properly by email.

I'm Ngozi, a technical writer and content strategist for fintech and Web3 products. I help teams like {company} make their product easier to understand, through API docs, onboarding and product education.

If there's anything on your side where that would help, I'd be glad to chat. My work is at ladyprowess.com.

Ngozi`,
  },
  {
    name: 'Gentle follow-up',
    subject: 'Re: following up',
    body: `Hi {first_name},

Bringing this back to the top of your inbox in case it got buried. I'd be happy to share a couple of writing samples relevant to {company}, if that would help.

Ngozi`,
  },
]

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

/** Midnight in Lagos (UTC+1) for the day containing `at`, so limits follow Ngozi's day. */
export function startOfDay(at = new Date()) {
  const lagos = new Date(at.getTime() + 60 * 60 * 1000)
  lagos.setUTCHours(0, 0, 0, 0)
  return new Date(lagos.getTime() - 60 * 60 * 1000)
}

/** True when a lead has waited long enough for its next follow-up. */
export function followUpDue(lead: Lead, s: OutreachSettings, now = Date.now()) {
  if (isFinished(lead.status) || lead.status === 'new' || !lead.last_sent_at) return false
  if (lead.follow_ups >= s.max_follow_ups) return false
  return now - new Date(lead.last_sent_at).getTime() >= s.follow_up_days * 86_400_000
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
