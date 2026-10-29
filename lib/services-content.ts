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
    key: 'product',
    intent: 'explain',
    name: 'Product marketing',
    problem: 'People don’t understand what my product does.',
    title: 'Your product is good. People just don’t get it yet.',
    body: 'I find the words your customers already use and build your message around them. Positioning, launch campaigns, onboarding and education that turn “what is this?” into “I need this”.',
    includes: ['Positioning and messaging', 'Landing page and launch copy', 'Onboarding and product education', 'Campaigns for fintech, payments and Web3'],
    proofTitle: 'Case studies I wrote',
    proof: caseStudies.map(c => ({ label: c.name, href: c.href })),
  },
  {
    key: 'writing',
    intent: 'docs',
    name: 'Technical writing',
    problem: 'Developers struggle to use my docs.',
    title: 'Your docs should answer questions, not create them.',
    body: 'Years in customer support taught me which questions people keep asking. I write API references, guides and help content that answer them on the first read, without dropping the technical detail. I have done it for zkSync and txFusion.',
    includes: ['API and developer documentation', 'Quickstarts and tutorials', 'Help centre articles', 'Technical and SEO articles'],
    proofTitle: 'Where my writing is published',
    proof: writing.map(w => ({ label: w.title, href: w.href })),
  },
  {
    key: 'web',
    intent: 'site',
    name: 'Website design',
    problem: 'My website isn’t bringing in customers.',
    title: 'Your website should work as hard as you do.',
    body: 'I design and build websites around what your visitors came to do, from custom-coded sites like Chidexun Plumbing Supplies to WordPress builds: clear pages, simple navigation and one obvious next step on every screen.',
    includes: ['Site structure and user journey', 'Custom-coded or WordPress build', 'Landing pages that convert', 'The words on every page'],
    proofTitle: 'Websites I built',
    proof: [...websites.map(w => ({ label: w.title, href: w.href })), { label: `LW Commerce (${lwCommercePages.reduce((n, g) => n + g.links.length, 0)} pages)`, href: 'https://lwcommerce.org/' }],
  },
  {
    key: 'education',
    intent: 'learn',
    name: 'Training & AI',
    problem: 'My team needs to understand Web3 or AI.',
    title: 'New technology is easier with a good teacher.',
    body: 'I turn Web3 and AI into lessons people can actually follow: workshops, video courses, guides and ebooks. Over 200 people trained so far.',
    includes: ['Workshops and team training', 'Video lessons and courses', 'Ebooks, guides and templates', 'AI workflows for writing, design and video'],
    proofTitle: 'Learning I created',
    proof: learning.map(l => ({ label: l.title, href: l.href })),
  },
  {
    key: 'business',
    intent: 'build',
    name: 'Business building',
    problem: 'My business runs on chaos.',
    title: 'Your business shouldn’t depend on you remembering everything.',
    body: 'I help founders turn good ideas into businesses that run: clear offers, simple digital systems and processes the team can follow. I have built three of my own.',
    includes: ['Offer and pricing design', 'Digital tools and systems', 'Operating processes', 'Founder strategy sessions'],
    proofTitle: 'Businesses I built',
    proof: [
      { label: 'KivoraPay', href: 'https://kivorapay.com/' },
      { label: 'Prowess Digital Solutions', href: 'https://www.prowessdigitalsolutions.com' },
      { label: 'Dritchwear', href: 'https://dritchwear.com/shop' },
    ],
  },
]

export const steps = [
  { title: 'You tell me the problem', body: 'In your own words. Rough is fine.' },
  { title: 'I show you the plan', body: 'What I will do, what you get and when, in plain language.' },
  { title: 'We build it together', body: 'You see progress as it happens, not just at the end.' },
]
