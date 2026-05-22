'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useInView } from 'framer-motion'

const photos = [
  {
    src: '/personal%20photo/headshot1.png',
    alt: 'Ngozi Peace Okafor professional headshot.',
    className: 'lg:row-span-2',
    aspect: 'aspect-[1023/1537]',
  },
  {
    src: '/personal%20photo/headshot2.png',
    alt: 'Ngozi Peace Okafor seated professional portrait.',
    className: '',
    aspect: 'aspect-[1023/1537]',
  },
  {
    src: '/personal%20photo/headshot3.png',
    alt: 'Ngozi Peace Okafor professional portrait.',
    className: '',
    aspect: 'aspect-[1023/1537]',
  },
  {
    src: '/personal%20photo/headshot4.png',
    alt: 'Ngozi Peace Okafor media portrait.',
    className: '',
    aspect: 'aspect-[1122/1402]',
  },
  {
    src: '/personal%20photo/headshot5.png',
    alt: 'Ngozi Peace Okafor media headshot.',
    className: '',
    aspect: 'aspect-[1122/1402]',
  },
  {
    src: '/personal%20photo/headshot6.jpg',
    alt: 'Ngozi Peace Okafor high-resolution media portrait.',
    className: 'lg:col-span-2',
    aspect: 'aspect-[2880/1800]',
  },
]

export default function Media() {
  const titleRef = useRef(null)
  const titleInView = useInView(titleRef, { once: true, margin: '-80px' })

  const gridRef = useRef(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-60px' })

  return (
    <section id="media" className="px-8 md:px-20 py-32 border-t border-ink-border">
      <div className="max-w-[1400px] mx-auto">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y: 28 }}
          animate={titleInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <span className="font-head text-[0.64rem] font-bold tracking-[0.2em] uppercase text-primary block mb-4">
              Media
            </span>
            <h2
              className="font-display font-light leading-[1.04]"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.8rem)' }}
            >
              Photos for
              <br />
              <em className="italic text-parchment/70">press and profiles.</em>
            </h2>
          </div>
          <p className="text-[0.95rem] text-muted max-w-sm leading-[1.8] mb-1">
            Selected portraits for interviews, features, speaker profiles, and professional references.
          </p>
        </motion.div>

        <div ref={gridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {photos.map((photo, index) => (
            <motion.figure
              key={photo.src}
              initial={{ opacity: 0, y: 24 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`bg-surface border border-ink-border overflow-hidden ${photo.className}`}
            >
              <div className={`relative ${photo.aspect}`}>
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover object-top grayscale-[12%]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  )
}
