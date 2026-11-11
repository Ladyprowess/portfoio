'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { Callout, Code, CodeTabs, Endpoint, Faq, H2, Hotspots, Lifecycle, P, Params, Playground, Steps, Table, Terminal } from './blocks'

export type Ctx = { lang: string; setLang: (l: string) => void; go: (id: string) => void }
export type DocPage = { id: string; group: string; title: string; lead: string; keywords?: string; toc: { id: string; label: string }[]; body: (ctx: Ctx) => ReactNode }

const EMAIL = 'mailto:hello@ladyprowess.com?subject=Technical%20writing%20enquiry'

/* ── Shared samples ──────────────────────────── */

const createPayment = {
  cURL: `curl https://sandbox.relaypay.test/v1/payments \\
  -H "Authorization: Bearer $RELAY_SECRET_KEY" \\
  -H "Idempotency-Key: 6f1c2b9e-order-0142" \\
  -d amount=12500 \\
  -d currency=NGN \\
  -d reference=inv_0142`,
  JavaScript: `import Relay from "@relaypay/node"

const relay = new Relay(process.env.RELAY_SECRET_KEY)

const payment = await relay.payments.create(
  { amount: 12500, currency: "NGN", reference: "inv_0142" },
  { idempotencyKey: "6f1c2b9e-order-0142" }
)

console.log(payment.id, payment.status) // pay_8Qw2LmT4 pending`,
  Python: `import os
from relaypay import Relay

relay = Relay(os.environ["RELAY_SECRET_KEY"])

payment = relay.payments.create(
    amount=12500,
    currency="NGN",
    reference="inv_0142",
    idempotency_key="6f1c2b9e-order-0142",
)

print(payment.id, payment.status)  # pay_8Qw2LmT4 pending`,
}

const SampleNote = () => (
  <Callout kind="note" title="About this sample">
    Relay is a fictional payments product. I wrote this page for my portfolio to show how I document an API end to end: the structure, the code, the errors and the edge cases. Client documentation I wrote is listed under <b>Projects</b>.
  </Callout>
)

/* ── Pages ───────────────────────────────────── */

export const pages: DocPage[] = [
  {
    id: 'overview',
    group: 'Start here',
    title: 'Technical writing and documentation',
    lead: 'I make complex products easy to understand. For over nine years I have written API references, developer guides, technical manuals and product documentation for software and Web3 teams.',
    toc: [{ id: 'at-a-glance', label: 'At a glance' }, { id: 'what-i-write', label: 'What I write' }, { id: 'where-to-start', label: 'Where to start' }],
    body: ({ go }) => (
      <>
        <H2 id="at-a-glance">At a glance</H2>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {[['9+ years', 'writing technical content'], ['Rootstock, ZKsync, Magnopus', 'documentation projects'], ['Jenkins', 'open-source contributor']].map(([v, l]) => (
            <div key={l} className="rounded-xl border border-ink-border bg-surface p-4"><p className="font-display text-[1.05rem] font-extrabold">{v}</p><p className="mt-1 text-xs text-muted">{l}</p></div>
          ))}
        </div>
        <P>This page is built the way good documentation is built: a clear structure, search, working code samples, a request you can run, and pages that link to each other. Everything on it is interactive, so you can judge the work by using it.</P>

        <H2 id="what-i-write">What I write</H2>
        <Table head={['Type', 'What it does for the reader']} rows={[
          ['API references', 'Every endpoint, parameter, response and error, accurate enough to build against.'],
          ['Quickstarts and integration guides', 'The shortest route from zero to a working result.'],
          ['Developer documentation', 'Concepts, architecture and tutorials for engineers adopting a platform.'],
          ['Technical manuals and user guides', 'Step-by-step help for people using a product, with troubleshooting.'],
          ['Release notes', 'What changed, who it affects and what to do about it.'],
        ]} />

        <H2 id="where-to-start">Where to start</H2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[['projects', 'Projects', 'Rootstock, Magnopus, ZKsync and Jenkins.'], ['quickstart', 'Live samples', 'A quickstart, API reference, user guide and more.'], ['process', 'How I work', 'From research to a published, maintained page.'], ['skills', 'Skills and tools', 'Docs-as-code, Git, CI and the web stack.']].map(([id, t, b]) => (
            <button key={id} type="button" onClick={() => go(id)} className="group rounded-xl border border-ink-border bg-surface p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg">
              <p className="font-display font-extrabold">{t} <span className="inline-block text-primary transition group-hover:translate-x-1">→</span></p>
              <p className="mt-1 text-sm text-muted">{b}</p>
            </button>
          ))}
        </div>
      </>
    ),
  },
  {
    id: 'process',
    keywords: 'docs as code github actions ci review',
    group: 'Start here',
    title: 'How I work',
    lead: 'Documentation is a product. I research it, structure it, test it and keep it current like one.',
    toc: [{ id: 'workflow', label: 'Workflow' }, { id: 'docs-as-code', label: 'Docs as code' }, { id: 'standards', label: 'Standards I hold' }],
    body: () => (
      <>
        <H2 id="workflow">Workflow</H2>
        <Steps items={[
          { title: 'Understand the reader', body: 'Who is arriving, what they already know, and what they need to get done.' },
          { title: 'Learn the product hands-on', body: 'I use it, run the code, read the source and interview the engineers who built it.' },
          { title: 'Design the information architecture', body: 'Concepts, tasks and reference each get their own place, so readers know where to look.' },
          { title: 'Write and test every step', body: 'Each command and code sample is run before it is published.' },
          { title: 'Review with engineers', body: 'Technical accuracy is checked by the people closest to the code.' },
          { title: 'Publish and maintain', body: 'Docs ship with the release, and stale pages are found and fixed.' },
        ]} />
        <H2 id="docs-as-code">Docs as code</H2>
        <P>Documentation lives next to the code, goes through pull requests and is checked automatically before it ships.</P>
        <CodeTabs title=".github/workflows/docs.yml" samples={{ YAML: `name: docs
on: [pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run lint:docs    # style and broken links
      - run: npm run build:docs   # fails on invalid pages` }} />
        <H2 id="standards">Standards I hold</H2>
        <Table head={['Standard', 'In practice']} rows={[
          ['Accurate', 'Every code sample runs. Every parameter matches the API.'],
          ['Task first', 'Pages start with what the reader is trying to do.'],
          ['Plain language', 'Short sentences, defined terms, no unexplained jargon.'],
          ['Findable', 'Clear titles, consistent structure and search that works.'],
          ['Maintained', 'Owned, versioned and reviewed with each release.'],
        ]} />
      </>
    ),
  },
  {
    id: 'projects',
    keywords: 'rootstock zksync magnopus jenkins she code africa txfusion zaycodes writetech hub open source',
    group: 'Projects',
    title: 'Selected projects',
    lead: 'Documentation and developer resources I have written for software and Web3 teams.',
    toc: [{ id: 'rootstock', label: 'Rootstock' }, { id: 'magnopus', label: 'Magnopus' }, { id: 'zksync', label: 'ZKsync' }, { id: 'jenkins', label: 'Jenkins' }, { id: 'more-work', label: 'More work' }],
    body: () => (
      <>
        {[
          { id: 'rootstock', name: 'Rootstock', org: 'Zaycodes / WriteTech Hub', body: 'Technical documentation and developer resources for the Rootstock ecosystem.', areas: ['API documentation', 'Developer guides', 'Technical documentation'], href: 'https://dev.rootstock.io', site: 'dev.rootstock.io' },
          { id: 'magnopus', name: 'Magnopus', org: 'Zaycodes / WriteTech Hub', body: 'Technical writing and documentation for Magnopus projects.', areas: ['Technical manuals', 'Product documentation', 'Technical guides'], href: 'https://www.magnopus.com', site: 'magnopus.com' },
          { id: 'zksync', name: 'ZKsync', org: 'txFusion', body: 'Technical writing work involving the ZKsync ecosystem.', areas: ['API documentation', 'Developer resources', 'Technical documentation'], href: 'https://docs.zksync.io', site: 'docs.zksync.io' },
          { id: 'jenkins', name: 'Jenkins', org: 'Open-source contributor', body: 'Contributed to the Jenkins open-source project through a programme sponsored by She Code Africa.', areas: ['Open-source contribution', 'Documentation', 'Community'], href: 'https://www.jenkins.io', site: 'jenkins.io' },
        ].map(p => (
          <section key={p.id}>
            <H2 id={p.id}>{p.name}</H2>
            <div className="mt-4 rounded-xl border border-ink-border bg-surface p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{p.org}</p>
              <p className="mt-2 text-[0.98rem] leading-7">{p.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">{p.areas.map(a => <span key={a} className="rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary">{a}</span>)}</div>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink-border pt-4 text-sm">
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">Project site: {p.site} ↗</a>
                <a href={EMAIL} className="text-muted hover:text-parchment">Ask for links to my pages →</a>
              </div>
            </div>
          </section>
        ))}
        <H2 id="more-work">More work</H2>
        <P>Additional experience includes API references, integration guides, technical manuals and developer-focused documentation across software and digital product projects.</P>
        <Callout kind="note" title="Confidential work">Some documentation was written for clients and cannot be shared publicly. I am happy to walk through my contributions, process and responsibilities in an interview, within my confidentiality obligations.</Callout>
      </>
    ),
  },
  {
    id: 'quickstart',
    keywords: 'webhook sdk install api key javascript python curl',
    group: 'Live samples',
    title: 'Quickstart: accept your first payment',
    lead: 'Create a payment in the Relay sandbox and confirm it with a webhook. This takes about five minutes.',
    toc: [{ id: 'before-you-begin', label: 'Before you begin' }, { id: 'steps', label: 'Steps' }, { id: 'next-steps', label: 'Next steps' }],
    body: ({ lang, setLang, go }) => (
      <>
        <SampleNote />
        <H2 id="before-you-begin">Before you begin</H2>
        <P>You need a Relay sandbox account and Node.js 18 or later, or Python 3.9 or later. Sandbox keys start with <Code>sk_test_</Code> and never move real money.</P>
        <H2 id="steps">Steps</H2>
        <P>Tick each step as you finish it.</P>
        <Steps items={[
          { title: 'Store your secret key', body: <>Copy your sandbox secret key from <b>Developers → API keys</b> and keep it in an environment variable, never in your code.<CodeTabs samples={{ Shell: 'export RELAY_SECRET_KEY="sk_test_4eC39HqLyjWD"' }} /></> },
          { title: 'Install the library', body: <CodeTabs lang={lang} onLang={setLang} samples={{ cURL: '# No install needed: cURL ships with macOS and most Linux distributions.', JavaScript: 'npm install @relaypay/node', Python: 'pip install relaypay' }} /> },
          { title: 'Create a payment', body: <>Amounts are in the smallest currency unit, so <Code>12500</Code> NGN is ₦125.00.<CodeTabs lang={lang} onLang={setLang} samples={createPayment} /></> },
          { title: 'Confirm it with a webhook', body: <>Relay sends <Code>payment.settled</Code> when the money arrives. Return a <Code>2xx</Code> within 10 seconds or the event is retried.<CodeTabs lang={lang} onLang={setLang} samples={{ cURL: '# Webhooks are received by your server. See the JavaScript or Python tab.', JavaScript: `app.post("/webhooks/relay", express.raw({ type: "application/json" }), (req, res) => {
  const event = relay.webhooks.verify(req.body, req.headers["relay-signature"])
  if (event.type === "payment.settled") {
    markOrderPaid(event.data.reference)
  }
  res.sendStatus(200)
})`, Python: `@app.post("/webhooks/relay")
def relay_webhook():
    event = relay.webhooks.verify(request.data, request.headers["Relay-Signature"])
    if event.type == "payment.settled":
        mark_order_paid(event.data.reference)
    return "", 200` }} /></> },
        ]} />
        <Callout kind="warning">Always verify the signature before trusting a webhook. Anyone can send a request to a public URL.</Callout>
        <H2 id="next-steps">Next steps</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[0.95rem]">
          <li><button type="button" onClick={() => go('api-payments')} className="font-semibold text-primary hover:underline">Read the Create a payment reference</button> and send a request from the page.</li>
          <li><button type="button" onClick={() => go('concepts')} className="font-semibold text-primary hover:underline">Learn the payment lifecycle</button> before you go live.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'api-payments',
    keywords: 'endpoint reference idempotency errors 401 409 422 429 rate limit try it',
    group: 'Live samples',
    title: 'Create a payment',
    lead: 'Creates a payment and returns it in the pending state. Use an idempotency key so a retried request never charges twice.',
    toc: [{ id: 'request', label: 'Request' }, { id: 'try-it', label: 'Try it' }, { id: 'response', label: 'Response' }, { id: 'errors', label: 'Errors' }],
    body: ({ lang, setLang }) => (
      <>
        <SampleNote />
        <Endpoint method="POST" path="/v1/payments" />
        <H2 id="request">Request</H2>
        <Params title="Headers" items={[
          { name: 'Authorization', type: 'string', required: true, body: 'Bearer followed by your secret key.' },
          { name: 'Idempotency-Key', type: 'string', body: 'A unique value per payment. Repeating it within 24 hours returns the original result instead of creating a second payment.' },
        ]} />
        <Params items={[
          { name: 'amount', type: 'integer', required: true, body: 'A positive whole number in the smallest currency unit. 12500 NGN is ₦125.00.' },
          { name: 'currency', type: 'string', required: true, body: 'Three-letter ISO code. One of NGN, USD, GHS or KES.' },
          { name: 'reference', type: 'string', body: 'Your own identifier, up to 64 characters. Returned in every event for this payment.' },
        ]} />
        <CodeTabs lang={lang} onLang={setLang} samples={createPayment} />
        <H2 id="try-it">Try it</H2>
        <P>Send a request to the simulated sandbox. Change the values to see how validation works.</P>
        <Playground />
        <H2 id="response">Response</H2>
        <P>Returns <Code>201 Created</Code> with the payment object.</P>
        <CodeTabs title="201 Created" samples={{ JSON: `{
  "id": "pay_8Qw2LmT4",
  "object": "payment",
  "amount": 12500,
  "currency": "NGN",
  "status": "pending",
  "reference": "inv_0142",
  "created_at": "2026-11-11T09:24:03Z"
}` }} />
        <H2 id="errors">Errors</H2>
        <Table head={['Status', 'Code', 'What to do']} rows={[
          [<Code key="a">401</Code>, 'unauthenticated', 'Check the key is set and starts with sk_test_ or sk_live_.'],
          [<Code key="b">409</Code>, 'idempotency_conflict', 'The key was reused with different values. Use a new key.'],
          [<Code key="c">422</Code>, 'invalid_amount', 'Send a positive whole number in the smallest unit.'],
          [<Code key="d">422</Code>, 'unsupported_currency', 'Use NGN, USD, GHS or KES.'],
          [<Code key="e">429</Code>, 'rate_limited', 'Wait for the time in the Retry-After header, then retry.'],
        ]} />
      </>
    ),
  },
  {
    id: 'user-guide',
    keywords: 'manual electricity meter token troubleshooting faq',
    group: 'Live samples',
    title: 'User guide: pay a bill',
    lead: 'For people using the Relay app. Find your way around the home screen, then pay an electricity bill.',
    toc: [{ id: 'home-screen', label: 'The home screen' }, { id: 'pay-electricity', label: 'Pay an electricity bill' }, { id: 'troubleshooting', label: 'Troubleshooting' }],
    body: () => (
      <>
        <SampleNote />
        <H2 id="home-screen">The home screen</H2>
        <P>Select a number to see what each part of the screen does.</P>
        <Hotspots />
        <H2 id="pay-electricity">Pay an electricity bill</H2>
        <Steps items={[
          { title: 'Select Pay a bill, then Electricity', body: 'Choose your distribution company from the list.' },
          { title: 'Enter your meter number', body: 'Relay checks the meter and shows the name on the account. Stop if the name is not yours.' },
          { title: 'Enter the amount and confirm', body: 'Review the amount and fee, then select Pay.' },
          { title: 'Save your token', body: 'Prepaid meters receive a 20-digit token on screen and by email. Enter it on your meter.' },
        ]} />
        <H2 id="troubleshooting">Troubleshooting</H2>
        <Faq items={[
          { q: 'I paid but did not get a token', a: 'Tokens usually arrive within a minute. Open Activity, select the payment and choose Resend token. If the status is failed, the money returns to your balance automatically.' },
          { q: 'The meter name is wrong', a: 'Do not continue. Check the meter number on your meter or last receipt and enter it again.' },
          { q: 'The token was rejected by my meter', a: 'Enter it again slowly, digit by digit. If it is still rejected, contact your distribution company with the receipt from Activity.' },
        ]} />
      </>
    ),
  },
  {
    id: 'concepts',
    keywords: 'webhook settled pending idempotency lifecycle',
    group: 'Live samples',
    title: 'Concepts: the payment lifecycle',
    lead: 'Every payment moves through a small set of states. Knowing them tells you when it is safe to deliver an order.',
    toc: [{ id: 'states', label: 'States' }, { id: 'idempotency', label: 'Idempotency' }, { id: 'when-to-fulfil', label: 'When to fulfil an order' }],
    body: () => (
      <>
        <SampleNote />
        <H2 id="states">States</H2>
        <P>Select a state to read what it means.</P>
        <Lifecycle />
        <H2 id="idempotency">Idempotency</H2>
        <P>Networks fail. If a request times out you cannot tell whether the payment was created. Send the same <Code>Idempotency-Key</Code> again and Relay returns the first result instead of creating a duplicate.</P>
        <Callout kind="tip">Derive the key from something you already store, such as your order ID, so a retry after a crash still sends the same key.</Callout>
        <H2 id="when-to-fulfil">When to fulfil an order</H2>
        <Table head={['Status', 'Safe to deliver?']} rows={[
          ['pending', 'No. Funds have not arrived.'],
          ['confirmed', 'Usually. Low-value digital goods can ship here.'],
          ['settled', 'Yes. The money is in your balance.'],
          ['failed', 'No. Ask the customer to pay again.'],
        ]} />
      </>
    ),
  },
  {
    id: 'web3-deploy',
    keywords: 'solidity hardhat evm smart contract blockchain rootstock zksync testnet',
    group: 'Live samples',
    title: 'Tutorial: deploy a smart contract',
    lead: 'Compile and deploy a Solidity contract to an EVM testnet with Hardhat, then call it.',
    toc: [{ id: 'the-contract', label: 'The contract' }, { id: 'configure', label: 'Configure the network' }, { id: 'deploy', label: 'Deploy' }],
    body: () => (
      <>
        <Callout kind="note" title="About this sample">I wrote this tutorial for my portfolio. It follows the same pattern as developer guides for EVM chains such as Rootstock and ZKsync, with the network details left generic.</Callout>
        <H2 id="the-contract">The contract</H2>
        <P>A counter that anyone can increase. Small enough to read in one go, real enough to deploy.</P>
        <CodeTabs title="contracts/Counter.sol" samples={{ Solidity: `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract Counter {
    uint256 public count;

    event Increased(uint256 newCount);

    function increase() external {
        count += 1;
        emit Increased(count);
    }
}` }} />
        <H2 id="configure">Configure the network</H2>
        <P>Read the RPC URL and deployer key from environment variables.</P>
        <CodeTabs title="hardhat.config.js" samples={{ JavaScript: `require("@nomicfoundation/hardhat-toolbox")

module.exports = {
  solidity: "0.8.24",
  networks: {
    testnet: {
      url: process.env.TESTNET_RPC_URL,
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
  },
}` }} />
        <Callout kind="warning">Never commit a private key. Use a wallet that holds only testnet funds.</Callout>
        <H2 id="deploy">Deploy</H2>
        <P>Compile, deploy and check the result. The terminal below plays the run.</P>
        <Terminal lines={[
          { cmd: 'npx hardhat compile', out: 'Compiled 1 Solidity file successfully (evm target: paris).' },
          { cmd: 'npx hardhat run scripts/deploy.js --network testnet', out: 'Counter deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3' },
          { cmd: 'npx hardhat console --network testnet', out: '> await counter.increase()\n> await counter.count()\n1n' },
        ]} />
      </>
    ),
  },
  {
    id: 'changelog',
    keywords: 'release notes deprecated version',
    group: 'Live samples',
    title: 'Changelog',
    lead: 'What changed in the Relay API, who it affects and what to do.',
    toc: [{ id: 'v2-4', label: '2.4.0' }, { id: 'v2-3', label: '2.3.0' }],
    body: () => (
      <>
        <SampleNote />
        <H2 id="v2-4">2.4.0 · November 2026</H2>
        <ul className="mt-4 space-y-3 text-[0.95rem] leading-7">
          <li><span className="mr-2 rounded bg-success/15 px-1.5 py-0.5 text-[0.7rem] font-bold text-success">Added</span>KES is now a supported currency for payments.</li>
          <li><span className="mr-2 rounded bg-primary/15 px-1.5 py-0.5 text-[0.7rem] font-bold text-primary">Changed</span>Idempotency keys are kept for 24 hours, up from 12.</li>
        </ul>
        <H2 id="v2-3">2.3.0 · September 2026</H2>
        <ul className="mt-4 space-y-3 text-[0.95rem] leading-7">
          <li><span className="mr-2 rounded bg-[#D97706]/15 px-1.5 py-0.5 text-[0.7rem] font-bold text-[#B45309] dark:text-[#FBBF24]">Deprecated</span><Code>payment.completed</Code> is replaced by <Code>payment.settled</Code>. Listen for both until 1 March 2027.</li>
        </ul>
        <Callout kind="tip" title="Upgrading">Search your webhook handlers for <Code>payment.completed</Code> and add a matching branch for <Code>payment.settled</Code>.</Callout>
      </>
    ),
  },
  {
    id: 'skills',
    keywords: 'git github jenkins github actions html css javascript php markdown',
    group: 'Reference',
    title: 'Skills and tools',
    lead: 'What I bring to a documentation team.',
    toc: [{ id: 'writing', label: 'Writing' }, { id: 'technical', label: 'Technical' }],
    body: () => (
      <>
        <H2 id="writing">Writing</H2>
        <Table head={['Skill', 'Includes']} rows={[
          ['API documentation', 'Endpoint references, authentication, errors, rate limits and SDK guides.'],
          ['Developer documentation', 'Quickstarts, tutorials, concepts and integration guides.'],
          ['Technical manuals and user guides', 'Task-based instructions, troubleshooting and onboarding.'],
          ['Research and information architecture', 'Interviewing engineers, testing products and structuring large doc sets.'],
        ]} />
        <H2 id="technical">Technical</H2>
        <div className="mt-5 flex flex-wrap gap-2">
          {['HTML', 'CSS', 'JavaScript', 'PHP', 'Git', 'GitHub', 'Jenkins', 'GitHub Actions', 'Markdown', 'REST APIs', 'Solidity basics'].map(t => <span key={t} className="rounded-lg border border-ink-border bg-surface px-3 py-1.5 font-head text-[0.8rem]">{t}</span>)}
        </div>
      </>
    ),
  },
  {
    id: 'contact',
    keywords: 'email hire cv recruiter',
    group: 'Reference',
    title: 'Work with me',
    lead: 'Need documentation that developers and customers can actually use? Let’s talk.',
    toc: [{ id: 'get-in-touch', label: 'Get in touch' }],
    body: () => (
      <>
        <H2 id="get-in-touch">Get in touch</H2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a href={EMAIL} className="rounded-xl bg-primary p-5 text-on-primary transition hover:-translate-y-0.5 hover:bg-primary-dim"><p className="font-display font-extrabold">Email me →</p><p className="mt-1 text-sm text-on-primary/80">hello@ladyprowess.com</p></a>
          <Link href="/recruiter" className="rounded-xl border border-ink-border bg-surface p-5 transition hover:-translate-y-0.5 hover:border-primary/50"><p className="font-display font-extrabold">Recruiter view →</p><p className="mt-1 text-sm text-muted">Experience, CV and contact on one page.</p></Link>
        </div>
      </>
    ),
  },
]
