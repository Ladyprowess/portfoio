// The services page speaks to the visitor directly: each service starts from
// their problem, in their words, then shows the fix being made live.
import { caseStudies, learning, lwCommercePages, websites, writing } from './work-content'

export type ServiceKey = 'product' | 'writing' | 'web' | 'education' | 'business'

export type Proof = { label: string; href: string }

export const services: {
  key: ServiceKey
  /** Matches an intent key on the homepage, so "I need this" can start the visitor's message. */
  intent: string
  name: string
  problem: string
  title: string
  body: string
  includes: string[]
  proofTitle: string
  proof: Proof[]
}[] = [
  {
    key: 'education',
    intent: 'learn',
    name: 'AI adoption & training',
    problem: 'We know AI matters, but not where to start.',
    title: 'Find where AI actually saves you time.',
    body: 'I look at how your team works, pick the AI uses worth doing, then train people to use them with confidence.',
    includes: ['AI use cases and workflow review', 'Team training and playbooks', 'AI and Web3 workshops'],
    proofTitle: 'Learning I created',
    proof: learning.map(l => ({ label: l.title, href: l.href })),
  },
  {
    key: 'business',
    intent: 'build',
    name: 'Product building',
    problem: 'I have an idea, but no product yet.',
    title: 'From idea to a product people use.',
    body: 'Requirements, user journeys, build and testing, the same way I took KivoraPay from concept to launch.',
    includes: ['Product requirements and user journeys', 'Build and testing', 'Launch and monitoring'],
    proofTitle: 'Products I built',
    proof: [
      { label: 'KivoraPay', href: 'https://kivorapay.com/' },
      { label: 'Prowess Digital Solutions', href: 'https://www.prowessdigitalsolutions.com' },
      { label: 'Dritchwear', href: 'https://dritchwear.com/shop' },
    ],
  },
  {
    key: 'writing',
    intent: 'docs',
    name: 'Technical writing',
    problem: 'Developers struggle to use my docs.',
    title: 'Docs that answer questions, not create them.',
    body: 'API references, guides and help content people understand on the first read. I have written them for zkSync and TxFusion.',
    includes: ['API and developer documentation', 'Quickstarts and tutorials', 'Help centre articles'],
    proofTitle: 'Where my writing is published',
    proof: writing.map(w => ({ label: w.title, href: w.href })),
  },
  {
    key: 'web',
    intent: 'site',
    name: 'Websites',
    problem: 'My website isn’t bringing in customers.',
    title: 'A website that works as hard as you do.',
    body: 'Custom-coded or WordPress, built around what your visitors came to do, with one clear next step on every page.',
    includes: ['Site structure and user journey', 'Custom-coded build or WordPress', 'The words on every page'],
    proofTitle: 'Websites I built',
    proof: [...websites.map(w => ({ label: w.title, href: w.href })), { label: `LW Commerce (${lwCommercePages.reduce((n, g) => n + g.links.length, 0)} pages)`, href: 'https://lwcommerce.org/' }],
  },
  {
    key: 'product',
    intent: 'explain',
    name: 'Product marketing',
    problem: 'People don’t understand what my product does.',
    title: 'Your product is good. Make people get it.',
    body: 'Positioning, launch copy and onboarding built from the words your customers already use.',
    includes: ['Positioning and messaging', 'Landing page and launch copy', 'Onboarding and product education'],
    proofTitle: 'Case studies I wrote',
    proof: caseStudies.map(c => ({ label: c.name, href: c.href })),
  },
]

export const steps = [
  { title: 'You tell me the problem', body: 'In your own words. Rough is fine.' },
  { title: 'I show you the plan', body: 'What I will do, what you get and when, in plain language.' },
  { title: 'We build it together', body: 'You see progress as it happens, not just at the end.' },
]
