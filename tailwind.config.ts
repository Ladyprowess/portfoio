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
        bg:       '#08090b',
        surface:  '#111319',
        'surface-2': '#171a22',
        primary:  '#41d7c7',
        'primary-dim': '#1b8f86',
        'primary-glow': 'rgba(65,215,199,0.12)',
        amber:    '#d7b46a',
        'amber-dim': '#7d6636',
        parchment: '#f0ece3',
        muted:    '#a2a7b3',
        'ink-border': '#272b35',
      },
      fontFamily: {
        display: ['var(--font-cormorant)', 'Georgia', 'serif'],
        head:    ['var(--font-syne)',      'system-ui', 'sans-serif'],
        body:    ['var(--font-dm-sans)',   'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
