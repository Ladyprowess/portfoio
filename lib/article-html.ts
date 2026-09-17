/**
 * Articles are usually pasted in from Google Docs or Word, which stamp every
 * block with inline colours (`style="color:#000000"`). Those declarations beat
 * any stylesheet rule, so in dark mode the body text stays black on black.
 *
 * The editor offers no colour control of its own, so any colour found in stored
 * article HTML is paste residue. Strip it and let the theme own the ink.
 */
const COLOUR_DECLARATION = /^\s*(?:color|background|background-color|-webkit-text-fill-color)\s*:/i

export function stripAuthoredColours(html: string): string {
  return html
    .replace(/\sstyle\s*=\s*(["'])([\s\S]*?)\1/gi, (_match, quote: string, declarations: string) => {
      const kept = declarations
        .split(';')
        .filter((declaration) => declaration.trim() && !COLOUR_DECLARATION.test(declaration))
        .join(';')
        .trim()
      return kept ? ` style=${quote}${kept}${quote}` : ''
    })
    // Legacy presentational attributes from older Word exports.
    .replace(/\s(?:color|bgcolor|text)\s*=\s*(["'])[\s\S]*?\1/gi, '')
    .replace(/<\/?font\b[^>]*>/gi, '')
}
