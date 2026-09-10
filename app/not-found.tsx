import type { Metadata } from 'next'
import Link from 'next/link'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export const metadata: Metadata = { title: 'Page Not Found', description: 'The page you requested could not be found.', robots: { index: false, follow: true } }

export default function NotFound() {
  return <main className="min-h-screen bg-bg">
    <Nav />
    <section className="relative overflow-hidden border-b border-ink-border px-5 pb-20 pt-32 md:px-8 md:pb-28 md:pt-40">
      <div aria-hidden className="absolute left-1/2 top-20 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-blue-100/70 blur-3xl" />
      <div className="relative mx-auto max-w-[1080px]">
        <div className="grid overflow-hidden rounded-[2rem] border border-ink-border bg-white lg:grid-cols-[0.72fr_1.28fr]">
          <div className="flex min-h-64 items-center justify-center bg-primary p-10 text-white lg:min-h-[34rem]"><span className="font-display text-[clamp(6rem,14vw,11rem)] font-extrabold leading-none tracking-[-0.08em]">404</span></div>
          <div className="flex flex-col justify-center p-8 md:p-14">
            <p className="font-head text-xs font-bold uppercase tracking-[0.18em] text-primary">Page not found</p>
            <h1 className="mt-5 max-w-xl font-display text-[clamp(2rem,4vw,3.35rem)] font-extrabold leading-[1.08] tracking-[-0.04em]">This page is not here.</h1>
            <p className="mt-5 max-w-lg text-base leading-8 text-muted">The address may have changed, or the page may no longer exist. You can return home or continue from one of the main sections.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><Link href="/" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-bold text-white transition hover:bg-primary-dim">Return home</Link><Link href="/blog" className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink-border px-7 py-3 text-sm font-bold transition hover:border-primary/40">Read the blog</Link></div>
            <nav aria-label="Helpful pages" className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-ink-border pt-7 text-sm font-semibold"><Link href="/about" className="hover:text-primary">About</Link><Link href="/services" className="hover:text-primary">Services</Link><Link href="/media" className="hover:text-primary">Media</Link><Link href="/#contact" className="hover:text-primary">Contact</Link></nav>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </main>
}
