import { permanentRedirect } from 'next/navigation'

export default function OldBlogCategoryPage({ params }: { params: { slug: string } }) {
  permanentRedirect(`/${params.slug}`)
}
