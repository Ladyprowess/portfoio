import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db, dbAll, dbCount } from '@/lib/email-store'
import { FROM, REPLY_TO, SIGNATURE_HTML, SIGNATURE_TEXT } from '@/lib/email-signature'
import { advance, DEFAULT_SETTINGS, EMAIL_RE, isFinished, startOfDay, STARTER_TEMPLATES, textToHtml, type Lead, type OutreachSettings } from '@/lib/outreach'

// Private API for the outreach tracker. Every action needs the admin password
// (COMPOSE_PASSWORD). Emails are stored in sent_emails with a lead_id, so the
// Resend webhook can move each contact along (opened, clicked, bounced, replied)
// on its own. Emails can be sent now, scheduled (Resend delivers them later),
// logged after being sent elsewhere, or linked after being sent from Compose.

export const runtime = 'nodejs'
export const maxDuration = 30

const SENT_KINDS = 'kind=in.(outreach,outreach_follow_up,outreach_compose)'
const LEAD_FIELDS = ['email', 'first_name', 'last_name', 'title', 'company', 'website', 'linkedin', 'country', 'industry', 'source_id', 'source', 'notes'] as const

type Body = { password?: string; action?: string; [key: string]: unknown }
type Json = Record<string, unknown>

const str = (v: unknown, max = 500) => String(v ?? '').trim().slice(0, max)
const leadById = async (id: unknown) => (await db(`outreach_leads?id=eq.${encodeURIComponent(str(id))}&select=*`))[0] as Lead | undefined

async function loadSettings(): Promise<OutreachSettings> {
  const s = (await db('outreach_settings?id=eq.1&select=daily_limit,follow_up_days,max_follow_ups'))[0] as Partial<OutreachSettings> | undefined
  return { ...DEFAULT_SETTINGS, ...s }
}

/** Seeds the starter templates the first time the library is opened. */
async function loadTemplates() {
  let templates = await db('outreach_templates?select=id,name,subject,body&order=created_at.asc')
  if (!templates.length) templates = await db('outreach_templates', { method: 'POST', body: JSON.stringify(STARTER_TEMPLATES) })
  return templates
}

/** Emails sent (or scheduled) on the Lagos day containing `at`. */
async function countForDay(at: Date) {
  const start = startOfDay(at)
  const end = new Date(start.getTime() + 86_400_000)
  return dbCount(`sent_emails?${SENT_KINDS}&status=in.(sent,scheduled)&sent_at=gte.${encodeURIComponent(start.toISOString())}&sent_at=lt.${encodeURIComponent(end.toISOString())}`)
}

/** Finds a contact by email, or creates one from the details given. */
async function upsertLead(details: Json): Promise<{ lead: Lead; created: boolean }> {
  const email = str(details.email, 320).toLowerCase()
  if (!EMAIL_RE.test(email)) throw new Error(`"${email}" is not a valid email address.`)
  const pattern = encodeURIComponent(email.replace(/[%_*\\]/g, m => `\\${m}`))
  const found = (await db(`outreach_leads?select=*&email=ilike.${pattern}&limit=1`))[0] as Lead | undefined
  if (found) {
    // Fill in any blanks with the new details, without overwriting what is there.
    const patch: Json = {}
    for (const f of LEAD_FIELDS) if (f !== 'email' && f !== 'notes' && !found[f as keyof Lead] && str(details[f])) patch[f] = str(details[f])
    if (str(details.notes)) patch.notes = [found.notes, str(details.notes, 5000)].filter(Boolean).join('\n')
    if (!Object.keys(patch).length) return { lead: found, created: false }
    const rows = await db(`outreach_leads?id=eq.${found.id}`, { method: 'PATCH', body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }) })
    return { lead: rows[0] as Lead, created: false }
  }
  const row: Json = { source: 'other' }
  for (const f of LEAD_FIELDS) if (str(details[f], f === 'notes' ? 5000 : 500)) row[f] = str(details[f], f === 'notes' ? 5000 : 500)
  row.email = email
  const rows = await db('outreach_leads', { method: 'POST', body: JSON.stringify(row) })
  return { lead: rows[0] as Lead, created: true }
}

/** Updates a contact after an email to them went out (or is scheduled) at `at`. */
async function markSent(lead: Lead, emailId: string, at: string, followUp: boolean) {
  const rows = await db(`outreach_leads?id=eq.${lead.id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: advance(lead.status, 'sent'),
      last_email_id: emailId,
      first_sent_at: lead.first_sent_at && lead.first_sent_at < at ? lead.first_sent_at : at,
      last_sent_at: lead.last_sent_at && lead.last_sent_at > at ? lead.last_sent_at : at,
      follow_ups: followUp ? lead.follow_ups + 1 : lead.follow_ups,
      updated_at: new Date().toISOString(),
    }),
  })
  return rows[0] as Lead
}

/** After a scheduled email is cancelled, rebuilds the contact's dates from what is left. */
async function recompute(leadId: string) {
  const lead = await leadById(leadId)
  if (!lead) return undefined
  const emails = await db(`sent_emails?select=id,sent_at,kind&lead_id=eq.${leadId}&status=in.(sent,scheduled,logged)&order=sent_at.asc`)
  const patch: Json = emails.length
    ? { first_sent_at: emails[0].sent_at, last_sent_at: emails[emails.length - 1].sent_at, last_email_id: emails[emails.length - 1].id, follow_ups: Math.max(0, emails.length - 1) }
    : { first_sent_at: null, last_sent_at: null, last_email_id: null, follow_ups: 0, status: isFinished(lead.status) ? lead.status : 'new' }
  return (await db(`outreach_leads?id=eq.${leadId}`, { method: 'PATCH', body: JSON.stringify({ ...patch, updated_at: new Date().toISOString() }) }))[0] as Lead
}

export async function POST(request: Request) {
  const password = process.env.COMPOSE_PASSWORD
  const body = (await request.json().catch(() => ({}))) as Body
  if (!password) return NextResponse.json({ error: 'COMPOSE_PASSWORD is not set on the server.' }, { status: 500 })
  if (body.password !== password) return NextResponse.json({ error: 'Wrong password.' }, { status: 401 })

  try {
    switch (body.action) {
      case 'load': {
        const [leads, settings, templates, emails, replies, today] = await Promise.all([
          dbAll('outreach_leads?select=*&order=created_at.desc'),
          loadSettings(),
          loadTemplates(),
          dbAll('sent_emails?select=id,lead_id,subject,sent_at,status,kind&lead_id=not.is.null&order=sent_at.desc'),
          db('outreach_replies?select=*&order=received_at.desc&limit=300'),
          countForDay(new Date()),
        ])
        return NextResponse.json({ leads, settings, templates, emails, replies, sentToday: today })
      }

      case 'import': {
        const incoming = Array.isArray(body.leads) ? (body.leads as Json[]) : []
        const existing = new Set((await dbAll('outreach_leads?select=email&order=email.asc')).map(r => String(r.email).toLowerCase()))
        const fresh: Json[] = []
        let skipped = 0, invalid = 0
        for (const raw of incoming) {
          const email = str(raw.email, 320).toLowerCase()
          if (!EMAIL_RE.test(email)) { invalid += 1; continue }
          if (existing.has(email)) { skipped += 1; continue }
          existing.add(email)
          const row: Json = { source: str(body.source) || 'apollo' }
          for (const f of LEAD_FIELDS) if (f !== 'source') row[f] = str(raw[f]) || null
          row.email = email
          row.notes = ''
          fresh.push(row)
        }
        for (let i = 0; i < fresh.length; i += 200) await db('outreach_leads', { method: 'POST', body: JSON.stringify(fresh.slice(i, i + 200)) })
        return NextResponse.json({ added: fresh.length, skipped, invalid })
      }

      case 'add_lead': {
        const { lead, created } = await upsertLead((body.lead || {}) as Json)
        return NextResponse.json({ lead, created })
      }

      case 'update': {
        const patch: Json = { updated_at: new Date().toISOString() }
        if (typeof body.notes === 'string') patch.notes = body.notes.slice(0, 5000)
        if (typeof body.status === 'string' && ['new', 'sent', 'opened', 'clicked', 'replied', 'bounced', 'stopped'].includes(body.status)) {
          patch.status = body.status
          if (body.status === 'replied') patch.replied_at = new Date().toISOString()
        }
        for (const f of ['first_name', 'last_name', 'title', 'company', 'linkedin', 'website', 'source'] as const) if (typeof body[f] === 'string') patch[f] = str(body[f]) || null
        const rows = await db(`outreach_leads?id=eq.${encodeURIComponent(str(body.id))}`, { method: 'PATCH', body: JSON.stringify(patch) })
        return NextResponse.json({ lead: rows[0] })
      }

      case 'delete': {
        await db(`outreach_leads?id=eq.${encodeURIComponent(str(body.id))}`, { method: 'DELETE' })
        return NextResponse.json({ ok: true })
      }

      case 'settings': {
        const s = body.settings as Partial<OutreachSettings> | undefined
        const clamp = (v: unknown, lo: number, hi: number, d: number) => Math.min(hi, Math.max(lo, Math.round(Number(v)) || d))
        const row = { id: 1, daily_limit: clamp(s?.daily_limit, 1, 100, 20), follow_up_days: clamp(s?.follow_up_days, 1, 30, 3), max_follow_ups: clamp(s?.max_follow_ups, 0, 5, 2), updated_at: new Date().toISOString() }
        await db('outreach_settings?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(row) })
        return NextResponse.json({ settings: await loadSettings() })
      }

      case 'template_save': {
        const t = (body.template || {}) as Json
        const row = { name: str(t.name, 120) || 'Untitled template', subject: str(t.subject, 300), body: String(t.body ?? '').slice(0, 10000), updated_at: new Date().toISOString() }
        const rows = t.id
          ? await db(`outreach_templates?id=eq.${encodeURIComponent(str(t.id))}`, { method: 'PATCH', body: JSON.stringify(row) })
          : await db('outreach_templates', { method: 'POST', body: JSON.stringify(row) })
        return NextResponse.json({ template: rows[0] })
      }

      case 'template_delete': {
        await db(`outreach_templates?id=eq.${encodeURIComponent(str(body.id))}`, { method: 'DELETE' })
        return NextResponse.json({ ok: true })
      }

      // Sends (or schedules) one email that the dashboard has already personalised.
      case 'send': {
        const apiKey = process.env.RESEND_API_KEY
        if (!apiKey) return NextResponse.json({ error: 'RESEND_API_KEY is not set on the server.' }, { status: 500 })
        const lead = await leadById(body.id)
        if (!lead) return NextResponse.json({ error: 'Contact not found.' }, { status: 404 })
        // Batches never email finished contacts; a single, deliberate email may (force).
        if (isFinished(lead.status) && body.force !== true) return NextResponse.json({ error: `${lead.email} is ${lead.status}; skipped.`, skipped: true }, { status: 409 })

        const subject = str(body.subject, 300)
        const text = String(body.body ?? '').trim()
        if (!subject || !text) return NextResponse.json({ error: 'Add a subject and a message.' }, { status: 400 })

        let at = new Date()
        const scheduled = typeof body.scheduledAt === 'string' && body.scheduledAt
        if (scheduled) {
          at = new Date(String(body.scheduledAt))
          if (Number.isNaN(at.getTime()) || at.getTime() < Date.now() + 60_000) return NextResponse.json({ error: 'Pick a time at least a minute from now.' }, { status: 400 })
        }

        const settings = await loadSettings()
        const dayCount = await countForDay(at)
        if (dayCount >= settings.daily_limit) return NextResponse.json({ error: `The daily limit of ${settings.daily_limit} is full for that day.`, limit: true }, { status: 429 })

        const followUp = lead.status !== 'new'
        const bodyHtml = textToHtml(text)
        const records = await db('sent_emails', { method: 'POST', body: JSON.stringify({ recipients: [lead.email], subject, preview: '', body_html: bodyHtml, lead_id: lead.id, kind: followUp ? 'outreach_follow_up' : 'outreach' }) })
        const emailId = String(records[0]?.id || '')
        const tracking = process.env.OUTREACH_REPLY_TRACKING_ADDRESS
        const { data, error } = await new Resend(apiKey).emails.send({
          from: FROM,
          to: [lead.email],
          // Replies reach the normal inbox (iCloud) and, when set, a tracking address
          // Resend receives, so replies are detected without moving the main domain's mail.
          replyTo: tracking ? [REPLY_TO, tracking] : REPLY_TO,
          subject,
          text: `${text}${SIGNATURE_TEXT}`,
          html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">${bodyHtml}</div>${SIGNATURE_HTML}`,
          ...(scheduled ? { scheduledAt: at.toISOString() } : {}),
        })
        if (error) {
          await db(`sent_emails?id=eq.${emailId}`, { method: 'PATCH', body: JSON.stringify({ status: 'failed' }) }).catch(() => null)
          return NextResponse.json({ error: error.message || 'Resend rejected the email.' }, { status: 502 })
        }
        const sentAt = at.toISOString()
        const email = (await db(`sent_emails?id=eq.${emailId}`, { method: 'PATCH', body: JSON.stringify({ status: scheduled ? 'scheduled' : 'sent', resend_id: data?.id, sent_at: sentAt }) }))[0]
        const updated = await markSent(lead, emailId, sentAt, followUp)
        return NextResponse.json({ lead: updated, email: { id: emailId, lead_id: lead.id, subject, sent_at: sentAt, status: email?.status, kind: email?.kind }, sentToday: await countForDay(new Date()) })
      }

      case 'cancel': {
        const apiKey = process.env.RESEND_API_KEY
        const email = (await db(`sent_emails?select=id,resend_id,lead_id,status&id=eq.${encodeURIComponent(str(body.emailId))}`))[0]
        if (!email || email.status !== 'scheduled') return NextResponse.json({ error: 'Only scheduled emails can be cancelled.' }, { status: 400 })
        if (apiKey && email.resend_id) {
          const { error } = await new Resend(apiKey).emails.cancel(String(email.resend_id))
          if (error) return NextResponse.json({ error: `Resend could not cancel it: ${error.message}` }, { status: 502 })
        }
        await db(`sent_emails?id=eq.${email.id}`, { method: 'PATCH', body: JSON.stringify({ status: 'cancelled' }) })
        return NextResponse.json({ lead: await recompute(String(email.lead_id)) })
      }

      // An email sent outside the site (Gmail, iCloud, LinkedIn InMail…), logged so
      // follow-up reminders still work. Opens and clicks cannot be tracked for these.
      case 'log': {
        const { lead } = await upsertLead((body.lead || {}) as Json)
        const at = new Date(str(body.sentAt) || Date.now())
        if (Number.isNaN(at.getTime())) return NextResponse.json({ error: 'That date is not valid.' }, { status: 400 })
        const subject = str(body.subject, 300) || '(sent from another inbox)'
        const records = await db('sent_emails', { method: 'POST', body: JSON.stringify({ recipients: [lead.email], subject, preview: '', body_html: '', lead_id: lead.id, kind: 'outreach_logged', status: 'logged', sent_at: at.toISOString() }) })
        const updated = await markSent(lead, String(records[0]?.id), at.toISOString(), lead.status !== 'new')
        return NextResponse.json({ lead: updated, email: records[0] })
      }

      // Called by the Compose page after it sends: attaches that email to a contact,
      // so the webhook updates the contact when it is opened, clicked or replied to.
      case 'link': {
        const emailId = str(body.emailId)
        const email = (await db(`sent_emails?select=id,sent_at,status&id=eq.${encodeURIComponent(emailId)}`))[0]
        if (!email) return NextResponse.json({ error: 'That email was not found.' }, { status: 404 })
        const { lead } = await upsertLead({ source: 'other', ...(body.lead as Json) })
        await db(`sent_emails?id=eq.${email.id}`, { method: 'PATCH', body: JSON.stringify({ lead_id: lead.id, kind: 'outreach_compose' }) })
        const updated = await markSent(lead, String(email.id), String(email.sent_at), lead.status !== 'new')
        return NextResponse.json({ lead: updated })
      }

      default:
        return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Something went wrong.' }, { status: 500 })
  }
}

