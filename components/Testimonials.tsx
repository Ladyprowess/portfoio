'use client'

import { useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'

const testimonials = [
  {
    quote:
      "I got maximum satisfaction from the work Ngozi did for me. She is indeed a great writer and honest in dealing with people. Her work is excellent. I recommend her to the public.",
    name: 'Mondesce Nigeria Ltd',
    role: 'Client',
  },
  {
    quote:
      'Working with Lady Prowess is an absolute delight and easy going. I will strongly recommend for guaranteed satisfaction.',
    name: 'Stanley Williams',
    role: 'Client',
  },
  {
    quote:
      "Hands down one of the best technical writers I've come across. Ngozi has a real gift for turning complex ideas into structured, clear, engaging content, be it internal docs or blog posts.",
    name: 'Abdullah T.',
    role: 'Data Engineer, worked together on the same team',
  },
  {
    quote:
      "It was great working with Peace Ngozi Okafor. She did the work very quickly, was responsive to learning new things, and gave great value. Highly recommended.",
    name: 'Smidh Vadera',
    role: 'Web App & Odoo ERP expert, managed her directly',
  },
]

export default function Testimonials() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState(0)

  const testimonial = testimonials[active]
  const previous = () => setActive((current) => (current === 0 ? testimonials.length - 1 : current - 1))
  const next = () => setActive((current) => (current === testimonials.length - 1 ? 0 : current + 1))

  return (
    <section className="bg-surface px-6 py-28 sm:px-8 md:px-20 md:py-32 border-b border-ink-border">
      <div className="max-w-[1480px] mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <span className="font-head text-[0.64rem] font-semibold tracking-[0.2em] uppercase text-primary block mb-4">
            Testimonials
          </span>
          <h2
            className="font-display font-extrabold text-parchment leading-[1.08]"
            style={{ fontSize: 'clamp(2.4rem, 4.6vw, 3.6rem)' }}
          >
            Kind words from
            <br />
            <span className="text-primary">amazing people.</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
          className="grid grid-cols-1 overflow-hidden border border-ink-border bg-bg lg:grid-cols-[1fr_340px]"
        >
          <div className="relative min-h-[420px] p-7 sm:p-10 md:p-14">
            <span className="font-display text-primary/40 text-[4.5rem] leading-none" aria-hidden>
              &ldquo;
            </span>

            <AnimatePresence mode="wait">
              <motion.article
                key={testimonial.name}
                initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -12 }}
                transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.23, 1, 0.32, 1] }}
                className="-mt-8 flex min-h-[300px] flex-col justify-between"
              >
                <p className="max-w-4xl font-display text-3xl font-extrabold leading-[1.18] text-parchment md:text-5xl">
                  {testimonial.quote}
                </p>

                <div className="mt-10 border-t border-ink-border pt-6">
                  <p className="font-head text-[0.85rem] font-bold text-parchment">
                    {testimonial.name}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted">{testimonial.role}</p>
                </div>
              </motion.article>
            </AnimatePresence>
          </div>

          <aside className="flex flex-col border-t border-ink-border bg-surface lg:border-l lg:border-t-0">
            <div className="grid grid-cols-2 border-b border-ink-border">
              <button
                type="button"
                onClick={previous}
                className="min-h-14 border-r border-ink-border px-5 font-head text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted motion-safe:transition-colors motion-safe:duration-150 hover:bg-bg hover:text-parchment focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                aria-label="Show previous testimonial"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={next}
                className="min-h-14 px-5 font-head text-[0.68rem] font-bold uppercase tracking-[0.12em] text-muted motion-safe:transition-colors motion-safe:duration-150 hover:bg-bg hover:text-parchment focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                aria-label="Show next testimonial"
              >
                Next
              </button>
            </div>

            <div className="flex flex-1 flex-col">
              {testimonials.map((item, index) => {
                const selected = index === active

                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setActive(index)}
                    className={`min-h-20 border-b border-ink-border px-6 py-5 text-left motion-safe:transition-colors motion-safe:duration-150 last:border-b-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                      selected ? 'bg-bg' : 'hover:bg-bg/70'
                    }`}
                    aria-pressed={selected}
                  >
                    <span className="block font-head text-[0.6rem] font-bold uppercase tracking-[0.12em] text-primary">
                      0{index + 1}
                    </span>
                    <span className="mt-2 block font-display text-lg font-extrabold leading-tight text-parchment">
                      {item.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </aside>
        </motion.div>
      </div>
    </section>
  )
}
