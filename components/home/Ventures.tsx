'use client'

import Image from 'next/image'
import posthog from 'posthog-js'
import { ventures } from '@/lib/home-content'

const shots: Record<string, string | undefined> = {
  'Prowess Digital Solutions': '/service-proof/prowess-digital-solutions.png',
  Dritchwear: '/service-proof/dritchwear.png',
}

// The three companies, as cards that stack on top of each other as you scroll.
export default function Ventures() {
  return <section id="ventures" className="mx-auto max-w-[1320px] px-5 py-20 md:px-8 md:py-28">
    <div className="mb-12 max-w-2xl">
      <p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Built, not only advised</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-[-.04em] md:text-[2.9rem] md:leading-[1.05]">Three companies I founded.</h2>
      <p className="mt-4 leading-7 text-muted">Everything I advise clients on, I have had to do myself first.</p>
    </div>

    <div className="space-y-6">
      {ventures.map((v, i) => <article key={v.name} className={`sticky overflow-hidden rounded-[2rem] ${v.tone} shadow-[0_-20px_60px_-30px_rgba(0,0,0,.45)]`} style={{ top: `${96 + i * 28}px` }}>
        <div className="grid min-h-[480px] md:grid-cols-[1fr_1.1fr]">
          <div className="flex flex-col p-8 md:p-12">
            <p className="font-head text-[11px] uppercase tracking-[.16em] opacity-60">0{i + 1} · {v.tag}</p>
            <h3 className="mt-5 font-display text-4xl font-bold tracking-[-.045em] md:text-5xl">{v.name}</h3>
            <p className={`mt-3 font-display text-xl font-semibold md:text-2xl ${v.accent}`}>{v.line}</p>
            <p className="mt-5 max-w-md leading-7 opacity-75">{v.body}</p>
            <a href={v.href} target="_blank" rel="noopener noreferrer" onClick={() => posthog.capture('project_website_visited', { project_name: v.name, source: 'home_ventures' })}
              className="mt-auto inline-flex w-max items-center gap-2 rounded-full bg-white/10 px-5 py-3 pt-3 text-sm font-semibold backdrop-blur transition hover:bg-white/20 md:mt-10">Visit {v.name} <span>↗</span></a>
          </div>
          <div className="relative min-h-[260px] overflow-hidden md:m-4 md:ml-0 md:rounded-[1.5rem]">
            {shots[v.name] ? <Image src={shots[v.name]!} alt={`The ${v.name} website`} fill sizes="(max-width: 768px) 100vw, 640px" className="object-cover object-top" />
              : <KivoraMock />}
          </div>
        </div>
      </article>)}
    </div>
  </section>
}

/** KivoraPay has no current screenshot, so it gets a drawn app window in the
    new brand: white surfaces, a navy balance panel, one blue accent. */
function KivoraMock() {
  return <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_60%_40%,rgba(21,89,179,.45),transparent_65%)] p-6">
    <div className="w-full max-w-[340px] overflow-hidden rounded-xl border border-[#dce2eb] bg-white text-[#101e32] shadow-[0_24px_60px_-20px_rgba(0,0,0,.6)]">
      <div className="flex items-center gap-2 border-b border-[#e6ebf2] px-4 py-3">
        <Image src="/brands/kivorapay.png" alt="KivoraPay" width={92} height={25} className="h-5 w-auto" />
        <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#edf2f8] text-[8px] font-bold text-[#34455c]">NO</span>
      </div>
      <div className="p-4">
        <div className="rounded-lg bg-[#102846] p-4 text-white">
          <p className="text-[10px] text-[#c3d1e3]">Available balance</p>
          <p className="mt-1.5 font-display text-2xl font-semibold tracking-[-.03em]">245.80 <span className="text-lg text-[#9fb4cf]">USDT</span></p>
          <div className="mt-3.5 flex gap-1.5 text-[9px]">
            <span className="flex-1 rounded bg-white py-1.5 text-center font-bold text-[#102846]">Pay a bill</span>
            <span className="flex-1 rounded border border-[#425773] py-1.5 text-center">Receive</span>
            <span className="flex-1 rounded border border-[#425773] py-1.5 text-center">Invoice</span>
          </div>
        </div>
        <div className="mt-3.5 grid grid-cols-4 gap-2 text-center text-[9px] text-[#4e5e73]">
          {['Electricity', 'Airtime', 'Cable TV', 'Data'].map(s => <div key={s} className="flex flex-col items-center gap-1.5"><span className="h-7 w-7 rounded-md border border-[#e2e8f0] bg-[#f3f6fa]" />{s}</div>)}
        </div>
        <div className="mt-3.5 rounded-lg bg-[#1559b3] py-2 text-center text-[10px] font-bold text-white">Pay with crypto</div>
      </div>
    </div>
  </div>
}
