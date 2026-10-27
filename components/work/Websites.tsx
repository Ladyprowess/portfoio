import Image from 'next/image'
import { lwCommercePages, websites, type WorkItem } from '@/lib/work-content'

function Heading({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
    <div><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">{eyebrow}</p><h2 className="mt-3 max-w-2xl font-display text-3xl font-semibold tracking-[-.04em] md:text-[2.6rem] md:leading-[1.08]">{title}</h2></div>
    <p className="max-w-sm text-sm leading-6 text-muted">{body}</p>
  </div>
}
export { Heading }

/** A screenshot in a browser frame; on hover the shot pans down like scrolling the page. */
function SiteCard({ item, large = false }: { item: WorkItem; large?: boolean }) {
  return <a href={item.href} target="_blank" rel="noopener noreferrer" className={`group flex flex-col overflow-hidden rounded-3xl border border-ink-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_30px_60px_-30px_rgba(17,24,39,.45)] ${large ? 'lg:col-span-2 lg:grid lg:grid-cols-[1.35fr_1fr]' : ''}`}>
    <div className={`m-2.5 overflow-hidden rounded-2xl border border-ink-border bg-surface-2 ${large ? 'lg:mr-0' : ''}`}>
      <div className="flex gap-1 border-b border-ink-border bg-surface px-3 py-2" aria-hidden="true">{[0, 1, 2].map(d => <span key={d} className="h-1.5 w-1.5 rounded-full bg-ink-border" />)}</div>
      <div className={`relative ${large ? 'aspect-[16/10] lg:aspect-auto lg:h-[calc(100%-22px)] lg:min-h-[340px]' : 'aspect-[16/10]'}`}>
        <Image src={item.image} alt={`Preview of ${item.title}`} fill sizes={large ? '(max-width: 1024px) 92vw, 720px' : '(max-width: 768px) 92vw, 420px'}
          className={`object-cover transition-[object-position] duration-[2500ms] ease-in-out ${large ? 'object-left-top group-hover:object-left-bottom' : 'object-top group-hover:object-bottom'}`} />
      </div>
    </div>
    <div className={`flex flex-1 flex-col p-6 ${large ? 'lg:justify-center lg:p-10' : ''}`}>
      {large && <p className="mb-3 font-head text-[10px] uppercase tracking-wider text-primary">Featured</p>}
      <h3 className={`font-display font-semibold tracking-[-.02em] ${large ? 'text-2xl md:text-3xl' : 'text-lg'}`}>{item.title}</h3>
      <p className={`mt-2 leading-6 text-muted ${large ? 'text-base leading-7' : 'text-sm'}`}>{item.description}</p>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-primary">{item.linkLabel} <span className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span></span>
    </div>
  </a>
}

export default function Websites() {
  const [featured, ...rest] = websites
  return <section id="websites" className="scroll-mt-40 py-20 md:py-28">
    <div className="mx-auto max-w-[1320px] px-5 md:px-8">
      <Heading eyebrow="01 · Websites" title="Websites built for real people." body="Responsive WordPress sites with clear navigation, useful content and straightforward paths to action. Hover a site to scroll it." />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <SiteCard item={featured} large />
        {rest.map(item => <SiteCard key={item.title} item={item} />)}
      </div>

      <div className="mt-14 rounded-3xl border border-ink-border bg-surface p-6 md:p-9">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div><p className="font-head text-[10px] uppercase tracking-[.14em] text-primary">LW Commerce page directory</p><h3 className="mt-2 font-display text-2xl font-semibold tracking-[-.03em]">Every LW Commerce page I worked on.</h3></div>
          <a href="https://lwcommerce.org/" target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline">Visit LW Commerce ↗</a>
        </div>
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          {lwCommercePages.map(group => <details key={group.title} className="group rounded-2xl border border-ink-border bg-bg p-5 open:bg-surface-2/50">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold">
              <span>{group.title} <span className="ml-1 text-sm font-normal text-muted">{group.links.length}</span></span>
              <span aria-hidden="true" className="text-primary transition-transform group-open:rotate-45">+</span>
            </summary>
            <ul className="mt-4 space-y-2 border-t border-ink-border pt-4">{group.links.map(([label, href]) => <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" className="text-sm leading-6 text-muted hover:text-primary hover:underline">{label} <span aria-hidden="true">↗</span></a></li>)}</ul>
          </details>)}
        </div>
      </div>
    </div>
  </section>
}
