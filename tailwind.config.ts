import type { Config } from 'tailwindcss'

// Every colour resolves through a CSS variable declared in globals.css,
// so `data-theme="dark"` on <html> re-skins the whole site without any
// dark: variants in component code. The `<alpha-value>` placeholder keeps
// opacity modifiers (bg-bg/80, text-parchment/60) working.
const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:        token('bg'),
        surface:   token('surface'),
        'surface-2': token('surface-2'),
        primary:   token('primary'),
        'primary-dim': token('primary-dim'),
        'primary-glow': 'rgb(var(--primary) / 0.08)',
        'on-primary': token('on-primary'),
        amber:     token('amber'),
        'amber-dim': token('amber-dim'),
        parchment: token('parchment'),
        muted:     token('muted'),
        'ink-border': token('border'),
        success:   token('success'),
        // Feature panels and the content sitting on them.
        panel:      token('panel'),
        'on-panel': token('on-panel'),
        'accent-invert': token('accent-invert'),
        'muted-invert':  token('muted-invert'),
        'border-invert': token('border-invert'),
        // Fixed dark values, for surfaces that stay dark in both themes.
        dark:      '#0A0C0D',
        'dark-surface': '#131718',
        'dark-border': '#22292A',
        'dark-ink': '#F2F1ED',
        'dark-muted': '#9CA3A3',
      },
      fontFamily: {
        display: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
        head:    ['var(--font-jetbrains)', 'ui-monospace', 'monospace'],
        body:    ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif:   ['var(--font-newsreader)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
