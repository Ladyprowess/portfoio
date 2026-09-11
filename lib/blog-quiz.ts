export type BlogQuiz = {
  id: string
  question: string
  options: string[]
  answer: number
  explanation: string
}

export type ArticleSegment = { type: 'html'; html: string } | { type: 'quiz'; quiz: BlogQuiz }

export const quizLetters = 'ABCDEF'
export const maxQuizOptions = quizLetters.length

// Quiz blocks are stored inside content_html as a locked <div> whose data-quiz
// attribute holds the URI-encoded quiz JSON. The inner markup is only a readable
// fallback for the editor, so it never contains nested divs.
const quizBlockPattern = /<div\b[^>]*\bdata-quiz="([^"]*)"[^>]*>[\s\S]*?<\/div>/gi

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export function newQuizId() {
  return `quiz-${Math.random().toString(36).slice(2, 10)}`
}

function normaliseQuiz(value: unknown): BlogQuiz | null {
  if (!value || typeof value !== 'object') return null
  const row = value as Record<string, unknown>
  const question = typeof row.question === 'string' ? row.question.trim() : ''
  const options = Array.isArray(row.options)
    ? row.options.slice(0, maxQuizOptions).map((option) => (typeof option === 'string' ? option.trim() : ''))
    : []
  const answer = typeof row.answer === 'number' ? row.answer : -1
  if (!question || options.length < 2 || options.some((option) => !option)) return null
  if (!Number.isInteger(answer) || answer < 0 || answer >= options.length) return null

  return {
    id: typeof row.id === 'string' && /^[a-z0-9-]{1,40}$/i.test(row.id) ? row.id : '',
    question,
    options,
    answer,
    explanation: typeof row.explanation === 'string' ? row.explanation.trim() : '',
  }
}

export function readQuizAttribute(raw: string) {
  try {
    const decoded = raw.replace(/&quot;/g, '"').replace(/&#0*39;|&apos;/g, "'").replace(/&amp;/g, '&')
    return normaliseQuiz(JSON.parse(decodeURIComponent(decoded)))
  } catch {
    return null
  }
}

export function quizBlockHtml(quiz: BlogQuiz) {
  const data = encodeURIComponent(JSON.stringify(quiz)).replace(/'/g, '%27')
  const options = quiz.options
    .map((option, index) => `<li${index === quiz.answer ? ' class="blog-quiz-correct"' : ''}>${escapeHtml(option)}</li>`)
    .join('')
  const explanation = quiz.explanation ? `<p class="blog-quiz-explanation">${escapeHtml(quiz.explanation)}</p>` : ''
  return `<div class="blog-quiz" contenteditable="false" data-quiz="${data}"><p class="blog-quiz-label">Quick quiz</p><p class="blog-quiz-question">${escapeHtml(quiz.question)}</p><ol class="blog-quiz-options">${options}</ol>${explanation}</div>`
}

// Replaces every valid quiz block in the article. Invalid blocks are left untouched.
export function replaceQuizBlocks(html: string, replace: (quiz: BlogQuiz, index: number) => string) {
  let index = 0
  const usedIds = new Set<string>()
  return html.replace(quizBlockPattern, (block, raw: string) => {
    const quiz = readQuizAttribute(raw)
    if (!quiz) return block
    let id = quiz.id || `quiz-${index + 1}`
    while (usedIds.has(id)) id = `${id}-${index + 1}`
    usedIds.add(id)
    return replace({ ...quiz, id }, index++)
  })
}

export function splitQuizSegments(html: string): ArticleSegment[] {
  const quizzes: BlogQuiz[] = []
  const marked = replaceQuizBlocks(html, (quiz, index) => {
    quizzes.push(quiz)
    return `\u0000quiz:${index}\u0000`
  })
  if (!quizzes.length) return html.trim() ? [{ type: 'html', html }] : []

  return marked.split('\u0000').flatMap((part): ArticleSegment[] => {
    const quizMatch = part.match(/^quiz:(\d+)$/)
    if (quizMatch) return [{ type: 'quiz', quiz: quizzes[Number(quizMatch[1])] }]
    return part.trim() ? [{ type: 'html', html: part }] : []
  })
}

// Email clients cannot run the interactive quiz, so subscribers get a static card
// that sends them to the quiz on the website without revealing the answer.
export function emailQuizHtml(quiz: BlogQuiz, postUrl?: string) {
  const options = quiz.options
    .map(
      (option, index) =>
        `<p style="margin:0 0 8px;padding:11px 14px;background:#FFFFFF;border:1px solid #DDE1E8;border-radius:8px;color:#25282D;font-size:15px;line-height:1.5;text-align:left;overflow-wrap:anywhere;word-break:break-word;"><strong style="color:#2563EB;">${quizLetters[index]}.</strong>&nbsp; ${escapeHtml(option)}</p>`,
    )
    .join('')
  const action = postUrl
    ? `<p style="margin:14px 0 0;"><a href="${postUrl}#${quiz.id}" style="display:inline-block;background:#2563EB;color:#FFFFFF;text-decoration:none;font-weight:700;font-size:14px;padding:11px 18px;border-radius:8px;">Answer on the website &rarr;</a></p>`
    : `<p style="margin:14px 0 0;color:#4B5563;font-size:14px;line-height:1.6;text-align:left;">Answer: <strong>${quizLetters[quiz.answer]}. ${escapeHtml(quiz.options[quiz.answer])}</strong>${quiz.explanation ? `<br>${escapeHtml(quiz.explanation)}` : ''}</p>`
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:100%;margin:26px 0;border-collapse:separate;table-layout:fixed;background:#EEF4FF;border:1px solid #C7D7FE;border-radius:12px;"><tr><td style="padding:20px 16px;font-family:Arial,Helvetica,sans-serif;text-align:left;overflow-wrap:anywhere;word-break:break-word;"><p style="margin:0 0 8px;color:#2563EB;font-size:12px;font-weight:800;letter-spacing:1.4px;text-transform:uppercase;">Quick quiz</p><p style="margin:0 0 14px;color:#17191D;font-size:18px;font-weight:700;line-height:1.45;text-align:left;">${escapeHtml(quiz.question)}</p>${options}${action}</td></tr></table>`
}
