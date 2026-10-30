import type { Metadata, Viewport } from 'next'
import AdminAppRegister from '@/components/AdminAppRegister'

// Only the admin advertises the installable app, so "Add to Home Screen" from
// any /admin page installs the dashboard, never the public site.
export const metadata: Metadata = {
  title: 'Admin',
  manifest: '/admin.webmanifest',
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: 'LP Admin', statusBarStyle: 'default' },
  icons: { apple: '/admin-app/apple-touch-icon.png' },
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>
    <AdminAppRegister />
    {children}
  </>
}
