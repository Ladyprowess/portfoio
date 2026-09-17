'use client'

import { useCallback, useEffect, useState } from 'react'
import { THEME_STORAGE_KEY, readStoredTheme, systemTheme, type Theme } from '@/lib/theme'

type ThemeToggleProps = {
  /** `bar` sits in the nav; `floating` pins itself to the bottom-right of the viewport. */
  variant?: 'bar' | 'floating'
  className?: string
}

export default function ThemeToggle({ variant = 'bar', className = '' }: ThemeToggleProps) {
  // Start as null so the first client render matches the server's markup;
  // the real theme is read in an effect, after the bootstrap script has run.
  const [theme, setTheme] = useState<Theme | null>(null)

  useEffect(() => {
    const current = (document.documentElement.dataset.theme as Theme | undefined) ?? systemTheme()
    setTheme(current)

    // Follow the OS only while the visitor has not made an explicit choice.
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = (event: MediaQueryListEvent) => {
      if (readStoredTheme()) return
      const next: Theme = event.matches ? 'dark' : 'light'
      document.documentElement.dataset.theme = next
      setTheme(next)
    }

    media.addEventListener('change', onSystemChange)
    return () => media.removeEventListener('change', onSystemChange)
  }, [])

  const toggle = useCallback(() => {
    const next: Theme = (theme ?? systemTheme()) === 'dark' ? 'light' : 'dark'
    const root = document.documentElement

    // Ease the swap, then drop the class so it never taxes ordinary paints.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduced) {
      root.classList.add('theme-transition')
      window.setTimeout(() => root.classList.remove('theme-transition'), 340)
    }

    root.dataset.theme = next
    setTheme(next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      /* Private mode or blocked storage — the choice just won't persist. */
    }
  }, [theme])

  const isDark = theme === 'dark'
  const label = theme === null ? 'Toggle theme' : isDark ? 'Switch to light mode' : 'Switch to dark mode'

  const base =
    variant === 'floating'
      ? 'fixed bottom-6 right-5 z-40 h-11 w-11 rounded-full border border-ink-border bg-surface/90 shadow-[0_6px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl md:bottom-8 md:right-8'
      : 'h-10 w-10 rounded-full border border-ink-border bg-surface/70'

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-pressed={isDark}
      className={`${base} relative inline-flex flex-none items-center justify-center text-parchment transition-colors duration-200 hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg ${className}`}
    >
      {/* Both glyphs are always mounted and cross-faded, so the button never
          reflows and there is nothing to mismatch during hydration. */}
      <SunIcon
        className={`absolute h-[1.05rem] w-[1.05rem] transition-all duration-300 ${
          isDark ? 'scale-50 opacity-0 -rotate-90' : 'scale-100 opacity-100 rotate-0'
        }`}
      />
      <MoonIcon
        className={`absolute h-[1.05rem] w-[1.05rem] transition-all duration-300 ${
          isDark ? 'scale-100 opacity-100 rotate-0' : 'scale-50 opacity-0 rotate-90'
        }`}
      />
    </button>
  )
}

function SunIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

function MoonIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
    </svg>
  )
}
