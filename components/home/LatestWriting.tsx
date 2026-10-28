import Image from 'next/image'
import NewsletterSignup from '@/components/NewsletterSignup'
import { Reveal, TypeHeading } from './Motion'

export type LatestPost = { slug: string; title: string; excerpt: string; category: string; date: string; readTime: string; cover: string | null }

const elsewhere = [
  { name: 'Medium', href: 'https://ladyprowess.medium.com/', tag: 'Essays' },
  { name: 'Substack', href: 'https://ladyprowess.substack.com', tag: 'Newsletter' },
  { name: 'Dev.to', href: 'https://dev.to/ladyprowess', tag: 'Technical' },
  { name: 'Hashnode', href: 'https://ladyprowess.hashnode.dev/', tag: 'Web3 & tech' },
]

// The three newest articles, from the CMS and the static posts alike.
export default function LatestWriting({ posts }: { posts: LatestPost[] }) {
  if (!posts.length) return null
  const [lead, ...rest] = posts
  return <section className="border-y border-ink-border bg-surface-2/60 py-14 md:py-28">
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      <div className="mb-7 flex flex-col justify-between gap-3 md:mb-10 md:flex-row md:items-end md:gap-5">
        <div><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">From the notebook</p><TypeHeading className="mt-3 max-w-xl font-display text-3xl font-semibold tracking-[-.035em] md:text-[2.75rem] md:leading-[1.08]" text="I write in public, too." /></div>
        <a href="/blog" className="text-sm font-semibold text-primary hover:underline">Read the blog →</a>
      </div>
      <Reveal className="grid gap-4 lg:grid-cols-[1.25fr_1fr]">
        <a href={`/blog/${lead.slug}`} className="group relative flex min-h-[240px] flex-col justify-end overflow-hidden rounded-3xl border border-ink-border bg-panel p-6 text-on-panel md:min-h-[380px] md:p-10">
          {lead.cover ? <Image src={lead.cover} alt="" fill unoptimized sizes="(max-width: 1024px) 100vw, 700px" className="object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-50" />
            : <div aria-hidden="true" className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary/40 blur-[90px]" />}
          <div className="relative">
            <p className="font-head text-[10px] uppercase tracking-wider text-accent-invert">{lead.category} · {lead.readTime}</p>
            <h3 className="mt-3 max-w-xl font-display text-2xl font-semibold leading-tight tracking-[-.03em] md:text-[2rem]">{lead.title}</h3>
            <p className="mt-3 line-clamp-2 max-w-xl text-sm leading-6 text-on-panel/70">{lead.excerpt}</p>
            <span className="mt-6 inline-flex text-sm font-semibold text-accent-invert">Read the article <span className="ml-1 transition-transform group-hover:translate-x-1">→</span></span>
          </div>
        </a>
        <div className="grid gap-4">
          {rest.map(post => <a key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col rounded-3xl border border-ink-border bg-surface p-6 transition hover:-translate-y-0.5 hover:border-primary/40 md:p-7">
            <p className="font-head text-[10px] uppercase tracking-wider text-muted">{post.category} · {post.date}</p>
            <h3 className="mt-3 font-display text-lg font-semibold leading-snug tracking-[-.02em] group-hover:text-primary">{post.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted">{post.excerpt}</p>
            <span className="mt-auto pt-4 text-xs text-muted">{post.readTime}</span>
          </a>)}
          <div className="flex flex-col rounded-3xl border border-ink-border bg-surface p-6 md:p-7">
            <p className="font-head text-[10px] uppercase tracking-wider text-muted">Also writing on</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {elsewhere.map(e => <a key={e.name} href={e.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between rounded-xl border border-ink-border px-4 py-3 text-sm transition hover:border-primary/40 hover:bg-primary/[0.04]">
                <span><span className="block font-semibold">{e.name}</span><span className="text-xs text-muted">{e.tag}</span></span><span className="text-primary transition-transform group-hover:translate-x-0.5">↗</span>
              </a>)}
            </div>
            <div className="mt-6 lg:mt-auto">
              <NewsletterSignup compact />
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </section>
}
