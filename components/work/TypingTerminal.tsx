'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

type Tool = { id: string; cmd?: string; name: string; summary: string }

// Phones: one terminal where each command types itself out, then prints what
// the tool does, one after another, then starts again. Plays while on screen.
export default function TypingTerminal({ tools }: { tools: Tool[] }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { margin: '-60px' })
  const [step, setStep] = useState(0)        // which tool is typing
  const [chars, setChars] = useState(0)      // characters of its command typed

  useEffect(() => {
    if (reduce) { setStep(tools.length); return }
    if (!inView) return
    const cmd = tools[step]?.cmd ?? ''
    let t: number
    if (step >= tools.length) t = window.setTimeout(() => { setStep(0); setChars(0) }, 3500)
    else if (chars < cmd.length) t = window.setTimeout(() => setChars(c => c + 1), 45)
    else t = window.setTimeout(() => { setStep(s => s + 1); setChars(0) }, 1600)
    return () => window.clearTimeout(t)
  }, [step, chars, inView, reduce, tools])

  return <div ref={ref} className="overflow-hidden rounded-3xl bg-[#0B0F14] text-[#E7EDF6] shadow-[0_40px_90px_-45px_rgba(17,24,39,.7)]">
    <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
      <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
      <span className="ml-2 font-head text-[11px] text-white/45">~/tools</span>
    </div>
    <div className="min-h-[300px] space-y-4 p-4 font-head text-[12px] leading-5">
      {tools.map((t, n) => {
        if (n > step) return null
        const typing = n === step
        const cmd = t.cmd ?? ''
        return <div key={t.id}>
          <p className="break-all"><span className="text-[#28C840]">$</span> {typing ? cmd.slice(0, chars) : cmd}{typing && <span className="ml-0.5 inline-block h-3.5 w-[7px] translate-y-[2px] animate-pulse bg-[#E7EDF6]" />}</p>
          {!typing && <p className="mt-1 font-body text-[13px] leading-5 text-white/70"><span className="font-semibold text-white">✓ {t.name}.</span> {t.summary}</p>}
        </div>
      })}
    </div>
  </div>
}
