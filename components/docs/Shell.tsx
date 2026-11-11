'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { highlight } from './highlight'

/*
 * The docs terminal. Commands run for real: `relay` and `curl` call the Relay
 * API on this site, `docs` moves between pages, and the Hardhat commands from
 * the smart contract guide print what Hardhat prints.
 */

const KEY = 'sk_test_relay_4eC39HqLyjWD'

type Line = { kind: 'in' | 'out' | 'err' | 'ok' | 'dim' | 'json'; text: string }
type ShellApi = { run: (cmd: string) => void; open: () => void }

const ShellContext = createContext<ShellApi>({ run: () => {}, open: () => {} })
export const useShell = () => useContext(ShellContext)

const COMMANDS = ['help', 'relay', 'curl', 'docs', 'ls', 'clear', 'echo', 'export', 'env', 'history', 'whoami', 'date', 'npx']
const RELAY_SUB = ['pay', 'status', 'refund', 'key', 'help']

/** Splits a command line like a shell: quotes, escapes and backslash line breaks. */
function tokenize(input: string) {
  const out: string[] = []
  let cur = ''
  let quote: string | null = null
  let started = false
  const s = input.replace(/\\\r?\n/g, ' ')
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (quote) { if (c === quote) quote = null; else if (c === '\\' && quote === '"' && i + 1 < s.length) cur += s[++i]; else cur += c; continue }
    if (c === '"' || c === "'") { quote = c; started = true; continue }
    if (/\s/.test(c)) { if (started) { out.push(cur); cur = ''; started = false } continue }
    if (c === '\\' && i + 1 < s.length) { cur += s[++i]; started = true; continue }
    cur += c
    started = true
  }
  if (started) out.push(cur)
  return out
}

export function ShellProvider({ go, pages, children }: { go: (id: string) => void; pages: { id: string; title: string }[]; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [lines, setLines] = useState<Line[]>([
    { kind: 'dim', text: 'Relay sandbox terminal. Your test key is saved as $RELAY_SECRET_KEY.' },
    { kind: 'dim', text: 'Try  relay pay 5000 NGN  then  relay status $LAST --watch.  Type help for everything else.' },
  ])
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const history = useRef<string[]>([])
  const cursor = useRef(-1)
  const env = useRef<Record<string, string>>({ RELAY_SECRET_KEY: KEY, LAST: '', PAYMENT_ID: '', BASE: '' })
  useEffect(() => { env.current.BASE = `${window.location.origin}/api/relay` }, [])
  const stop = useRef(false)
  const input = useRef<HTMLInputElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const queue = useRef<string | null>(null)

  // Set when a command prints an error or gets a 4xx/5xx, so a && chain stops like a shell.
  const failed = useRef(false)
  const print = useCallback((...ls: Line[]) => {
    if (ls.some(l => l.kind === 'err')) failed.current = true
    setLines(prev => [...prev, ...ls].slice(-400))
  }, [])

  useEffect(() => { scroller.current?.scrollTo({ top: scroller.current.scrollHeight }) }, [lines, open])

  const call = useCallback(async (method: string, path: string, opts: { headers?: Record<string, string>; body?: string } = {}) => {
    const res = await fetch(`/api/relay${path}`, { method, headers: opts.headers, body: opts.body })
    const text = await res.text()
    let json: unknown = text
    try { json = JSON.parse(text) } catch { /* not JSON */ }
    return { status: res.status, statusText: res.statusText, json }
  }, [])

  const show = useCallback((r: { status: number; json: unknown }) => {
    print({ kind: r.status < 300 ? 'ok' : 'err', text: `HTTP ${r.status}` }, { kind: 'json', text: typeof r.json === 'string' ? r.json : JSON.stringify(r.json, null, 2) })
    const id = (r.json as { id?: string })?.id
    if (r.status < 300 && id?.startsWith('pay_')) {
      env.current.LAST = id
      env.current.PAYMENT_ID = id
      print({ kind: 'dim', text: 'Saved as $LAST and $PAYMENT_ID.' })
    }
  }, [print])

  const auth = () => ({ Authorization: `Bearer ${env.current.RELAY_SECRET_KEY}` })
  const wait = (ms: number) => new Promise(r => setTimeout(r, ms))

  const execute = useCallback(async (raw: string) => {
    const line = raw.replace(/\$\{?([A-Z_]+)\}?/g, (_, v) => env.current[v] ?? '')
    const [cmd, ...args] = tokenize(line)
    if (!cmd) return
    const flag = (name: string) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined }

    switch (cmd) {
      case 'help':
        print({ kind: 'out', text: [
          'relay pay <amount> <currency> [--ref <reference>]   Create a payment',
          'relay status <id> [--watch]                         Retrieve a payment, or follow it until it settles',
          'relay refund <id> [--amount <n>]                    Refund a settled payment',
          'relay key                                           Show the API key in use',
          'curl <url> [-X METHOD] [-H header] [-d data]        Call the API directly',
          'docs <page>   ls                                    Open a docs page, list pages',
          'export NAME=value   echo   env   history   clear',
          'npx hardhat compile | test | run scripts/deploy.js --network testnet',
          '',
          'Amounts are in the smallest unit: 5000 NGN is NGN 50.00. Currencies: NGN, USD, GHS, KES.',
        ].join('\n') })
        return
      case 'clear': setLines([]); return
      case 'whoami': print({ kind: 'out', text: 'guest (sandbox)' }); return
      case 'date': print({ kind: 'out', text: new Date().toString() }); return
      case 'echo': print({ kind: 'out', text: args.join(' ') }); return
      case 'env': print({ kind: 'out', text: Object.entries(env.current).map(([k, v]) => `${k}=${v}`).join('\n') }); return
      case 'history': print({ kind: 'out', text: history.current.map((h, n) => `${String(n + 1).padStart(4)}  ${h}`).join('\n') }); return
      case 'export': {
        const m = args.join(' ').match(/^([A-Z_]+)=(.*)$/)
        if (!m) { print({ kind: 'err', text: 'usage: export NAME=value' }); return }
        env.current[m[1]] = m[2]
        return
      }
      case 'ls': print({ kind: 'out', text: pages.map(p => `${p.id.padEnd(16)} ${p.title}`).join('\n') }); return
      case 'docs': case 'open': {
        const p = pages.find(x => x.id === args[0])
        if (!p) { print({ kind: 'err', text: `docs: no page called "${args[0] ?? ''}". Type ls to see them.` }); return }
        print({ kind: 'dim', text: `Opening ${p.title}` })
        go(p.id)
        return
      }
      case 'relay': {
        const [sub, a, b] = args
        if (!sub || sub === 'help') return execute('help')
        if (sub === 'key') { print({ kind: 'out', text: env.current.RELAY_SECRET_KEY || '(not set)' }); return }
        if (sub === 'pay') {
          if (!a) { print({ kind: 'err', text: 'usage: relay pay <amount> <currency> [--ref <reference>]' }); return }
          const ref = flag('--ref')
          const body = new URLSearchParams({ amount: a, currency: b ?? '', ...(ref ? { reference: ref } : {}) }).toString()
          show(await call('POST', '/v1/payments', { headers: { ...auth(), 'Content-Type': 'application/x-www-form-urlencoded' }, body }))
          return
        }
        if (sub === 'status' || sub === 'get') {
          if (!a) { print({ kind: 'err', text: 'usage: relay status <id> [--watch]' }); return }
          if (!args.includes('--watch')) { show(await call('GET', `/v1/payments/${a}`, { headers: auth() })); return }
          stop.current = false
          let last = ''
          print({ kind: 'dim', text: 'Watching. Press Ctrl+C to stop.' })
          for (let n = 0; n < 20 && !stop.current; n++) {
            const r = await call('GET', `/v1/payments/${a}`, { headers: auth() })
            if (r.status >= 300) { show(r); return }
            const st = (r.json as { status: string }).status
            if (st !== last) { print({ kind: st === 'settled' ? 'ok' : 'out', text: `${new Date().toLocaleTimeString()}  ${st}` }); last = st }
            if (st === 'settled') { print({ kind: 'dim', text: 'Settled. You can refund it now: relay refund $LAST' }); return }
            await wait(1500)
          }
          return
        }
        if (sub === 'refund') {
          if (!a) { print({ kind: 'err', text: 'usage: relay refund <id> [--amount <n>]' }); return }
          const amount = flag('--amount')
          show(await call('POST', `/v1/payments/${a}/refund`, { headers: { ...auth(), 'Content-Type': 'application/x-www-form-urlencoded' }, body: amount ? `amount=${amount}` : '' }))
          return
        }
        print({ kind: 'err', text: `relay: unknown command "${sub}". Try relay help.` })
        return
      }
      case 'curl': {
        let method = ''
        const headers: Record<string, string> = {}
        const data: string[] = []
        let url = ''
        for (let i = 0; i < args.length; i++) {
          const t = args[i]
          if (t === '-X' || t === '--request') method = args[++i] ?? ''
          else if (t === '-H' || t === '--header') { const h = args[++i] ?? ''; const at = h.indexOf(':'); if (at > 0) headers[h.slice(0, at).trim()] = h.slice(at + 1).trim() }
          else if (t === '-d' || t === '--data' || t === '--data-raw' || t === '--data-urlencode') data.push(args[++i] ?? '')
          else if (t === '-u' || t === '--user') headers.Authorization = `Bearer ${(args[++i] ?? '').replace(/:$/, '')}`
          else if (t.startsWith('-')) continue
          else url = t
        }
        const path = url.match(/\/api\/relay(\/[^\s?#]*)/)?.[1] ?? url.match(/^\/?(v1\/[^\s?#]*)/)?.[1]?.replace(/^/, '/')
        if (!url) { print({ kind: 'err', text: 'curl: no URL specified. Try: curl $BASE/v1/payments/$LAST -H "Authorization: Bearer $RELAY_SECRET_KEY"' }); return }
        if (!path) { print({ kind: 'err', text: `curl: (6) This terminal only reaches the Relay API: ${window.location.origin}/api/relay/v1/...` }); return }
        const body = data.length ? (data[0].trim().startsWith('{') ? data[0] : data.join('&')) : undefined
        if (body && !Object.keys(headers).some(h => h.toLowerCase() === 'content-type')) headers['Content-Type'] = body.startsWith('{') ? 'application/json' : 'application/x-www-form-urlencoded'
        show(await call(method || (body ? 'POST' : 'GET'), path, { headers, body }))
        return
      }
      case 'npx': {
        if (args[0] !== 'hardhat') { print({ kind: 'err', text: `npx: only hardhat is installed in this project` }); return }
        const sub = args[1]
        if (sub === 'compile') { await wait(700); print({ kind: 'out', text: 'Compiled 1 Solidity file successfully (evm target: paris).' }); return }
        if (sub === 'test') {
          await wait(500)
          print({ kind: 'out', text: '\n  Counter' })
          await wait(600); print({ kind: 'ok', text: '    ✔ increases by one (38ms)' })
          print({ kind: 'out', text: '\n  1 passing (412ms)' })
          return
        }
        if (sub === 'run') {
          if (!args.includes('--network')) { print({ kind: 'err', text: 'Error: no --network given. Deploying to the in-memory network, which disappears when this command ends. Add --network testnet.' }); return }
          await wait(1200)
          const addr = '0x' + Array.from({ length: 40 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('')
          print({ kind: 'out', text: `Counter deployed to ${addr}` })
          return
        }
        print({ kind: 'err', text: 'usage: npx hardhat compile | test | run scripts/deploy.js --network testnet' })
        return
      }
      default:
        print({ kind: 'err', text: `command not found: ${cmd}. Type help to see what you can run.` })
    }
  }, [call, go, pages, print, show])

  const submit = useCallback(async (raw: string) => {
    const cmd = raw.trim()
    print({ kind: 'in', text: raw })
    setValue('')
    if (!cmd) return
    history.current = [...history.current, cmd].slice(-100)
    cursor.current = -1
    setBusy(true)
    // Commands chained with && run in order, the way a shell would.
    try {
      for (const part of cmd.split('&&')) {
        failed.current = false
        await execute(part.trim())
        if (failed.current) break
      }
    } catch (e) { print({ kind: 'err', text: `error: ${(e as Error).message}` }) }
    setBusy(false)
    input.current?.focus()
  }, [execute, print])

  const run = useCallback((cmd: string) => {
    setOpen(true)
    if (busy) { queue.current = cmd; return }
    submit(cmd)
  }, [busy, submit])

  useEffect(() => { if (!busy && queue.current) { const q = queue.current; queue.current = null; submit(q) } }, [busy, submit])

  useEffect(() => { if (open) setTimeout(() => input.current?.focus(), 250) }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === '`' && e.ctrlKey) { e.preventDefault(); setOpen(o => !o) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !busy) submit(value)
    else if (e.key === 'c' && e.ctrlKey) { stop.current = true; if (!busy) { print({ kind: 'in', text: `${value}^C` }); setValue('') } }
    else if (e.key === 'ArrowUp') { e.preventDefault(); const h = history.current; if (!h.length) return; cursor.current = cursor.current < 0 ? h.length - 1 : Math.max(0, cursor.current - 1); setValue(h[cursor.current]) }
    else if (e.key === 'ArrowDown') { e.preventDefault(); const h = history.current; if (cursor.current < 0) return; cursor.current = cursor.current + 1; if (cursor.current >= h.length) { cursor.current = -1; setValue('') } else setValue(h[cursor.current]) }
    else if (e.key === 'Tab') {
      e.preventDefault()
      const parts = value.split(' ')
      const last = parts[parts.length - 1]
      const pool = parts.length === 1 ? COMMANDS : parts[0] === 'relay' && parts.length === 2 ? RELAY_SUB : parts[0] === 'docs' ? pages.map(p => p.id) : ['$LAST', '$RELAY_SECRET_KEY']
      const hit = pool.filter(c => c.startsWith(last))
      if (hit.length === 1) { parts[parts.length - 1] = hit[0]; setValue(parts.join(' ') + ' ') }
      else if (hit.length > 1) print({ kind: 'dim', text: hit.join('   ') })
    }
  }

  const suggestions = ['relay pay 5000 NGN', 'relay status $LAST --watch', 'relay refund $LAST', 'help']

  return (
    <ShellContext.Provider value={{ run, open: () => setOpen(true) }}>
      {children}
      <AnimatePresence>
        {!open && (
          <motion.button key="pill" type="button" onClick={() => setOpen(true)} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            className="fixed bottom-5 right-5 z-[80] flex items-center gap-2.5 rounded-full bg-[#0B0F14] py-2.5 pl-3 pr-4 font-head text-[0.8rem] font-semibold text-white shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] ring-1 ring-white/10 transition hover:-translate-y-0.5">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-[#4ADE80]/15 text-[#4ADE80]">{'>_'}</span>Terminal<kbd className="hidden rounded border border-white/15 px-1.5 text-[0.62rem] text-white/50 sm:inline">Ctrl `</kbd>
          </motion.button>
        )}
        {open && (
          <motion.section key="dock" aria-label="Terminal" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-x-0 bottom-0 z-[80] flex h-[62vh] flex-col border-t border-white/10 bg-[#0B0F14] text-[#E7EDF6] shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.5)] md:h-[46vh]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
              {['#FF5F57', '#FEBC2E', '#28C840'].map(c => <span key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />)}
              <span className="ml-2 font-head text-[0.72rem] text-white/50">relay-sandbox — bash</span>
              <div className="ml-4 hidden gap-1.5 overflow-x-auto md:flex">
                {suggestions.map(s => <button key={s} type="button" onClick={() => run(s)} className="whitespace-nowrap rounded-md bg-white/5 px-2 py-1 font-head text-[0.68rem] text-white/70 transition hover:bg-white/10 hover:text-white">{s}</button>)}
              </div>
              <button type="button" onClick={() => setLines([])} className="ml-auto rounded px-2 py-1 text-[0.72rem] text-white/50 hover:text-white">Clear</button>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close terminal" className="rounded px-2 py-1 text-[0.72rem] text-white/50 hover:text-white">Close ✕</button>
            </div>
            <div ref={scroller} onClick={() => input.current?.focus()} className="flex-1 overflow-y-auto px-4 py-3 font-head text-[0.8rem] leading-6">
              {lines.map((l, n) => (
                <div key={n} className={`whitespace-pre-wrap break-words ${l.kind === 'err' ? 'text-[#F87171]' : l.kind === 'ok' ? 'text-[#4ADE80]' : l.kind === 'dim' ? 'text-white/45' : 'text-white/85'}`}>
                  {l.kind === 'in' ? <><span className="text-[#4ADE80]">guest@relay</span><span className="text-white/40">:~$ </span>{l.text}</> : l.kind === 'json' ? highlight(l.text) : l.text}
                </div>
              ))}
              <div className="flex items-center">
                <span className="shrink-0"><span className="text-[#4ADE80]">guest@relay</span><span className="text-white/40">:~$&nbsp;</span></span>
                <input ref={input} value={value} onChange={e => setValue(e.target.value)} onKeyDown={onKeyDown} spellCheck={false} autoCapitalize="off" autoComplete="off" aria-label="Command"
                  className="min-w-0 flex-1 bg-transparent text-white caret-[#4ADE80] outline-none" placeholder={busy ? 'running…' : ''} />
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </ShellContext.Provider>
  )
}
