const names = [
  'Kivora Pay',
  'Prowess Digital Solutions',
  'txFusion',
  'Cwallet',
  'Bullring Finance',
  'WriteTech Hub',
  'CustomersChain',
  'CoinTime ATM',
  'Point22',
]

export default function Credibility() {
  const row = [...names, ...names]

  return (
    <section className="bg-dark border-b border-dark-border py-8 overflow-hidden">
      <div className="animate-marquee gap-16">
        {row.map((name, i) => (
          <span
            key={`${name}-${i}`}
            className="font-display font-bold text-[1.1rem] text-dark-muted whitespace-nowrap px-8"
          >
            {name}
          </span>
        ))}
      </div>
    </section>
  )
}
