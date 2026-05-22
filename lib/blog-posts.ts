export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  accent: string
  body: string[]
}

export const blogPosts: BlogPost[] = []

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug)
}
