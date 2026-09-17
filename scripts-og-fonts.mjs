// Regenerates lib/og/fonts.ts from the .woff sources. Run with: node scripts-og-fonts.mjs
import { readFile, writeFile } from 'node:fs/promises'

const files = [
  ['newsreader600', 'newsreader-600.woff'],
  ['newsreader400', 'newsreader-400.woff'],
  ['jetbrains700', 'jetbrains-700.woff'],
]

const parts = []
for (const [name, file] of files) {
  const data = await readFile(new URL(`./lib/og/fonts/${file}`, import.meta.url))
  parts.push(`export const ${name} =\n  '${data.toString('base64')}'`)
}

await writeFile(
  new URL('./lib/og/fonts.ts', import.meta.url),
  `/**
 * Font data for the social cards, base64-encoded at build time from the .woff
 * files in ./fonts.
 *
 * These are embedded rather than read from disk on purpose. Reading them at
 * request time made the dynamic /blog/[slug]/opengraph-image route depend on
 * the font files being traced into the serverless bundle; when that tracing
 * did not happen, every article's preview image returned a 500 and social
 * platforms fell back to the favicon. Embedding removes the failure mode
 * entirely and works the same on every runtime.
 *
 * Regenerate with: node scripts-og-fonts.mjs
 */

${parts.join('\n\n')}\n`,
)
console.log('wrote lib/og/fonts.ts')
