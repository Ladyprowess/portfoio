// Homepage content. The homepage is built as "The Edit": every section shows
// a rough draft becoming something clear, because that is the work.

export const roles = [
  { key: 'product', label: 'Product marketing', title: 'I help products make sense to the people they are built for.', body: 'Positioning, product messaging, launch campaigns, onboarding, customer education, and go to market support, especially for fintech, payments, and Web3.', tools: ['Positioning', 'Launch strategy', 'User education', 'Campaigns'] },
  { key: 'writing', label: 'Technical writing', title: 'I turn difficult subjects into content people can follow.', body: 'Documentation, explainers, SEO articles, help content, and product guides that reduce confusion without removing the important details.', tools: ['Documentation', 'SEO content', 'Tutorials', 'Product copy'] },
  { key: 'web', label: 'WordPress design', title: 'I design websites around the user journey, not decoration.', body: 'Responsive WordPress and Elementor websites with clear structure, useful pages, clean content hierarchy, and practical conversion paths.', tools: ['WordPress', 'Elementor', 'UX structure', 'Landing pages'] },
  { key: 'education', label: 'Education & AI', title: 'I teach technology and use AI as a practical production tool.', body: 'Web3 education and training, plus AI-supported workflows for writing, research, visual design, and video production.', tools: ['Web3 education', 'Training', 'AI writing', 'AI design & video'] },
  { key: 'business', label: 'Business building', title: 'I build ideas into systems people can actually run.', body: 'Offer development, digital tools, business processes, founder strategy, and hands-on execution across the ventures I own and support.', tools: ['Business strategy', 'Digital systems', 'Operations', 'Founder support'] },
]

export const projects = [
  { name: 'Dritchwear', type: 'Commerce & merchandise', image: '/brands/dritchwear.png', colour: 'bg-[#F3F0EC]', draft: 'People want streetwear that feels like them, and companies and events need custom merch they are proud to hand out.', summary: 'A men’s streetwear and custom merchandise business built for individuals, companies, and events.', work: ['Brand strategy', 'Online commerce', 'Marketing', 'Operations'], href: 'https://dritchwear.com/shop' },
  { name: 'Prowess Digital Solutions', type: 'Business education', image: '/brands/pds.png', colour: 'bg-[#EDF5F5]', draft: 'Too many small businesses run on guesswork. What if they had simple tools and training to give them structure?', summary: 'Practical tools and training that help small businesses replace guesswork with structure.', work: ['Founder', 'Digital tools', 'Training', 'Content systems'], href: 'https://www.prowessdigitalsolutions.com' },
  { name: 'KivoraPay', type: 'Fintech product', image: '/brands/kivorapay.png', colour: 'bg-[#EAFBF5]', draft: 'People hold crypto, but they still cannot use it to pay for everyday things like bills and shopping.', summary: 'A spending layer that lets people use crypto for everyday bills and merchant payments.', work: ['Product strategy', 'Messaging', 'User flows', 'Market strategy'], href: 'https://kivorapay.com/' },
]

/** Hard sentences and their plain-language rewrites, for the "Try me" translator. */
export const jargonExamples = [
  { tag: 'Fintech', jargon: 'Our non-custodial, multi-chain settlement infrastructure abstracts transactional complexity to facilitate frictionless fiat off-ramping for end users.', plain: 'Pay your bills with crypto. We handle the hard parts for you.' },
  { tag: 'Web3', jargon: 'Zero-knowledge rollups aggregate transactions off-chain and submit succinct validity proofs to the base layer, inheriting its security guarantees.', plain: 'Many payments are bundled and checked together, so they cost less and stay just as safe.' },
  { tag: 'API docs', jargon: 'Idempotency keys ensure that retried POST requests do not result in the duplicate instantiation of server-side resources.', plain: 'If a request is sent twice by accident, it only happens once.' },
  { tag: 'SaaS', jargon: 'Leverage our AI-powered, omnichannel engagement platform to operationalise customer-centric workflows at enterprise scale.', plain: 'Answer every customer message from one inbox, with help from AI.' },
  { tag: 'Small business', jargon: 'We empower SMEs to unlock operational efficiencies through bespoke, end-to-end digital transformation solutions.', plain: 'We help small businesses stop doing by hand what a simple tool can do.' },
  { tag: 'Marketing', jargon: 'A holistic, data-driven go-to-market strategy designed to maximise top-of-funnel awareness and accelerate downstream conversion.', plain: 'Get the right people to notice you, then give them a reason to sign up.' },
]

/** What each craft actually produces, ticked off in the expertise section. */
export const deliverables: Record<string, string[]> = {
  product: ['Positioning and messaging', 'Launch plan and campaign', 'Onboarding and education content', 'Sales and pitch narratives'],
  writing: ['API and developer docs', 'Help centre articles', 'SEO explainers', 'Product guides and tutorials'],
  web: ['Site structure and user journey', 'Responsive WordPress build', 'Landing pages that convert', 'Clear content hierarchy'],
  education: ['Web3 courses and workshops', 'Training for teams', 'AI-assisted writing workflows', 'AI design and video production'],
  business: ['Offer and pricing design', 'Digital tools and systems', 'Operating processes', 'Founder strategy sessions'],
}

export const brands = [
  { name: 'txFusion', image: '/brands/txfusion.png', href: 'https://www.txfusion.io/', relationship: 'API and developer documentation' },
  { name: 'Cwallet', image: '/brands/cwallet.png', href: 'https://cwallet.com', relationship: 'Content writing' },
  { name: 'Bullring Finance', image: '/brands/BF.svg', href: 'https://www.bullring.finance/', relationship: 'Content strategy and writing' },
  { name: 'WriteTech Hub', image: '/brands/writechtechhub.webp', href: 'https://writetechhub.org/', relationship: 'Technical writer' },
  { name: 'CoinTime ATM', image: '/brands/cointime.png', href: 'https://cointimeatm.com/', relationship: 'Content writing' },
  { name: 'CustomersChain', image: '/brands/customerschain.png', href: 'https://customerschain.com/', relationship: 'Content marketing' },
  { name: 'LW Commerce', image: '/brands/moc.png', href: 'https://lwcommerce.org/', relationship: 'WordPress design and content' },
  { name: 'zkSync', image: '/brands/zksync.png', href: 'https://www.zksync.io/', relationship: 'API and developer documentation' },
  { name: 'Xcentrique Media', image: '/brands/xm lab.jpg', href: 'https://www.xcentriquemedia.com/', relationship: 'Technical content writer' },
  { name: 'UPay', image: '/brands/upay.jpeg', href: 'https://upay.com/', relationship: 'Content writing' },
  { name: 'UEEx', image: '/brands/ueex.png', href: 'https://ueex.com/', relationship: 'Content writing' },
]

export const testimonials = [
  { quote: 'I got maximum satisfaction from the work Ngozi did for me. She is a great writer, honest in dealing with people, and her work is excellent.', name: 'Mondesce Nigeria Ltd', role: 'Client' },
  { quote: 'Working with Lady Prowess was an absolute delight. The process was easy, clear, and I would strongly recommend her for guaranteed satisfaction.', name: 'Stanley Williams', role: 'Client' },
  { quote: 'One of the best technical writers I have come across. Ngozi has a real gift for turning complex ideas into structured, clear, engaging content.', name: 'Abdullah T.', role: 'Data Engineer' },
  { quote: 'Peace worked quickly, was responsive to learning new things, and delivered great value. Highly recommended.', name: 'Smidh Vadera', role: 'Web App & Odoo ERP Expert' },
]

export const stats = [
  { value: '9+', label: 'Years building' },
  { value: '200+', label: 'People trained' },
  { value: '3', label: 'Ventures founded' },
]

export type Role = (typeof roles)[number]
export type Project = (typeof projects)[number]
