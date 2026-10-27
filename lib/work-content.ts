// Everything on the Work page. Moved here from the old ServiceProof and
// CaseStudies components so the page and its sections share one source.

export type WorkItem = { title: string; description: string; image: string; href: string; linkLabel: string }

export const websites: WorkItem[] = [
      { title: 'Prowess Digital Solutions', description: 'A practical platform connecting people with learning, opportunities, tools, and business support.', image: '/service-proof/prowess-digital-solutions.png', href: 'https://www.prowessdigitalsolutions.com', linkLabel: 'Visit website' },
      { title: 'Testers Connect', description: 'A community website built to connect quality assurance professionals with resources, events, jobs, and mentorship.', image: '/service-proof/testers-connect.png', href: 'https://testersconnect.com', linkLabel: 'View project preview' },
      { title: 'Dritchwear', description: 'A merchandise commerce experience for custom apparel, corporate gifts, event kits, and branded products.', image: '/service-proof/dritchwear.png', href: 'https://dritchwear.com', linkLabel: 'Visit website' },
      { title: 'BEGIN', description: 'A digital home for the Business Expansion & Growth Initiative, connecting entrepreneurs to training, mentorship, investment access and strategic partnerships.', image: '/projects/lw-commerce-begin.jpg', href: 'https://begin.lwcommerce.org/', linkLabel: 'Visit website' },
      { title: 'BEGIN Admin', description: 'A secure entry point for the BEGIN administration console, designed to keep programme management focused and straightforward.', image: '/projects/lw-commerce-dashboard.png', href: 'https://begin.lwcommerce.org/admin-dashboard', linkLabel: 'Visit portal' },
      { title: 'LoveWorld Trade & Investment Forum', description: 'An event platform for bringing entrepreneurs, investors, policymakers and innovators together around trade and investment.', image: '/projects/ltif.jpg', href: 'https://ltif.lwcommerce.org/', linkLabel: 'Visit website' },
    ]

export const writing: WorkItem[] = [
      { title: 'LBank', description: 'Crypto market education, industry coverage, and product focused articles.', image: '/service-proof/case-study-lbank.jpg', href: 'https://www.lbank.com/creator/profile/ladyprowess', linkLabel: 'Read my work' },
      { title: 'Bullring Finance', description: 'DeFi education, protocol explainers, and practical blockchain content.', image: '/service-proof/case-study-bullring.jpg', href: 'https://blog.bullring.finance/en/author/ngozipeaceokafor/', linkLabel: 'Read my work' },
      { title: 'UEEx', description: 'Crypto guides and market content written for a global exchange audience.', image: '/service-proof/case-study-ueex.jpg', href: 'https://blog.ueex.com/author/ngozi/', linkLabel: 'Read my work' },
      { title: 'UPay', description: 'Product education and payment content for people using digital assets.', image: '/service-proof/case-study-upay.jpg', href: 'https://blog.upay.best/author/ngozi/', linkLabel: 'Read my work' },
      { title: 'Giveaway.com', description: 'Campaign education and practical content for brands building engaged communities.', image: '/brands/giveaway_com.jpeg', href: 'https://giveaway.com/blog/author/okafor/', linkLabel: 'Read my work' },
      { title: 'CCPayment', description: 'Crypto payment guides, business education, and product led content.', image: '/service-proof/case-study-ccpayment.jpg', href: 'https://ccpayment.com/blog/author/okafor/', linkLabel: 'Read my work' },
      { title: 'DEV Community', description: 'Technical articles, tutorials, and practical lessons for builders.', image: '/service-proof/case-study-devto.jpg', href: 'https://dev.to/ladyprowess', linkLabel: 'Read my work' },
      { title: 'WriteTech Hub', description: 'Technical writing resources, career guidance, and educational content.', image: '/service-proof/case-study-writetechhub.jpg', href: 'https://writetechhub.org/author/ladyprowess/', linkLabel: 'Read my work' },
    ]

export const learning: WorkItem[] = [
      { title: 'Video Learning Library', description: 'Practical video lessons covering Web3, business, career growth, and useful digital skills.', image: '/service-proof/video-library.png', href: 'https://www.prowessdigitalsolutions.com/videos', linkLabel: 'Watch the lessons' },
      { title: 'Learn Web3 with Lady Prowess', description: 'Lessons and practical explanations for people building confidence in Web3 and emerging technology.', image: '/service-proof/web3-training.jpg', href: 'https://ladyprowess.substack.com/', linkLabel: 'Explore the lessons' },
      { title: 'Ebook and Resource Library', description: 'A digital library where readers can discover and buy ebooks, guides, templates, checklists, and other useful resources.', image: '/service-proof/digital-library.png', href: 'https://www.prowessdigitalsolutions.com/resources', linkLabel: 'Visit the library' },
    ]

export const caseStudies = [
  {
    name: 'Prospult',
    desc: 'A written brand case study for a B2B prospecting platform, focused on positioning, messaging clarity, and product value.',
    href: 'https://docs.google.com/document/d/1sV_J_iikUSUtBztg6H3dezYifhoyEXZaX8YDkxAPTPg/edit?usp=sharing',
    image: '/service-proof/brand-case-prospult.jpg',
  },
  {
    name: 'Three Movers',
    desc: 'A written case study for a relocation and moving services brand, shaped for clarity, search relevance, and reader confidence.',
    href: 'https://docs.google.com/document/d/1oZSJHBPZ8JBrAYQ5kfU5XOZucHAbV1ORX1S27ZZVdkc/edit?usp=sharing',
    image: '/service-proof/brand-case-three-movers.jpg',
  },
  {
    name: 'Giftvant',
    desc: 'A written case study for a digital gifting and loyalty rewards platform, translating product use cases into a clear brand story.',
    href: 'https://docs.google.com/document/d/1L-47UUPHsd0reieSVOV2cex3_PV1Qh-XxuilbkIiwpA/edit?usp=sharing',
    image: '/service-proof/brand-case-giftvant.jpg',
  },
  {
    name: 'UEEX',
    desc: 'A written case study for a centralised crypto trading platform, covering exchange education and technical product communication.',
    href: 'https://docs.google.com/document/d/1LwssJU3c6CfrqO2fW8Tvr1nm6OAYNLttNYa1Dgxnowc/edit?usp=sharing',
    image: '/service-proof/brand-case-ueex.jpg',
  },
  {
    name: 'Solevant',
    desc: 'A written case study for a lifestyle brand, focused on brand identity, product language, and storytelling for its audience.',
    href: 'https://docs.google.com/document/d/19BrIcrzEP3RWCV89YtYub1ogclLR_Or5UZCKGOLHgeM/edit?tab=t.0',
    image: '/service-proof/brand-case-solevant.jpg',
  },
  {
    name: 'UPay',
    desc: 'A written case study for a payment solution supporting multiple currencies, explaining product value, onboarding, and user education.',
    href: 'https://docs.google.com/document/d/1HNnhHOL3BQYMgUe4RW-73Bm8Nfq7IOME2Ca7eWJ3WVU/edit?usp=sharing',
    image: '/service-proof/brand-case-upay.jpg',
  },
]

export const lwCommercePages: { title: string; links: [string, string][] }[] = [
  { title: 'Departments', links: [['All departments', 'https://lwcommerce.org/departments/'], ['Human Capital Development', 'https://lwcommerce.org/departments/?lwc=human-capital-development'], ['Finance & Treasury', 'https://lwcommerce.org/departments/?lwc=finance-treasury'], ['Media, Communications & Public Relations', 'https://lwcommerce.org/departments/?lwc=media-communications-public-relations'], ['Enterprise Growth & Development', 'https://lwcommerce.org/departments/?lwc=enterprise-growth-development'], ['E-Commerce & Digital Trade', 'https://lwcommerce.org/departments/?lwc=e-commerce-digital-trade'], ['Digital Infrastructure & Innovation', 'https://lwcommerce.org/departments/?lwc=digital-infrastructure-innovation'], ['Legal & Policy Regulations', 'https://lwcommerce.org/departments/?lwc=legal-policy-regulations'], ['Economic Research & Statistics', 'https://lwcommerce.org/departments/?lwc=economic-research-statistics'], ['Commerce Programs & Events', 'https://lwcommerce.org/departments/?lwc=commerce-programs-events'], ['Investments & Partnerships', 'https://lwcommerce.org/departments/?lwc=investments-partnerships']] },
  { title: 'Regulatory agencies', links: [['All regulatory agencies', 'https://lwcommerce.org/regulatory-agencies/'], ['Consumer Protection Agency', 'https://lwcommerce.org/regulatory-agencies/?lwc=consumer-protection-agency'], ['Finance Reporting Agency', 'https://lwcommerce.org/regulatory-agencies/?lwc=finance-reporting-agency'], ['Loveworld Enterprise Development Agency', 'https://lwcommerce.org/regulatory-agencies/?lwc=loveworld-enterprise-development-agency'], ['Loveworld Trade & Export Promotion Agency', 'https://lwcommerce.org/regulatory-agencies/?lwc=loveworld-trade-export-promotion-agency'], ['Investment Promotion Agency', 'https://lwcommerce.org/regulatory-agencies/?lwc=investment-promotion-agency']] },
  { title: 'Commercial corporations', links: [['All commercial corporations', 'https://lwcommerce.org/commercial-coporations/'], ['Loveworld Inspectorate Administration', 'https://lwcommerce.org/commercial-coporations/?lwc=loveworld-inspectorate-administration'], ['Loveworld Business House', 'https://lwcommerce.org/commercial-coporations/?lwc=loveworld-business-house'], ['Loveworld Standards Organisation', 'https://lwcommerce.org/commercial-coporations/?lwc=loveworld-standards-organisation'], ['Loveworld Bank of Industry', 'https://lwcommerce.org/commercial-coporations/?lwc=loveworld-bank-of-industry'], ['Loveworld Free Trade Zone', 'https://lwcommerce.org/commercial-coporations/?lwc=loveworld-free-trade-zone']] },
  { title: 'Event pages', links: [['LoveWorld Trade & Investment Forum events', 'https://ltif.lwcommerce.org/events/'], ['LW Commerce events', 'https://lwcommerce.org/events/'], ['BEGIN events', 'https://begin.lwcommerce.org/events/']] },
]
