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
  { name: 'Point22', logo: null },
]

export default function Credibility() {
  const row = [...brands, ...brands]

  return (
    <section className="bg-dark border-b border-dark-border py-8 overflow-hidden">
      <div className="animate-marquee gap-16 items-center">
        {row.map((brand, i) =>
          brand.logo ? (
            <div key={`${brand.name}-${i}`} className="h-7 shrink-0 flex items-center px-8 opacity-70 hover:opacity-100 transition-opacity duration-300">
              <Image
                src={brand.logo}
                alt={brand.name}
                width={140}
                height={56}
                className="h-full w-auto max-w-[190px] object-contain grayscale brightness-[1.8] contrast-[0.9]"
              />
            </div>
          ) : (
            <span
              key={`${brand.name}-${i}`}
              className="font-display font-bold text-[1.1rem] text-dark-muted whitespace-nowrap px-8 shrink-0"
            >
              {brand.name}
            </span>
          )
        )}
      </div>
    </section>
  )
}
