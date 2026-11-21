// The /builds page: what Ngozi has actually built with AI tools, Python and
// automation. Every item here is backed by a real repository on her machine
// (kivorapay, hospital/Velantrii, chidexun, prowess-digital_solution_website,
// portfoio), so keep claims to what those repos show.

/** The three questions recruiters ask, answered up front. */
export const answers = [
  {
    q: 'Built real applications with AI coding tools?',
    a: 'Yes. I build applications and use AI coding tools like Claude Code where they help, from a crypto payments platform to a healthcare app.',
  },
  {
    q: 'Worked with AI agents that act, not just write?',
    a: 'I run AI coding agents that write code, run commands, test and fix issues, and I write the operating rules (AGENTS.md / CLAUDE.md) they follow.',
  },
  {
    q: 'Used Python to build something practical?',
    a: 'A computer-vision redaction pipeline, a programmatic video renderer and an accessibility contrast checker.',
  },
]

export type Build = {
  id: string
  /** Honest development status, shown as a badge. */
  status?: string
  /** Screenshot under /public, when there is one. */
  image?: string
  /** For Python tools: the command shown in the terminal header. */
  cmd?: string
  name: string
  kind: string
  summary: string
  did: string[]
  stack: string
  href?: string
  linkLabel?: string
}

export const products: Build[] = [
  {
    id: 'kivorapay', status: 'Live', name: 'KivoraPay',
    kind: 'Fintech platform · Product lead and builder',
    summary: 'Lets people turn crypto (USDT, USDC, BTC) into naira and pay bills such as airtime, data, electricity and TV in one step.',
    did: [
      'A web app, an Android app, a payments relay service and a shared database package.',
      'Deposit detection, rate locking, background crypto conversion, bill payments and an admin panel, with scheduled payment and requery jobs.',
      'Wrote the complete technical documentation (v2.3) for new developers, covering architecture, API reference and deployment.',
    ],
    stack: 'Next.js, TypeScript, Supabase/PostgreSQL, Android (TWA), GitHub Actions, PostHog',
    href: 'https://kivorapay.com/',
    linkLabel: 'Visit KivoraPay',
  },
  {
    id: 'velantrii', status: 'Prototype', image: '/projects/velantrii.jpg', name: 'Velantrii',
    kind: 'Healthcare platform for Nigeria · Prototype',
    summary: 'Connects patients, hospitals, labs, pharmacies and community health workers in one consent-based workspace.',
    did: [
      'Role-based workspaces, appointments, lab orders, pharmacy dispensing, consent renewal and private document uploads.',
      'Automated appointment, medication and urgent blood-request reminders through a scheduled job that sends opt-in SMS.',
    ],
    stack: 'React, TypeScript, Supabase (Edge Functions, PostgreSQL), GitHub Actions, Africa’s Talking SMS',
    href: 'https://velantrii.vercel.app/',
    linkLabel: 'View the prototype',
  },
  {
    id: 'chidexun', status: 'Live', image: '/projects/chidexun.jpg', name: 'Chidexun',
    kind: 'E-commerce catalogue · Client build',
    summary: 'Website for a wholesale and retail plumbing supplier, with a searchable catalogue and a quote workflow.',
    did: [
      'Catalogue search and filters, product pages and a quote list that saves on the device, hands off to WhatsApp and prints as a PDF.',
      'Automated browser checks with Playwright that test quotes, pricing, SEO and mobile, tablet and desktop layouts before release.',
    ],
    stack: 'Next.js, TypeScript, Playwright, Python',
    href: 'https://www.chidexun.com/',
    linkLabel: 'Visit Chidexun',
  },
  {
    id: 'prowess-digital-solutions', status: 'Live', image: '/service-proof/prowess-digital-solutions.png', name: 'Prowess Digital Solutions',
    kind: 'Learning and services platform · Founder',
    summary: 'My business platform: services, courses, jobs and opportunities, events, tools and a shared customer account.',
    did: [
      'Checkout, memberships, certificates, a jobs board, an events system and business-planning tools.',
      'Wrote the AGENTS.md rulebook the AI agents follow: check the whole user journey, test every state and report only what was verified.',
    ],
    stack: 'Next.js, TypeScript, Supabase, payments, transactional email',
    href: 'https://www.prowessdigitalsolutions.com/',
    linkLabel: 'Visit the platform',
  },
  {
    id: 'portfolio', status: 'Live', image: '/projects/portfolio.jpg', name: 'This portfolio',
    kind: 'Personal site · Builder',
    summary: 'The site you are on, with a blog CMS, newsletter, email outreach tool and admin dashboard behind it.',
    did: [
      'Blog editor with inline quizzes and Igbo translations, newsletter sending, outreach email and product analytics.',
    ],
    stack: 'Next.js, TypeScript, Supabase, Resend, PostHog',
    href: '/',
    linkLabel: 'Home',
  },
  {
    id: 'dritchwear', status: 'Live', image: '/service-proof/dritchwear.png', name: 'Dritchwear',
    kind: 'Streetwear & merchandise · Founder',
    summary: 'My streetwear and branded merchandise label: custom apparel, corporate gifts and event kits, with an online store to order them.',
    did: [],
    stack: 'Next.js, e-commerce',
    href: 'https://dritchwear.com/shop',
    linkLabel: 'Visit Dritchwear',
  },
]

export const python: Build[] = [
  {
    id: 'redaction', cmd: 'python process-recordings.py deposit', name: 'Screen-recording redaction pipeline',
    kind: 'Python · Computer vision',
    summary: 'Cuts phone screen recordings into clean clips and automatically blurs account numbers and other private details.',
    did: ['Uses OpenCV template matching to follow sensitive text frame by frame, so it stays hidden even while the screen scrolls.'],
    stack: 'Python, OpenCV, NumPy, ffmpeg',
  },
  {
    id: 'renderer', cmd: 'python render.py video', name: 'Programmatic video renderer',
    kind: 'Python · Automation',
    summary: 'Turns HTML animations into finished social-media videos and stills for KivoraPay and client campaigns.',
    did: ['Drives a headless browser to capture each frame, then streams the frames into ffmpeg to encode an MP4.'],
    stack: 'Python, Playwright, ffmpeg',
  },
  {
    id: 'contrast', cmd: 'python build-design-preview.py', name: 'Brand palette contrast checker',
    kind: 'Python · Accessibility',
    summary: 'Scores brand colour palettes against WCAG contrast rules and builds a visual comparison page for the client.',
    did: ['Calculates relative luminance and contrast ratios for every text and background pair, then flags combinations that fail.'],
    stack: 'Python',
  },
]

export const automations = [
  { title: 'Scheduled payment jobs', text: 'Cron jobs that process pending payments and requery stuck transactions on KivoraPay.' },
  { title: 'SMS reminder worker', text: 'Sends Velantrii’s appointment, medication and blood-request reminders every few minutes.' },
  { title: 'Release checks', text: 'Playwright scripts that test Chidexun’s key journeys and layouts before each release.' },
  { title: 'Docs deployment', text: 'Automated documentation deployment with Jenkins and GitHub Actions at TxFusion.' },
]

/** How she works with AI agents, step by step. */
export const workflow = [
  { step: 'Define', text: 'I write the problem, user journey and acceptance criteria, the same way I would brief an engineering team.' },
  { step: 'Set the rules', text: 'An AGENTS.md or CLAUDE.md file tells the agent how to work: what to check, what never to do and how to report.' },
  { step: 'Build', text: 'The agent writes code, runs commands and tests; I steer decisions on product, security and copy.' },
  { step: 'Verify', text: 'Automated checks and my own review of every state: mobile, dark mode, errors, payments and emails.' },
  { step: 'Ship and monitor', text: 'Deploy, watch analytics and fix what real users run into.' },
]

export const tools = [
  { group: 'AI', items: 'Claude Code, Claude, ChatGPT, Gemini, Grok, Veo, Bolt' },
  { group: 'Languages', items: 'TypeScript, JavaScript, Python, SQL' },
  { group: 'Frameworks', items: 'Next.js, React, Playwright, OpenCV' },
  { group: 'Platforms', items: 'Supabase, Vercel, GitHub Actions, PostHog, WordPress' },
]
