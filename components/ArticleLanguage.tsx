'use client'
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
const Language = createContext({ igbo: false, available: false, toggle: (_igbo: boolean) => {} })
export function ArticleLanguageProvider({ available, children }: { available: boolean; children: ReactNode }) {
 const [igbo, setIgbo] = useState(false)
 useEffect(() => { try { setIgbo(available && localStorage.getItem('article-language') === 'ig') } catch {} }, [available])
 function toggle(value: boolean) { setIgbo(available && value); try { localStorage.setItem('article-language', value ? 'ig' : 'en') } catch {} }
 return <Language.Provider value={{ igbo: available && igbo, available, toggle }}>{children}</Language.Provider>
}
export function ArticleLanguageSwitch() {
 const { igbo, available, toggle } = useContext(Language)
 if (!available) return null
 return <div className="mt-4 flex gap-2" role="group" aria-label="Article language">{[{ code: false, label: 'English', lang: 'en' }, { code: true, label: 'Igbo', lang: 'ig' }].map(option => <button key={option.lang} type="button" lang={option.lang} aria-pressed={igbo === option.code} onClick={() => toggle(option.code)} className={`min-h-11 rounded-full border px-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${igbo === option.code ? 'border-primary bg-primary text-on-primary' : 'border-ink-border text-muted hover:text-primary'}`}>{option.label}</button>)}</div>
}
export function ArticleLanguageText({ english, igbo: translation }: { english: string; igbo?: string }) {
 const { igbo } = useContext(Language)
 return <span lang={igbo && translation ? 'ig' : 'en'}>{igbo && translation ? translation : english}</span>
}
export function ArticleLanguageBody({ children, translation }: { children: ReactNode; translation?: string }) {
 const { igbo } = useContext(Language)
 if (!igbo || !translation) return <div lang="en">{children}</div>
 return <div lang="ig" className="reading mx-auto w-full min-w-0 max-w-3xl py-10 md:py-14">{translation.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index} className="whitespace-pre-line">{paragraph}</p>)}</div>
}
