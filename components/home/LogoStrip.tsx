import Image from 'next/image'
import { clients } from '@/lib/home-content'

// Who she has worked with: one row of logos that drifts sideways on a loop
// (the list is drawn twice, so the loop is seamless). Hover pauses it, and
// visitors who prefer reduced motion see it still. Hovering a logo shows what
// she did for them.
export default function LogoStrip() {
  const row = (copy: number) => <ul aria-hidden={copy === 1} className="flex shrink-0 items-center gap-12 pr-12 md:gap-16 md:pr-16">
    {clients.map(c => <li key={c.name} className="shrink-0">
      <a href={c.href} target="_blank" rel="noopener noreferrer" tabIndex={copy === 1 ? -1 : undefined} title={`${c.name}: ${c.did}`}
        className="brand-plate flex items-center rounded-md px-1.5 py-1 opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
        <Image src={c.image} alt={copy === 1 ? '' : c.name} width={120} height={36} className="max-h-8 w-auto max-w-[110px] object-contain" />
      </a>
    </li>)}
  </ul>

  return <section aria-label="Teams I have worked with" className="border-y border-ink-border bg-surface">
    <div className="mx-auto flex max-w-[1320px] flex-col gap-4 py-6 md:flex-row md:items-center md:gap-10 md:py-8">
      <p className="shrink-0 px-5 font-head text-[11px] uppercase tracking-[.16em] text-muted md:pl-8 md:pr-0">Trusted by teams at</p>
      <div className="marquee-mask min-w-0 flex-1 overflow-hidden">
        <div className="animate-marquee motion-reduce:[animation:none]">{row(0)}{row(1)}</div>
      </div>
    </div>
  </section>
}
