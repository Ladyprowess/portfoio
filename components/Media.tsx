import Image from 'next/image'

const photos = [
  { src: '/personal%20photo/headshot1.png', file: '/personal photo/headshot1.png', alt: 'Ngozi Peace Okafor wearing a tan blazer in a professional portrait', label: 'Tan blazer portrait' },
  { src: '/personal%20photo/headshot2.png', file: '/personal photo/headshot2.png', alt: 'Ngozi Peace Okafor wearing an olive blouse in a professional portrait', label: 'Olive portrait' },
  { src: '/personal%20photo/headshot3.png', file: '/personal photo/headshot3.png', alt: 'Ngozi Peace Okafor seated in a light blazer for a professional portrait', label: 'Seated portrait' },
  { src: '/personal%20photo/headshot4.png', file: '/personal photo/headshot4.png', alt: 'Close professional headshot of Ngozi Peace Okafor in a black blazer', label: 'Close portrait' },
  { src: '/personal%20photo/headshot5.png', file: '/personal photo/headshot5.png', alt: 'Front facing professional headshot of Ngozi Peace Okafor', label: 'Profile portrait' },
  { src: '/personal%20photo/headshot6.jpg', file: '/personal photo/headshot6.jpg', alt: 'Professional studio portrait from the Lady Prowess media collection', label: 'Studio portrait' },
]

export default function Media() {
  return <>
    <section className="border-b border-ink-border px-5 pb-16 pt-32 md:px-8 md:pb-24 md:pt-40">
      <div className="mx-auto grid max-w-[1240px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
        <div className="max-w-xl">
          <p className="font-head text-xs font-bold uppercase tracking-[0.18em] text-primary">Media kit</p>
          <h1 className="mt-5 font-display text-[clamp(2.25rem,4vw,3.75rem)] font-extrabold leading-[1.06] tracking-[-0.04em]">Photos and information for media use.</h1>
          <p className="mt-6 text-base leading-8 text-muted md:text-lg">Download approved portraits for interviews, articles, event programmes, speaker profiles, and professional features.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#portraits" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-bold text-white transition hover:bg-primary-dim">View portraits</a>
            <a href="mailto:hello@ladyprowess.com?subject=Media%20enquiry" className="inline-flex min-h-12 items-center justify-center rounded-full border border-ink-border bg-white px-7 py-3 text-sm font-bold transition hover:border-primary/40">Media enquiry</a>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[540px] overflow-hidden rounded-[2rem] bg-[#EEF3FA]">
          <div className="relative aspect-[4/5]"><Image src={photos[0].src} alt={photos[0].alt} fill priority className="object-cover object-top" sizes="(max-width: 1024px) 100vw, 540px" /></div>
          <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 px-5 py-4 backdrop-blur"><p className="font-head text-sm font-bold">Ngozi Peace Okafor</p><p className="mt-1 text-sm text-muted">Lady Prowess</p></div>
        </div>
      </div>
    </section>

    <section className="border-b border-ink-border bg-white px-5 py-14 md:px-8 md:py-20">
      <div className="mx-auto grid max-w-[1240px] gap-8 md:grid-cols-[0.55fr_1.45fr] md:gap-16">
        <div><p className="font-head text-xs font-bold uppercase tracking-[0.18em] text-primary">About</p><h2 className="mt-4 font-display text-2xl font-extrabold">Short biography</h2></div>
        <p className="max-w-3xl text-base leading-8 text-muted">Ngozi Peace Okafor, known as Lady Prowess, is a product marketer, technical writer, WordPress designer, Web3 educator, and business strategist. She is a founder that builds practical products, content, and learning experiences for businesses and technical audiences.</p>
      </div>
    </section>

    <section id="portraits" className="px-5 py-20 md:px-8 md:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-12 grid gap-5 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div><p className="font-head text-xs font-bold uppercase tracking-[0.18em] text-primary">Portrait library</p><h2 className="mt-4 font-display text-[clamp(1.9rem,3vw,2.8rem)] font-extrabold leading-tight">Choose the photo that fits.</h2></div>
          <p className="max-w-xl text-base leading-8 text-muted md:justify-self-end">Each image is available in its original resolution.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {photos.map(photo => <article key={photo.src} className="overflow-hidden rounded-3xl border border-ink-border bg-white">
            <div className="relative aspect-[2/3] overflow-hidden bg-[#EEF3FA]"><Image src={photo.src} alt={photo.alt} fill className="object-cover object-top transition duration-500 hover:scale-[1.015]" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" /></div>
            <div className="flex items-center justify-between gap-4 p-5"><div><h3 className="font-head text-sm font-bold">{photo.label}</h3><p className="mt-1 text-xs text-muted">Original resolution</p></div><a href={photo.file} download className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-border text-primary transition hover:border-primary hover:bg-primary hover:text-white" aria-label={`Download ${photo.label}`}><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 20h14" /></svg></a></div>
          </article>)}
        </div>
      </div>
    </section>

    <section className="px-5 pb-20 md:px-8 md:pb-28">
      <div className="mx-auto grid max-w-[1240px] gap-8 rounded-[2rem] bg-[#121212] p-8 text-white md:grid-cols-[1fr_auto] md:items-center md:p-12">
        <div><p className="font-head text-xs font-bold uppercase tracking-[0.18em] text-[#7CA8FF]">Need something else?</p><h2 className="mt-4 max-w-2xl font-display text-2xl font-extrabold leading-tight md:text-3xl">For interviews, speaking requests, or a different image format, send a media enquiry.</h2></div>
        <a href="mailto:hello@ladyprowess.com?subject=Media%20enquiry" className="inline-flex min-h-12 items-center justify-center rounded-full bg-white px-7 py-3 text-sm font-bold text-[#121212]">hello@ladyprowess.com</a>
      </div>
    </section>
  </>
}
