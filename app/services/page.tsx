import Nav from '@/components/Nav'
import ServiceProof from '@/components/ServiceProof'
import CaseStudies from '@/components/CaseStudies'
import CTABanner from '@/components/CTABanner'
import Footer from '@/components/Footer'

export const metadata = { title: 'Services | Lady Prowess', description: 'Product marketing, copywriting, technical writing, WordPress design, Web3 education, business strategy, and practical AI work.' }

export default function ServicesPage() {
  return <main className="bg-bg"><Nav /><section className="mx-auto max-w-[1240px] px-5 pb-14 pt-32 md:px-8 md:pb-20 md:pt-40"><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">Services and case studies</p><h1 className="mt-4 max-w-4xl font-display text-[clamp(2.5rem,5vw,4.6rem)] font-semibold leading-[1.05] tracking-[-.055em]">Strategy, words, websites, and education that people can use.</h1><p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg">I support products and growing businesses with clear positioning, useful content, thoughtful websites, and practical learning experiences.</p></section><ServiceProof /><CaseStudies /><CTABanner /><Footer /></main>
}
