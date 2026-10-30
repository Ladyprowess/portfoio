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

/** Maps an Apollo contacts export row onto lead fields. */
export function apolloToLead(r: Record<string, string>) {
  return {
    email: r['Email'] || r['Secondary Email'] || '',
    first_name: r['First Name'] || '',
    last_name: r['Last Name'] || '',
    title: r['Title'] || '',
    company: r['Company Name for Emails'] || r['Company Name'] || '',
    website: r['Website'] || '',
    linkedin: r['Person Linkedin Url'] || '',
    country: r['Country'] || r['Company Country'] || '',
    industry: r['Industry'] || '',
    source_id: r['Apollo Contact Id'] || '',
  }
}
