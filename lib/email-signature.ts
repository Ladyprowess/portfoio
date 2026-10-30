// The sender identity and branded signature shared by every email the site
// sends from hello@ladyprowess.com (compose page and outreach).
import { SITE_URL } from './site'

export const FROM = 'Lady Prowess <hello@ladyprowess.com>'
export const REPLY_TO = 'hello@ladyprowess.com'

// Social links for the signature footer.
const SOCIALS: { label: string; url: string }[] = [
  { label: 'X', url: 'https://x.com/ladyprowess' },
  { label: 'Instagram', url: 'https://www.instagram.com/ladyprowess_' },
  { label: 'LinkedIn', url: 'https://www.linkedin.com/in/peace-ngozi-okafor' },
  { label: 'TikTok', url: 'https://www.tiktok.com/@ladyprowess' },
  { label: 'Medium', url: 'https://ladyprowess.medium.com/' },
  { label: 'Substack', url: 'https://ladyprowess.substack.com' },
]

const TAGLINE = 'I help tech products get understood and trusted.'

// Branded signature footer appended to every email: logo, a blue rule, then name and links.
export const SIGNATURE_HTML = `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;font-family:Arial,Helvetica,sans-serif;color:#22292A;font-size:14px;line-height:1.4;">
  <tr>
    <td style="padding-right:16px;vertical-align:top;">
      <a href="${SITE_URL}" style="text-decoration:none;">
        <img src="${SITE_URL}/icon-blue.png" width="64" height="64" alt="Lady Prowess" style="display:block;border:0;border-radius:8px;">
      </a>
    </td>
    <td style="border-left:2px solid #2563EB;padding-left:16px;vertical-align:top;">
      <div style="font-size:16px;font-weight:bold;color:#131718;">Ngozi Peace Okafor</div>
      <div style="color:#2563EB;font-weight:bold;">Lady Prowess</div>
      <div style="color:#5B6466;font-style:italic;padding-bottom:8px;">${TAGLINE}</div>
      <div>
        <a href="mailto:hello@ladyprowess.com" style="color:#22292A;text-decoration:none;">hello@ladyprowess.com</a>
        <span style="color:#9CA3A3;">&nbsp;|&nbsp;</span>
        <a href="${SITE_URL}" style="color:#22292A;text-decoration:none;">ladyprowess.com</a>
      </div>
      <div style="padding-top:6px;font-size:13px;">
        ${SOCIALS.map(
          (s) => `<a href="${s.url}" style="color:#2563EB;text-decoration:none;">${s.label}</a>`,
        ).join('<span style="color:#9CA3A3;">&nbsp;&middot;&nbsp;</span>')}
      </div>
    </td>
  </tr>
</table>`

export const SIGNATURE_TEXT = `

-
Ngozi Peace Okafor
Lady Prowess
${TAGLINE}
hello@ladyprowess.com · ladyprowess.com
${SOCIALS.map((s) => `${s.label}: ${s.url}`).join('\n')}`
