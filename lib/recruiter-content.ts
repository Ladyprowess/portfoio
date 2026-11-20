// The CV page (/recruiter). Source of truth is Ngozi's CV — the same file
// CV_URL points to — so the page and the download always tell the same story.

export const headline = 'AI Strategy & Digital Product Specialist · Technical Writer · Product Builder'

/** How she is open to working, shown under the contact line. */
export const workTypes = 'Open to remote or hybrid roles: full-time, part-time or contract'

export const pitch = 'AI Strategy and Digital Product Specialist helping businesses adopt AI, build useful digital products and improve the way they work, with experience across technical writing, developer documentation, fintech, Web3, digital products, product operations, content strategy and digital-skills education. I combine technical communication with practical product delivery: I took KivoraPay from concept through planning, build coordination, testing and ongoing monitoring, built WordPress websites and digital workflows, and have worked with engineering, product and marketing teams across remote, international environments.'

export type Role = { role: string; org: string; when: string; where: string; points: string[] }

export const experience: Role[] = [
  {
    role: 'Product Lead', org: 'KivoraPay', when: 'Product development & operations', where: '',
    points: [
      'Took KivoraPay, a crypto-to-fiat utility and business payments platform, from initial concept through planning, development coordination, testing, launch preparation and ongoing monitoring.',
      'Defined product direction, user problems, feature requirements and priorities; designed user and payment journeys for deposits, fiat conversion, transfers, bill payments and merchant payments.',
      'Worked across requirements, technical architecture, API workflows and payment integrations, and developed positioning and go-to-market messaging.',
    ],
  },
  {
    role: 'Technical Content Writer', org: 'Point22', when: 'Feb 2026 – Present', where: 'UAE · Remote',
    points: [
      'Create technical, educational and marketing content for Web3 and technology clients, including CustomersChain and CoinTime.',
      'Write product guides, user manuals, explainers and blog articles; set up client YouTube channels and grew a TikTok presence with AI-assisted video.',
      'Contributed to client SEO growth of more than 30%.',
    ],
  },
  {
    role: 'WordPress Content & Digital Product Specialist', org: 'LWCommerce', when: 'Apr 2026 – Sep 2026', where: 'Nigeria · Remote',
    points: [
      'Designed and built WordPress websites, landing pages and responsive layouts, including the BEGIN and LTIF projects.',
      'Developed an event-management and attendee check-in workflow for on-site participant verification.',
    ],
  },
  {
    role: 'Content Strategist', org: 'Bullring Finance', when: 'Jan 2025 – Mar 2025', where: 'Brazil · Remote',
    points: [
      'Developed content strategy and product messaging for a Brazilian financial-services audience.',
      'Increased user engagement by 200% through research-led content, infographics and multimedia.',
    ],
  },
  {
    role: 'Technical Writer', org: 'TxFusion', when: 'Jun 2024 – Apr 2025', where: 'Serbia · Remote',
    points: [
      'Wrote and maintained API documentation and integration guides for cross-border payment systems, and improved the zkSync SDK documentation.',
      'Improved developer satisfaction by 25% and reduced support queries by 15%; automated docs deployment with Jenkins and GitHub Actions.',
    ],
  },
  {
    role: 'Technical Content Writer', org: 'Hawkish Group', when: 'Apr 2024 – Jun 2024', where: 'United Kingdom · Remote',
    points: [
      'Wrote client-facing technical documentation, system manuals, business plans and feasibility studies; content strategies raised client engagement by 15%.',
    ],
  },
  {
    role: 'Lead Consultant', org: 'Prowess Digital Solutions', when: 'Jul 2023 – Present', where: 'Nigeria · Remote',
    points: [
      'Provide technical writing, content strategy, website content and digital-marketing support to businesses and emerging-market clients.',
      'Trained 100+ people in Web3 and blockchain and 200+ businesses and individuals in digital skills; improved client SEO and organic traffic by 20%.',
    ],
  },
  {
    role: 'Crypto Content Writer', org: 'Cwallet', when: 'Mar 2023 – Jul 2024', where: 'Europe · Remote',
    points: [
      'Wrote product blogs, newsletters and technical guides for crypto products, including CCPayment and Giveaway.com.',
      'Increased user engagement by 50%, social interaction by 20% and organic traffic by 10%.',
    ],
  },
  {
    role: 'Senior Technical Writer', org: 'WriteTech Hub (formerly Zaycodes)', when: 'Jul 2022 – Feb 2025', where: 'Nigeria · Remote',
    points: [
      'First technical writer at the organisation; wrote user manuals and API documentation for clients including Rootstock and Magnopus.',
      'Helped launch the WriteTech Bootcamp, which has trained 1,000+ aspiring technical writers; reduced documentation turnaround by 20%.',
    ],
  },
  {
    role: 'Open Source Contributor', org: 'Jenkins · She Code Africa Contributhon', when: 'Mar 2022 – Jun 2022', where: 'Remote',
    points: ['Contributed to the Jenkins Inclusive Naming project and improved documentation through GitHub pull requests and maintainer reviews.'],
  },
  {
    role: 'Customer Support Representative', org: 'HK Fashion (now Soofluffy)', when: '2018 – Nov 2020', where: 'Nigeria',
    points: ['Created FAQs and response templates and tracked recurring complaints, reducing customer-support issues by 45%.'],
  },
]

export const achievements = [
  { label: 'Product ownership', text: 'Led KivoraPay from concept to launch preparation and ongoing monitoring.' },
  { label: 'Developer experience', text: '+25% developer satisfaction and −15% support queries at TxFusion.' },
  { label: 'Content performance', text: '+200% engagement at Bullring Finance; +50% at Cwallet.' },
  { label: 'SEO', text: '30%+ client SEO growth at Point22; 20% at Prowess Digital Solutions.' },
  { label: 'Education', text: 'Trained 100+ people in Web3 and 200+ in practical digital skills.' },
  { label: 'Community', text: 'Helped launch a bootcamp that has trained 1,000+ technical writers.' },
]

export const skills = [
  { group: 'AI & building', items: 'Building applications with Claude Code and AI coding agents, agent operating rules (AGENTS.md), AI-assisted workflows, Python automation' },
  { group: 'Writing & docs', items: 'Technical writing, API documentation, integration guides, SDK documentation, developer education' },
  { group: 'Product', items: 'Product strategy and requirements, digital product development, product operations, workflow design' },
  { group: 'Domains', items: 'Fintech and payment systems, Web3 and blockchain' },
  { group: 'Content', items: 'Content strategy and SEO, AI-assisted content and video production, training and mentoring, customer experience' },
  { group: 'Tech', items: 'TypeScript, Python, SQL, Next.js, Supabase, Playwright, OpenCV, Git, GitHub Actions, Jenkins, WordPress' },
]

export const projects = [
  { title: 'KivoraPay', text: 'End-to-end product work on a crypto-to-fiat utility and business payments platform.', href: 'https://kivorapay.com/' },
  { title: 'Velantrii', text: 'Healthcare platform prototype for Nigeria, built with AI coding agents: consent-based records, appointments, pharmacy and SMS reminders.', href: 'https://velantrii.vercel.app/' },
  { title: 'Chidexun', text: 'Catalogue and quote-workflow website for a plumbing supplier, with automated Playwright release checks.', href: 'https://www.chidexun.com/' },
  { title: 'Python tools', text: 'OpenCV pipeline that auto-blurs private data in screen recordings; Playwright and ffmpeg video renderer; WCAG contrast checker.' },
  { title: 'TrustBallot', text: 'Blockchain-based voting solution; winning team at WIBAHacks 2023.' },
  { title: 'Jenkins Inclusive Naming', text: 'Open-source documentation contribution through She Code Africa Contributhon 2022.' },
  { title: 'BEGIN and LTIF', text: 'Digital projects delivered through WordPress content and implementation at LWCommerce.' },
  { title: 'WriteTech Bootcamp', text: 'Technical-writing education initiative that has trained 1,000+ aspiring writers.' },
]

export const education = { title: 'B.Sc. (Ed.) Home Economics Education', org: 'University of Uyo, Akwa Ibom State, Nigeria', year: '2023', note: 'Issued under my former name, Ngozi Peace Okafor.' }

export const certifications = [
  { title: 'Developer Relations', org: 'DXMentorship' },
  { title: 'Blockchain and Web3 Development', org: 'Women in Blockchain Africa' },
  { title: 'Open Source Contribution', org: 'She Code Africa' },
  { title: 'Attention to Detail', org: 'TestDome' },
]

export const awards = [
  { title: 'Winning team, TrustBallot', org: 'WIBAHacks 2023' },
  { title: 'Most Problem Solver', org: 'WriteTech Hub, 2024' },
  { title: 'Mood Booster', org: 'WriteTech Hub, 2024' },
  { title: 'Most Likely to Say “This Could Be an Email”', org: 'WriteTech Hub, 2024' },
]

export const LINKEDIN_URL = 'https://www.linkedin.com/in/peace-ngozi-okafor'
