import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="border-t border-ink-border px-8 md:px-20 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
      <span className="font-body text-[0.72rem] text-muted tracking-[0.04em]">
        © 2026 Ngozi Peace Okafor. All rights reserved.
      </span>
      <Image src="/Logo.png" alt="Lady Prowess" width={104} height={30} className="h-5 w-auto opacity-80" />
    </footer>
  )
}
