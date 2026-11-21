import Image from 'next/image'

type Site = { title: string; image: string; href: string }

// Phones: the websites as two rows of screenshots gliding in opposite
// directions. Touch pauses the row; tapping a screenshot opens the site.
export default function WebsiteMarquee({ sites }: { sites: Site[] }) {
  const half = Math.ceil(sites.length / 2)
  const rows = [sites.slice(0, half), sites.slice(half)]
  const card = (w: Site, copy: number) => <a key={`${w.title}-${copy}`} href={w.href} target="_blank" rel="noopener noreferrer" tabIndex={copy ? -1 : undefined} aria-hidden={copy ? true : undefined}
    className="block w-[220px] shrink-0 overflow-hidden rounded-2xl border border-ink-border bg-surface shadow-[0_18px_40px_-28px_rgba(17,24,39,.5)]">
    <span className="relative block aspect-[16/10]"><Image src={w.image} alt="" fill sizes="220px" className="object-cover object-top" /></span>
    <span className="block truncate px-3 py-2.5 text-[13px] font-semibold">{w.title}</span>
  </a>
  return <div className="marquee-mask -mx-5 space-y-3 overflow-hidden">
    {rows.map((r, n) => <div key={n} className="animate-marquee gap-3 pr-3 motion-reduce:[animation:none]" style={{ animationDirection: n ? 'reverse' : 'normal', animationDuration: '38s' }}>
      {r.map(w => card(w, 0))}{r.map(w => card(w, 1))}
    </div>)}
  </div>
}
