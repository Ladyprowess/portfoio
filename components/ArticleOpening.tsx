import Link from 'next/link'
import ScrollCue from '@/components/ScrollCue'

type ArticleOpeningProps = {
  title: string
  date: string
  category: string
  readTime: string
  excerpt?: string
  accent?: string
}

export default function ArticleOpening({
  title,
  date,
  category,
  readTime,
  excerpt,
  accent = 'rgb(var(--primary))',
}: ArticleOpeningProps) {
  return (
    <header className="relative flex min-h-[100svh] flex-col px-5 pb-8 pt-24 md:px-8 md:pt-28">
      <Link
        href="/blog"
        className="inline-flex min-h-11 self-start items-center font-head text-xs font-bold uppercase tracking-widest text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
      >
        ← All posts
      </Link>

      <div className="flex flex-1 items-center py-8 md:py-10">
      <div className="w-full">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 flex-none" style={{ background: accent }} aria-hidden="true" />
          <span className="font-head text-xs font-bold uppercase tracking-widest" style={{ color: accent }}>
            {category}
          </span>
        </div>

        <h1 className="mt-6 max-w-5xl font-serif text-[clamp(2.5rem,1.25rem+4vw,5rem)] font-medium leading-[1.08] tracking-tight text-parchment [overflow-wrap:anywhere] [text-wrap:balance]">
          {title}
        </h1>

        {excerpt && (
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted md:mt-8 md:text-xl [text-wrap:pretty]">
            {excerpt}
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-ink-border pt-6 md:mt-10">
          <Link href="/about" className="group inline-flex min-h-11 items-center gap-3 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-bg">
            <span aria-hidden="true" className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-2 font-serif text-xl text-primary">NP</span>
            <span className="text-sm font-medium text-parchment transition-colors group-hover:text-primary">Ngozi Peace Okafor</span>
          </Link>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted">
            {date && <span>{date}</span>}
            {date && readTime && <span aria-hidden="true">·</span>}
            {readTime && <span>{readTime}</span>}
          </div>
        </div>
      </div>
      </div>
      <div className="flex justify-center pb-20 pt-4">
        <ScrollCue />
      </div>
    </header>
  )
}
