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
        bg:       '#f7f3ea',
        surface:  '#ffffff',
        'surface-2': '#efe8d8',
        primary:  '#0f766e',
        'primary-dim': '#0b5c56',
        'primary-glow': 'rgba(15,118,110,0.10)',
        amber:    '#b45309',
        'amber-dim': '#8a3f07',
        parchment: '#1c1a17',
        muted:    '#6b655c',
        'ink-border': '#e3dcc9',
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
