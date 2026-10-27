import Image from 'next/image'
import { learning } from '@/lib/work-content'

// Learning products on a dark band, to break up the light page.
export default function Learning() {
  return <section id="learning" className="scroll-mt-40 bg-panel py-20 text-on-panel md:py-28">
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><p className="font-head text-[11px] uppercase tracking-[.14em] text-accent-invert">03 · Learning</p><h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-.04em] md:text-[2.6rem] md:leading-[1.08]">Practical learning for business, technology and Web3.</h2></div>
        <p className="max-w-sm text-sm leading-6 text-on-panel/60">Workshops, video lessons, ebooks and guides that make unfamiliar topics easier to understand. Over 200 people trained.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-3">
        {learning.map((l, i) => <a key={l.title} href={l.href} target="_blank" rel="noopener noreferrer"
          className="group flex flex-col overflow-hidden rounded-3xl border border-border-invert bg-white/[0.03] transition duration-300 hover:-translate-y-1 hover:border-accent-invert/60 hover:bg-white/[0.06]">
          <div className="relative m-2.5 aspect-[16/10] overflow-hidden rounded-2xl bg-white/5">
            <Image src={l.image} alt={`Preview of ${l.title}`} fill sizes="(max-width: 768px) 92vw, 420px" className="object-cover object-top transition duration-700 group-hover:scale-105" />
            <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 font-head text-[10px] text-white backdrop-blur">0{i + 1}</span>
          </div>
          <div className="flex flex-1 flex-col p-6">
            <h3 className="font-display text-xl font-semibold tracking-[-.02em]">{l.title}</h3>
            <p className="mt-2 text-sm leading-6 text-on-panel/65">{l.description}</p>
            <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-accent-invert">{l.linkLabel} <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span></span>
          </div>
        </a>)}
      </div>
    </div>
  </section>
}
