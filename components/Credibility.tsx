import Image from 'next/image'

const brands = [
  { name: 'Kivora Pay', logo: '/brands/kivorapay.png' },
  { name: 'Prowess Digital Solutions', logo: '/brands/pds.png' },
  { name: 'Dritchwear', logo: '/brands/dritchwear.png' },
  { name: 'txFusion', logo: '/brands/txfusion.png' },
  { name: 'Cwallet', logo: '/brands/cwallet.png' },
  { name: 'Bullring Finance', logo: '/brands/BF.svg' },
  { name: 'WriteTech Hub', logo: '/brands/writechtechhub.webp' },
  { name: 'CustomersChain', logo: '/brands/customerschain.png' },
  { name: 'CoinTime ATM', logo: '/brands/cointime.png' },
]

export default function Credibility() {
  return (
    <section className="overflow-hidden border-b border-ink-border bg-surface px-6 py-8 sm:px-8 md:px-20">
      <div className="mx-auto grid max-w-[1480px] grid-cols-1 gap-6 lg:grid-cols-[260px_1fr] lg:items-center">
        <div>
          <p className="font-head text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-primary">
            Trusted work
          </p>
          <p className="mt-2 text-sm leading-6 text-muted">
            A few of the teams and ventures connected to my work.
          </p>
        </div>

        <div className="grid grid-cols-2 border-l border-t border-ink-border sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="flex h-24 items-center justify-center border-b border-r border-ink-border bg-bg px-4 py-6"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                width={160}
                height={64}
                className="max-h-9 w-auto max-w-[150px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
