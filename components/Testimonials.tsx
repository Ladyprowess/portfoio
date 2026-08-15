'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

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
            Testimonials
          </span>
          <h2
            className="font-display font-extrabold text-dark-ink leading-[1.08]"
            style={{ fontSize: 'clamp(2.4rem, 4.6vw, 3.6rem)' }}
          >
            Kind words from
            <br />
            <span className="text-primary">amazing people.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[0]
  index: number
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="bg-dark-surface border border-dark-border p-7 flex flex-col gap-6"
    >
      <span className="font-display text-primary/50 text-[2.5rem] leading-none">&ldquo;</span>
      <p className="text-[0.9rem] text-dark-muted leading-[1.8] flex-1 -mt-4">{testimonial.quote}</p>
      <div className="border-t border-dark-border pt-4">
        <p className="font-head font-bold text-[0.85rem] text-dark-ink">{testimonial.name}</p>
        <p className="font-body text-[0.72rem] text-dark-muted mt-0.5">{testimonial.role}</p>
      </div>
    </motion.div>
  )
}
