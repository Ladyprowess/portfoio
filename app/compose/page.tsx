import { redirect } from 'next/navigation'

// Compose now lives inside the Email page, so every email can be tracked
// and added to contacts. This opens it with a new email ready to write.
export default function Page() {
  redirect('/admin/email?compose=1')
}
