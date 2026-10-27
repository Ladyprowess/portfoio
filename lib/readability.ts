// Flesch–Kincaid grade level, used to show how much easier a rewrite reads.
// The syllable count is a heuristic (vowel groups, minus a silent final e),
// which is accurate enough to compare two versions of the same sentence.

function syllables(word: string) {
  const w = word.toLowerCase().replace(/[^a-z]/g, '')
  if (!w) return 0
  if (w.length <= 3) return 1
  const groups = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '').match(/[aeiouy]{1,2}/g)
  return Math.max(1, groups?.length ?? 1)
}

export function wordCount(text: string) {
  return text.split(/\s+/).filter(Boolean).length
}

export function gradeLevel(text: string) {
  const words = text.split(/\s+/).filter(Boolean)
  if (!words.length) return 0
  const sentences = Math.max(1, (text.match(/[.!?]+/g) ?? []).length)
  const syl = words.reduce((sum, w) => sum + syllables(w), 0)
  const grade = 0.39 * (words.length / sentences) + 11.8 * (syl / words.length) - 15.59
  return Math.max(1, Math.round(grade))
}
