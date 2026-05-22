import Link from 'next/link'
import type { Metadata } from 'next'
import { blogPosts } from '@/lib/blog-posts'

export const metadata: Metadata = {
  title: 'Blog - Lady Prowess',
  description: 'Personal essays and technical notes by Ngozi Peace Okafor on Web3, content strategy, and founder work.',
}

export default function BlogIndexPage() {
  const hasPosts = blogPosts.length > 0

  return (
    <main className="min-h-screen px-8 md:px-20 py-16 md:py-24">
      <div className="max-w-[1200px] mx-auto">
        <Link
          href="/"
          className="font-head text-[0.65rem] font-bold tracking-[0.14em] uppercase text-muted hover:text-primary transition-colors"
        >
          &lt;- Back Home
        </Link>

        <header className="mt-16 mb-16 md:mb-20">
          <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
            Lady Prowess Blog
          </span>
          <h1
            className="font-display font-light leading-[1.02] max-w-5xl"
            style={{ fontSize: 'clamp(3.25rem, 7vw, 7rem)' }}
          >
            Essays from
            <br />
            <em className="italic gradient-text">my own desk</em>
          </h1>
        </header>

        {hasPosts ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink-border border border-ink-border">
            {blogPosts.map((post) => (
              <article key={post.slug} className="bg-surface">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group min-h-[26rem] h-full p-7 lg:p-8 flex flex-col hover:bg-surface-2 transition-colors duration-300"
                >
                  <div className="flex items-start justify-between gap-4 mb-8">
                    <span
                      className="font-head text-[0.56rem] font-bold tracking-[0.12em] uppercase px-3 py-1.5 rounded-full"
                      style={{ color: post.accent, background: `${post.accent}14` }}
                    >
                      {post.category}
                    </span>
                    <span className="font-head text-[0.58rem] font-bold tracking-[0.12em] uppercase text-muted">
                      {post.readTime}
                    </span>
                  </div>

                  <h2 className="font-head font-bold text-[1.4rem] leading-[1.25] text-parchment group-hover:text-primary transition-colors duration-200">
                    {post.title}
                  </h2>
                  <p className="text-[0.92rem] text-muted leading-[1.8] mt-5 flex-1">{post.excerpt}</p>

                  <div className="pt-8 mt-8 border-t border-ink-border flex items-center justify-between">
                    <span className="font-head text-[0.65rem] font-bold tracking-[0.12em] uppercase text-parchment/70">
                      {post.date}
                    </span>
                    <span
                      className="text-sm opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200"
                      style={{ color: post.accent }}
                    >
                      -&gt;
                    </span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-ink-border bg-surface p-8 lg:p-10">
            <span className="font-head text-[0.58rem] font-bold tracking-[0.16em] uppercase text-muted">
              No Posts Published
            </span>
            <p className="font-display font-light italic leading-[1.25] text-parchment/90 mt-6" style={{ fontSize: 'clamp(1.8rem, 3vw, 3.2rem)' }}>
              Your first article will appear here when you add it.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
