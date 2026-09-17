/**
 * Post accents arrive either as a literal hex (per-post brand colours set in
 * the CMS) or as a themed token string like `rgb(var(--primary))`. This builds
 * the chip styles for both without the caller caring which it got.
 */
export function accentChip(accent: string, alpha = 0.08) {
  if (accent.startsWith('#')) {
    const hexAlpha = Math.round(alpha * 255)
      .toString(16)
      .padStart(2, '0')
    return { color: accent, background: `${accent}${hexAlpha}` }
  }
  // `rgb(var(--primary))` -> `rgb(var(--primary) / 0.08)`
  return { color: accent, background: accent.replace(/\)\s*$/, ` / ${alpha})`) }
}

/** The accent used when a post carries none of its own. */
export const DEFAULT_ACCENT = 'rgb(var(--primary))'
