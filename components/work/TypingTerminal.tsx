'use client'

import { motion, useReducedMotion } from 'framer-motion'

type Tool = { id: string; cmd?: string; name: string; summary: string }

// Phones: one terminal with every tool already in it (never an empty box).
// Each command and its result fade in as the terminal scrolls into view, and
// a cursor blinks on the last line.
export default function TypingTerminal({ tools }: { tools: Tool[] }) {
  const reduce = useReducedMotion()
  const line = (n: number) => reduce ? {} : { initial: { opacity: 0, x: -8 }, whileInView: { opacity: 1, x: 0 }, viewport: { once: true, margin: '-40px' }, transition: { delay: n * 0.25, duration: 0.4 } }
  return <div className="overflow-hidden rounded-3xl bg-[#0B0F14] text-[#E7EDF6] shadow-[0_40px_90px_-45px_rgba(17,24,39,.7)]">
    <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
      <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" /><span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" /><span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
      <span className="ml-2 font-head text-[11px] text-white/45">~/tools</span>
    </div>
    <div className="space-y-4 p-4 font-head text-[12px] leading-5">
      {tools.map((t, n) => <motion.div key={t.id} {...line(n * 2)}>
        <p className="break-all"><span className="text-[#28C840]">$</span> {t.cmd}</p>
        <motion.p {...line(n * 2 + 1)} className="mt-1 font-body text-[13px] leading-5 text-white/70"><span className="font-semibold text-white">✓ {t.name}.</span> {t.summary}</motion.p>
      </motion.div>)}
      <p><span className="text-[#28C840]">$</span> <span className="inline-block h-3.5 w-[7px] translate-y-[2px] animate-pulse bg-[#E7EDF6] motion-reduce:animate-none" /></p>
    </div>
  </div>
}
