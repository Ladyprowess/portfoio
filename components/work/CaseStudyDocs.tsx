import Image from 'next/image'
import { caseStudies } from '@/lib/work-content'
import { Heading } from './Websites'

const tilt = ['-rotate-[1.2deg]', 'rotate-[0.8deg]', '-rotate-[0.6deg]', 'rotate-[1deg]', '-rotate-[0.9deg]', 'rotate-[0.6deg]']

// The case studies are written documents, so they look like pages: a folded
// corner, a slight tilt, and they straighten up and lift when hovered.
export default function CaseStudyDocs() {
  return <section id="case-studies" className="scroll-mt-40 py-20 md:py-28">
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      <Heading eyebrow="04 · Case studies" title="Case studies I wrote for companies." body="Brand and product case studies across technology, crypto, payments, lifestyle and professional services. Each opens the full document." />
      <div className="grid gap-x-6 gap-y-8 md:grid-cols-2 lg:grid-cols-3">
        {caseStudies.map((s, i) => <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer"
          className={`group relative flex flex-col bg-paper p-3 shadow-[0_24px_50px_-28px_rgba(17,24,39,.45)] ring-1 ring-ink-border transition duration-300 [clip-path:polygon(0_0,calc(100%-28px)_0,100%_28px,100%_100%,0_100%)] hover:-translate-y-2 hover:rotate-0 hover:shadow-[0_40px_70px_-30px_rgba(17,24,39,.55)] ${tilt[i % tilt.length]}`}>
          {/* Folded corner */}
          <span aria-hidden="true" className="absolute right-0 top-0 h-7 w-7 bg-gradient-to-bl from-transparent from-50% to-surface-2 to-50% shadow-[-2px_2px_4px_rgba(17,24,39,.12)]" />
          <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-surface-2">
            <Image src={s.image} alt={`Preview of the ${s.name} case study`} fill sizes="(max-width: 768px) 92vw, 420px" className="object-cover object-top transition duration-700 group-hover:scale-[1.03]" />
          </div>
          <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
            <div className="flex items-center justify-between font-head text-[10px] uppercase tracking-wider text-muted"><span>Case study · {String(i + 1).padStart(2, '0')}</span><span className="rounded bg-primary/10 px-1.5 py-0.5 text-primary">Doc</span></div>
            <h3 className="mt-3 font-display text-xl font-semibold tracking-[-.02em] transition-colors group-hover:text-primary">{s.name}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{s.desc}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">Read the case study <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span></span>
          </div>
        </a>)}
      </div>
    </div>
  </section>
}
