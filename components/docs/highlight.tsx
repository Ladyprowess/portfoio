import type { ReactNode } from 'react'

/* ── Syntax colouring ─────────────────────────
   A small tokenizer is enough for the languages on this page. */

const tokenRules: [RegExp, string][] = [
  [/^(\/\/[^\n]*|#[^\n]*)/, 'text-[#7C8BA1] italic'],
  [/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/, 'text-[#A5D6A7]'],
  [/^\b(const|let|await|async|import|from|export|return|if|else|new|function|def|print|true|false|null|None|True|False)\b/, 'text-[#C792EA]'],
  [/^\b\d+(\.\d+)?\b/, 'text-[#F78C6C]'],
  [/^(curl|npx|npm|pip|python|node|git)\b/, 'text-[#82AAFF]'],
  [/^(-{1,2}[a-zA-Z][\w-]*)/, 'text-[#FFCB6B]'],
]

export function highlight(code: string) {
  const out: ReactNode[] = []
  let rest = code
  let plain = ''
  let k = 0
  let prev = ''
  while (rest.length) {
    // Comments only start a token at the line start or after whitespace, so URLs stay intact.
    const hit = tokenRules.map(([re, cls], i) => { if (i === 0 && prev && !/\s/.test(prev)) return null; if (i === 3 && /[\w/.:]/.test(prev)) return null; const m = rest.match(re); return m ? { text: m[0], cls } : null }).find(Boolean)
    if (hit) {
      if (plain) { out.push(plain); plain = '' }
      out.push(<span key={k++} className={hit.cls}>{hit.text}</span>)
      prev = hit.text[hit.text.length - 1]
      rest = rest.slice(hit.text.length)
    } else {
      plain += rest[0]
      prev = rest[0]
      rest = rest.slice(1)
    }
  }
  if (plain) out.push(plain)
  return out
}

