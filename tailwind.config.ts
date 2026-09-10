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
        bg:       '#F9F9FB',
        surface:  '#ffffff',
        'surface-2': '#F1F3F6',
        primary:  '#2563EB',
        'primary-dim': '#1D4ED8',
        'primary-glow': 'rgba(37,99,235,0.08)',
        amber:    '#35555A',
        'amber-dim': '#25393D',
        parchment: '#121212',
        muted:    '#6B7280',
        'ink-border': '#E3E6EA',
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
      },
    },
  },
  plugins: [],
}

export default config
