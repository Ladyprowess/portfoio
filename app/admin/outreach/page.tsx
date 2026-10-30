import { redirect } from 'next/navigation'

// Outreach and Compose became one page.
export default function Page() {
  redirect('/admin/email')
}
