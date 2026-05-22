'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView } from 'framer-motion'
import { blogPosts } from '@/lib/blog-posts'

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function Blog() {
  const hasPosts = blogPosts.length > 0

  if (!hasPosts) {
    return null
  }

  return (
    <section id="blog" className="px-8 md:px-20 py-36 border-t border-ink-border">
      <div className="max-w-[1400px] mx-auto">
        <Reveal className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              Blog
            </span>
            <h2
              className="font-display font-light leading-[1.04]"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.8rem)' }}
            >
              Ideas worth
              <br />
              <em className="italic gradient-text">thinking through</em>
            </h2>
          </div>
          <p className="text-[0.95rem] text-muted max-w-sm leading-[1.8] mb-1">
            Your personal posts will publish directly on this site.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-[1.05fr_1.95fr] gap-8 lg:gap-14 items-start">
          <Reveal delay={0.1}>
            <div className="border border-ink-border bg-surface p-8 lg:p-10">
              <span className="font-head text-[0.58rem] font-bold tracking-[0.16em] uppercase text-amber">
                Editor&apos;s Note
              </span>
              <p
                className="font-display font-light italic leading-[1.25] text-parchment/90 mt-5"
                style={{ fontSize: 'clamp(1.7rem, 3vw, 3rem)' }}
              >
                Clear writing is not decoration. It is how complex ideas become usable.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Crypto', 'Fintech', 'Technical Writing', 'Founder Notes'].map((topic) => (
                  <span
                    key={topic}
                    className="font-head text-[0.58rem] font-bold tracking-[0.12em] uppercase text-muted border border-ink-border px-3 py-2"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-ink-border border border-ink-border">
            {blogPosts.map((post, index) => (
              <Reveal key={post.title} delay={0.14 + index * 0.08} className="bg-surface">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group min-h-[24rem] h-full p-7 lg:p-8 flex flex-col hover:bg-surface-2 transition-colors duration-300"
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

                  <h3 className="font-head font-bold text-[1.35rem] leading-[1.25] text-parchment group-hover:text-primary transition-colors duration-200">
                    {post.title}
                  </h3>
                  <p className="text-[0.9rem] text-muted leading-[1.8] mt-5 flex-1">{post.excerpt}</p>

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
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.22} className="mt-10">
          <Link
            href="/blog"
            className="inline-flex font-head text-[0.67rem] font-bold tracking-[0.14em] uppercase text-bg bg-primary px-6 py-3 hover:bg-primary/85 transition-colors duration-200"
          >
            View All Posts
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
