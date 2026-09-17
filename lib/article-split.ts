/**
 * Finds a place near the middle of an article to drop the inline sign-up.
 *
 * The previous approach walked the tag tree and only cut between top-level
 * elements. Pasted articles regularly carry an unclosed tag, and one is enough
 * for the walker to treat the whole rest of the document as a single node — so
 * the only available cut was after the opening paragraph and the sign-up landed
 * a few hundred pixels into a 14,000px article.
 *
 * This scans tags once instead of nesting them, so malformed markup cannot
 * collapse the candidate list, and it refuses to cut inside a table, list or
 * quote, or after a heading (which would strand the heading above the box).
 */

// Cutting inside one of these would tear the element in half.
const CONTAINERS = ['table', 'ul', 'ol', 'blockquote', 'figure', 'pre']

// Cutting straight after one of these is safe. Headings are deliberately absent.
const CUT_AFTER = /^<\/(p|blockquote|pre|ul|ol|table|figure)>$/i

const textLength = (value: string) =>
  value.replace(/&[a-z0-9#]+;/gi, ' ').replace(/\s+/g, ' ').trim().length

/** How far through the article the sign-up is allowed to sit. */
const LOWER = 0.35
const UPPER = 0.65

export function splitArticleHtml(html: string): [string, string] {
  const tokens = html.match(/<[^>]+>|[^<]+/g)
  if (!tokens) return [html, '']

  const open: Record<string, number> = {}
  const cuts: { at: number; before: number }[] = []
  let cursor = 0
  let seen = 0

  for (const token of tokens) {
    cursor += token.length

    if (token[0] !== '<') {
      seen += textLength(token)
      continue
    }

    const closing = /^<\/([a-z0-9]+)/i.exec(token)
    if (closing) {
      const tag = closing[1].toLowerCase()
      if (CONTAINERS.includes(tag)) open[tag] = Math.max(0, (open[tag] || 0) - 1)
      if (CUT_AFTER.test(token) && CONTAINERS.every((name) => !open[name]))
        cuts.push({ at: cursor, before: seen })
      continue
    }

    const opening = /^<([a-z0-9]+)/i.exec(token)
    if (opening) {
      const tag = opening[1].toLowerCase()
      if (CONTAINERS.includes(tag) && !/\/>$/.test(token))
        open[tag] = (open[tag] || 0) + 1
    }
  }

  const total = seen
  if (!total || cuts.length < 2) return [html, '']

  let best: { at: number; before: number } | null = null
  for (const cut of cuts) {
    const ratio = cut.before / total
    if (ratio < LOWER || ratio > UPPER) continue
    if (!best || Math.abs(ratio - 0.5) < Math.abs(best.before / total - 0.5)) best = cut
  }

  // Nothing lands in the middle third — a very short piece, or one long
  // unbroken block. Leave the article whole rather than interrupt it badly.
  if (!best) return [html, '']

  return [html.slice(0, best.at), html.slice(best.at)]
}

/**
 * The same idea for the hand-written posts, whose body is an array of blocks
 * rather than HTML: return the index to place the sign-up after, chosen by how
 * much text has been read rather than how many blocks have gone by, so a few
 * long paragraphs followed by many short ones does not push it to the top.
 * Returns 0 when nothing sensible lands in the middle.
 */
export function staticSplitIndex(blocks: { type: string; text?: string }[]): number {
  const lengths = blocks.map((block) => (block.text || '').trim().length)
  const total = lengths.reduce((sum, length) => sum + length, 0)
  if (!total || blocks.length < 3) return 0

  let seen = 0
  let best = 0
  let closest = Infinity

  for (let index = 0; index < blocks.length - 1; index += 1) {
    seen += lengths[index]
    // Never break between a quote and the text answering it.
    if (blocks[index + 1]?.type === 'quote') continue
    const ratio = seen / total
    if (ratio < LOWER || ratio > UPPER) continue
    const difference = Math.abs(ratio - 0.5)
    if (difference < closest) {
      closest = difference
      best = index + 1
    }
  }

  return best
}
