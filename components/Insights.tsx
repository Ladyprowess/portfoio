'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { blogPosts } from '@/lib/blog-posts'

const platforms = [
  { label: 'Medium', href: 'https://ladyprowess.medium.com/' },
  { label: 'Substack', href: 'https://ladyprowess.substack.com' },
  { label: 'Dev.to', href: 'https://dev.to/ladyprowess' },
  { label: 'Hashnode', href: 'https://ladyprowess.hashnode.dev/' },
]

export default function Insights() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })
  const post = blogPosts[0]

  return (
    <section className="bg-dark px-8 md:px-20 py-32 border-b border-dark-border">
      <div className="max-w-[1480px] mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="font-head text-[0.64rem] font-semibold tracking-[0.2em] uppercase text-primary block mb-4">
            Insights
          </span>
          <h2
            className="font-display font-extrabold text-dark-ink leading-[1.08]"
            style={{ fontSize: 'clamp(2.4rem, 4.6vw, 3.6rem)' }}
          >
            Things I share
            <br />
            <span className="text-primary">and talk about.</span>
          </h2>
        </motion.div>

        <motion.a
          href={`/blog/${post.slug}`}
          initial={{ opacity: 0, y: 24 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="group block bg-dark-surface border border-dark-border p-10 md:p-14 hover:border-primary/40 transition-colors duration-300"
        >
          <div className="flex items-center gap-3 mb-5">
            <span className="font-head text-[0.6rem] font-bold tracking-[0.12em] uppercase text-primary">
              {post.category}
            </span>
            <span className="w-1 h-1 rounded-full bg-dark-muted" />
            <span className="font-head text-[0.6rem] font-bold tracking-[0.12em] uppercase text-dark-muted">
              {post.readTime}
            </span>
          </div>
          <h3 className="font-display font-extrabold text-2xl md:text-3xl text-dark-ink group-hover:text-primary transition-colors duration-200 max-w-3xl">
            {post.title}
          </h3>
          <p className="mt-4 text-[0.95rem] text-dark-muted leading-[1.8] max-w-2xl">{post.excerpt}</p>
          <div className="flex items-center gap-2 mt-6 text-primary">
            <span className="font-head text-[0.65rem] font-bold tracking-[0.1em] uppercase">Read the Story</span>
            <span className="text-sm transition-transform duration-300 group-hover:translate-x-1">→</span>
          </div>
        </motion.a>

        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <span className="font-head text-[0.6rem] font-bold tracking-[0.12em] uppercase text-dark-muted">
            More writing on
          </span>
          {platforms.map((p) => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-head text-[0.68rem] font-bold tracking-[0.08em] uppercase text-dark-ink hover:text-primary transition-colors duration-200"
            >
              {p.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
