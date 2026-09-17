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

/**
 * The title screen: one viewport of quiet, the headline set in the reading
 * serif, and nothing else competing for attention. The body starts below the
 * fold on purpose — the reader arrives at the piece rather than mid-stride.
 */
export default function ArticleOpening({
  title,
  date,
  category,
  readTime,
  excerpt,
  accent = 'rgb(var(--primary))',
}: ArticleOpeningProps) {
  return (
    <header className="relative flex min-h-[100svh] flex-col px-5 pb-10 pt-24 md:px-8 md:pt-32">
      <Link
        href="/blog"
        className="font-head text-[0.6rem] font-bold uppercase tracking-[0.18em] text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-bg"
      >
        ← All posts
      </Link>

      {/* The headline block sits on the optical third, not dead centre. */}
      <div className="flex flex-1 items-center">
        <div className="w-full max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 flex-none" style={{ background: accent }} aria-hidden="true" />
            <span
              className="font-head text-[0.6rem] font-bold uppercase tracking-[0.18em]"
              style={{ color: accent }}
            >
              {category}
            </span>
          </div>

          <h1 className="mt-7 font-serif text-[clamp(2.15rem,1.2rem+4.6vw,4.05rem)] font-medium leading-[1.08] tracking-[-0.018em] text-parchment [text-wrap:balance]">
            {title}
          </h1>

          {excerpt && (
            <p className="mt-7 max-w-xl font-serif text-[1.05rem] italic leading-[1.65] text-muted md:text-[1.15rem] [text-wrap:pretty]">
              {excerpt}
            </p>
          )}

          <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2 font-head text-[0.6rem] font-bold uppercase tracking-[0.16em] text-muted">
            {date && <span>{date}</span>}
            {date && readTime && <span aria-hidden="true">·</span>}
            {readTime && <span>{readTime}</span>}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <ScrollCue />
      </div>
    </header>
  )
}
