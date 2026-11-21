import Image from 'next/image'
import { clients } from '@/lib/home-content'

// Who she has worked with, as one quiet row of logos under the hero, instead
// of a full wall of tiles. Hovering a logo shows what she did for them.
export default function LogoStrip() {
  return <section aria-label="Teams I have worked with" className="border-y border-ink-border bg-surface">
    <div className="mx-auto flex max-w-[1320px] flex-col gap-4 px-5 py-6 md:py-8 md:flex-row md:items-center md:gap-10 md:px-8">
      <p className="shrink-0 font-head text-[11px] uppercase tracking-[.16em] text-muted">Trusted by teams at</p>
      <ul className="-mx-5 flex items-center gap-x-8 overflow-x-auto px-5 [scrollbar-width:none] md:mx-0 md:flex-wrap md:gap-y-5 md:overflow-visible md:px-0">
        {clients.slice(0, 8).map(c => <li key={c.name} className="shrink-0">
          <a href={c.href} target="_blank" rel="noopener noreferrer" title={`${c.name}: ${c.did}`}
            className="brand-plate flex items-center rounded-md px-1.5 py-1 opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
            <Image src={c.image} alt={c.name} width={110} height={32} className="max-h-7 w-auto max-w-[96px] object-contain" />
          </a>
        </li>)}
      </ul>
    </div>
  </section>
}
