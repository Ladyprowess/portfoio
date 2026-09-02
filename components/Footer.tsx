import Image from 'next/image'

const columns = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Work', href: '/work' },
      { label: 'Services', href: '/#services' },
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
    title: 'Resources',
    links: [
      { label: 'Resources', href: 'https://www.prowessdigitalsolutions.com/resources' },
      { label: 'Media', href: '/media' },
      { label: 'Awards', href: '/awards' },
      {
        label: 'CV',
        href: 'https://drive.google.com/file/d/1qWDoVGKY3sps03fPbmNgCeR0FpPj7A0c/view?usp=sharing',
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
    <footer className="bg-dark px-8 md:px-20 pt-20 pb-10">
      <div className="max-w-[1480px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr] gap-12 lg:gap-8 pb-16 border-b border-dark-border">
          <div>
            <Image src="/Logo.png" alt="Lady Prowess" width={132} height={38} className="h-8 w-auto" />
            <p className="mt-5 text-[0.9rem] text-dark-muted leading-[1.8] max-w-xs">
              Founder, builder, and technical writer working at the intersection of technology,
              business, and people.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-head text-[0.62rem] font-bold tracking-[0.14em] uppercase text-dark-ink mb-5">
                {col.title}
              </p>
              <ul className="flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target={l.href.startsWith('http') || l.href.startsWith('mailto') ? '_blank' : undefined}
                      rel={l.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="font-body text-[0.86rem] text-dark-muted hover:text-primary transition-colors duration-200"
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
          <span className="font-body text-[0.72rem] text-dark-muted tracking-[0.04em]">
            © 2026 Ngozi Peace Okafor. All rights reserved.
          </span>
          <span className="font-body text-[0.72rem] text-dark-muted tracking-[0.04em]">
            Founder Digital Headquarters
          </span>
        </div>
      </div>
    </footer>
  )
}
