// The recruiter view: everything a hiring manager needs in one screen.
// Source of truth is Ngozi's CV (roles, dates, locations and results), so the
// page and the CV a recruiter downloads always tell the same story.

export const headline = 'Technical Writer & Technical Communicator · Web3, Fintech & Developer Documentation'

export const openTo = ['Technical Writing', 'API Documentation', 'Developer Education', 'Content Strategy', 'Product Communication']

/** How she is open to working, shown in the status pill and under the role chips. */
export const workTypes = 'Remote, hybrid, full-time, part-time or contract'

export const pitch = 'Technical writer and technical communicator with 4+ years of experience writing documentation and content for fintech, Web3, payments and developer products. I write API documentation, integration guides, tutorials and product education that help developers and users understand and adopt products faster. I have worked remotely with teams in Brazil, Serbia, the United Kingdom and Europe, alongside engineering, product and marketing. I am also a trainer and community builder: I have trained 100+ people in Web3, and as the first technical writer at WriteTech Hub I helped launch a bootcamp that has trained 1,000+ aspiring technical writers.'

/** Results taken straight from the CV. */
export const glance = [
  { value: '+25%', label: 'developer satisfaction', where: 'TxFusion' },
  { value: '−45%', label: 'customer support issues', where: 'HK Fashion (now Soofluffy)' },
  { value: '+200%', label: 'user engagement', where: 'Bullring Finance' },
  { value: '1,000+', label: 'technical writers trained by the bootcamp I helped launch', where: 'WriteTech Hub' },
]

export const experience: { role: string; org: string; when: string; where: string; points: string[] }[] = [
  {
    role: 'Technical Content Writer', org: 'Point22', when: '02/2026 – Present', where: 'UAE',
    points: [
      'Create content for Point22’s Web3 and tech clients, including Customerschain and Cointime (crypto OTC and crypto ATM platforms), across blog, social media and video.',
      'Launched YouTube channels for Customerschain and Cointime, started and grew the TikTok account, and grew client SEO by over 30%.',
    ],
  },
  {
    role: 'WordPress Content & Digital Product Specialist', org: 'LWCommerce', when: '04/2026 – 09/2026', where: 'Nigeria',
    points: ['Designed and built WordPress websites, landing pages and responsive layouts across LWCommerce, including BEGIN and LTIF.', 'Built an event management and attendee check-in workflow for on-site participant verification.'],
  },
  {
    role: 'Content Strategist', org: 'Bullring Finance', when: '01/2025 – 03/2025', where: 'Brazil',
    points: ['Increased user engagement by 200% through infographics and multimedia content across web and social channels.', 'Developed content strategy and product messaging for a Brazilian financial services audience; managed editorial planning, SEO and brand consistency.'],
  },
  {
    role: 'Technical Writer', org: 'TxFusion', when: '06/2024 – 04/2025', where: 'Serbia',
    points: [
      'Wrote and maintained API documentation and integration guides for cross-border payment systems, and improved the zkSync SDK documentation.',
      'Improved developer satisfaction by 25% and cut support queries by 15%; automated docs deployment with Jenkins and GitHub Actions.',
    ],
  },
  {
    role: 'Technical Content Writer', org: 'Hawkish Group', when: '04/2024 – 06/2024', where: 'United Kingdom',
    points: ['Wrote client-facing technical documentation, system manuals and marketing content; built content strategies that raised client engagement by 15%.'],
  },
  {
    role: 'Founder', org: 'Prowess Digital Solutions', when: '07/2023 – Present', where: 'Nigeria',
    points: ['Run a digital content business for fintech and emerging-market clients: technical writing, content strategy, website content and digital marketing.', 'Trained 100+ people in Web3 and blockchain and 200+ businesses and individuals in digital skills; improved client SEO and organic traffic by 20%.'],
  },
  {
    role: 'Crypto Content Writer', org: 'Cwallet', when: '03/2023 – 07/2024', where: 'Europe',
    points: ['Wrote product blogs, newsletters and technical guides for crypto products including CCPayment and Giveaway.com.', 'Increased user engagement by 50%, social interaction by 20% and organic traffic by 10% through SEO-focused content.'],
  },
  {
    role: 'Senior Technical Writer', org: 'WriteTech Hub (formerly Zaycodes)', when: '07/2022 – 02/2025', where: 'Nigeria',
    points: [
      'First technical writer hired; managed technical writing projects across fintech, blockchain and DevOps, including user manuals and API docs for Rootstock and Magnopus.',
      'Helped launch the WriteTech Bootcamp, which has trained 1,000+ aspiring technical writers; cut documentation turnaround by 20%.',
    ],
  },
  {
    role: 'Open Source Contributor', org: 'Jenkins (She Code Africa Contributhon 2022)', when: '03/2022 – 06/2022', where: '',
    points: ['Contributed to the Jenkins Inclusive Naming project and improved documentation and version-control guides, working with maintainers through GitHub pull requests.'],
  },
  {
    role: 'Customer Support Representative', org: 'HK Fashion (now Soofluffy)', when: '2018 – 11/2020', where: 'Nigeria',
    points: [
      'Reduced customer support issues by 45% by improving how customer questions and complaints were handled.',
      'Wrote FAQs and reply templates so customers got clear, consistent answers faster, the start of my documentation work.',
    ],
  },
]

export const skills = [
  { group: 'Technical writing', items: ['API documentation', 'Integration guides', 'Tutorials', 'User guides', 'Technical explainers', 'Docs-as-code'] },
  { group: 'Developer & product content', items: ['Developer education', 'Onboarding content', 'Product communication', 'eBooks', 'Content localisation'] },
  { group: 'Web3 & fintech', items: ['Blockchain', 'zkSync', 'Rootstock', 'Crypto wallets', 'Payments', 'Cross-border payment APIs'] },
  { group: 'Training & community', items: ['Web3 training', 'Bootcamp design', 'Mentoring', 'Workshops'] },
  { group: 'Content strategy', items: ['SEO', 'Editorial planning', 'Brand consistency', 'Multimedia content'] },
  { group: 'Tools', items: ['GitHub', 'GitHub Actions', 'Jenkins', 'WordPress', 'CMS platforms'] },
]

export const awards = [
  { title: 'Winning team (TrustBallot)', org: 'WIBAHacks 2023, Women in Blockchain Africa' },
  { title: 'Most Problem Solver', org: 'WriteTech Hub, 2024' },
  { title: 'Mood Booster', org: 'WriteTech Hub, 2024' },
  { title: 'Most Likely to Say “This Could Be an Email”', org: 'WriteTech Hub, 2024' },
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
  { label: 'Websites', title: 'Chidexun Plumbing Supplies, LWCommerce and other sites I built', href: 'https://www.chidexun.com/' },
  { label: 'Product', title: 'KivoraPay, the crypto payments platform I founded', href: 'https://kivorapay.com/' },
]

export const quote = { text: 'One of the best technical writers I have come across. Ngozi has a real gift for turning complex ideas into structured, clear, engaging content.', name: 'Abdullah T.', role: 'Data Engineer' }

export const LINKEDIN_URL = 'https://www.linkedin.com/in/peace-ngozi-okafor'
