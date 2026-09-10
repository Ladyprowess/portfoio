export type Venture = {
  slug: string
  name: string
  eyebrow: string
  logo: string
  website: string
  status: string
  summary: string
  introduction: string
  story: string[]
  problem: string
  solution: string
  audience: string[]
  features: { title: string; body: string }[]
  stats: { value: string; label: string }[]
  model: string[]
  priorities: string[]
  support: string[]
  paymentUrl?: string
  videos?: { title: string; src: string }[]
  raise?: {
    amount: string
    details: { value: string; label: string }[]
    allocation: { percent: string; label: string }[]
  }
}

export const ventures: Venture[] = [
  {
    slug: 'kivorapay',
    name: 'KivoraPay',
    eyebrow: 'Crypto payments for everyday life',
    logo: '/brands/kivorapay.png',
    website: 'https://kivorapay.com',
    status: 'Currently seeking funding and strategic support',
    summary: 'KivoraPay helps Africans receive crypto, pay everyday bills, create invoices, and use digital assets in real life.',
    introduction: 'KivoraPay is the spending layer for crypto. It closes the gap between having digital assets and being able to use them for ordinary needs.',
    story: [
      'I was already earning and transacting in crypto when I tried to pay a normal electricity bill. The money was in my wallet, but I still had to find a trader, negotiate a rate, wait for a transfer, and accept that the final amount could change.',
      'The money was available, but it could not move directly to where I needed it. KivoraPay grew from that simple problem. Crypto should be useful beyond holding and trading.',
    ],
    problem: 'Millions of people receive or hold crypto, yet everyday spending still depends on slow conversions, uncertain rates, and extra intermediaries. The experience becomes especially difficult when a bill is urgent.',
    solution: 'KivoraPay connects supported crypto assets to bills, invoices, payment links, merchant sales, and bank payouts through one clear experience.',
    audience: ['Crypto earners', 'Freelancers', 'Remote workers', 'Merchants', 'Small businesses', 'People receiving international payments'],
    features: [
      { title: 'Bill payments', body: 'Pay electricity, airtime, data, cable TV, internet, betting, education, flights, and other everyday expenses.' },
      { title: 'Crypto invoices', body: 'Create an invoice, lock the amount, share the payment link, and receive an automatic payment confirmation.' },
      { title: 'Payment links', body: 'Receive supported crypto through a personal or business payment link without building a checkout.' },
      { title: 'Merchant stores', body: 'Create a storefront, list products, accept orders, manage stock, and receive crypto payments.' },
      { title: 'Balance and direct payment', body: 'Fund a KivoraPay balance or complete a supported payment directly through an invoice.' },
      { title: 'Business tools', body: 'Use product uploads, cashier payment codes, invoices, order updates, and bank payouts from one account.' },
    ],
    stats: [
      { value: '500+', label: 'Registered users' },
      { value: '200+', label: 'Transactions completed' },
      { value: '₦1.5M+', label: 'Transaction volume' },
      { value: '10+', label: 'Merchant accounts' },
    ],
    model: ['Transaction fees on crypto bill payments', 'Merchant subscriptions for advanced store tools', 'Fees on selected payment and payout services', 'Future card and business payment services'],
    priorities: ['Improve reliability across every bill category', 'Grow merchant tools and business adoption', 'Strengthen compliance and operational systems', 'Expand customer acquisition and support', 'Continue card product development'],
    support: ['Seed investment', 'Fintech and compliance expertise', 'Distribution partnerships', 'Merchant introductions', 'Product and infrastructure partnerships'],
    paymentUrl: 'https://kivorapay.com/pay/7632295',
    videos: [
      { title: 'Crypto invoice flow', src: 'https://www.youtube-nocookie.com/embed/3jajJ3nSWHM?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3' },
      { title: 'Wallet funding flow', src: 'https://www.youtube-nocookie.com/embed/oLnbfwoeNBU?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3' },
      { title: 'Bill payment flow', src: 'https://www.youtube-nocookie.com/embed/12gAqZI4-RQ?rel=0&modestbranding=1&playsinline=1&iv_load_policy=3' },
    ],
    raise: {
      amount: '$500K',
      details: [{ value: 'Seed', label: 'Round stage' }, { value: '$2.5M', label: 'Valuation cap' }, { value: 'Delaware', label: 'United States company' }, { value: '18 months', label: 'Planned runway' }],
      allocation: [{ percent: '40%', label: 'Product and engineering' }, { percent: '30%', label: 'Growth and acquisition' }, { percent: '20%', label: 'Operations and compliance' }, { percent: '10%', label: 'Reserve' }],
    },
  },
  {
    slug: 'prowess-digital-solutions',
    name: 'Prowess Digital Solutions',
    eyebrow: 'Business education, tools, and digital execution',
    logo: '/brands/pds.png',
    website: 'https://www.prowessdigitalsolutions.com',
    status: 'Open to partnerships, sponsorships, and growth support',
    summary: 'Prowess Digital Solutions helps entrepreneurs learn, structure their businesses, and access practical digital support.',
    introduction: 'Prowess Digital Solutions brings business education, useful tools, opportunities, and digital services into one place for entrepreneurs who need practical help.',
    story: [
      'I built Prowess Digital Solutions after seeing how often good business ideas struggle because the owner lacks structure, clear information, or affordable digital support.',
      'The goal is not to overwhelm entrepreneurs with theory. It is to give them tools, learning, services, and guidance they can use to make better decisions and move forward.',
    ],
    problem: 'Many entrepreneurs are trying to build with scattered information. They struggle with pricing, planning, processes, websites, business documents, marketing, and knowing which opportunity is useful.',
    solution: 'Prowess Digital Solutions combines learning, business tools, templates, opportunities, videos, consultation, and digital services in one practical platform.',
    audience: ['Small business owners', 'Early stage founders', 'Freelancers', 'Job seekers', 'Students', 'People learning digital skills'],
    features: [
      { title: 'Business tools', body: 'Use practical calculators, checklists, templates, invoice tools, and planning resources.' },
      { title: 'Learning library', body: 'Access courses, videos, ebooks, and guides covering business, technology, AI, and digital work.' },
      { title: 'Opportunities', body: 'Discover jobs, grants, scholarships, events, fellowships, and useful programmes.' },
      { title: 'Web and digital services', body: 'Get WordPress websites, content, documentation, product support, and digital execution.' },
      { title: 'Business education', body: 'Join practical training designed to help people understand and apply what they learn.' },
      { title: 'Consultation', body: 'Discuss a business challenge and receive direct guidance based on the current stage and goal.' },
    ],
    stats: [{ value: '500+', label: 'Small businesses impacted' }, { value: '10+', label: 'Products and tools' }, { value: 'Multiple', label: 'Learning formats' }, { value: 'Global', label: 'Digital access' }],
    model: ['Paid digital products and ebooks', 'Business consultation and training', 'WordPress and digital services', 'Sponsored learning and opportunity programmes'],
    priorities: ['Expand the business tools library', 'Publish more structured learning paths', 'Improve the member and purchase experience', 'Build partnerships around training and opportunities', 'Reach more African entrepreneurs'],
    support: ['Training sponsorship', 'Education partnerships', 'Business tool sponsorship', 'Grant support', 'Distribution and community partnerships'],
  },
  {
    slug: 'dritchwear',
    name: 'Dritchwear',
    eyebrow: 'Wear it. Brand it. Gift it.',
    logo: '/brands/dritchwear.png',
    website: 'https://app.dritchwear.com/shop',
    status: 'Open to production, distribution, and corporate partnerships',
    summary: 'Dritchwear is a Nigerian streetwear and custom merchandise business for individuals, brands, teams, companies, and events.',
    introduction: 'Dritchwear combines everyday menswear with custom streetwear, branded merchandise, corporate gifts, and event kits made for real use.',
    story: [
      'Dritchwear began from my interest in creating a practical clothing business that could serve both individual customers and organisations.',
      'The business now connects fashion, branding, gifting, and event needs. Customers can shop ready made pieces or request custom merchandise for a team, company, campaign, or event.',
    ],
    problem: 'Individuals and organisations often struggle to find reliable clothing and merchandise suppliers who can manage design, product quality, branding, ordering, and delivery together.',
    solution: 'Dritchwear provides clothing and custom merchandise through one brand, supported by digital ordering and a clear quote process for bulk projects.',
    audience: ['Men buying everyday streetwear', 'Companies', 'Technology teams', 'Events', 'Schools', 'Creators', 'Campaigns and communities'],
    features: [
      { title: 'Streetwear', body: 'Shop quality menswear designed for comfortable everyday use.' },
      { title: 'Custom merchandise', body: 'Create branded T shirts, hoodies, caps, tote bags, flasks, notebooks, and custom items.' },
      { title: 'Corporate gifts', body: 'Prepare useful branded gifts for staff, clients, partners, and special occasions.' },
      { title: 'Event kits', body: 'Produce coordinated merchandise for conferences, communities, campaigns, and events.' },
      { title: 'Bulk orders', body: 'Place custom orders from 20 pieces with support for product choice, design, and delivery.' },
      { title: 'Digital ordering', body: 'Browse products, request a quote, and manage the first stage of an order online.' },
    ],
    stats: [{ value: '100+', label: 'Orders delivered' }, { value: '50+', label: 'Custom designs' }, { value: '5 star', label: 'Google rating' }, { value: '20', label: 'Minimum bulk quantity' }],
    model: ['Direct sales of ready made clothing', 'Bulk custom merchandise orders', 'Corporate gifting projects', 'Event and campaign merchandise'],
    priorities: ['Increase production capacity', 'Improve fulfilment and delivery systems', 'Expand the menswear collection', 'Reach more corporate buyers', 'Strengthen the digital ordering experience'],
    support: ['Production partnerships', 'Corporate introductions', 'Equipment and inventory funding', 'Distribution partnerships', 'Event and merchandise contracts'],
  },
]

export function getVenture(slug: string) {
  return ventures.find(venture => venture.slug === slug)
}
