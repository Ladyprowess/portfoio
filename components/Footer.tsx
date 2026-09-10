import Image from 'next/image'

const columns = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Contact', href: '/#contact' },
    ],
  },
  {
    title: 'Businesses',
    links: [
      { label: 'Prowess Digital Solutions', href: 'https://www.prowessdigitalsolutions.com' },
      { label: 'Kivora Pay', href: 'https://kivorapay.com/' },
      { label: 'Dritchwear', href: 'https://app.dritchwear.com/shop' },
    ],
  },
  {
    title: 'More',
    links: [
      { label: 'Media', href: '/media' },
      { label: 'Awards', href: '/awards' },
      {
        label: 'CV',
        href: 'https://drive.google.com/file/d/1VhYNSzSsOgS_nyyNS0fbmquKZxPCkPde/view?usp=sharing',
      },
    ],
  },
  {
    title: "Let's Connect",
    links: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/peace-ngozi-okafor' },
      { label: 'X', href: 'https://x.com/ladyprowess' },
      { label: 'Instagram', href: 'https://www.instagram.com/ladyprowess_' },
      { label: 'Email', href: 'mailto:hello@ladyprowess.com' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-ink-border bg-white px-6 pb-8 pt-14 sm:px-8 md:px-20">
      <div className="max-w-[1480px] mx-auto">
        <div className="grid grid-cols-1 gap-10 border-b border-ink-border pb-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] lg:gap-8">
          <div>
            <Image src="/Logo-blue.png" alt="Lady Prowess" width={170} height={44} className="h-8 w-auto" />
            <p className="mt-5 max-w-xs text-[0.88rem] leading-[1.8] text-muted">
              Founder, builder, and technical writer working at the intersection of technology,
              business, and people.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-5 font-head text-[0.62rem] font-bold uppercase tracking-[0.14em] text-parchment">
                {col.title}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith('http') || l.href.startsWith('mailto') ? '_blank' : undefined}
                      rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-body text-[0.84rem] text-muted transition-colors duration-200 hover:text-primary"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="font-body text-[0.72rem] tracking-[0.04em] text-muted">
            © 2026 Ngozi Peace Okafor. All rights reserved.
          </span>
          <span className="font-body text-[0.72rem] tracking-[0.04em] text-muted">
            Founder Digital Headquarters
          </span>
        </div>
      </div>
    </footer>
  )
}
