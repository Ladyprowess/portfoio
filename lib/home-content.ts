// Content for the homepage. Every fact here comes from the Work page, the
// "From a Phone Screen to a Movement" story, or the existing site copy.

export type FacetKey = 'product' | 'writing' | 'web' | 'education' | 'business'

export const facets: { key: FacetKey; label: string; short: string; title: string; body: string; proof: string[]; image: string; imageAlt: string }[] = [
  {
    key: 'product',
    label: 'Product marketing',
    short: 'Marketing',
    title: 'I help products make sense to the people they are built for.',
    body: 'Positioning, messaging, launch campaigns, onboarding and customer education, especially for fintech, payments and Web3.',
    proof: ['KivoraPay', 'CustomersChain', 'Bullring Finance', 'Prospult', 'Giftvant'],
    image: '/service-proof/brand-case-prospult.jpg',
    imageAlt: 'Brand work for Prospult',
  },
  {
    key: 'writing',
    label: 'Technical writing',
    short: 'Writing',
    title: 'I turn difficult subjects into content people can follow.',
    body: 'I started in customer support, so I know the questions people actually ask. API and developer documentation, help content and guides that answer them, without dropping the important details.',
    proof: ['zkSync', 'txFusion', 'LBank', 'UEEx', 'CCPayment', 'WriteTech Hub', 'DEV Community'],
    image: '/service-proof/case-study-lbank.jpg',
    imageAlt: 'Articles written for LBank',
  },
  {
    key: 'web',
    label: 'Website design',
    short: 'Websites',
    title: 'I build websites around the people who will use them.',
    body: 'WordPress and Elementor sites with clear structure, useful pages and practical paths to action, for businesses, communities and events.',
    proof: ['Prowess Digital Solutions', 'Testers Connect', 'Dritchwear', 'BEGIN', 'LoveWorld Trade & Investment Forum'],
    image: '/service-proof/prowess-digital-solutions.png',
    imageAlt: 'The Prowess Digital Solutions website',
  },
  {
    key: 'education',
    label: 'Education & AI',
    short: 'Teaching',
    title: 'I teach technology so people feel confident using it.',
    body: 'Web3 lessons and training, a video learning library, an ebook and resource library, and AI workflows for writing, design and video.',
    proof: ['Learn Web3 with Lady Prowess', 'Video Learning Library', 'Ebook & Resource Library', '200+ people trained'],
    image: '/service-proof/web3-training.jpg',
    imageAlt: 'A Web3 training session',
  },
  {
    key: 'business',
    label: 'Business building',
    short: 'Building',
    title: 'I build ideas into businesses people can actually run.',
    body: 'Offers, digital tools, operations and founder strategy, tested on three companies of my own before I bring them to yours.',
    proof: ['Prowess Digital Solutions', 'KivoraPay', 'Dritchwear'],
    image: '/service-proof/dritchwear.png',
    imageAlt: 'The Dritchwear store',
  },
]

/** Tabs in the hero's live editor: the five crafts, plus customer support,
    where the work started (2018–2020 at Soofluffy). */
export type EditorKey = FacetKey | 'support'
export const editorTabs: { key: EditorKey; short: string }[] = [
  ...facets.slice(0, 2).map(f => ({ key: f.key as EditorKey, short: f.short })),
  { key: 'support', short: 'Support' },
  ...facets.slice(2).map(f => ({ key: f.key as EditorKey, short: f.short })),
]

/** "What brings you here?" — each answer points the page at one craft. */
export const intents: { key: string; label: string; facet: EditorKey | null; reply: string }[] = [
  { key: 'explain', label: 'My product is hard to explain', facet: 'product', reply: 'Then we start with the words. I will find what your users actually need to hear.' },
  { key: 'docs', label: 'I need docs developers can follow', facet: 'writing', reply: 'Good docs are a feature. I have written them for zkSync and txFusion.' },
  { key: 'support', label: 'My customers keep asking the same questions', facet: 'support', reply: 'I spent nearly three years in customer support and cut recurring issues by 45%. Let’s find what your customers are stuck on and answer it once, properly.' },
  { key: 'site', label: 'I need a website that works', facet: 'web', reply: 'A site people can find their way around, built around what they came to do.' },
  { key: 'learn', label: 'My team needs Web3 or AI training', facet: 'education', reply: 'I have trained over 200 people. Plain explanations, practical lessons.' },
  { key: 'build', label: 'I am building a business', facet: 'business', reply: 'I have built three. Let us make yours easier to run and easier to sell.' },
]

/** The real milestones, from the personal story on the blog. */
export const journey = [
  { year: '2016', title: 'A phone and a love for words', body: 'I started writing on my phone, just because I wanted to. That same year I got into the University of Uyo.' },
  { year: '2017', title: 'Five posts a day', body: 'My first paid writing role: five blog posts a day, Monday to Saturday, for five thousand naira a month. I showed up every day.' },
  { year: '2018', title: 'My first job and learning to build', body: 'Customer support at Soofluffy, over email and social media. After hours, a friend showed me web development, learned in a cyber café.' },
  { year: '2019', title: 'My first business', body: 'I sold hair growth products and made it profitable, until fake versions flooded the market. I learned, and kept moving.' },
  { year: '2020', title: 'Fixing problems at the source', body: 'COVID shut everything down, but I kept going. At Soofluffy I cut recurring customer issues by 45% before moving on in November.' },
  { year: '2021', title: 'The door finally opened', body: 'Payment walls that had blocked me for years came down. I went back to freelancing properly and built a reputation piece by piece.' },
  { year: '2022', title: 'Technical Writer', body: 'My first full-time role, at WriteTech Hub. Proof that none of the hard years had been wasted.' },
  { year: 'Now', title: 'Founder and strategist', body: 'I run Prowess Digital Solutions, built KivoraPay and founded Dritchwear, and I work with teams across fintech and Web3.' },
]

export const ventures = [
  // Colours follow KivoraPay's current brand (navy and blue, from kivora-codebase brand.css).
  { name: 'KivoraPay', tag: 'Fintech · Solana', line: 'The spending layer for crypto.', body: 'Pay bills, receive money and run a business with crypto, built for the African market on Solana. I lead product strategy, messaging and user flows.', href: 'https://kivorapay.com/', tone: 'bg-[#0E223C] text-white', accent: 'text-[#8DBBFF]' },
  { name: 'Prowess Digital Solutions', tag: 'Business consulting', line: 'Structure in place of guesswork.', body: 'A business consulting firm for African entrepreneurs: practical tools, training and content systems.', href: 'https://www.prowessdigitalsolutions.com', tone: 'bg-[#0E2A2C] text-[#EDF5F5]', accent: 'text-[#5EC4C9]' },
  { name: 'Dritchwear', tag: 'Streetwear & merchandise', line: 'Clothes and merch people are proud of.', body: 'A streetwear and branded merchandise label for individuals, companies and events.', href: 'https://dritchwear.com/shop', tone: 'bg-[#2A1E3D] text-[#F3F0EC]', accent: 'text-[#F5B841]' },
]

export const clients = [
  { name: 'zkSync', image: '/brands/zksync.png', href: 'https://www.zksync.io/', did: 'API and developer documentation' },
  { name: 'txFusion', image: '/brands/txfusion.png', href: 'https://www.txfusion.io/', did: 'API and developer documentation' },
  { name: 'Cwallet', image: '/brands/cwallet.png', href: 'https://cwallet.com', did: 'Content writing' },
  { name: 'Bullring Finance', image: '/brands/BF.svg', href: 'https://www.bullring.finance/', did: 'Content strategy and writing' },
  { name: 'WriteTech Hub', image: '/brands/writechtechhub.webp', href: 'https://writetechhub.org/', did: 'Technical writer' },
  { name: 'CoinTime ATM', image: '/brands/cointime.png', href: 'https://cointimeatm.com/', did: 'Content writing' },
  { name: 'CustomersChain', image: '/brands/customerschain.png', href: 'https://customerschain.com/', did: 'Content marketing' },
  { name: 'LW Commerce', image: '/brands/moc.png', href: 'https://lwcommerce.org/', did: 'WordPress design and content' },
  { name: 'Xcentrique Media', image: '/brands/xm lab.jpg', href: 'https://www.xcentriquemedia.com/', did: 'Technical content writer' },
  { name: 'UPay', image: '/brands/upay.jpeg', href: 'https://upay.com/', did: 'Content writing' },
  { name: 'UEEx', image: '/brands/ueex.png', href: 'https://ueex.com/', did: 'Content writing' },
]

export const testimonials = [
  { quote: 'One of the best technical writers I have come across. Ngozi has a real gift for turning complex ideas into structured, clear, engaging content.', name: 'Abdullah T.', role: 'Data Engineer' },
  { quote: 'Working with Lady Prowess was an absolute delight. The process was easy, clear, and I would strongly recommend her for guaranteed satisfaction.', name: 'Stanley Williams', role: 'Client' },
  { quote: 'I got maximum satisfaction from the work Ngozi did for me. She is a great writer, honest in dealing with people, and her work is excellent.', name: 'Mondesce Nigeria Ltd', role: 'Client' },
  { quote: 'Peace worked quickly, was responsive to learning new things, and delivered great value. Highly recommended.', name: 'Smidh Vadera', role: 'Web App & Odoo ERP Expert' },
]
