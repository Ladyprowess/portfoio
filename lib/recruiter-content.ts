// The recruiter view: everything a hiring manager needs in one screen.
// Source of truth is Ngozi's CV (roles, dates, locations and results), so the
// page and the CV a recruiter downloads always tell the same story.

export const headline = 'Technical Writer & Content Strategist'

export const openTo = ['Technical Writing', 'API Documentation', 'Developer Education', 'Content Strategy', 'Product Communication']

export const pitch = 'I started in customer support, answering the questions people get stuck on. Now I write the documentation, guides and product education that stop those questions coming: API docs, integration guides and tutorials across fintech, Web3, payments and web platforms, working with product, engineering, marketing and business teams.'

/** Results taken straight from the CV. */
export const glance = [
  { value: '+25%', label: 'developer satisfaction', where: 'txFusion' },
  { value: '−45%', label: 'recurring customer issues', where: 'Soofluffy' },
  { value: '+200%', label: 'user engagement', where: 'Bullring Finance' },
  { value: '200+', label: 'businesses and people trained', where: 'Prowess Digital Solutions' },
]

export const experience: { role: string; org: string; when: string; where: string; points: string[] }[] = [
  {
    role: 'WordPress Content & Digital Product Specialist', org: 'LWCommerce', when: '04/2026 – 09/2026', where: '',
    points: ['Designed and built WordPress websites, landing pages and responsive layouts across LWCommerce, including BEGIN and LTIF.', 'Built an event management and attendee check-in workflow for on-site participant verification.'],
  },
  {
    role: 'Content Strategist', org: 'Bullring Finance', when: '01/2025 – 03/2025', where: 'Brazil',
    points: ['Increased user engagement by 200% through high-performing infographics and multimedia content.', 'Led content strategy, editorial planning, SEO and brand consistency for a financial services audience.'],
  },
  {
    role: 'Technical Writer', org: 'txFusion', when: '06/2024 – 04/2025', where: 'Serbia',
    points: ['Wrote and maintained API documentation and integration guides for cross-border payment systems.', 'Improved developer satisfaction by 25% and cut support queries by 15%; automated docs deployment with Jenkins and GitHub Actions.'],
  },
  {
    role: 'Technical Content Writer', org: 'Hawkish Group', when: '04/2024 – 06/2024', where: 'United Kingdom',
    points: ['Created business and technical documentation, system manuals and marketing content; raised client engagement by 15%.'],
  },
  {
    role: 'Crypto Content Writer', org: 'Cwallet', when: '03/2023 – 07/2024', where: 'Europe',
    points: ['Product-led blogs, newsletters and technical guides for crypto products including CCPayment and Giveaway.com.', 'Improved user engagement by 50% and organic traffic by 10% through SEO-focused product content.'],
  },
  {
    role: 'Founder', org: 'Prowess Digital Solutions', when: '07/2023 – Present', where: 'Nigeria',
    points: ['Lead a digital content business for fintech and emerging-market clients.', 'Improved client SEO and organic traffic by 20%; trained more than 200 businesses and individuals.'],
  },
  {
    role: 'Senior Technical Writer', org: 'WriteTech Hub', when: '07/2022 – 02/2025', where: 'Nigeria',
    points: ['Managed technical writing projects and team delivery across fintech, blockchain and DevOps.', 'Cut documentation turnaround by 20%; led eBook and content-localisation projects for global audiences.'],
  },
  {
    role: 'Open Source Contributor (Contract)', org: 'Jenkins', when: '03/2022 – 06/2022', where: '',
    points: ['Improved open-source documentation and version-control guides for developers.'],
  },
  {
    role: 'Customer Support Specialist', org: 'Soofluffy', when: '02/2018 – 11/2020', where: '',
    points: [
      'Reduced recurring customer issues by 45% by tracing the most common questions to their root cause and fixing them with clearer answers and processes.',
      'Ran customer support across email and social media, resolving order, delivery and product queries end to end.',
      'Managed order fulfilment and order queries, keeping customers informed from purchase to delivery.',
      'Turned repeated customer questions into reusable responses and help content, the start of my documentation work.',
    ],
  },
]

export const skills = [
  { group: 'Technical writing', items: ['Technical documentation', 'API documentation', 'Integration guides', 'Tutorials'] },
  { group: 'Product & developer content', items: ['Product education', 'Developer communication', 'User guides', 'Onboarding'] },
  { group: 'Technology', items: ['Web3', 'Blockchain', 'Fintech', 'Payments', 'APIs'] },
  { group: 'Content strategy', items: ['SEO', 'Editorial planning', 'Product communication'] },
  { group: 'Web & CMS', items: ['WordPress', 'Responsive web design', 'Website implementation'] },
  { group: 'Customer support', items: ['Email and social media support', 'Order fulfilment', 'Issue resolution', 'Help content'] },
  { group: 'Delivery', items: ['Cross-functional work', 'Docs workflows', 'Jenkins', 'GitHub Actions', 'Open source'] },
]

export const education = [
  { title: 'BSc, Home Economics', org: 'University of Uyo, Akwa Ibom', year: '2021' },
]

export const certifications = [
  { title: 'Developer Relations', org: 'DXMentorship' },
  { title: 'Blockchain and Web3 Development', org: 'Women in Blockchain Africa' },
  { title: 'Open Source Contribution', org: 'She Code Africa' },
  { title: 'Attention to Detail', org: 'TestDome' },
]

export const proof = [
  { label: 'Writing samples', title: 'Published articles for LBank, Bullring Finance, UEEx, CCPayment and more', href: '/services#writing' },
  { label: 'Websites', title: 'LWCommerce, BEGIN, LTIF and other WordPress sites I built', href: '/services#web' },
  { label: 'Product', title: 'KivoraPay, the crypto payments platform I founded', href: 'https://kivorapay.com/' },
]

export const quote = { text: 'One of the best technical writers I have come across. Ngozi has a real gift for turning complex ideas into structured, clear, engaging content.', name: 'Abdullah T.', role: 'Data Engineer' }

export const LINKEDIN_URL = 'https://www.linkedin.com/in/peace-ngozi-okafor'
