export type Theme = 'light' | 'dark'

export const THEME_STORAGE_KEY = 'lp-theme'

/**
 * Runs before first paint, inlined in <head>, so the page never flashes the
 * wrong theme. Kept dependency-free and self-contained on purpose: it is
 * stringified into a <script> tag, not bundled.
 */
// Light is the default for everyone; dark only when the visitor has chosen it
// with the toggle. The OS preference is deliberately not followed.
export const themeBootstrapScript = `
(function () {
  try {
    document.documentElement.dataset.theme = localStorage.getItem('${THEME_STORAGE_KEY}') === 'dark' ? 'dark' : 'light';
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
`.trim()

export function readStoredTheme(): Theme | null {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored === 'light' || stored === 'dark' ? stored : null
  } catch {
    return null
  }
}

export function systemTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}
