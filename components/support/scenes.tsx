'use client'

import Image from 'next/image'
import { animate, motion } from 'framer-motion'
import { useEffect, useState, type CSSProperties, type ReactNode } from 'react'
import { useMotionPreference, type Scene, type Tone } from './kit'

/* ── Drawing primitives (all coordinates are on the 720×450 board) ── */

const ease = [0.22, 1, 0.36, 1] as const

function Pop({ at, d = 0, y = 18, x = 0, s = 0.94, className = '', style, children }: { at?: [number, number]; d?: number; y?: number; x?: number; s?: number; className?: string; style?: CSSProperties; children: ReactNode }) {
  const reduce = useMotionPreference()
  return (
    <motion.div initial={reduce ? false : { opacity: 0, x, y, scale: s }} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} transition={{ delay: d, duration: 0.55, ease }} className={`${at ? 'absolute' : ''} ${className}`} style={at ? { left: at[0], top: at[1], ...style } : style}>
      {children}
    </motion.div>
  )
}

function Card({ className = '', style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  return <div className={`rounded-2xl border border-ink-border bg-surface shadow-[0_18px_40px_-18px_rgba(15,23,42,0.35)] ${className}`} style={style}>{children}</div>
}

function Label({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`font-head text-[11px] font-bold uppercase tracking-[0.14em] text-muted ${className}`}>{children}</p>
}

function Tick({ d = 0, size = 28, color = 'var(--t)' }: { d?: number; size?: number; color?: string }) {
  return (
    <motion.svg width={size} height={size} viewBox="0 0 28 28" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: d, type: 'spring', stiffness: 380, damping: 18 }}>
      <circle cx="14" cy="14" r="14" fill={color} />
      <motion.path d="M8 14.5l4 4 8-9" fill="none" stroke="white" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: d + 0.15, duration: 0.35 }} />
    </motion.svg>
  )
}

function Cross({ d = 0 }: { d?: number }) {
  return (
    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: d, type: 'spring', stiffness: 400, damping: 16 }} className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E5484D] text-[13px] font-bold text-white">✕</motion.span>
  )
}

function Roll({ to, d = 0, dur = 1.8, format }: { to: number; d?: number; dur?: number; format: (n: number) => string }) {
  const [v, setV] = useState(0)
  const reduce = useMotionPreference()
  useEffect(() => {
    if (reduce) { setV(to); return }
    const c = animate(0, to, { delay: d, duration: dur, ease: 'easeOut', onUpdate: setV })
    return () => c.stop()
  }, [to, d, dur, reduce])
  return <>{format(v)}</>
}

function Phone({ at, d = 0, children }: { at: [number, number]; d?: number; children: ReactNode }) {
  return (
    <Pop at={at} d={d} y={40}>
      <div className="h-[400px] w-[212px] rounded-[36px] bg-[#0F172A] p-[7px] shadow-[0_30px_60px_-20px_rgba(15,23,42,0.6)]">
        <div className="relative h-full w-full overflow-hidden rounded-[30px] bg-bg">
          <div className="absolute left-1/2 top-2 z-20 h-[18px] w-[70px] -translate-x-1/2 rounded-full bg-[#0F172A]" />
          {children}
        </div>
      </div>
    </Pop>
  )
}

function Brand({ src, w, h, at, d = 0 }: { src: string; w: number; h: number; at?: [number, number]; d?: number }) {
  return <Pop at={at} d={d}><div className="relative" style={{ width: w, height: h }}><Image src={src} alt="" fill sizes={`${w}px`} className="object-contain" /></div></Pop>
}

function Pulse({ at, d = 0 }: { at: [number, number]; d?: number }) {
  const reduce = useMotionPreference()
  if (reduce) return null
  return (
    <motion.span className="absolute z-30 h-10 w-10 rounded-full border-[3px] border-[var(--a)]" style={{ left: at[0] - 20, top: at[1] - 20 }} initial={{ scale: 0.3, opacity: 0 }} animate={{ scale: [0.3, 1.4], opacity: [0, 1, 0] }} transition={{ delay: d, duration: 0.8, repeat: 1 }} />
  )
}

const Icon = {
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  phone: <path d="M7 2h10a1 1 0 011 1v18a1 1 0 01-1 1H7a1 1 0 01-1-1V3a1 1 0 011-1zm4 16h2" />,
  wifi: <path d="M2 9a15 15 0 0120 0M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0M12 20h.01" />,
  tv: <path d="M3 6h18v12H3zM8 21h8M9 2l3 4 3-4" />,
  book: <path d="M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-5a3 3 0 00-3 3" />,
  plane: <path d="M2 13l20-8-6 17-4-7z" />,
  brief: <path d="M3 7h18v13H3zM8 7V4h8v3" />,
  spark: <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />,
}

function Glyph({ name, size = 20, className = '' }: { name: keyof typeof Icon; size?: number; className?: string }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>{Icon[name]}</svg>
}

function Line({ d, path, dashed = true, color = 'var(--t)' }: { d: number; path: string; dashed?: boolean; color?: string }) {
  return (
    <svg className="pointer-events-none absolute inset-0" width="720" height="450">
      <motion.path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeDasharray={dashed ? '6 7' : undefined} strokeLinecap="round" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.8 }} transition={{ delay: d, duration: 0.9, ease: 'easeInOut' }} />
    </svg>
  )
}

function End({ logo, w, h, line, stats }: { logo: string; w: number; h: number; line: string; stats: [string, string][] }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      <Brand src={logo} w={w} h={h} />
      <Pop d={0.4}><p className="mt-6 max-w-[520px] font-display text-[34px] font-extrabold leading-tight tracking-[-0.02em]">{line}</p></Pop>
      <div className="mt-8 flex gap-3">
        {stats.map(([v, l], n) => (
          <Pop key={l} d={0.9 + n * 0.18}><Card className="min-w-[150px] px-5 py-3"><p className="font-display text-[26px] font-extrabold text-[var(--t)]">{v}</p><p className="text-[12px] text-muted">{l}</p></Card></Pop>
        ))}
      </div>
    </div>
  )
}

/* ── KivoraPay ─────────────────────────────── */

const naira = (n: number) => `₦${Math.round(n).toLocaleString('en-US')}`

function KProblem() {
  return (
    <>
      <Pop at={[36, 60]}><Card className="w-[210px] p-5"><Label>My wallet</Label><p className="mt-2 font-display text-[30px] font-extrabold">120.00</p><p className="text-[14px] font-semibold text-muted">USDT on Solana</p></Card></Pop>
      <Pop at={[474, 60]} d={0.25}><Card className="w-[210px] p-5"><Label>Electricity bill</Label><p className="mt-2 font-display text-[30px] font-extrabold">₦12,500</p><motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.1 }} className="mt-1 inline-block rounded-full bg-[#E5484D]/10 px-2.5 py-0.5 text-[12px] font-bold text-[#E5484D]">Due today</motion.span></Card></Pop>
      <Line d={0.5} path="M250 125 C 330 125 390 125 470 125" color="#E5484D" />
      {['Find a trader', 'Agree on a rate', 'Wait for the transfer'].map((t, n) => (
        <Pop key={t} at={[238, 190 + n * 54]} d={0.9 + n * 0.55} x={-20} y={0}>
          <div className="flex w-[244px] items-center gap-3 rounded-xl border border-ink-border bg-surface px-4 py-2.5 shadow-sm"><span className="font-head text-[12px] font-bold text-muted">0{n + 1}</span><span className="flex-1 text-[15px] font-semibold">{t}</span><Cross d={1.2 + n * 0.55} /></div>
        </Pop>
      ))}
      <Pop at={[214, 372]} d={2.8}><div className="flex items-center gap-3 rounded-full bg-[#0F172A] px-5 py-2.5 text-[15px] font-semibold text-white"><motion.span animate={{ rotate: 360 }} transition={{ duration: 1.6, ease: 'linear' }} className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent" />Hours later, the rate has moved.</div></Pop>
    </>
  )
}

const coins = [
  { s: '₮', name: 'USDT', net: 'Solana', c: '#26A17B' },
  { s: '$', name: 'USDC', net: 'Solana', c: '#2775CA' },
  { s: '₿', name: 'Bitcoin', net: 'Bitcoin network', c: '#F7931A' },
]

function KFund() {
  return (
    <>
      {coins.map((c, n) => (
        <div key={c.name}>
          <Pop at={[44, 80 + n * 100]} d={n * 0.15} x={-20} y={0}>
            <Card className="flex w-[230px] items-center gap-3 p-3.5"><span className="flex h-11 w-11 items-center justify-center rounded-full text-[20px] font-bold text-white" style={{ background: c.c }}>{c.s}</span><div><p className="text-[16px] font-bold">{c.name}</p><p className="text-[12px] text-muted">{c.net}</p></div></Card>
          </Pop>
          <motion.span className="absolute z-10 flex h-9 w-9 items-center justify-center rounded-full text-[16px] font-bold text-white shadow-lg" style={{ left: 240, top: 98 + n * 100, background: c.c }} initial={{ x: 0, y: 0, opacity: 0, scale: 1 }} animate={{ x: [0, 120, 230], y: [0, -20, 120 - n * 100], opacity: [0, 1, 0], scale: [1, 1, 0.5] }} transition={{ delay: 0.7 + n * 0.35, duration: 1.1, ease: 'easeInOut' }}>{c.s}</motion.span>
        </div>
      ))}
      <Phone at={[462, 25]} d={0.2}>
        <div className="px-4 pt-10">
          <Label>Naira balance</Label>
          <p className="mt-1 font-display text-[27px] font-extrabold"><Roll to={248500} d={1} dur={2.2} format={naira} /></p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-border"><motion.div className="h-full bg-[var(--t)]" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 1, duration: 2.2 }} /></div>
          <div className="mt-5 space-y-2">
            {coins.map((c, n) => (
              <Pop key={c.name} d={1.2 + n * 0.4} y={10}><div className="flex items-center gap-2 rounded-xl bg-surface p-2.5 shadow-sm"><span className="h-6 w-6 rounded-full" style={{ background: c.c }} /><span className="flex-1 text-[12px] font-semibold">Funded with {c.name}</span><Tick size={18} d={1.4 + n * 0.4} /></div></Pop>
            ))}
          </div>
          <Pop d={2.8}><p className="mt-4 rounded-xl t-soft p-2.5 text-center text-[11px] font-semibold text-[var(--t)] dark:text-[var(--a)]">Rate and fees shown before you confirm</p></Pop>
        </div>
      </Phone>
    </>
  )
}

const bills: { name: string; icon: keyof typeof Icon }[] = [{ name: 'Electricity', icon: 'bolt' }, { name: 'Airtime', icon: 'phone' }, { name: 'Data', icon: 'wifi' }, { name: 'Cable TV', icon: 'tv' }]

function KPay() {
  return (
    <>
      <Phone at={[70, 25]}>
        <div className="px-4 pt-10">
          <Label>Pay a bill</Label>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {bills.map((b, n) => (
              <Pop key={b.name} d={0.3 + n * 0.1}><div className={`flex h-[78px] flex-col justify-between rounded-2xl p-3 ${n === 0 ? 'bg-[var(--t)] text-white' : 'bg-surface shadow-sm'}`}><Glyph name={b.icon} /><span className="text-[12px] font-bold">{b.name}</span></div></Pop>
            ))}
          </div>
        </div>
        <Pulse at={[52, 80]} d={1} />
        <motion.div className="absolute inset-x-0 bottom-0 z-10 rounded-t-[22px] bg-surface p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.12)]" initial={{ y: 260 }} animate={{ y: 0 }} transition={{ delay: 1.5, duration: 0.5, ease }}>
          <Label>Electricity · Prepaid</Label>
          <p className="mt-1 font-display text-[26px] font-extrabold">₦12,500</p>
          <p className="text-[11px] text-muted">Meter 4501 •••• 2290</p>
          <motion.div className="mt-3 rounded-full bg-[var(--t)] py-2.5 text-center text-[13px] font-bold text-white" animate={{ scale: [1, 0.94, 1] }} transition={{ delay: 2.4, duration: 0.3 }}>Pay now</motion.div>
        </motion.div>
        <motion.div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-surface px-5 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 0.3 }}>
          <Tick d={2.9} size={56} />
          <p className="mt-4 font-display text-[22px] font-extrabold">Paid</p>
          <p className="mt-1 text-[12px] text-muted">Your token</p>
          <p className="mt-1 rounded-lg bg-surface-2 px-3 py-1.5 font-head text-[13px] font-bold tracking-wider">5821 4410 9036</p>
        </motion.div>
      </Phone>
      <Pop at={[340, 64]} d={1.9}>
        <Card className="w-[330px] p-5">
          <Label>Before you confirm</Label>
          {['Rate', 'Fee', 'Total'].map((r, n) => <div key={r} className="mt-3 flex items-center justify-between border-b border-ink-border pb-2 text-[15px] last:border-0"><span className="text-muted">{r}</span><Tick size={20} d={2.1 + n * 0.2} /></div>)}
        </Card>
      </Pop>
      <Pop at={[340, 266]} d={2.5}>
        <Card className="w-[330px] p-5">
          <Label>Every day bills</Label>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Electricity', 'Airtime', 'Data', 'Cable TV', 'Internet', 'Education', 'Travel', 'Betting'].map((b, n) => <Pop key={b} d={2.7 + n * 0.08} y={6}><span className="rounded-full t-soft px-3 py-1 text-[12px] font-semibold text-[var(--t)] dark:text-[var(--a)]">{b}</span></Pop>)}
          </div>
        </Card>
      </Pop>
    </>
  )
}

function KInvoice() {
  return (
    <>
      <Pop at={[36, 54]}>
        <Card className="w-[280px] p-5">
          <div className="flex items-center justify-between"><Label>Invoice #0142</Label><span className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-bold text-muted">Draft</span></div>
          <p className="mt-4 text-[14px] text-muted">Brand design project</p>
          <p className="font-display text-[34px] font-extrabold">$450.00</p>
          <p className="mt-1 text-[12px] text-muted">Pay with USDT or USDC</p>
          <motion.div className="mt-4 rounded-full bg-[var(--t)] py-2.5 text-center text-[13px] font-bold text-white" animate={{ scale: [1, 0.94, 1] }} transition={{ delay: 0.9, duration: 0.3 }}>Share payment link</motion.div>
        </Card>
      </Pop>
      <motion.div className="absolute z-10 rounded-full border border-ink-border bg-surface px-3.5 py-2 font-head text-[12px] font-bold shadow-lg" style={{ left: 120, top: 280 }} initial={{ opacity: 0, x: 0, y: 0 }} animate={{ opacity: [0, 1, 1, 0], x: [0, 200, 400, 420], y: [0, -120, -170, -170] }} transition={{ delay: 1.1, duration: 1.4, ease: 'easeInOut' }}>kivorapay.com/pay/…</motion.div>
      <Pop at={[470, 54]} d={0.4}>
        <Card className="flex w-[214px] items-center gap-3 p-4"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F59E0B] font-bold text-white">C</span><div><p className="text-[15px] font-bold">Your client</p><p className="text-[12px] text-muted">Anywhere in the world</p></div></Card>
      </Pop>
      <Pop at={[370, 210]} d={2.5} y={30}>
        <Card className="w-[314px] p-5">
          <div className="flex items-center gap-3"><Tick d={2.7} size={34} /><div><p className="text-[16px] font-bold">Payment received</p><p className="text-[13px] text-muted">450 USDT · confirmed</p></div></div>
          <div className="mt-4 flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2 text-[12px]"><span className="text-muted">Invoice #0142</span><motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.1 }} className="font-bold text-[#12A150]">Marked paid</motion.span></div>
        </Card>
      </Pop>
    </>
  )
}

function KBusiness() {
  const side = ['Store', 'Orders', 'Inventory', 'Invoices', 'Team payroll']
  return (
    <Pop at={[36, 34]}>
      <Card className="flex h-[382px] w-[648px] overflow-hidden p-0">
        <div className="w-[160px] border-r border-ink-border bg-surface-2 p-4">
          <div className="mb-4 h-7 w-7 rounded-lg bg-[var(--t)]" />
          {side.map((s, n) => <Pop key={s} d={0.2 + n * 0.08} x={-10} y={0}><p className={`mb-1 rounded-lg px-3 py-2 text-[13px] font-semibold ${n === 0 ? 'bg-surface text-[var(--t)] shadow-sm dark:text-[var(--a)]' : 'text-muted'}`}>{s}</p></Pop>)}
        </div>
        <div className="relative flex-1 p-5">
          <Label>My store</Label>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {['#F59E0B', '#8B5CF6', '#10B981'].map((c, n) => (
              <Pop key={c} d={0.5 + n * 0.15}><div className="rounded-xl border border-ink-border p-2"><div className="h-[70px] rounded-lg" style={{ background: `linear-gradient(135deg, ${c}, ${c}88)` }} /><div className="mt-2 h-2 w-3/4 rounded bg-ink-border" /><div className="mt-1.5 h-2 w-1/3 rounded t-mid" /></div></Pop>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            {['New order · 2 items · paid in USDT', 'Cashier code paid at the counter'].map((t, n) => (
              <Pop key={t} d={1.3 + n * 0.6} x={30} y={0}><div className="flex items-center gap-3 rounded-xl border border-ink-border px-3 py-2.5 text-[13px] font-semibold"><Tick size={20} d={1.5 + n * 0.6} />{t}</div></Pop>
            ))}
          </div>
          <Pop d={2.6} y={20} className="mt-3">
            <div className="flex items-center justify-between rounded-xl bg-[var(--t)] px-4 py-3 text-white"><div><p className="text-[13px] font-bold">Team payroll</p><p className="text-[11px] opacity-80">Salaries sent from one balance</p></div><span className="rounded-full bg-white/20 px-3 py-1 text-[12px] font-bold">Paid</span></div>
          </Pop>
        </div>
      </Card>
    </Pop>
  )
}

/* ── Prowess Digital Solutions ─────────────── */

const scattered = [
  { t: 'Job board', at: [40, 50] }, { t: 'Grant website', at: [270, 26] }, { t: 'Free template', at: [500, 56] },
  { t: 'YouTube course', at: [30, 300] }, { t: 'Pricing advice?', at: [270, 350] }, { t: 'Web designer', at: [500, 300] },
] as const

function PProblem() {
  return (
    <>
      {scattered.map((s, n) => (
        <Line key={`l${s.t}`} d={0.6 + n * 0.1} path={`M360 225 L ${s.at[0] + 90} ${s.at[1] + 32}`} color="var(--t)" />
      ))}
      {scattered.map((s, n) => (
        <Pop key={s.t} at={[s.at[0], s.at[1]]} d={0.15 + n * 0.12}>
          <motion.div animate={{ y: [0, n % 2 ? 8 : -8, 0], rotate: [0, n % 2 ? 2 : -2, 0] }} transition={{ duration: 3 + n * 0.3 }}>
            <Card className="w-[180px] overflow-hidden p-0"><div className="flex gap-1 border-b border-ink-border px-3 py-2">{[0, 1, 2].map(i => <span key={i} className="h-2 w-2 rounded-full bg-ink-border" />)}</div><p className="px-3 py-2.5 text-[14px] font-semibold">{s.t}</p></Card>
          </motion.div>
        </Pop>
      ))}
      <Pop at={[300, 165]} d={0.3}>
        <div className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full bg-[var(--t)] text-center text-[14px] font-bold leading-tight text-white shadow-xl">
          <motion.span className="absolute inset-0 rounded-full border-2 border-[var(--t)]" animate={{ scale: [1, 1.35], opacity: [0.6, 0] }} transition={{ duration: 1.6 }} />
          A founder<br />with an idea
        </div>
      </Pop>
      {[[250, 150], [450, 160], [440, 300]].map(([x, y], n) => (
        <Pop key={n} at={[x, y]} d={1.6 + n * 0.3}><span className="font-display text-[34px] font-extrabold text-[var(--a)]">?</span></Pop>
      ))}
    </>
  )
}

const routes = [
  { t: 'Business', s: 'Plans, websites, systems', icon: 'brief' },
  { t: 'Jobs', s: 'CV, interviews, portfolio', icon: 'book' },
  { t: 'Opportunities', s: 'Grants, scholarships, fellowships', icon: 'spark' },
  { t: 'Learning', s: 'Courses, videos, guides', icon: 'book' },
] as const

function PRoutes() {
  return (
    <Pop at={[100, 40]}>
      <Card className="w-[520px] p-7">
        <Label>Prowess Digital Solutions</Label>
        <p className="mt-2 font-display text-[28px] font-extrabold leading-tight">What are you working towards?</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {routes.map((r, n) => (
            <Pop key={r.t} d={0.5 + n * 0.18} s={0.85}>
              <motion.div animate={n === 0 ? { boxShadow: ['0 0 0 0px var(--a)', '0 0 0 3px var(--a)'] } : {}} transition={{ delay: 1.8, duration: 0.3 }} className="rounded-2xl border border-ink-border bg-bg p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--t)] text-white"><Glyph name={r.icon} size={18} /></span>
                <p className="mt-3 text-[16px] font-bold">{r.t}</p>
                <p className="text-[12px] text-muted">{r.s}</p>
              </motion.div>
            </Pop>
          ))}
        </div>
      </Card>
    </Pop>
  )
}

function PDiagnose() {
  const issues = ['Pricing is guesswork', 'No written process', 'Cash runs out mid-month', 'Customers don’t come back']
  return (
    <>
      <Pop at={[36, 48]}>
        <Card className="w-[300px] p-5">
          <Label>Business structure diagnostic</Label>
          <p className="mt-2 text-[15px] font-bold">What is slowing you down?</p>
          <div className="mt-3 space-y-2">
            {issues.map((t, n) => (
              <motion.div key={t} initial={{ borderColor: 'rgb(var(--border))' }} animate={n < 3 ? { borderColor: 'var(--t)' } : {}} transition={{ delay: 0.5 + n * 0.4 }} className="flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-[13px] font-semibold">
                {n < 3 ? <Tick size={18} d={0.5 + n * 0.4} /> : <span className="h-[18px] w-[18px] rounded-full border-2 border-ink-border" />}{t}
              </motion.div>
            ))}
          </div>
        </Card>
      </Pop>
      <Line d={1.8} path="M342 200 C 362 200 362 200 384 200" dashed={false} />
      <Pop at={[384, 48]} d={1.9} x={20} y={0}>
        <Card className="w-[300px] p-5">
          <Label>Possible causes</Label>
          {['No costing behind the prices', 'Work lives in one person’s head'].map((t, n) => <Pop key={t} d={2.1 + n * 0.2} y={6}><p className="mt-2 text-[13px]">• {t}</p></Pop>)}
          <Label className="mt-5">Next steps</Label>
          {['Cost one product properly', 'Write the first process', 'Track cash every week'].map((t, n) => (
            <Pop key={t} d={2.6 + n * 0.25} y={6}><div className="mt-2 flex items-center gap-2 rounded-lg t-soft px-3 py-2 text-[13px] font-semibold"><span className="font-head text-[11px] text-[var(--t)] dark:text-[var(--a)]">0{n + 1}</span>{t}</div></Pop>
          ))}
        </Card>
      </Pop>
    </>
  )
}

function PTools() {
  const months = [[40, 30], [52, 38], [48, 44], [64, 40], [70, 46], [82, 50]]
  return (
    <>
      <Pop at={[36, 48]}>
        <Card className="w-[410px] p-5">
          <Label>Profit and cashflow tracker</Label>
          <div className="mt-5 flex h-[190px] items-end gap-4 border-b border-ink-border">
            {months.map(([i, o], n) => (
              <div key={n} className="flex flex-1 items-end gap-1">
                <motion.div className="flex-1 rounded-t-md bg-[var(--t)]" initial={{ height: 0 }} animate={{ height: i * 2 }} transition={{ delay: 0.4 + n * 0.12, duration: 0.6, ease }} />
                <motion.div className="flex-1 rounded-t-md a-mid" initial={{ height: 0 }} animate={{ height: o * 2 }} transition={{ delay: 0.5 + n * 0.12, duration: 0.6, ease }} />
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-4 text-[12px] text-muted"><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[var(--t)]" />Money in</span><span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm a-mid" />Money out</span></div>
        </Card>
      </Pop>
      <Pop at={[470, 48]} d={0.8}>
        <Card className="flex w-[214px] flex-col items-center p-5">
          <Label>Business health check</Label>
          <svg width="110" height="110" viewBox="0 0 110 110" className="mt-3 -rotate-90"><circle cx="55" cy="55" r="46" fill="none" stroke="rgb(var(--border))" strokeWidth="10" /><motion.circle cx="55" cy="55" r="46" fill="none" stroke="var(--t)" strokeWidth="10" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 0.72 }} transition={{ delay: 1, duration: 1.4, ease }} /></svg>
          <p className="mt-2 text-[13px] font-semibold">Report ready</p>
        </Card>
      </Pop>
      <Pop at={[470, 268]} d={1.6}>
        <Card className="w-[214px] p-5">
          <Label>Invoice builder</Label>
          {[1, 2, 3].map(n => <Pop key={n} d={1.8 + n * 0.15} y={4}><div className="mt-2.5 flex justify-between"><span className="h-2 w-20 rounded bg-ink-border" /><span className="h-2 w-10 rounded t-mid" /></div></Pop>)}
          <Pop d={2.5}><div className="mt-3 rounded-full bg-[var(--t)] py-1.5 text-center text-[12px] font-bold text-white">Download</div></Pop>
        </Card>
      </Pop>
    </>
  )
}

function PServices() {
  return (
    <>
      <Pop at={[36, 48]}>
        <Card className="w-[330px] p-5">
          <Label>Done for you</Label>
          {['Business plan', 'Website', 'Business systems', 'Consultation'].map((t, n) => (
            <div key={t} className="mt-3">
              <div className="flex items-center justify-between text-[14px] font-semibold"><span>{t}</span><Tick size={20} d={0.9 + n * 0.45} /></div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-border"><motion.div className="h-full bg-[var(--t)]" initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.3 + n * 0.45, duration: 0.6 }} /></div>
            </div>
          ))}
        </Card>
      </Pop>
      <Pop at={[396, 48]} d={1.6}>
        <Card className="w-[290px] p-5">
          <span className="font-serif text-[44px] leading-none text-[var(--t)]">“</span>
          <p className="-mt-3 text-[15px] font-semibold leading-snug">Their team delivered a modern, high-quality website that perfectly reflects our company and brand.</p>
          <p className="mt-3 text-[12px] text-muted">Testers Connect · website client</p>
        </Card>
      </Pop>
      <Pop at={[396, 276]} d={2.4}>
        <Card className="w-[290px] p-5"><p className="font-display text-[40px] font-extrabold text-[var(--t)]">500+</p><p className="text-[13px] text-muted">small businesses impacted</p></Card>
      </Pop>
    </>
  )
}

/* ── Dritchwear ────────────────────────────── */

type MerchKind = 'tee' | 'hoodie' | 'cap' | 'tote'

const merchPath: Record<MerchKind, string> = {
  tee: 'M62 32 L86 20 Q100 34 114 20 L138 32 L176 62 L156 88 L140 76 L140 184 L60 184 L60 76 L44 88 L24 62 Z',
  hoodie: 'M64 40 Q100 4 136 40 L170 66 L182 172 L160 174 L146 94 L146 186 L54 186 L54 94 L40 174 L18 172 L30 66 Z',
  cap: 'M36 128 Q38 58 100 54 Q162 58 164 128 Q190 132 192 142 Q150 150 100 140 L36 140 Z',
  tote: 'M48 72 L152 72 L162 186 L38 186 Z M78 72 Q78 26 100 26 Q122 26 122 72',
}
const logoSpot: Record<MerchKind, [number, number]> = { tee: [100, 92], hoodie: [100, 104], cap: [100, 98], tote: [100, 128] }

function Merch({ kind, size = 150, d = 0, mark = true }: { kind: MerchKind; size?: number; d?: number; mark?: boolean }) {
  const [x, y] = logoSpot[kind]
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <path d={merchPath[kind]} fill={kind === 'tote' ? '#EFE7D6' : 'var(--t)'} stroke={kind === 'tote' ? '#C9B994' : 'rgba(0,0,0,0.15)'} strokeWidth={kind === 'tote' ? 5 : 2} strokeLinejoin="round" />
      {kind === 'hoodie' && <path d="M80 42 Q100 74 120 42 M76 150 L124 150 L118 172 L82 172 Z" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />}
      {mark && (
        <motion.g initial={{ opacity: 0, y: -140, scale: 2.4 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: d, type: 'spring', stiffness: 220, damping: 18 }}>
          <rect x={x - 20} y={y - 14} width="40" height="28" rx="7" fill="var(--a)" />
          <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="800" fill="#2A1A4F" fontFamily="system-ui">LOGO</text>
        </motion.g>
      )}
    </svg>
  )
}

function DProblem() {
  const parties = [{ t: 'Designer', at: [36, 190] }, { t: 'Printer', at: [270, 190] }, { t: 'Delivery', at: [504, 190] }] as const
  return (
    <>
      <Pop at={[250, 36]}>
        <Card className="w-[220px] p-4 text-center"><Label>Your event</Label><p className="mt-1 font-display text-[26px] font-extrabold">Friday</p><motion.p animate={{ opacity: [1, 0.35, 1] }} transition={{ duration: 1 }} className="text-[12px] font-bold text-[#E5484D]">Merch not ready</motion.p></Card>
      </Pop>
      {parties.map((p, n) => (
        <Pop key={p.t} at={[p.at[0], p.at[1]]} d={0.3 + n * 0.2}><Card className="w-[180px] p-5 text-center"><p className="text-[16px] font-bold">{p.t}</p><p className="mt-1 text-[12px] text-muted">Separate supplier</p></Card></Pop>
      ))}
      <Line d={0.9} path="M216 232 L 270 232" color="#E5484D" />
      <Line d={1.1} path="M450 232 L 504 232" color="#E5484D" />
      <Pop at={[231, 220]} d={1.5}><Cross /></Pop>
      <Pop at={[465, 220]} d={1.8}><Cross /></Pop>
      <Pop at={[160, 352]} d={2.4}><div className="rounded-full bg-[#0F172A] px-6 py-3 text-[15px] font-semibold text-white">Three suppliers. Nobody owns the deadline.</div></Pop>
    </>
  )
}

function DBrand() {
  const items: MerchKind[] = ['tee', 'hoodie', 'cap', 'tote']
  return (
    <>
      {items.map((k, n) => (
        <Pop key={k} at={[28 + n * 170, 100]} d={n * 0.12}>
          <Merch kind={k} size={160} d={0.6 + n * 0.5} />
          <p className="mt-2 text-center text-[14px] font-bold capitalize">{k === 'tee' ? 'T-shirt' : k}</p>
        </Pop>
      ))}
      <Pop at={[210, 360]} d={2.6}><div className="rounded-full bg-[var(--t)] px-6 py-3 text-[15px] font-semibold text-white">Your logo, colours and design on any item</div></Pop>
    </>
  )
}

function DMethod() {
  const methods = [{ t: 'Embroidery', at: [40, 110] }, { t: 'DTF printing', at: [500, 110] }, { t: 'DTG printing', at: [500, 280] }, { t: 'Branded gifts', at: [40, 280] }] as const
  return (
    <>
      <Pop at={[240, 50]}>
        <div className="relative">
          <Merch kind="tee" size={240} mark={false} />
          <svg className="absolute left-0 top-0" width="240" height="240" viewBox="0 0 200 200">
            <rect x="76" y="76" width="48" height="34" rx="8" fill="var(--a)" />
            <motion.rect x="70" y="70" width="60" height="46" rx="11" fill="none" stroke="white" strokeWidth="2" strokeDasharray="4 4" initial={{ strokeDashoffset: 0 }} animate={{ strokeDashoffset: -64 }} transition={{ duration: 2, ease: 'linear' }} />
          </svg>
        </div>
      </Pop>
      {methods.map((m, n) => (
        <div key={m.t}>
          <Line d={0.6 + n * 0.3} path={`M360 160 L ${m.at[0] + 90} ${m.at[1] + 24}`} />
          <Pop at={[m.at[0], m.at[1]]} d={0.8 + n * 0.3}><Card className="w-[180px] px-4 py-3 text-center text-[15px] font-bold">{m.t}</Card></Pop>
        </div>
      ))}
      <Pop at={[180, 370]} d={2.4}><p className="w-[360px] text-center text-[14px] font-semibold text-muted">Chosen for the fabric, the look and the quantity</p></Pop>
    </>
  )
}

function DScale() {
  return (
    <>
      <Pop at={[40, 70]}>
        <Label>Bulk ready</Label>
        <p className="mt-2 font-display text-[72px] font-extrabold leading-none text-[var(--t)] dark:text-[var(--a)]"><Roll to={10000} d={0.5} dur={2.4} format={n => Math.max(10, Math.round(n)).toLocaleString('en-US')} /></p>
        <p className="mt-2 text-[16px] font-semibold">pieces, from a minimum of 10</p>
        <Pop d={2.6}><Card className="mt-6 flex w-[270px] items-center gap-3 p-4"><Tick d={2.8} size={28} /><div><p className="text-[14px] font-bold">Specs kept on file</p><p className="text-[12px] text-muted">Every reorder matches the last</p></div></Card></Pop>
      </Pop>
      <div className="absolute grid grid-cols-8 gap-2" style={{ left: 360, top: 56 }}>
        {Array.from({ length: 48 }).map((_, n) => (
          <motion.div key={n} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + n * 0.045, type: 'spring', stiffness: 300, damping: 18 }}>
            <svg width="34" height="34" viewBox="0 0 200 200"><path d={merchPath.tee} fill={n % 5 === 0 ? 'var(--a)' : 'var(--t)'} /></svg>
          </motion.div>
        ))}
      </div>
    </>
  )
}

function DDeliver() {
  return (
    <>
      <Pop at={[36, 70]}><Card className="w-[170px] p-4"><Label>From</Label><p className="mt-1 text-[15px] font-bold">Dritchwear studio</p></Card></Pop>
      <Pop at={[514, 70]} d={0.2}><Card className="w-[170px] p-4"><Label>To</Label><p className="mt-1 text-[15px] font-bold">Your office or event</p></Card></Pop>
      <Line d={0.4} path="M206 110 C 300 40 420 180 514 110" />
      <motion.div className="absolute" style={{ left: 196, top: 92 }} initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: [0, 100, 200, 300], y: [0, -30, 10, 0], opacity: [1, 1, 1, 1] }} transition={{ delay: 0.8, duration: 1.8, ease: 'easeInOut' }}>
        <span className="flex h-10 w-14 items-center justify-center rounded-lg bg-[var(--a)] text-[11px] font-black text-[#2A1A4F] shadow-lg">BOX</span>
      </motion.div>
      <Pop at={[250, 170]} d={2.4}><Card className="flex w-[220px] items-center gap-3 p-4"><Tick d={2.6} /><p className="text-[15px] font-bold">Delivered on time</p></Card></Pop>
      <div className="absolute flex gap-3" style={{ left: 36, top: 290 }}>
        {[['500+', 'orders delivered'], ['100+', 'brands served'], ['5.0', 'Google rating'], ['Nationwide', 'delivery']].map(([v, l], n) => (
          <Pop key={l} d={2.9 + n * 0.15}><Card className="w-[153px] p-4"><p className="font-display text-[24px] font-extrabold text-[var(--t)] dark:text-[var(--a)]">{v}</p><p className="text-[12px] text-muted">{l}</p></Card></Pop>
        ))}
      </div>
    </>
  )
}

/* ── Registry ──────────────────────────────── */

export type Step = { title: string; body: string; scene: number }
export type VentureFilm = { tone: Tone; short: string; title: string; scenes: Scene[]; steps: Step[] }

export const films: Record<string, VentureFilm> = {
  kivorapay: {
    tone: { t: '#1D4ED8', a: '#60A5FA' },
    short: 'KivoraPay',
    title: 'From crypto to a paid bill',
    scenes: [
      { key: 'k1', kicker: 'The problem', caption: 'The money is in the wallet. It still can’t pay the bill.', view: () => <KProblem /> },
      { key: 'k2', kicker: 'Fund', caption: 'Fund a naira balance with USDT, USDC or Bitcoin.', view: () => <KFund /> },
      { key: 'k3', kicker: 'Pay', caption: 'Pay electricity, airtime, data and TV from that balance.', view: () => <KPay />, ms: 5200 },
      { key: 'k4', kicker: 'Get paid', caption: 'Freelancers send an invoice or link. Clients pay in crypto.', view: () => <KInvoice /> },
      { key: 'k5', kicker: 'Run a business', caption: 'Merchants run a store, orders and payroll from one account.', view: () => <KBusiness /> },
      { key: 'k6', kicker: 'KivoraPay', caption: 'The spending layer for crypto.', view: () => <End logo="/brands/kivorapay.png" w={300} h={80} line="Crypto you can actually spend." stats={[['500+', 'registered users'], ['200+', 'transactions'], ['₦1.5M+', 'volume']]} /> },
    ],
    steps: [
      { scene: 1, title: 'Fund a naira balance', body: 'Send USDT or USDC on Solana, or Bitcoin. The rate and fees are shown before anything is confirmed.' },
      { scene: 2, title: 'Pay everyday bills', body: 'Electricity, airtime, data, cable TV, internet, education and travel, paid straight from the balance.' },
      { scene: 3, title: 'Get paid in crypto', body: 'Create an invoice or payment link, share it, and see the payment confirmed automatically.' },
      { scene: 4, title: 'Run the business', body: 'A storefront, orders, inventory, cashier codes and team payroll, all from one account.' },
    ],
  },
  'prowess-digital-solutions': {
    tone: { t: '#2F6E72', a: '#4FB8BD' },
    short: 'PDS',
    title: 'From scattered to structured',
    scenes: [
      { key: 'p1', kicker: 'The problem', caption: 'Good ideas stall when the help is scattered across too many places.', view: () => <PProblem /> },
      { key: 'p2', kicker: 'One place', caption: 'Business, jobs, opportunities and learning, organised in one place.', view: () => <PRoutes /> },
      { key: 'p3', kicker: 'Diagnose', caption: 'Pick what is slowing you down. See the likely causes and the next steps.', view: () => <PDiagnose />, ms: 5200 },
      { key: 'p4', kicker: 'Tools', caption: 'Practical tools: a health check, cashflow tracking and invoices.', view: () => <PTools /> },
      { key: 'p5', kicker: 'Execution', caption: 'When owners need hands, the team builds it: plans, websites and systems.', view: () => <PServices /> },
      { key: 'p6', kicker: 'Prowess Digital Solutions', caption: 'Structure in place of guesswork.', view: () => <End logo="/brands/pds.png" w={320} h={110} line="Structure in place of guesswork." stats={[['500+', 'small businesses impacted'], ['200+', 'people trained'], ['10+', 'products and tools']]} /> },
    ],
    steps: [
      { scene: 1, title: 'Choose the goal', body: 'Visitors start with what they are working towards: business, jobs, opportunities or learning.' },
      { scene: 2, title: 'Diagnose the business', body: 'The structure diagnostic turns everyday problems into likely causes and clear next steps.' },
      { scene: 3, title: 'Use the tools', body: 'A business health check, a profit and cashflow tracker and an invoice builder, with access requirements shown on each tool.' },
      { scene: 4, title: 'Get it built', body: 'Business plans, websites, business systems and consultation, delivered by the team.' },
    ],
  },
  dritchwear: {
    tone: { t: '#4A2D82', a: '#F5A70E' },
    short: 'Dritchwear',
    title: 'Merch people actually keep',
    scenes: [
      { key: 'd1', kicker: 'The problem', caption: 'Design in one place, printing in another, and the delivery misses the event.', view: () => <DProblem /> },
      { key: 'd2', kicker: 'Brand it', caption: 'Your logo, colours and design on tees, hoodies, caps, totes and gifts.', view: () => <DBrand />, ms: 5000 },
      { key: 'd3', kicker: 'Make it', caption: 'Embroidery, DTF or DTG, chosen for the fabric and the quantity.', view: () => <DMethod /> },
      { key: 'd4', kicker: 'Scale it', caption: 'From 10 pieces to 10,000. Same quality, every time.', view: () => <DScale />, ms: 5000 },
      { key: 'd5', kicker: 'Deliver it', caption: 'Delivered nationwide, on time for the deadline.', view: () => <DDeliver />, ms: 5000 },
      { key: 'd6', kicker: 'Dritchwear', caption: 'We build merch people actually keep.', view: () => <End logo="/brands/dritchwear-trim.png" w={340} h={60} line="We build merch people actually keep." stats={[['500+', 'orders delivered'], ['100+', 'brands served'], ['5.0', 'Google rating']]} /> },
    ],
    steps: [
      { scene: 1, title: 'Brand any item', body: 'T-shirts, hoodies, varsity jackets, caps, totes, notebooks, flasks and gift sets with the customer’s identity.' },
      { scene: 2, title: 'Pick the right method', body: 'Embroidery, DTF or DTG printing, matched to the fabric, the design and the order size.' },
      { scene: 3, title: 'Produce in bulk', body: 'From 10 to 10,000 pieces, with specs kept on file so every reorder matches.' },
      { scene: 4, title: 'Deliver on time', body: 'Nationwide delivery for companies, events, schools, NGOs and creators.' },
    ],
  },
}
