/* eslint-disable @next/next/no-img-element */
import type { ReactElement } from 'react'

export const OG_SIZE = { width: 1200, height: 630 }

const INK = '#F4F3EF'
const INK_MUTED = '#8C9497'
const CANVAS = '#0B0D0E'
const PANEL = '#14181A'
const BRAND = '#5B9BFF'
const COVER_WIDTH = 430

// These routes run on the Node runtime so the fonts can be read from disk.
// On edge, `new URL(..., import.meta.url)` resolves to a bundler path with no
// origin, which `fetch` rejects during the production prerender.
const fontFiles = [
  ['Newsreader', 600, 'newsreader-600.woff'],
  ['Newsreader', 400, 'newsreader-400.woff'],
  ['JetBrains Mono', 700, 'jetbrains-700.woff'],
] as const

// Read once per lambda, not once per request.
const fontPromise = (async () => {
  const { readFile } = await import('node:fs/promises')
  const { join } = await import('node:path')
  return Promise.all(
    fontFiles.map(async ([name, weight, file]) => ({
      name,
      weight: weight as 400 | 600 | 700,
      style: 'normal' as const,
      data: await readFile(join(process.cwd(), 'lib/og/fonts', file)),
    })),
  )
})()

export function ogFonts() {
  return fontPromise
}

/**
 * Post accents are stored either as a literal hex or as a themed token string
 * like `rgb(var(--primary))`. A CSS variable means nothing to the image
 * renderer, so anything that is not a hex falls back to the brand blue.
 */
export function ogAccent(accent?: string | null) {
  return accent && /^#[0-9A-Fa-f]{3,8}$/.test(accent) ? accent : BRAND
}

export function absoluteImage(src: string | null | undefined, siteUrl: string) {
  if (!src) return null
  if (/^https?:\/\//i.test(src)) return src
  if (src.startsWith('/')) return `${siteUrl.replace(/\/$/, '')}${src}`
  return null
}

function truncate(value: string, limit: number) {
  const text = value.replace(/\s+/g, ' ').trim()
  if (text.length <= limit) return text
  // Cut on a word boundary — "…busine…" reads like a rendering fault.
  const cut = text.slice(0, limit - 1)
  const lastSpace = cut.lastIndexOf(' ')
  const trimmed = lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut
  return `${trimmed.replace(/[\s,;:.\u2014-]+$/, '')}…`
}

function titleSize(title: string, narrow: boolean) {
  const length = title.length
  if (length <= 34) return narrow ? 62 : 74
  if (length <= 58) return narrow ? 52 : 64
  if (length <= 88) return narrow ? 44 : 54
  return narrow ? 38 : 46
}

const mono = {
  fontFamily: 'JetBrains Mono',
  fontWeight: 700,
  letterSpacing: 2.4,
  textTransform: 'uppercase' as const,
}

/** The eyebrow: a short accent rule, then the category. */
function Eyebrow({ label, accent }: { label: string; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ display: 'flex', width: 46, height: 3, background: accent }} />
      <div style={{ ...mono, display: 'flex', fontSize: 21, color: accent }}>{label}</div>
    </div>
  )
}

export type OgCardProps = {
  category: string
  title: string
  excerpt?: string | null
  meta?: string | null
  cover?: string | null
  accent?: string
}

/**
 * One dark editorial card for every share link. Set in the same serif as the
 * article pages so a shared post looks like the site it came from, and dark so
 * it holds its own against a light social feed.
 */
export function OgCard({
  category,
  title,
  excerpt,
  meta,
  cover,
  accent = BRAND,
}: OgCardProps): ReactElement {
  const safeTitle = truncate(title, 108)
  const size = titleSize(safeTitle, Boolean(cover))

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        background: CANVAS,
        color: INK,
        fontFamily: 'Newsreader',
        position: 'relative',
      }}
    >
      {/* A soft wash of the accent keeps the field from reading as flat black. */}
      <div
        style={{
          position: 'absolute',
          top: -260,
          left: -160,
          width: 900,
          height: 620,
          background: `radial-gradient(closest-side, ${accent}2E, ${accent}00)`,
          display: 'flex',
        }}
      />

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          flex: 1,
          padding: cover ? '64px 52px 64px 70px' : '64px 76px',
        }}
      >
        <Eyebrow label={truncate(category || 'Article', 28)} accent={accent} />

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              display: 'flex',
              fontSize: size,
              fontWeight: 600,
              lineHeight: 1.1,
              letterSpacing: -1,
            }}
          >
            {safeTitle}
          </div>
          {excerpt ? (
            <div
              style={{
                display: 'flex',
                marginTop: 22,
                fontSize: cover ? 23 : 26,
                fontWeight: 400,
                lineHeight: 1.45,
                color: INK_MUTED,
              }}
            >
              {truncate(excerpt, cover ? 96 : 132)}
            </div>
          ) : null}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', height: 1, background: '#262C2E' }} />
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 22,
            }}
          >
            <div style={{ ...mono, display: 'flex', fontSize: 18, color: INK }}>
              Ngozi Peace Okafor
            </div>
            <div style={{ ...mono, display: 'flex', fontSize: 18, color: INK_MUTED }}>
              {meta || 'ladyprowess.com'}
            </div>
          </div>
        </div>
      </div>

      {cover ? (
        <div
          style={{
            display: 'flex',
            position: 'relative',
            width: COVER_WIDTH,
            height: OG_SIZE.height,
          }}
        >
          <img
            src={cover}
            alt=""
            width={COVER_WIDTH}
            height={OG_SIZE.height}
            style={{ width: COVER_WIDTH, height: OG_SIZE.height, objectFit: 'cover' }}
          />
          {/* Feathers the left edge into the card and veils the rest, so a busy
              screenshot cannot out-shout the headline. The overlay is given real
              dimensions because `inset` alone does not size it here. */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: COVER_WIDTH,
              height: OG_SIZE.height,
              display: 'flex',
              background: `linear-gradient(90deg, ${CANVAS} 0%, ${CANVAS}E0 20%, ${CANVAS}59 62%, ${CANVAS}33 100%)`,
            }}
          />
        </div>
      ) : (
        // No cover art: a quiet panel of the wordmark rather than dead space.
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 250,
            height: '100%',
            background: PANEL,
            borderLeft: `1px solid #22282A`,
          }}
        >
          <div
            style={{
              ...mono,
              display: 'flex',
              fontSize: 20,
              color: INK_MUTED,
              letterSpacing: 8,
              transform: 'rotate(90deg)',
              width: 420,
              justifyContent: 'center',
            }}
          >
            Lady Prowess
          </div>
        </div>
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: OG_SIZE.width,
          height: 8,
          background: accent,
          display: 'flex',
        }}
      />
    </div>
  )
}
