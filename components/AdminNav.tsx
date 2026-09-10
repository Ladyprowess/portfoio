import Link from 'next/link'

export default function AdminNav() {
  return (
    <nav className="border-b border-ink-border bg-white">
      <div className="mx-auto flex max-w-[1240px] items-center gap-2 overflow-x-auto px-5 py-3 md:px-8">
        <Link href="/admin" className="min-w-max rounded-full px-4 py-2 text-sm font-semibold text-parchment hover:bg-surface-2">Admin home</Link>
        <Link href="/compose" className="min-w-max rounded-full px-4 py-2 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-parchment">Email compose</Link>
        <Link href="/admin/blog" className="min-w-max rounded-full px-4 py-2 text-sm font-semibold text-muted hover:bg-surface-2 hover:text-parchment">Blog CMS</Link>
        <Link href="/blog" className="ml-auto min-w-max rounded-full border border-ink-border px-4 py-2 text-sm font-semibold text-muted hover:border-primary hover:text-primary">View blog</Link>
      </div>
    </nav>
  )
}
