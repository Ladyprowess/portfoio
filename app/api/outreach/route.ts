import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { db, dbAll, dbCount } from '@/lib/email-store'
import { FROM, REPLY_TO, SIGNATURE_HTML, SIGNATURE_TEXT } from '@/lib/email-signature'
import { advance, DEFAULT_SETTINGS, EMAIL_RE, isFinished, personalise, startOfToday, textToHtml, type Lead, type OutreachSettings } from '@/lib/outreach'

// Private API for the outreach tracker. Every action needs the admin password
// (COMPOSE_PASSWORD). Emails go out one at a time from hello@ladyprowess.com
// and are stored in sent_emails with a lead_id, so the Resend webhook can move
// each lead along (opened, clicked, bounced, replied) without any manual work.

export const runtime = 'nodejs'

const OUTREACH_KINDS = 'kind=in.(outreach,outreach_follow_up)'
const LEAD_FIELDS = ['email', 'first_name', 'last_name', 'title', 'company', 'website', 'linkedin', 'country', 'industry', 'source_id'] as const

type Body = { password?: string; action?: string; [key: string]: unknown }

async function loadSettings(): Promise<OutreachSettings> {
  const rows = await db('outreach_settings?id=eq.1&select=*')
  const s = rows[0] as Partial<OutreachSettings> | undefined
  // Empty templates fall back to the starter copy until they are edited in admin.
  return {
    daily_limit: s?.daily_limit ?? DEFAULT_SETTINGS.daily_limit,
    follow_up_days: s?.follow_up_days ?? DEFAULT_SETTINGS.follow_up_days,
    max_follow_ups: s?.max_follow_ups ?? DEFAULT_SETTINGS.max_follow_ups,
    subject: s?.subject || DEFAULT_SETTINGS.subject,
    body: s?.body || DEFAULT_SETTINGS.body,
    follow_up_body: s?.follow_up_body || DEFAULT_SETTINGS.follow_up_body,
  }
}

const sentToday = () => dbCount(`sent_emails?${OUTREACH_KINDS}&status=eq.sent&sent_at=gte.${encodeURIComponent(startOfToday())}`)

export async function POST(request: Request) {
  const password = process.env.COMPOSE_PASSWORD
  const body = (await request.json().catch(() => ({}))) as Body
  if (!password) return NextResponse.json({ error: 'COMPOSE_PASSWORD is not set on the server.' }, { status: 500 })
  if (body.password !== password) return NextResponse.json({ error: 'Wrong password.' }, { status: 401 })

  try {
    switch (body.action) {
      case 'load': {
        const [leads, settings, today, replies] = await Promise.all([
          dbAll('outreach_leads?select=*&order=created_at.desc'),
          loadSettings(),
          sentToday(),
          db('outreach_replies?select=*&order=received_at.desc&limit=200'),
        ])
        return NextResponse.json({ leads, settings, sentToday: today, replies })
      }

      case 'import': {
        const incoming = Array.isArray(body.leads) ? (body.leads as Record<string, string>[]) : []
        const existing = new Set((await dbAll('outreach_leads?select=email&order=email.asc')).map(r => String(r.email).toLowerCase()))
        const fresh: Record<string, string | null>[] = []
        let skipped = 0, invalid = 0
        for (const raw of incoming) {
          const email = String(raw.email || '').trim().toLowerCase()
          if (!EMAIL_RE.test(email)) { invalid += 1; continue }
          if (existing.has(email)) { skipped += 1; continue }
          existing.add(email)
          const row: Record<string, string | null> = { source: 'apollo' }
          for (const f of LEAD_FIELDS) row[f] = String(raw[f] || '').trim() || null
          row.email = email
          fresh.push(row)
        }
        for (let i = 0; i < fresh.length; i += 200) await db('outreach_leads', { method: 'POST', body: JSON.stringify(fresh.slice(i, i + 200)) })
        return NextResponse.json({ added: fresh.length, skipped, invalid })
      }

      case 'update': {
        const id = String(body.id || '')
        const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
        if (typeof body.notes === 'string') patch.notes = body.notes.slice(0, 5000)
        if (typeof body.status === 'string' && ['new', 'sent', 'opened', 'clicked', 'replied', 'bounced', 'stopped'].includes(body.status)) {
          patch.status = body.status
          if (body.status === 'replied') patch.replied_at = new Date().toISOString()
        }
        const rows = await db(`outreach_leads?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(patch) })
        return NextResponse.json({ lead: rows[0] })
      }

      case 'delete': {
        await db(`outreach_leads?id=eq.${encodeURIComponent(String(body.id || ''))}`, { method: 'DELETE' })
        return NextResponse.json({ ok: true })
      }

      case 'settings': {
        const s = body.settings as Partial<OutreachSettings> | undefined
        const clamp = (v: unknown, lo: number, hi: number, d: number) => Math.min(hi, Math.max(lo, Math.round(Number(v)) || d))
        const row = {
          id: 1,
          daily_limit: clamp(s?.daily_limit, 1, 100, 20),
          follow_up_days: clamp(s?.follow_up_days, 1, 30, 3),
          max_follow_ups: clamp(s?.max_follow_ups, 0, 5, 2),
          subject: String(s?.subject || '').slice(0, 300),
          body: String(s?.body || '').slice(0, 10000),
          follow_up_body: String(s?.follow_up_body || '').slice(0, 10000),
          updated_at: new Date().toISOString(),
        }
        await db('outreach_settings?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(row) })
        return NextResponse.json({ settings: await loadSettings() })
      }

      case 'send': {
        const apiKey = process.env.RESEND_API_KEY
        if (!apiKey) return NextResponse.json({ error: 'RESEND_API_KEY is not set on the server.' }, { status: 500 })
        const followUp = body.kind === 'follow_up'
        const leads = await db(`outreach_leads?id=eq.${encodeURIComponent(String(body.id || ''))}&select=*`)
        const lead = leads[0] as Lead | undefined
        if (!lead) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 })
        if (isFinished(lead.status)) return NextResponse.json({ error: `${lead.email} is ${lead.status}; not emailing again.`, skipped: true }, { status: 409 })
        if (!followUp && lead.status !== 'new') return NextResponse.json({ error: `${lead.email} has already been emailed.`, skipped: true }, { status: 409 })

        const settings = await loadSettings()
        const today = await sentToday()
        if (today >= settings.daily_limit) return NextResponse.json({ error: `Daily limit of ${settings.daily_limit} reached. The rest go out tomorrow.`, limit: true }, { status: 429 })

        const firstSubject = personalise(settings.subject, lead)
        const subject = followUp ? `Re: ${firstSubject}` : firstSubject
        const text = personalise(followUp ? settings.follow_up_body : settings.body, lead)
        const bodyHtml = textToHtml(text)

        const records = await db('sent_emails', { method: 'POST', body: JSON.stringify({ recipients: [lead.email], subject, preview: '', body_html: bodyHtml, lead_id: lead.id, kind: followUp ? 'outreach_follow_up' : 'outreach' }) })
        const emailId = String(records[0]?.id || '')
        const { data, error } = await new Resend(apiKey).emails.send({
          from: FROM,
          to: [lead.email],
          // Replies go to the normal inbox (iCloud) and, when configured, to a tracking
          // address on a subdomain whose mail Resend receives, so replies are detected
          // without moving the main domain's mail away from iCloud.
          replyTo: process.env.OUTREACH_REPLY_TRACKING_ADDRESS ? [REPLY_TO, process.env.OUTREACH_REPLY_TRACKING_ADDRESS] : REPLY_TO,
          subject,
          text: `${text}${SIGNATURE_TEXT}`,
          html: `<div style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;">${bodyHtml}</div>${SIGNATURE_HTML}`,
        })
        if (error) {
          await db(`sent_emails?id=eq.${emailId}`, { method: 'PATCH', body: JSON.stringify({ status: 'failed' }) }).catch(() => null)
          return NextResponse.json({ error: error.message || 'Resend rejected the email.' }, { status: 502 })
        }

        const now = new Date().toISOString()
        await db(`sent_emails?id=eq.${emailId}`, { method: 'PATCH', body: JSON.stringify({ status: 'sent', resend_id: data?.id, sent_at: now }) })
        const updated = await db(`outreach_leads?id=eq.${lead.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            status: advance(lead.status, 'sent'),
            last_email_id: emailId,
            first_sent_at: lead.first_sent_at || now,
            last_sent_at: now,
            follow_ups: followUp ? lead.follow_ups + 1 : lead.follow_ups,
            updated_at: now,
          }),
        })
        return NextResponse.json({ lead: updated[0], sentToday: today + 1 })
      }

      default:
        return NextResponse.json({ error: 'Unknown action.' }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Something went wrong.' }, { status: 500 })
  }
}
