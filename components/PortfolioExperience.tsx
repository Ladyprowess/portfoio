'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'

const roles = [
  { key: 'product', label: 'Product marketing', title: 'I help products make sense to the people they are built for.', body: 'Positioning, product messaging, launch campaigns, onboarding, customer education, and go-to-market support—especially for fintech, payments, and Web3.', tools: ['Positioning', 'Launch strategy', 'User education', 'Campaigns'] },
  { key: 'writing', label: 'Technical writing', title: 'I turn difficult subjects into content people can follow.', body: 'Documentation, explainers, SEO articles, help content, and product guides that reduce confusion without removing the important details.', tools: ['Documentation', 'SEO content', 'Tutorials', 'Product copy'] },
  { key: 'web', label: 'WordPress design', title: 'I design websites around the user journey, not decoration.', body: 'Responsive WordPress and Elementor websites with clear structure, useful pages, clean content hierarchy, and practical conversion paths.', tools: ['WordPress', 'Elementor', 'UX structure', 'Landing pages'] },
  { key: 'education', label: 'Education & AI', title: 'I teach technology and use AI as a practical production tool.', body: 'Web3 education and training, plus AI-supported workflows for writing, research, visual design, and video production.', tools: ['Web3 education', 'Training', 'AI writing', 'AI design & video'] },
  { key: 'business', label: 'Business building', title: 'I build ideas into systems people can actually run.', body: 'Offer development, digital tools, business processes, founder strategy, and hands-on execution across the ventures I own and support.', tools: ['Business strategy', 'Digital systems', 'Operations', 'Founder support'] },
]

const projects = [
  { name: 'KivoraPay', type: 'Fintech product', image: '/brands/kivorapay.png', colour: 'bg-[#EAFBF5]', summary: 'A spending layer that lets people use crypto for everyday bills and merchant payments.', work: ['Product strategy', 'Messaging', 'User flows', 'Go-to-market'], href: 'https://kivorapay.com/' },
  { name: 'Prowess Digital Solutions', type: 'Business education', image: '/brands/pds.png', colour: 'bg-[#EDF5F5]', summary: 'Practical tools and training that help small businesses replace guesswork with structure.', work: ['Founder', 'Digital tools', 'Training', 'Content systems'], href: 'https://www.prowessdigitalsolutions.com' },
  { name: 'Dritchwear', type: 'Commerce & merchandise', image: '/brands/dritchwear.png', colour: 'bg-[#F3F0EC]', summary: 'A men’s streetwear and custom merchandise business built for individuals, companies, and events.', work: ['Brand strategy', 'E-commerce', 'Marketing', 'Operations'], href: 'https://app.dritchwear.com/shop' },
  { name: 'CustomersChain', type: 'Crypto content', image: '/brands/customerschain.png', colour: 'bg-[#EEF3FA]', summary: 'Product education, campaigns, and SEO content for a relationship-led crypto OTC desk.', work: ['Technical content', 'SEO', 'Campaigns', 'Email'], href: 'https://customerschain.com/' },
]

const brands = ['/brands/txfusion.png', '/brands/cwallet.png', '/brands/BF.svg', '/brands/writechtechhub.webp', '/brands/cointime.png']

export default function PortfolioExperience() {
  const [role, setRole] = useState(roles[0])
  const [project, setProject] = useState<(typeof projects)[0] | null>(null)

  return <main className="min-h-screen bg-bg text-parchment">
    <nav className="sticky top-0 z-50 border-b border-ink-border bg-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center justify-between px-5 md:px-8">
        <a href="#top" className="font-display text-base font-bold tracking-[-0.02em]">Lady Prowess<span className="text-primary">.</span></a>
        <div className="hidden items-center gap-7 text-sm text-muted md:flex"><a href="#expertise" className="hover:text-parchment">Expertise</a><a href="#work" className="hover:text-parchment">Work</a><a href="/about" className="hover:text-parchment">About</a><a href="/blog" className="hover:text-parchment">Writing</a></div>
        <a href="mailto:hello@ladyprowess.com" className="rounded-full bg-parchment px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary">Start a conversation</a>
      </div>
    </nav>

    <section id="top" className="mx-auto max-w-[1240px] px-5 pb-20 pt-16 md:px-8 md:pb-28 md:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_.88fr]">
        <div>
          <div className="mb-6 flex items-center gap-2 text-sm text-muted"><span className="h-2 w-2 rounded-full bg-[#84CC16]" />Available for selected projects</div>
          <h1 className="max-w-3xl font-display text-[clamp(2.7rem,5.3vw,4.8rem)] font-semibold leading-[1.04] tracking-[-0.055em]">I connect products, content and business.</h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-muted md:text-lg">I’m Ngozi Peace Okafor—a product marketer, technical writer, WordPress designer, Web3 educator, and founder. I make complex ideas clear enough to use, market, and grow.</p>
          <div className="mt-9 flex flex-wrap gap-3"><a href="#work" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dim">Explore my work</a><a href="https://drive.google.com/file/d/1qWDoVGKY3sps03fPbmNgCeR0FpPj7A0c/view?usp=sharing" target="_blank" className="rounded-full border border-ink-border bg-white px-6 py-3 text-sm font-semibold hover:border-slate">View résumé ↗</a></div>
          <div className="mt-12 grid max-w-xl grid-cols-3 border-t border-ink-border pt-6"><div><strong className="block font-display text-xl">9+</strong><span className="text-xs text-muted">Years building</span></div><div><strong className="block font-display text-xl">200+</strong><span className="text-xs text-muted">People trained</span></div><div><strong className="block font-display text-xl">3</strong><span className="text-xs text-muted">Ventures founded</span></div></div>
        </div>
        <div className="relative mx-auto w-full max-w-[460px]">
          <div className="absolute -left-5 -top-5 h-full w-full rounded-[2rem] border border-primary/20 bg-primary/5" />
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-surface-2"><Image src="/personal%20photo/headshot1.png" alt="Ngozi Peace Okafor" fill priority className="object-cover object-top" /></div>
          <div className="absolute -bottom-5 -left-4 rounded-2xl border border-ink-border bg-white p-4 shadow-[0_16px_45px_rgba(17,24,39,.12)]"><p className="font-head text-[10px] uppercase tracking-wider text-muted">Currently building</p><p className="mt-1 text-sm font-semibold">KivoraPay · Prowess · Dritchwear</p></div>
        </div>
      </div>
    </section>

    <section id="expertise" className="border-y border-ink-border bg-white py-20 md:py-24">
      <div className="mx-auto max-w-[1240px] px-5 md:px-8">
        <div className="mb-10 max-w-xl"><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">How I work</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-.035em] md:text-4xl">One person. Different ways to solve the problem.</h2></div>
        <div className="overflow-hidden rounded-3xl border border-ink-border bg-bg lg:grid lg:grid-cols-[.82fr_1.18fr]">
          <div className="flex gap-2 overflow-x-auto border-b border-ink-border p-3 lg:block lg:border-b-0 lg:border-r lg:p-3">{roles.map((item, i) => <button key={item.key} onClick={() => setRole(item)} className={`min-w-max rounded-xl px-4 py-3 text-left text-sm transition lg:flex lg:w-full lg:items-center lg:gap-4 lg:px-5 lg:py-4 ${role.key === item.key ? 'bg-parchment font-semibold text-white shadow-sm' : 'text-muted hover:bg-white hover:text-parchment'}`}><span className="hidden font-head text-[10px] opacity-50 lg:inline">0{i + 1}</span>{item.label}</button>)}</div>
          <div className="min-h-[360px] p-7 md:p-12"><AnimatePresence mode="wait"><motion.div key={role.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .2 }}><p className="font-head text-[11px] uppercase tracking-wider text-primary">Selected expertise</p><h3 className="mt-5 max-w-2xl font-display text-2xl font-semibold leading-tight tracking-[-.03em] md:text-4xl">{role.title}</h3><p className="mt-5 max-w-2xl leading-7 text-muted">{role.body}</p><div className="mt-8 flex flex-wrap gap-2">{role.tools.map(tool => <span key={tool} className="rounded-full border border-ink-border bg-white px-4 py-2 text-xs font-medium text-slate">{tool}</span>)}</div></motion.div></AnimatePresence></div>
        </div>
      </div>
    </section>

    <section id="work" className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28">
      <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Selected work</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-[-.035em] md:text-4xl">Built, not only discussed.</h2></div><p className="max-w-md text-sm leading-6 text-muted">Select a project to see what I worked on and how the different parts of my experience came together.</p></div>
      <div className="grid gap-5 md:grid-cols-2">{projects.map(item => <button key={item.name} onClick={() => setProject(item)} className="group overflow-hidden rounded-3xl border border-ink-border bg-white text-left transition hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_18px_45px_rgba(17,24,39,.08)]"><div className={`flex h-48 items-center justify-center ${item.colour}`}><Image src={item.image} alt={`${item.name} logo`} width={190} height={80} className="max-h-16 max-w-[190px] object-contain transition duration-300 group-hover:scale-105" /></div><div className="p-6"><div className="flex items-center justify-between"><span className="font-head text-[10px] uppercase tracking-wider text-muted">{item.type}</span><span className="text-primary">↗</span></div><h3 className="mt-3 font-display text-xl font-semibold">{item.name}</h3><p className="mt-2 text-sm leading-6 text-muted">{item.summary}</p></div></button>)}</div>
    </section>

    <section className="border-y border-ink-border bg-white py-14"><div className="mx-auto max-w-[1240px] px-5 md:px-8"><p className="text-center font-head text-[10px] uppercase tracking-[.14em] text-muted">Work connected to teams across fintech, Web3 and technology</p><div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-5">{brands.map(src => <div key={src} className="flex h-20 items-center justify-center rounded-2xl border border-ink-border bg-bg p-5"><Image src={src} alt="Client brand" width={120} height={42} className="max-h-8 max-w-[110px] object-contain" /></div>)}</div></div></section>

    <section className="mx-auto max-w-[1240px] px-5 py-20 md:px-8 md:py-28"><div className="grid overflow-hidden rounded-3xl bg-parchment text-white md:grid-cols-[1.2fr_.8fr]"><div className="p-8 md:p-14"><p className="font-head text-[10px] uppercase tracking-wider text-blue-300">Have something to build?</p><h2 className="mt-4 max-w-xl font-display text-3xl font-semibold tracking-[-.04em] md:text-4xl">Tell me what feels unclear. We can start there.</h2><p className="mt-5 max-w-lg leading-7 text-white/65">Products, websites, technical content, education, AI workflows, or business systems.</p></div><div className="flex items-end border-t border-white/10 p-8 md:border-l md:border-t-0 md:p-14"><a href="mailto:hello@ladyprowess.com" className="w-full rounded-full bg-white px-6 py-4 text-center text-sm font-semibold text-parchment hover:bg-blue-50">hello@ladyprowess.com</a></div></div></section>

    <footer className="border-t border-ink-border py-8"><div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between md:px-8"><span>© 2026 Ngozi Peace Okafor</span><div className="flex gap-5"><a href="https://www.linkedin.com/in/peace-ngozi-okafor">LinkedIn</a><a href="https://x.com/ladyprowess">X</a><a href="https://www.instagram.com/ladyprowess_">Instagram</a></div></div></footer>

    <AnimatePresence>{project && <motion.div className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/30 p-3 backdrop-blur-sm md:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setProject(null)}><motion.div role="dialog" aria-modal="true" initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} onClick={e => e.stopPropagation()} className="w-full max-w-xl rounded-3xl bg-white p-7 shadow-2xl md:p-9"><div className="flex items-start justify-between"><div><p className="font-head text-[10px] uppercase tracking-wider text-primary">{project.type}</p><h3 className="mt-2 font-display text-3xl font-semibold tracking-[-.035em]">{project.name}</h3></div><button onClick={() => setProject(null)} className="rounded-full bg-surface-2 px-3 py-2 text-sm text-muted hover:text-parchment">Close</button></div><p className="mt-5 leading-7 text-muted">{project.summary}</p><p className="mt-7 text-xs font-semibold uppercase tracking-wider">My work</p><div className="mt-3 flex flex-wrap gap-2">{project.work.map(item => <span key={item} className="rounded-full border border-ink-border px-4 py-2 text-xs">{item}</span>)}</div><a href={project.href} target="_blank" className="mt-8 block rounded-full bg-primary px-6 py-3 text-center text-sm font-semibold text-white">Visit project ↗</a></motion.div></motion.div>}</AnimatePresence>
  </main>
}
