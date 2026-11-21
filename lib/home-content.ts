// Content for the homepage. Every fact here comes from the Work page, the
// "From a Phone Screen to a Movement" story, or the existing site copy.

export type FacetKey = 'product' | 'writing' | 'web' | 'education' | 'business'

export const facets: { key: FacetKey; label: string; short: string; title: string; body: string; proof: string[]; image: string; imageAlt: string }[] = [
  {
    key: 'product',
    label: 'Product marketing',
    short: 'Marketing',
    title: 'I help products make sense to the people they are built for.',
    body: 'Positioning, messaging and launches for fintech, payments and Web3.',
    proof: ['KivoraPay', 'CustomersChain', 'Bullring Finance', 'Prospult', 'Giftvant'],
    image: '/service-proof/brand-case-prospult.jpg',
    imageAlt: 'Brand work for Prospult',
  },
  {
    key: 'writing',
    label: 'Technical writing',
    short: 'Writing',
    title: 'I turn difficult subjects into content people can follow.',
    body: 'API docs, developer guides and help content, for teams like zkSync and TxFusion.',
    proof: ['zkSync', 'txFusion', 'LBank', 'UEEx', 'CCPayment', 'WriteTech Hub', 'DEV Community'],
    image: '/service-proof/case-study-lbank.jpg',
    imageAlt: 'Articles written for LBank',
  },
  {
    key: 'web',
    label: 'Website design',
    short: 'Websites',
    title: 'I build websites around the people who use them.',
    body: 'Custom-coded sites like Chidexun, plus WordPress for LWCommerce.',
    proof: ['Chidexun', 'Prowess Digital Solutions', 'Testers Connect', 'Dritchwear', 'BEGIN', 'LoveWorld Trade & Investment Forum'],
    // Chidexun is the lead example of her website work wherever it is shown.
    image: '/projects/chidexun.jpg',
    imageAlt: 'The Chidexun Plumbing Supplies website',
  },
  {
    key: 'education',
    label: 'AI & training',
    short: 'AI',
    title: 'I help teams use AI with confidence.',
    body: 'Practical AI workflows and hands-on AI and Web3 training. 200+ people trained.',
    proof: ['Learn Web3 with Lady Prowess', 'Video Learning Library', 'Ebook & Resource Library', '200+ people trained'],
    image: '/service-proof/web3-training.jpg',
    imageAlt: 'A Web3 training session',
  },
  {
    key: 'business',
    label: 'Product building',
    short: 'Building',
    title: 'I turn ideas into working products.',
    body: 'Product strategy, building and launch, tested on my own companies first.',
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

/** "What brings you here?" - each answer points the page at one craft. */
export const intents: { key: string; label: string; facet: EditorKey | null; reply: string }[] = [
  { key: 'explain', label: 'My product is hard to explain', facet: 'product', reply: 'Then we start with the words your users need to hear.' },
  { key: 'docs', label: 'I need docs developers can follow', facet: 'writing', reply: 'Good docs are a feature. I have written them for zkSync and TxFusion.' },
  { key: 'support', label: 'My customers keep asking the same questions', facet: 'support', reply: 'I cut repeat support issues by 45%. Let’s answer it once, properly.' },
  { key: 'site', label: 'I need a website that works', facet: 'web', reply: 'A clear site, built around what your visitors came to do.' },
  { key: 'learn', label: 'I want my team using AI', facet: 'education', reply: 'Let’s find where AI saves you time, then train your team to use it.' },
  { key: 'build', label: 'I am building a business', facet: 'business', reply: 'I have built three. Let’s make yours easier to run.' },
]

/** The real milestones, from the personal story on the blog. */
export const journey = [
  { year: '2016', title: 'A phone and a love for words', body: 'I started writing on my phone, and got into university.' },
  { year: '2017', title: 'Five posts a day', body: 'My first paid writing job: five posts a day, for ₦5,000 a month.' },
  { year: '2018', title: 'My first job and learning to build', body: 'Customer support by day, web development in a cyber café by night.' },
  { year: '2019', title: 'My first business', body: 'Profitable hair products, until fakes flooded the market.' },
  { year: '2020', title: 'Fixing problems at the source', body: 'I cut repeat customer issues by 45% at Soofluffy.' },
  { year: '2021', title: 'The door finally opened', body: 'Back to freelancing, building a reputation piece by piece.' },
  { year: '2022', title: 'Technical Writer', body: 'My first full-time role, at WriteTech Hub.' },
  { year: 'Now', title: 'AI strategist and builder', body: 'Helping businesses adopt AI and build products. Founder of KivoraPay.' },
]

export const ventures = [
  // Colours follow KivoraPay's current brand (navy and blue, from kivora-codebase brand.css).
  { name: 'KivoraPay', tag: 'Fintech · Solana', line: 'The spending layer for crypto.', body: 'Pay bills and get paid with crypto, built for Africa. I lead the product.', href: 'https://kivorapay.com/', tone: 'bg-[#0E223C] text-white', accent: 'text-[#8DBBFF]' },
  { name: 'Prowess Digital Solutions', tag: 'Business consulting', line: 'Structure in place of guesswork.', body: 'Practical tools, training and content for African entrepreneurs.', href: 'https://www.prowessdigitalsolutions.com', tone: 'bg-[#0E2A2C] text-[#EDF5F5]', accent: 'text-[#5EC4C9]' },
  { name: 'Dritchwear', tag: 'Streetwear & merchandise', line: 'Clothes and merch people are proud of.', body: 'Streetwear and branded merch for people, companies and events.', href: 'https://dritchwear.com/shop', tone: 'bg-[#2A1E3D] text-[#F3F0EC]', accent: 'text-[#F5B841]' },
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
