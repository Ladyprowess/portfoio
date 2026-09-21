const marker = '<!--igbo-rich-text-->'
const escape = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
// Translation HTML allows only editor formatting and HTTPS/HTTP links or images.
export function sanitizeIgboHtml(html: string) {
 return html.replace(/<!--[\s\S]*?-->/g, '').replace(/<(script|style|iframe|object|svg|math)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '').replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (tag, name: string) => {
  const lower = name.toLowerCase()
  if (!['span','p','div','br','h2','h3','strong','b','em','i','u','s','strike','blockquote','pre','code','ul','ol','li','a','img','table','thead','tbody','tr','th','td','hr'].includes(lower)) return ''
  if (tag.startsWith('</')) return ['img','br','hr'].includes(lower) ? '' : `</${lower}>`
  if (lower === 'a' || lower === 'img') {
   const attr = lower === 'a' ? 'href' : 'src'
   const value = tag.match(new RegExp(`\\s${attr}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'))
   const url = value?.[1] || value?.[2] || value?.[3] || ''
   if (!/^https?:\/\/[^\s<>"']+$/i.test(url) || /&(?:#|colon)/i.test(url)) return lower === 'img' ? '' : '<a>'
   return `<${lower} ${attr}="${escape(url.replace(/&amp;/g, '&'))}"${lower === 'img' ? ' alt=""' : ' rel="noopener noreferrer"'}>`
  }
  const style = tag.match(/\sstyle\s*=\s*(?:"([^"]*)"|'([^']*)')/i)
  const declarations = (style?.[1] || style?.[2] || '').split(';').map(s => s.trim()).filter(s => /^(?:text-align\s*:\s*(?:left|center|right|justify)|font-family\s*:\s*(?:Inter|Georgia|monospace)|font-weight\s*:\s*(?:normal|bold|[1-9]00)|font-style\s*:\s*(?:normal|italic)|text-decoration\s*:\s*(?:underline|line-through|none))$/i.test(s))
  return `<${lower}${declarations.length ? ` style="${declarations.join(';')}"` : ''}>`
 })
}
export function igboEditorHtml(value: string) {
 return value.startsWith(marker) ? sanitizeIgboHtml(value.slice(marker.length)) : value.split(/\n\s*\n/).filter(Boolean).map(p => `<p>${escape(p).replace(/\n/g, '<br>')}</p>`).join('')
}
export function storeIgboHtml(html: string) { return marker + sanitizeIgboHtml(html) }
export function igboHasText(value: string) { return (value.startsWith(marker) ? sanitizeIgboHtml(value.slice(marker.length)).replace(/<[^>]*>/g, '').replace(/&nbsp;|&#160;/gi, ' ') : value).trim().length > 0 }
