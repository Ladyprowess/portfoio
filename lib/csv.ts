/** Parses CSV text into objects keyed by the header row. Handles quoted fields
    containing commas, quotes ("") and line breaks, as Apollo exports do. */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let row: string[] = [], field = '', quoted = false
  const src = text.replace(/^﻿/, '')
  for (let i = 0; i < src.length; i++) {
    const c = src[i]
    if (quoted) {
      if (c === '"' && src[i + 1] === '"') { field += '"'; i++ }
      else if (c === '"') quoted = false
      else field += c
    } else if (c === '"') quoted = true
    else if (c === ',') { row.push(field); field = '' }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && src[i + 1] === '\n') i++
      row.push(field); field = ''
      if (row.some(v => v !== '')) rows.push(row)
      row = []
    } else field += c
  }
  row.push(field)
  if (row.some(v => v !== '')) rows.push(row)
  const [header, ...body] = rows
  if (!header) return []
  return body.map(r => Object.fromEntries(header.map((h, i) => [h.trim(), (r[i] ?? '').trim()])))
}

const norm = (h: string) => h.toLowerCase().replace(/[^a-z0-9]/g, '')

/** The first non-empty value among the given headers, ignoring case, spaces and punctuation. */
function pick(r: Record<string, string>, ...names: string[]) {
  const keys = Object.keys(r)
  for (const n of names) {
    const k = keys.find(k => norm(k) === norm(n))
    if (k && r[k]) return r[k]
  }
  return ''
}

/** Maps a contacts row onto lead fields: Apollo exports, or simpler company lists
    (Name, URL, Description, LinkedIn, Email…). A cell with several addresses keeps
    the first as the main email and the rest as other_emails. */
export function apolloToLead(r: Record<string, string>) {
  const emails = [pick(r, 'Email', 'Email Address', 'Emails', 'Contact Email', 'Work Email'), pick(r, 'Secondary Email')]
    .join(',').split(/[\s,;]+/).filter(Boolean)
  const first = pick(r, 'First Name', 'Firstname')
  const last = pick(r, 'Last Name', 'Lastname', 'Surname')
  const company = pick(r, 'Company Name for Emails', 'Company Name', 'Company', 'Organization', 'Organisation')
  // In a list with no separate company column, "Name" is the company itself.
  const name = pick(r, 'Full Name', 'Name')
  const [nameFirst, ...nameRest] = company && !first ? name.split(/\s+/) : []
  // Growth lists mark each address; a known-bad one is not worth importing.
  if (/^(invalid|bounced?|undeliverable)$/i.test(pick(r, 'Email Status'))) emails.length = 0
  // Funding news is the best opener for a cold email, so it goes into the notes.
  const amount = Number(pick(r, 'Funding Amount', 'Funding Amount USD', 'Last Funding Amount').replace(/[^0-9.]/g, ''))
  const funding = [
    amount ? `$${amount >= 1e9 ? `${+(amount / 1e9).toFixed(1)}B` : amount >= 1e6 ? `${+(amount / 1e6).toFixed(1)}M` : amount.toLocaleString('en-US')}` : '',
    pick(r, 'Funding Type', 'Last Funding Type'),
    pick(r, 'Funding Date', 'Last Funding Date') && `(${pick(r, 'Funding Date', 'Last Funding Date')})`,
  ].filter(Boolean).join(' ')
  return {
    email: emails[0] || '',
    other_emails: emails.slice(1).join(','),
    first_name: first || nameFirst || '',
    last_name: last || nameRest.join(' '),
    title: pick(r, 'Title', 'Job Title', 'Position'),
    company: company || name,
    website: pick(r, 'Website', 'URL', 'Company Website', 'Domain'),
    linkedin: pick(r, 'Person Linkedin Url', 'LinkedIn', 'LinkedIn URL', 'Company Linkedin Url'),
    country: pick(r, 'Country', 'Company Country'),
    industry: pick(r, 'Industry', 'Industries'),
    notes: [pick(r, 'Description', 'Notes', 'About'), funding && `Raised: ${funding}`].filter(Boolean).join('\n'),
    source_id: pick(r, 'Apollo Contact Id'),
  }
}
