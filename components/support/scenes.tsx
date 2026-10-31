'use client'

import Image from 'next/image'
import { animate, motion } from 'framer-motion'
import { useEffect, useState, type ReactNode } from 'react'
import { useMotionPreference, type Scene, type Tone } from './kit'

/*
 * Explainer films, drawn on a 720×450 board over a solid brand colour.
 * Each scene shows a few large pieces of interface at a time: a cursor types
 * and clicks, results arrive, and bold status pills pop in to say what happened.
 * With reduced motion every scene renders in its finished state.
 */

const ease = [0.22, 1, 0.36, 1] as const
const ink = '#0F172A'

function Pop({ at, d = 0, y = 22, x = 0, s = 0.92, className = '', children }: { at?: [number, number]; d?: number; y?: number; x?: number; s?: number; className?: string; children: ReactNode }) {
  const reduce = useMotionPreference()
  return (
    <motion.div initial={reduce ? false : { opacity: 0, x, y, scale: s }} animate={{ opacity: 1, x: 0, y: 0, scale: 1 }} transition={{ delay: d, duration: 0.6, ease }} className={`${at ? 'absolute' : ''} ${className}`} style={at ? { left: at[0], top: at[1] } : undefined}>
      {children}
    </motion.div>
  )
}

/** White interface card; stays white in both site themes, like a product screenshot. */
function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return <div className={`rounded-2xl bg-white text-[#0F172A] shadow-[0_22px_44px_-22px_rgba(15,23,42,0.45)] ring-1 ring-black/5 ${className}`}>{children}</div>
}

function Label({ children }: { children: ReactNode }) {
  return <p className="font-head text-[11px] font-bold uppercase tracking-[0.14em] text-[#64748B]">{children}</p>
}

/** Fades everything behind the moment in focus, like a camera pulling focus. */
function Defocus({ d, children }: { d: number; children: ReactNode }) {
  const reduce = useMotionPreference()
  return <motion.div className="absolute inset-0" initial={reduce ? false : { filter: 'blur(0px)', opacity: 1 }} animate={{ filter: 'blur(5px)', opacity: 0.45 }} transition={{ delay: d, duration: 0.5 }}>{children}</motion.div>
}

const Icon = {
  check: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  x: <path d="M6 6l12 12M18 6L6 18" />,
  bolt: <path d="M13 2L4 14h7l-1 8 9-12h-7z" />,
  phone: <path d="M7 2h10a1 1 0 011 1v18a1 1 0 01-1 1H7a1 1 0 01-1-1V3a1 1 0 011-1zm4 16h2" />,
  wifi: <path d="M2 9a15 15 0 0120 0M5 12.5a10 10 0 0114 0M8.5 16a5 5 0 017 0M12 20h.01" />,
  tv: <path d="M3 6h18v12H3zM8 21h8M9 2l3 4 3-4" />,
  search: <path d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.3-4.3" />,
  send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4z" />,
  cart: <path d="M3 4h2l2.4 11h11L21 7H6.2M9 20h.01M18 20h.01" />,
  users: <path d="M16 20v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 10a4 4 0 100-8 4 4 0 000 8zM22 20v-2a4 4 0 00-3-3.9M16 2.1a4 4 0 010 7.8" />,
  doc: <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M8 13h8M8 17h5" />,
  star: <path d="M12 2l3 6.5 7 .9-5.1 4.8 1.3 7L12 17.8 5.8 21.2l1.3-7L2 9.4l7-.9z" />,
  truck: <path d="M1 4h14v12H1zM15 9h4l3 3v4h-7M5.5 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18.5 20a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />,
  chat: <path d="M21 12a8 8 0 01-11.6 7.1L3 21l1.9-6.4A8 8 0 1121 12z" />,
  brief: <path d="M3 7h18v13H3zM8 7V4h8v3" />,
  book: <path d="M4 4h7a3 3 0 013 3v13a2 2 0 00-2-2H4zM20 4h-5a3 3 0 00-3 3" />,
  spark: <path d="M12 2v6M12 16v6M2 12h6M16 12h6M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />,
  calc: <path d="M5 2h14v20H5zM8 6h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 19h8" />,
}

function Glyph({ name, size = 20, stroke = 2.2 }: { name: keyof typeof Icon; size?: number; stroke?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{Icon[name]}</svg>
}

const pill = {
  green: { bg: '#22C55E', fg: '#FFFFFF' },
  amber: { bg: '#FBBF24', fg: '#1F2937' },
  cyan: { bg: '#2DD4BF', fg: '#073B36' },
  red: { bg: '#EF4444', fg: '#FFFFFF' },
  ink: { bg: ink, fg: '#FFFFFF' },
}

/** Bold status label that springs in, the way results announce themselves. */
function Pill({ at, d = 0, c = 'green', icon = 'check', size = 'lg', children }: { at: [number, number]; d?: number; c?: keyof typeof pill; icon?: keyof typeof Icon; size?: 'lg' | 'md'; children: ReactNode }) {
  const reduce = useMotionPreference()
  return (
    <motion.div className={`absolute z-20 flex items-center gap-2.5 whitespace-nowrap rounded-xl font-display font-extrabold shadow-[0_16px_34px_-12px_rgba(0,0,0,0.55)] ${size === 'lg' ? 'px-4 py-2.5 text-[19px]' : 'px-3 py-2 text-[15px]'}`} style={{ left: at[0], top: at[1], background: pill[c].bg, color: pill[c].fg }} initial={reduce ? false : { scale: 0, opacity: 0, rotate: -8 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ delay: d, type: 'spring', stiffness: 420, damping: 17 }}>
      <Glyph name={icon} size={size === 'lg' ? 22 : 18} stroke={2.6} />{children}
    </motion.div>
  )
}

/** Filter chip, light on the dark stage. */
function Chip({ d = 0, on = false, icon, children }: { d?: number; on?: boolean; icon?: keyof typeof Icon; children: ReactNode }) {
  const reduce = useMotionPreference()
  return (
    <motion.span initial={reduce ? false : { opacity: 0, y: 12, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: d, duration: 0.45, ease }} className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[16px] font-bold ${on ? 'bg-[var(--t)] text-white' : 'border border-ink-border bg-surface text-parchment'}`}>
      {icon && <Glyph name={icon} size={17} />}{children}
    </motion.span>
  )
}

/** A pointer that glides between points and clicks. Points are [x, y, seconds]. */
function Cursor({ path, clicks = [] }: { path: [number, number, number][]; clicks?: [number, number, number][] }) {
  const reduce = useMotionPreference()
  if (reduce) return null
  const total = path[path.length - 1][2] || 1
  const times = path.map(p => p[2] / total)
  return (
    <>
      {clicks.map(([x, y, t]) => (
        <motion.span key={t} className="pointer-events-none absolute z-40 rounded-full border-[3px] border-[var(--t)]" style={{ left: x - 22, top: y - 22, width: 44, height: 44 }} initial={{ scale: 0.2, opacity: 0 }} animate={{ scale: [0.2, 1.35], opacity: [0, 1, 0] }} transition={{ delay: t, duration: 0.55 }} />
      ))}
      <motion.div className="pointer-events-none absolute left-0 top-0 z-50" initial={{ x: path[0][0], y: path[0][1], opacity: 0 }} animate={{ x: path.map(p => p[0]), y: path.map(p => p[1]), opacity: 1 }} transition={{ x: { duration: total, times, ease: 'easeInOut' }, y: { duration: total, times, ease: 'easeInOut' }, opacity: { duration: 0.3 } }}>
        <svg width="34" height="40" viewBox="0 0 24 28" className="drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]"><path d="M2 2l19 11.5-8.2 1.6 4.7 9.4-3.4 1.7-4.7-9.4L2 22.5z" fill="white" stroke="#0F172A" strokeWidth="1.6" strokeLinejoin="round" /></svg>
      </motion.div>
    </>
  )
}

/** Text that types itself in, with a blinking caret. */
function Type({ text, d = 0, cps = 24 }: { text: string; d?: number; cps?: number }) {
  const reduce = useMotionPreference()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (reduce) { setN(text.length); return }
    let id: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      id = setInterval(() => setN(v => { if (v >= text.length) { clearInterval(id); return v } return v + 1 }), 1000 / cps)
    }, d * 1000)
    return () => { clearTimeout(start); if (id) clearInterval(id) }
  }, [text, d, cps, reduce])
  return <>{text.slice(0, n)}<motion.span className="ml-0.5 inline-block h-[0.95em] w-[2px] translate-y-[0.12em] bg-[#0F172A]" animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.9 }} /></>
}

function Roll({ to, d = 0, dur = 1.8, format }: { to: number; d?: number; dur?: number; format: (n: number) => string }) {
  const reduce = useMotionPreference()
  const [v, setV] = useState(0)
  useEffect(() => {
    if (reduce) { setV(to); return }
    const c = animate(0, to, { delay: d, duration: dur, ease: 'easeOut', onUpdate: setV })
    return () => c.stop()
  }, [to, d, dur, reduce])
  return <>{format(v)}</>
}

/** Logo on a white plate: the brand marks are drawn for light backgrounds. */
function Logo({ src, w, h, at, d = 0 }: { src: string; w: number; h: number; at?: [number, number]; d?: number }) {
  return (
    <Pop at={at} d={d} y={-10}>
      <div className="flex items-center justify-center rounded-2xl bg-white px-6 py-4 shadow-[0_22px_44px_-22px_rgba(15,23,42,0.4)] ring-1 ring-black/5"><span className="relative block" style={{ width: w, height: h }}><Image src={src} alt="" fill sizes={`${w}px`} className="object-contain" /></span></div>
    </Pop>
  )
}

/** Search box the cursor types into. */
function Search({ at, w, text, d, button }: { at: [number, number]; w: number; text: string; d: number; button?: string }) {
  return (
    <Pop at={at} d={0.15}>
      <Card className="flex h-[66px] items-center gap-3 pl-5 pr-2.5">
        <span className="text-[#94A3B8]"><Glyph name="search" size={22} /></span>
        <span className="truncate text-[21px] font-semibold" style={{ width: w - (button ? 200 : 120) }}><Type text={text} d={d} /></span>
        <span className="flex h-[48px] min-w-[48px] items-center justify-center rounded-xl bg-[var(--t)] px-4 text-[15px] font-bold text-white">{button ?? <Glyph name="search" size={22} />}</span>
      </Card>
    </Pop>
  )
}

/** One row of a result list. */
function Row({ y, d = 0, mark, markColor, title, sub, right }: { y: number; d?: number; mark: ReactNode; markColor: string; title: string; sub: string; right?: ReactNode }) {
  return (
    <Pop at={[60, y]} d={d} y={16}>
      <Card className="flex h-[64px] w-[440px] items-center gap-3.5 px-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-bold text-white" style={{ background: markColor }}>{mark}</span>
        <span className="min-w-0 flex-1"><b className="block truncate text-[15px]">{title}</b><span className="block truncate text-[12px] text-[#64748B]">{sub}</span></span>
        {right}
      </Card>
    </Pop>
  )
}

/** A list that drifts upward while each row's status pops in. */
function Feed({ rows }: { rows: { t: string; sub: string; c: string; pill: [keyof typeof pill, keyof typeof Icon, string] }[] }) {
  const reduce = useMotionPreference()
  return (
    <motion.div className="absolute inset-0" initial={reduce ? false : { y: 30 }} animate={{ y: -60 }} transition={{ duration: 5, ease: 'linear' }}>
      {rows.map((r, n) => (
        <div key={r.t}>
          <Row y={30 + n * 80} d={0.1 + n * 0.15} mark={r.t[0]} markColor={r.c} title={r.t} sub={r.sub} />
          <Pill at={[478, 40 + n * 80]} d={0.8 + n * 0.5} c={r.pill[0]} icon={r.pill[1]} size="md">{r.pill[2]}</Pill>
        </div>
      ))}
    </motion.div>
  )
}

function Outro({ logo, w, h, line, stats }: { logo: string; w: number; h: number; line: string; stats: [string, string][] }) {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
      <Logo src={logo} w={w} h={h} />
      <Pop d={0.45} className="mt-7"><p className="max-w-[560px] font-display text-[36px] font-extrabold leading-tight tracking-[-0.02em]">{line}</p></Pop>
      <div className="mt-8 flex gap-3">
        {stats.map(([v, l], n) => (
          <Pop key={l} d={0.9 + n * 0.18}><div className="min-w-[150px] rounded-2xl bg-surface px-5 py-3 ring-1 ring-ink-border"><p className="t-ink font-display text-[26px] font-extrabold">{v}</p><p className="text-[12px] text-muted">{l}</p></div></Pop>
        ))}
      </div>
    </div>
  )
}

/* ── KivoraPay ─────────────────────────────── */

const naira = (n: number) => `₦${Math.round(n).toLocaleString('en-US')}`
const coins = [
  { s: '₮', name: 'USDT', net: 'on Solana', c: '#26A17B' },
  { s: '$', name: 'USDC', net: 'on Solana', c: '#2775CA' },
  { s: '₿', name: 'Bitcoin', net: 'on Bitcoin', c: '#F7931A' },
]

function KProblem() {
  return (
    <>
      <Pop at={[60, 56]}><Card className="w-[270px] p-5"><Label>My wallet</Label><p className="mt-1 font-display text-[40px] font-extrabold">120 USDT</p></Card></Pop>
      <Pop at={[390, 56]} d={0.2}><Card className="w-[270px] p-5"><Label>Electricity bill</Label><p className="mt-1 font-display text-[40px] font-extrabold">₦12,500</p><p className="text-[13px] font-bold text-[#EF4444]">Due today</p></Card></Pop>
      <Pill at={[60, 250]} d={0.9} c="red" icon="x">Find a trader</Pill>
      <Pill at={[250, 312]} d={1.5} c="red" icon="x">Agree on a rate</Pill>
      <Pill at={[420, 250]} d={2.1} c="red" icon="x">Wait for the transfer</Pill>
    </>
  )
}

function KAsk() {
  return (
    <>
      <Logo src="/brands/kivorapay.png" w={230} h={56} at={[230, 50]} />
      <Search at={[90, 186]} w={540} text="Pay my electricity bill with USDT" d={0.6} />
      <Cursor path={[[640, 400, 0], [640, 400, 1.6], [590, 220, 2.3], [590, 220, 3.2]]} clicks={[[600, 234, 2.5]]} />
      <div className="absolute left-[90px] top-[290px] flex flex-wrap gap-2.5" style={{ width: 560 }}>
        <Chip d={2.8} icon="bolt">Electricity</Chip>
        <Chip d={2.95}>₮ USDT on Solana</Chip>
        <Chip d={3.1}>₦ Naira balance</Chip>
        <Chip d={3.25} on>Rate shown upfront</Chip>
      </div>
    </>
  )
}

function KFund() {
  const reduce = useMotionPreference()
  return (
    <>
      {coins.map((c, n) => (
        <div key={c.name}>
          <Pop at={[56, 70 + n * 108]} d={n * 0.12} x={-24} y={0}>
            <Card className="flex w-[240px] items-center gap-3.5 p-4"><span className="flex h-12 w-12 items-center justify-center rounded-full text-[22px] font-bold text-white" style={{ background: c.c }}>{c.s}</span><span><b className="block text-[19px]">{c.name}</b><span className="text-[13px] text-[#64748B]">{c.net}</span></span></Card>
          </Pop>
          {!reduce && <motion.span className="absolute z-10 flex h-11 w-11 items-center justify-center rounded-full text-[18px] font-bold text-white shadow-lg" style={{ left: 270, top: 92 + n * 108, background: c.c }} initial={{ x: 0, y: 0, opacity: 0 }} animate={{ x: [0, 90, 170], y: [0, -16, 110 - n * 108], opacity: [0, 1, 0], scale: [1, 1, 0.5] }} transition={{ delay: 0.7 + n * 0.4, duration: 1, ease: 'easeInOut' }}>{c.s}</motion.span>}
        </div>
      ))}
      <Pop at={[400, 110]} d={0.25}>
        <Card className="w-[280px] p-6">
          <Label>Naira balance</Label>
          <p className="mt-2 font-display text-[38px] font-extrabold"><Roll to={248500} d={0.9} dur={2.2} format={naira} /></p>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#E2E8F0]"><motion.div className="h-full bg-[var(--t)]" initial={reduce ? false : { width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.9, duration: 2.2 }} /></div>
          <p className="mt-3 text-[13px] text-[#64748B]">Rate and fees shown before you confirm</p>
        </Card>
      </Pop>
      <Pill at={[452, 312]} d={3.1}>Balance funded!</Pill>
    </>
  )
}

const bills: { name: string; sub: string; icon: keyof typeof Icon; c: string }[] = [
  { name: 'Electricity', sub: 'Prepaid and postpaid meters', icon: 'bolt', c: '#F59E0B' },
  { name: 'Airtime', sub: 'Every network', icon: 'phone', c: '#10B981' },
  { name: 'Data', sub: 'Mobile data bundles', icon: 'wifi', c: '#6366F1' },
  { name: 'Cable TV', sub: 'TV subscriptions', icon: 'tv', c: '#EC4899' },
]

function KPay() {
  return (
    <>
      <Defocus d={1.7}>
        {bills.map((b, n) => (
          <Row key={b.name} y={40 + n * 76} d={0.1 + n * 0.12} mark={<Glyph name={b.icon} />} markColor={b.c} title={b.name} sub={b.sub} right={<span className="rounded-lg bg-[var(--t)] px-3.5 py-2 text-[13px] font-bold text-white">Pay</span>} />
        ))}
      </Defocus>
      <Cursor path={[[620, 380, 0], [462, 70, 1.1], [462, 70, 1.6], [360, 300, 2.4], [360, 300, 3.4]]} clicks={[[452, 72, 1.25], [352, 302, 2.6]]} />
      <Pop at={[190, 110]} d={1.8} s={0.85}>
        <Card className="w-[340px] p-6">
          <Label>Electricity · Prepaid</Label>
          <p className="mt-2 font-display text-[40px] font-extrabold">₦12,500</p>
          <p className="text-[13px] text-[#64748B]">Meter 4501 •••• 2290 · from naira balance</p>
          <div className="mt-5 rounded-xl bg-[var(--t)] py-3.5 text-center text-[16px] font-bold text-white">Pay now</div>
        </Card>
      </Pop>
      <Pill at={[470, 96]} d={3.0}>Paid!</Pill>
      <Pill at={[400, 322]} d={3.4} c="cyan" icon="bolt">Token 5821 4410 9036</Pill>
    </>
  )
}

function KInvoices() {
  return (
    <Feed rows={[
      { t: 'Brand design project', sub: 'Invoice #0142 · $450', c: '#F59E0B', pill: ['green', 'check', 'Paid in USDT!'] },
      { t: 'Website retainer', sub: 'Payment link · $1,200', c: '#8B5CF6', pill: ['cyan', 'send', 'Link shared!'] },
      { t: 'Product photography', sub: 'Invoice #0143 · $300', c: '#EC4899', pill: ['green', 'check', 'Paid in USDC!'] },
      { t: 'Copywriting sprint', sub: 'Invoice #0144 · $650', c: '#10B981', pill: ['amber', 'doc', 'Invoice sent!'] },
      { t: 'App design review', sub: 'Payment link · $380', c: '#3B82F6', pill: ['green', 'check', 'Paid in USDT!'] },
    ]} />
  )
}

function KBusiness() {
  return (
    <>
      <Pop at={[50, 50]}>
        <Card className="w-[330px] p-5">
          <div className="flex items-center justify-between"><Label>My store</Label><span className="rounded-full bg-[#DCFCE7] px-2.5 py-0.5 text-[11px] font-bold text-[#15803D]">Open</span></div>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            {['#F59E0B', '#8B5CF6', '#10B981', '#EC4899', '#3B82F6', '#F97316'].map((c, n) => <Pop key={c} d={0.3 + n * 0.08}><div className="h-[68px] rounded-xl" style={{ background: `linear-gradient(135deg, ${c}, ${c}99)` }} /></Pop>)}
          </div>
          <div className="mt-4 flex items-center justify-between text-[13px]"><span className="text-[#64748B]">Orders, stock and payroll</span><b>One account</b></div>
        </Card>
      </Pop>
      <Pill at={[420, 70]} d={0.9} c="amber" icon="cart">New order!</Pill>
      <Pill at={[440, 146]} d={1.5} icon="check">Cashier code paid!</Pill>
      <Pill at={[420, 222]} d={2.1} c="cyan" icon="doc">Stock updated!</Pill>
      <Pill at={[440, 298]} d={2.7} c="ink" icon="users">Team payroll sent!</Pill>
    </>
  )
}

/* ── Prowess Digital Solutions ─────────────── */

const scattered = [
  { t: 'Job board', at: [44, 46] }, { t: 'Grant website', at: [270, 24] }, { t: 'Free template', at: [500, 50] },
  { t: 'YouTube course', at: [34, 300] }, { t: 'Pricing advice?', at: [272, 352] }, { t: 'Web designer', at: [502, 300] },
] as const

function PProblem() {
  const reduce = useMotionPreference()
  return (
    <>
      {scattered.map((s, n) => (
        <Pop key={s.t} at={[s.at[0], s.at[1]]} d={0.15 + n * 0.12}>
          <motion.div animate={reduce ? undefined : { y: [0, n % 2 ? 9 : -9, 0], rotate: [0, n % 2 ? 2.5 : -2.5, 0] }} transition={{ repeat: Infinity, duration: 3 + n * 0.3 }}>
            <Card className="w-[184px] overflow-hidden"><div className="flex gap-1 border-b border-[#E2E8F0] px-3 py-2">{[0, 1, 2].map(i => <span key={i} className="h-2 w-2 rounded-full bg-[#CBD5E1]" />)}</div><p className="px-3 py-2.5 text-[15px] font-semibold">{s.t}</p></Card>
          </motion.div>
        </Pop>
      ))}
      <Pop at={[296, 150]} d={0.3}>
        <div className="flex h-[128px] w-[128px] items-center justify-center rounded-full bg-[var(--t)] text-center text-[15px] font-extrabold leading-tight text-white shadow-2xl">A founder<br />with an idea</div>
      </Pop>
      <Pill at={[232, 292]} d={2.2} c="red" icon="x" size="md">Help scattered everywhere</Pill>
    </>
  )
}

function PAsk() {
  const reduce = useMotionPreference()
  return (
    <>
      <Logo src="/brands/pds.png" w={250} h={64} at={[220, 36]} />
      <Search at={[90, 180]} w={540} text="How do I price my product?" d={0.6} />
      <Cursor path={[[640, 400, 0], [640, 400, 1.5], [590, 214, 2.1], [590, 214, 2.6], [150, 314, 3.3], [150, 314, 4]]} clicks={[[600, 228, 2.25], [150, 316, 3.45]]} />
      <div className="absolute left-[90px] top-[290px] flex gap-2.5">
        <motion.span initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2.6 }}>
          <motion.span className="inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-[16px] font-bold" initial={reduce ? false : { backgroundColor: 'rgba(47,110,114,0.10)', color: '#0F172A' }} animate={{ backgroundColor: '#2F6E72', color: '#FFFFFF' }} transition={{ delay: 3.5 }}><Glyph name="brief" size={17} />Business</motion.span>
        </motion.span>
        <Chip d={2.75} icon="users">Jobs</Chip>
        <Chip d={2.9} icon="spark">Opportunities</Chip>
        <Chip d={3.05} icon="book">Learning</Chip>
      </div>
      <Pill at={[440, 360]} d={3.8} c="amber" icon="calc" size="md">Pricing tools found!</Pill>
    </>
  )
}

function PDiagnose() {
  const reduce = useMotionPreference()
  const issues = ['Pricing is guesswork', 'No written process', 'Cash runs out mid-month', 'Customers don’t come back']
  return (
    <>
      <Pop at={[56, 40]}>
        <Card className="w-[330px] p-5">
          <Label>Business structure diagnostic</Label>
          <p className="mt-1.5 text-[18px] font-extrabold">What is slowing you down?</p>
          <div className="mt-3 space-y-2">
            {issues.map((t, n) => (
              <motion.div key={t} initial={reduce ? false : { borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }} animate={n < 3 ? { borderColor: '#2F6E72', backgroundColor: '#F0FDFA' } : { borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }} transition={{ delay: 0.75 + n * 0.55 }} className="flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 text-[14px] font-semibold">
                <span className="flex h-5 w-5 items-center justify-center rounded-md border-2 border-[#CBD5E1]">{n < 3 && <motion.span initial={reduce ? false : { scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.75 + n * 0.55 }} className="text-[#2F6E72]"><Glyph name="check" size={14} stroke={3.5} /></motion.span>}</span>{t}
              </motion.div>
            ))}
          </div>
        </Card>
      </Pop>
      <Cursor path={[[330, 420, 0], [80, 138, 0.7], [80, 192, 1.25], [80, 244, 1.8], [80, 244, 2.4]]} clicks={[[84, 140, 0.75], [84, 194, 1.3], [84, 246, 1.85]]} />
      <Pop at={[420, 60]} d={2.3} x={24} y={0}>
        <Card className="w-[250px] p-5">
          <Label>Your next steps</Label>
          {['Cost one product properly', 'Write the first process', 'Track cash every week'].map((t, n) => (
            <Pop key={t} d={2.5 + n * 0.2} y={6}><p className="mt-2.5 flex items-center gap-2 text-[14px] font-semibold"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--t)] font-head text-[11px] text-white">{n + 1}</span>{t}</p></Pop>
          ))}
        </Card>
      </Pop>
      <Pill at={[440, 300]} d={3.3}>Next steps ready!</Pill>
    </>
  )
}

const tools: { t: string; sub: string; icon: keyof typeof Icon; c: string }[] = [
  { t: 'Business health check', sub: 'See where the business stands', icon: 'star', c: '#F59E0B' },
  { t: 'Profit and cashflow tracker', sub: 'Money in, money out, every month', icon: 'calc', c: '#10B981' },
  { t: 'Invoice builder', sub: 'Create and download invoices', icon: 'doc', c: '#6366F1' },
  { t: 'Business plan', sub: 'Done for you by the team', icon: 'brief', c: '#EC4899' },
]

function PTools() {
  return (
    <>
      {tools.map((t, n) => (
        <div key={t.t}>
          <Row y={44 + n * 82} d={0.1 + n * 0.15} mark={<Glyph name={t.icon} />} markColor={t.c} title={t.t} sub={t.sub} right={<span className="rounded-lg bg-[#F1F5F9] px-3 py-1.5 text-[12px] font-bold">Open</span>} />
          <Pill at={[478, 56 + n * 82]} d={0.9 + n * 0.5} c={n === 3 ? 'amber' : 'green'} icon={n === 3 ? 'brief' : 'check'} size="md">{n === 3 ? 'Delivered!' : 'Free to start!'}</Pill>
        </div>
      ))}
    </>
  )
}

function POpportunities() {
  return (
    <Feed rows={[
      { t: 'Business funding', sub: 'Grants and accelerators', c: '#F59E0B', pill: ['amber', 'spark', 'Apply now!'] },
      { t: 'Scholarships', sub: 'Learning and study', c: '#8B5CF6', pill: ['cyan', 'star', 'Saved!'] },
      { t: 'Fellowships', sub: 'Fellowships and placements', c: '#10B981', pill: ['green', 'check', 'Applied!'] },
      { t: 'Jobs', sub: 'CV, interviews and portfolio', c: '#3B82F6', pill: ['amber', 'brief', 'Interview ready!'] },
      { t: 'Events', sub: 'Events and competitions', c: '#EC4899', pill: ['green', 'check', 'Registered!'] },
    ]} />
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

function Merch({ kind, size = 150, d = 0 }: { kind: MerchKind; size?: number; d?: number }) {
  const reduce = useMotionPreference()
  const [x, y] = logoSpot[kind]
  return (
    <svg width={size} height={size} viewBox="0 0 200 200">
      <path d={merchPath[kind]} fill={kind === 'tote' ? '#EFE7D6' : 'var(--t)'} stroke={kind === 'tote' ? '#C9B994' : 'rgba(0,0,0,0.15)'} strokeWidth={kind === 'tote' ? 5 : 2} strokeLinejoin="round" />
      {kind === 'hoodie' && <path d="M80 42 Q100 74 120 42 M76 150 L124 150 L118 172 L82 172 Z" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />}
      <motion.g initial={reduce ? false : { opacity: 0, y: -140, scale: 2.4 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: d, type: 'spring', stiffness: 220, damping: 18 }}>
        <rect x={x - 22} y={y - 15} width="44" height="30" rx="7" fill="var(--a)" />
        <text x={x} y={y + 5} textAnchor="middle" fontSize="12" fontWeight="800" fill="#2A1A4F" fontFamily="system-ui">LOGO</text>
      </motion.g>
    </svg>
  )
}

function DProblem() {
  const parties = [{ t: 'Designer', at: [40, 160] }, { t: 'Printer', at: [270, 160] }, { t: 'Delivery', at: [500, 160] }] as const
  return (
    <>
      <Pop at={[250, 30]}><Card className="w-[220px] p-4 text-center"><Label>Your event</Label><p className="mt-1 font-display text-[30px] font-extrabold">Friday</p></Card></Pop>
      {parties.map((p, n) => (
        <Pop key={p.t} at={[p.at[0], p.at[1]]} d={0.3 + n * 0.2}><Card className="w-[180px] p-5 text-center"><p className="text-[18px] font-extrabold">{p.t}</p><p className="mt-1 text-[12px] text-[#64748B]">Separate supplier</p></Card></Pop>
      ))}
      <Pill at={[40, 270]} d={1.1} c="red" icon="x" size="md">Wrong colour</Pill>
      <Pill at={[280, 300]} d={1.7} c="red" icon="x" size="md">Print delayed</Pill>
      <Pill at={[500, 270]} d={2.3} c="red" icon="x" size="md">Missed the event</Pill>
    </>
  )
}

function DAsk() {
  return (
    <>
      <Logo src="/brands/dritchwear-trim.png" w={280} h={46} at={[200, 46]} />
      <Search at={[70, 176]} w={580} text="200 branded hoodies for our event" d={0.6} button="Get a quote" />
      <Cursor path={[[640, 400, 0], [640, 400, 1.7], [580, 206, 2.4], [580, 206, 3.2]]} clicks={[[584, 210, 2.55]]} />
      <div className="absolute left-[70px] top-[284px] flex flex-wrap gap-2.5" style={{ width: 580 }}>
        <Chip d={2.9} on>Hoodie</Chip>
        <Chip d={3.05}>Embroidery</Chip>
        <Chip d={3.2}>Qty 200</Chip>
        <Chip d={3.35}>Your brand colours</Chip>
      </div>
      <Pill at={[440, 360]} d={3.8} c="amber" icon="chat" size="md">Quote on the way!</Pill>
    </>
  )
}

function DBrand() {
  const items: MerchKind[] = ['tee', 'hoodie', 'cap', 'tote']
  return (
    <>
      {items.map((k, n) => (
        <Pop key={k} at={[34 + n * 168, 86]} d={n * 0.1}>
          <div className="t-soft rounded-3xl p-2"><Merch kind={k} size={148} d={0.6 + n * 0.5} /></div>
          <p className="mt-2 text-center text-[15px] font-bold capitalize">{k === 'tee' ? 'T-shirt' : k}</p>
        </Pop>
      ))}
      <Pill at={[270, 352]} d={2.7} c="amber">Logo placed!</Pill>
    </>
  )
}

function DScale() {
  const reduce = useMotionPreference()
  return (
    <>
      <Pop at={[50, 60]}>
        <p className="font-head text-[12px] font-bold uppercase tracking-[0.16em] text-muted">Bulk ready</p>
        <p className="mt-2 font-display text-[84px] font-extrabold leading-none text-[var(--t)]"><Roll to={10000} d={0.5} dur={2.4} format={n => Math.max(10, Math.round(n)).toLocaleString('en-US')} /></p>
        <p className="mt-2 text-[18px] font-semibold">pieces, from a minimum of 10</p>
      </Pop>
      <div className="absolute grid grid-cols-8 gap-2" style={{ left: 372, top: 54 }}>
        {Array.from({ length: 48 }).map((_, n) => (
          <motion.div key={n} initial={reduce ? false : { opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + n * 0.045, type: 'spring', stiffness: 300, damping: 18 }}>
            <svg width="34" height="34" viewBox="0 0 200 200"><path d={merchPath.tee} fill={n % 5 === 0 ? 'var(--a)' : 'var(--t)'} /></svg>
          </motion.div>
        ))}
      </div>
      <Pill at={[50, 300]} d={2.9} icon="doc">Specs saved for reorders!</Pill>
    </>
  )
}

function DOrders() {
  return (
    <Feed rows={[
      { t: 'Tech conference', sub: 'Event tees and staff wear', c: '#F59E0B', pill: ['cyan', 'check', 'Design approved!'] },
      { t: 'Company onboarding', sub: 'Welcome kits and notebooks', c: '#8B5CF6', pill: ['amber', 'spark', 'In production!'] },
      { t: 'School anniversary', sub: 'Branded polos and caps', c: '#10B981', pill: ['green', 'check', 'Quality checked!'] },
      { t: 'Community launch', sub: 'Hoodies and tote bags', c: '#EC4899', pill: ['green', 'truck', 'Delivered!'] },
      { t: 'Client gifts', sub: 'Flasks and gift boxes', c: '#3B82F6', pill: ['green', 'truck', 'Delivered!'] },
    ]} />
  )
}

/* ── Registry ──────────────────────────────── */

export type Step = { title: string; body: string; scene: number }
export type VentureFilm = { tone: Tone; short: string; title: string; scenes: Scene[]; steps: Step[] }

export const films: Record<string, VentureFilm> = {
  kivorapay: {
    tone: { t: '#1D4ED8', a: '#60A5FA', f: '#1E2D5C' },
    short: 'KivoraPay',
    title: 'From crypto to a paid bill',
    scenes: [
      { key: 'k1', kicker: 'The problem', caption: 'The money is in the wallet. It still can’t pay the bill.', view: () => <KProblem /> },
      { key: 'k2', kicker: 'Ask', caption: 'Open KivoraPay and say what needs paying.', view: () => <KAsk />, ms: 4400 },
      { key: 'k3', kicker: 'Fund', caption: 'Fund a naira balance with USDT, USDC or Bitcoin.', view: () => <KFund /> },
      { key: 'k4', kicker: 'Pay', caption: 'Pick the bill, pay from the balance, get the token.', view: () => <KPay />, ms: 4800 },
      { key: 'k5', kicker: 'Get paid', caption: 'Freelancers send invoices and links. Clients pay in crypto.', view: () => <KInvoices />, ms: 5000 },
      { key: 'k6', kicker: 'Run a business', caption: 'Merchants run a store, orders and payroll from one account.', view: () => <KBusiness /> },
      { key: 'k7', kicker: 'KivoraPay', caption: 'The spending layer for crypto.', view: () => <Outro logo="/brands/kivorapay.png" w={230} h={56} line="Crypto you can actually spend." stats={[['500+', 'registered users'], ['200+', 'transactions'], ['₦1.5M+', 'volume']]} /> },
    ],
    steps: [
      { scene: 2, title: 'Fund a naira balance', body: 'Send USDT or USDC on Solana, or Bitcoin. The rate and fees are shown before anything is confirmed.' },
      { scene: 3, title: 'Pay everyday bills', body: 'Electricity, airtime, data, cable TV, internet, education and travel, paid straight from the balance.' },
      { scene: 4, title: 'Get paid in crypto', body: 'Create an invoice or payment link, share it, and see the payment confirmed automatically.' },
      { scene: 5, title: 'Run the business', body: 'A storefront, orders, inventory, cashier codes and team payroll, all from one account.' },
    ],
  },
  'prowess-digital-solutions': {
    tone: { t: '#2F6E72', a: '#4FB8BD', f: '#1B4447' },
    short: 'PDS',
    title: 'From scattered to structured',
    scenes: [
      { key: 'p1', kicker: 'The problem', caption: 'Good ideas stall when the help is scattered across too many places.', view: () => <PProblem /> },
      { key: 'p2', kicker: 'Ask', caption: 'Start with the question. Prowess points to the right route.', view: () => <PAsk />, ms: 5000 },
      { key: 'p3', kicker: 'Diagnose', caption: 'Pick what is slowing you down. Get the next steps.', view: () => <PDiagnose />, ms: 4800 },
      { key: 'p4', kicker: 'Tools', caption: 'Free tools for the numbers, and done-for-you plans when needed.', view: () => <PTools /> },
      { key: 'p5', kicker: 'Opportunities', caption: 'Funding, scholarships, fellowships, jobs and events in one place.', view: () => <POpportunities />, ms: 5000 },
      { key: 'p6', kicker: 'Prowess Digital Solutions', caption: 'Structure in place of guesswork.', view: () => <Outro logo="/brands/pds.png" w={250} h={64} line="Structure in place of guesswork." stats={[['500+', 'small businesses impacted'], ['200+', 'people trained'], ['10+', 'products and tools']]} /> },
    ],
    steps: [
      { scene: 1, title: 'Choose the goal', body: 'Visitors start with what they are working towards: business, jobs, opportunities or learning.' },
      { scene: 2, title: 'Diagnose the business', body: 'The structure diagnostic turns everyday problems into likely causes and clear next steps.' },
      { scene: 3, title: 'Use the tools', body: 'A business health check, a profit and cashflow tracker and an invoice builder, free to start.' },
      { scene: 4, title: 'Find opportunities', body: 'Funding, scholarships, fellowships, jobs and events, organised in one place.' },
    ],
  },
  dritchwear: {
    tone: { t: '#4A2D82', a: '#F5A70E', f: '#2E1B57' },
    short: 'Dritchwear',
    title: 'Merch people actually keep',
    scenes: [
      { key: 'd1', kicker: 'The problem', caption: 'Design in one place, printing in another, and the delivery misses the event.', view: () => <DProblem /> },
      { key: 'd2', kicker: 'Ask', caption: 'Tell Dritchwear what you need. The quote starts there.', view: () => <DAsk />, ms: 5000 },
      { key: 'd3', kicker: 'Brand it', caption: 'Your logo, colours and design on tees, hoodies, caps, totes and gifts.', view: () => <DBrand />, ms: 4800 },
      { key: 'd4', kicker: 'Scale it', caption: 'From 10 pieces to 10,000. Same quality, every time.', view: () => <DScale />, ms: 4800 },
      { key: 'd5', kicker: 'Deliver it', caption: 'Every order tracked from design to delivery, nationwide.', view: () => <DOrders />, ms: 5000 },
      { key: 'd6', kicker: 'Dritchwear', caption: 'We build merch people actually keep.', view: () => <Outro logo="/brands/dritchwear-trim.png" w={280} h={46} line="We build merch people actually keep." stats={[['500+', 'orders delivered'], ['100+', 'brands served'], ['5.0', 'Google rating']]} /> },
    ],
    steps: [
      { scene: 1, title: 'Ask for a quote', body: 'Customers say what they need, from a team uniform to event kits, and get a quote.' },
      { scene: 2, title: 'Brand any item', body: 'T-shirts, hoodies, varsity jackets, caps, totes, notebooks, flasks and gift sets with the customer’s identity.' },
      { scene: 3, title: 'Produce in bulk', body: 'From 10 to 10,000 pieces, embroidered or printed, with specs kept on file so every reorder matches.' },
      { scene: 4, title: 'Deliver on time', body: 'Nationwide delivery for companies, events, schools, NGOs and creators.' },
    ],
  },
}
