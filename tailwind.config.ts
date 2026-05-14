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
        bg:       '#07070d',
        surface:  '#0e0e1a',
        'surface-2': '#141424',
        primary:  '#2fd6c5',
        'primary-dim': '#1a7a72',
        'primary-glow': 'rgba(47,214,197,0.12)',
        amber:    '#f5a623',
        'amber-dim': '#7a4e0a',
        parchment: '#f0ece3',
        muted:    '#5e6a80',
        'ink-border': '#1c1c2e',
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
