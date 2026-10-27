import Image from 'next/image'
import { brands } from '@/lib/portfolio-content'

// Logos straight under the hero: proof before the pitch.
export default function ClientStrip() {
  return <section aria-label="Companies I have worked with" className="border-y border-ink-border bg-surface py-8">
    <div className="mx-auto flex max-w-[1320px] flex-col items-center gap-6 px-4 md:flex-row md:px-8">
      <p className="shrink-0 text-center font-head text-[10px] uppercase leading-5 tracking-[.14em] text-muted md:w-44 md:text-left">Writing, strategy and websites for</p>
      <div className="marquee-mask w-full min-w-0 flex-1 overflow-hidden">
        <div className="animate-brand-marquee flex w-max items-center gap-3 hover:[animation-play-state:paused]">
          {[...brands, ...brands].map((brand, index) => <a key={`${brand.name}-${index}`} href={brand.href} target="_blank" rel="noopener noreferrer" aria-label={`${brand.name}: ${brand.relationship}`} title={brand.relationship} tabIndex={index >= brands.length ? -1 : 0}
            className="group flex h-16 w-40 shrink-0 items-center justify-center rounded-xl border border-transparent px-4 transition hover:border-ink-border hover:bg-bg">
            <span className="brand-plate flex items-center justify-center rounded-md px-2 py-1"><Image src={brand.image} alt={brand.name} width={120} height={40} className="max-h-8 max-w-[120px] object-contain opacity-70 grayscale transition group-hover:opacity-100 group-hover:grayscale-0" /></span>
          </a>)}
        </div>
      </div>
    </div>
  </section>
}
