import ArticleContent from '@/components/ArticleContent'
import { quizBlockHtml } from '@/lib/blog-quiz'

// Temporary page for checking the quiz visually. Delete after review.
export default function QuizPreviewPage() {
  const html = `<p>Stablecoins are crypto tokens designed to hold a steady value, usually pegged to a currency like the US dollar.</p>${quizBlockHtml({
    id: 'quiz-demo-one',
    question: 'What is a stablecoin usually pegged to?',
    options: ['The price of Bitcoin', 'A currency like the US dollar', 'The number of users on a blockchain', 'Nothing, its price floats freely'],
    answer: 1,
    explanation: 'Most stablecoins, such as USDT and USDC, aim to stay worth one US dollar.',
  })}<p><br></p><h2>Why this matters</h2><p>That stability is what makes them useful for payments.</p>${quizBlockHtml({
    id: 'quiz-demo-two',
    question: 'Which network is Kivora Pay built on?',
    options: ['Solana', 'Ethereum', 'Bitcoin'],
    answer: 0,
    explanation: '',
  })}`
  return (
    <main className="min-h-screen bg-bg">
      <article className="mx-auto w-full min-w-0 max-w-4xl px-5 pb-24 pt-16 md:px-8">
        <div className="w-full min-w-0 max-w-3xl py-6">
          <ArticleContent html={html} />
        </div>
      </article>
    </main>
  )
}
