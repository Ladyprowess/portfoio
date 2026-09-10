export function categorySlug(category: string) {
  return category
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export function categoryFromSlug(categories: string[], slug: string) {
  return categories.find(category => categorySlug(category) === slug) || null
}
