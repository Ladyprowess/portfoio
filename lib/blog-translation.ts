export type IgboTranslation = { title_ig?: string; excerpt_ig?: string; body_ig?: string; igbo_approved?: boolean }
export function hasIgboTranslation(post: IgboTranslation) {
 return post.igbo_approved === true && Boolean(post.title_ig?.trim() && post.excerpt_ig?.trim() && post.body_ig?.trim())
}
export function translationRecord(payload: Record<string, unknown>) {
 const title_ig = typeof payload.titleIg === 'string' ? payload.titleIg.trim() : ''
 const excerpt_ig = typeof payload.excerptIg === 'string' ? payload.excerptIg.trim() : ''
 const body_ig = typeof payload.bodyIg === 'string' ? payload.bodyIg.trim() : ''
 if (title_ig.length > 500 || excerpt_ig.length > 3000 || body_ig.length > 200000) throw new Error('The Igbo translation is too long. Use up to 500 characters for the title, 3,000 for the summary, and 200,000 for the article.')
 const igbo_approved = payload.igboApproved === true
 if (igbo_approved && (!title_ig || !excerpt_ig || !body_ig)) throw new Error('Complete the Igbo title, summary, and article before approving the translation.')
 return { title_ig, excerpt_ig, body_ig, igbo_approved }
}
