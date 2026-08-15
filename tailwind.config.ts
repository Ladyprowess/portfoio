import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg:       '#F9FAF9',
        surface:  '#ffffff',
        'surface-2': '#F1F3F1',
        primary:  '#507B80',
        'primary-dim': '#35555A',
        'primary-glow': 'rgba(80,123,128,0.10)',
        amber:    '#35555A',
        'amber-dim': '#25393D',
        parchment: '#14201F',
        muted:    '#55625F',
        'ink-border': '#DCE2DE',
        dark:      '#0A0C0D',
        'dark-surface': '#131718',
        'dark-border': '#22292A',
        'dark-ink': '#F2F1ED',
        'dark-muted': '#9CA3A3',
      },
      fontFamily: {
        display: ['var(--font-bricolage)', 'system-ui', 'sans-serif'],
        head:    ['var(--font-plex-mono)', 'ui-monospace', 'monospace'],
        body:    ['var(--font-dm-sans)',   'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
