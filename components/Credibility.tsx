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
  const row = [...brands, ...brands]

  return (
    <section className="bg-surface border-b border-ink-border py-10 overflow-hidden">
      <div className="animate-marquee gap-14 items-center">
        {row.map((brand, i) => (
          <div
            key={`${brand.name}-${i}`}
            className="h-9 shrink-0 flex items-center justify-center px-4 opacity-75 hover:opacity-100 transition-opacity duration-300"
          >
            <Image
              src={brand.logo}
              alt={brand.name}
              width={160}
              height={64}
              className="h-full w-auto max-w-[170px] object-contain"
            />
          </div>
        ))}
      </div>
    </section>
  )
}
