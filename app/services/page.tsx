import Nav from '@/components/Nav'
import ServiceProof from '@/components/ServiceProof'
import CaseStudies from '@/components/CaseStudies'
import CTABanner from '@/components/CTABanner'
import Footer from '@/components/Footer'

export const metadata = { title: 'Work', description: 'Explore product communication, content strategy, technical writing, WordPress design, Web3 education, and practical digital work by Lady Prowess.', alternates: { canonical: '/services' }, openGraph: { title: 'Work | Lady Prowess', description: 'Explore product communication, writing, WordPress design, Web3 education, and digital strategy by Lady Prowess.', url: '/services', images: ['/opengraph-image'] } }

export default function ServicesPage() {
  return <main className="bg-bg"><Nav /><section className="mx-auto max-w-[1240px] px-5 pb-14 pt-32 md:px-8 md:pb-20 md:pt-36"><p className="font-head text-[11px] uppercase tracking-[.14em] text-primary">My work</p><h1 className="mt-4 max-w-4xl font-display text-[clamp(2.15rem,3.5vw,3.3rem)] font-semibold leading-[1.1] tracking-[-.045em]">I help businesses turn ideas into clear products, useful content, and better digital experiences.</h1><p className="mt-6 max-w-3xl text-base leading-8 text-muted md:text-lg">My work brings together product communication, content strategy, technical writing, WordPress design, education and practical digital execution.</p></section><ServiceProof /><CaseStudies /><CTABanner /><Footer /></main>
}
