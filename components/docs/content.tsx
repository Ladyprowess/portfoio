'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { Callout, Code, CodeTabs, Endpoint, Faq, H2, Hotspots, Lifecycle, P, Params, Playground, RunCommand, Steps, Table } from './blocks'

export type Ctx = { lang: string; setLang: (l: string) => void; go: (id: string, anchor?: string) => void; origin: string }
export type DocPage = { id: string; group: string; title: string; lead: string; keywords?: string; toc: { id: string; label: string }[]; body: (ctx: Ctx) => ReactNode }

const EMAIL = 'mailto:hello@ladyprowess.com?subject=Technical%20writing%20enquiry'
const KEY = 'sk_test_relay_4eC39HqLyjWD'

const api = (origin: string) => `${origin || 'https://ladyprowess.com'}/api/relay/v1`

const createPayment = (origin: string) => ({
  cURL: `curl ${api(origin)}/payments \\
  -H "Authorization: Bearer $RELAY_SECRET_KEY" \\
  -H "Idempotency-Key: order-0142" \\
  -d amount=5000 \\
  -d currency=NGN \\
  -d reference=order_0142`,
  JavaScript: `const res = await fetch("${api(origin)}/payments", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.RELAY_SECRET_KEY}\`,
    "Content-Type": "application/json",
    "Idempotency-Key": "order-0142",
  },
  body: JSON.stringify({ amount: 5000, currency: "NGN", reference: "order_0142" }),
})

const payment = await res.json()
console.log(payment.id, payment.status) // pay_... pending`,
  Python: `import os
import requests

res = requests.post(
    "${api(origin)}/payments",
    headers={
        "Authorization": f"Bearer {os.environ['RELAY_SECRET_KEY']}",
        "Idempotency-Key": "order-0142",
    },
    json={"amount": 5000, "currency": "NGN", "reference": "order_0142"},
)

payment = res.json()
print(payment["id"], payment["status"])  # pay_... pending`,
})

const retrievePayment = (origin: string) => ({
  cURL: `curl ${api(origin)}/payments/$PAYMENT_ID \\
  -H "Authorization: Bearer $RELAY_SECRET_KEY"`,
  JavaScript: `const res = await fetch(\`${api(origin)}/payments/\${paymentId}\`, {
  headers: { Authorization: \`Bearer \${process.env.RELAY_SECRET_KEY}\` },
})
const payment = await res.json()
console.log(payment.status) // pending, confirmed or settled`,
  Python: `res = requests.get(
    f"${api(origin)}/payments/{payment_id}",
    headers={"Authorization": f"Bearer {os.environ['RELAY_SECRET_KEY']}"},
)
print(res.json()["status"])  # pending, confirmed or settled`,
})

const refundPayment = (origin: string) => ({
  cURL: `curl ${api(origin)}/payments/$PAYMENT_ID/refund \\
  -X POST \\
  -H "Authorization: Bearer $RELAY_SECRET_KEY"`,
  JavaScript: `const res = await fetch(\`${api(origin)}/payments/\${paymentId}/refund\`, {
  method: "POST",
  headers: { Authorization: \`Bearer \${process.env.RELAY_SECRET_KEY}\` },
})
const refund = await res.json()`,
  Python: `res = requests.post(
    f"${api(origin)}/payments/{payment_id}/refund",
    headers={"Authorization": f"Bearer {os.environ['RELAY_SECRET_KEY']}"},
)
refund = res.json()`,
})

const Json = ({ title, body }: { title: string; body: string }) => <CodeTabs title={title} samples={{ JSON: body }} />

const Try = ({ children }: { children: ReactNode }) => <div className="mt-5 flex flex-wrap gap-2">{children}</div>

export const pages: DocPage[] = [
  {
    id: 'overview',
    group: 'Start here',
    title: 'Technical writing and documentation',
    lead: 'I am Ngozi Peace Okafor, a technical writer with over nine years of experience documenting APIs, developer platforms and software products.',
    keywords: 'about ngozi technical writer',
    toc: [{ id: 'first-request', label: 'Make your first request' }, { id: 'what-i-write', label: 'What I write' }, { id: 'experience', label: 'Experience' }],
    body: ({ go, origin }) => (
      <>
        <H2 id="first-request">Make your first request</H2>
        <P>The Relay API in these docs is live. Create a payment, follow it until it settles, then refund it. Each command runs in the terminal at the bottom of the page.</P>
        <Try>
          <RunCommand cmd="relay pay 5000 NGN" />
          <RunCommand cmd="relay status $LAST --watch" />
          <RunCommand cmd="relay refund $LAST" />
        </Try>
        <P>The same API answers from your own machine. Paste this into any terminal:</P>
        <CodeTabs samples={{ Shell: `curl ${api(origin)}/payments \\
  -H "Authorization: Bearer ${KEY}" \\
  -d amount=5000 \\
  -d currency=NGN` }} />

        <H2 id="what-i-write">What I write</H2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {[
            ['create-payment', 'API references', 'Endpoints, parameters, responses and errors you can build against.'],
            ['quickstart', 'Quickstarts', 'The shortest route from an API key to a working result.'],
            ['web3-deploy', 'Tutorials', 'Hands-on guides for developers, like deploying a smart contract.'],
            ['user-guide', 'User guides', 'Step-by-step help for the people using the product.'],
            ['errors', 'Error references', 'Every error, what causes it and how to fix it.'],
            ['changelog', 'Release notes', 'What changed, who it affects and what to do next.'],
          ].map(([id, t, b]) => (
            <button key={id} type="button" onClick={() => go(id)} className="group rounded-xl border border-ink-border bg-surface p-5 text-left transition hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg">
              <p className="font-display font-extrabold">{t} <span className="inline-block text-primary transition group-hover:translate-x-1">→</span></p>
              <p className="mt-1 text-sm leading-6 text-muted">{b}</p>
            </button>
          ))}
        </div>

        <H2 id="experience">Experience</H2>
        <P>I have written API documentation, developer guides and technical manuals for Rootstock, Magnopus and ZKsync, and contributed to Jenkins as an open-source contributor.</P>
        <Try>{['Rootstock', 'Magnopus', 'ZKsync', 'Jenkins'].map(n => <button key={n} type="button" onClick={() => go('projects', n.toLowerCase())} className="rounded-full border border-ink-border bg-surface px-4 py-2 text-sm font-semibold transition hover:border-primary/50 hover:text-primary">{n} →</button>)}</Try>
      </>
    ),
  },
  {
    id: 'process',
    group: 'Start here',
    title: 'How I work',
    lead: 'I treat documentation like a product: researched, structured, tested and kept up to date.',
    keywords: 'docs as code github actions ci review process',
    toc: [{ id: 'workflow', label: 'Workflow' }, { id: 'docs-as-code', label: 'Docs as code' }],
    body: () => (
      <>
        <H2 id="workflow">Workflow</H2>
        <Steps items={[
          { title: 'Understand the reader', body: 'Who arrives at the page, what they already know and what they need to finish.' },
          { title: 'Learn the product hands-on', body: 'I use it, run the code, read the source and interview the engineers who built it.' },
          { title: 'Structure the information', body: 'Concepts, tasks and reference each get their own place, so readers know where to look.' },
          { title: 'Write, then test every step', body: 'Every command and code block is run before it is published.' },
          { title: 'Review with engineers', body: 'The people closest to the code check it for accuracy.' },
          { title: 'Publish and maintain', body: 'Docs ship with the release, and outdated pages are found and fixed.' },
        ]} />
        <H2 id="docs-as-code">Docs as code</H2>
        <P>Docs live next to the code, go through pull requests and are checked automatically before they ship.</P>
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
      </>
    ),
  },
  {
    id: 'projects',
    group: 'Projects',
    title: 'Selected projects',
    lead: 'Documentation and developer resources I have written for software and Web3 teams.',
    keywords: 'rootstock zksync magnopus jenkins she code africa txfusion zaycodes writetech hub open source',
    toc: [{ id: 'rootstock', label: 'Rootstock' }, { id: 'magnopus', label: 'Magnopus' }, { id: 'zksync', label: 'ZKsync' }, { id: 'jenkins', label: 'Jenkins' }, { id: 'more-work', label: 'More work' }],
    body: () => (
      <>
        {[
          { id: 'rootstock', name: 'Rootstock', org: 'Zaycodes / WriteTech Hub', body: 'Technical documentation and developer resources for the Rootstock ecosystem.', areas: ['API documentation', 'Developer guides', 'Technical documentation'], href: 'https://dev.rootstock.io', site: 'dev.rootstock.io' },
          { id: 'magnopus', name: 'Magnopus', org: 'Zaycodes / WriteTech Hub', body: 'Technical writing and documentation for Magnopus projects.', areas: ['Technical manuals', 'Product documentation', 'Technical guides'], href: 'https://www.magnopus.com', site: 'magnopus.com' },
          { id: 'zksync', name: 'ZKsync', org: 'txFusion', body: 'Technical writing for the ZKsync ecosystem.', areas: ['API documentation', 'Developer resources', 'Technical documentation'], href: 'https://docs.zksync.io', site: 'docs.zksync.io' },
          { id: 'jenkins', name: 'Jenkins', org: 'Open-source contributor', body: 'Contributed to the Jenkins open-source project through a programme sponsored by She Code Africa.', areas: ['Open-source contribution', 'Documentation'], href: 'https://www.jenkins.io', site: 'jenkins.io' },
        ].map(p => (
          <section key={p.id}>
            <H2 id={p.id}>{p.name}</H2>
            <div className="mt-4 rounded-xl border border-ink-border bg-surface p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">{p.org}</p>
              <p className="mt-2 text-[0.98rem] leading-7">{p.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">{p.areas.map(a => <span key={a} className="rounded-full bg-primary/[0.08] px-3 py-1 text-xs font-semibold text-primary">{a}</span>)}</div>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-ink-border pt-4 text-sm">
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary hover:underline">{p.site} ↗</a>
                <a href={EMAIL} className="text-muted hover:text-parchment">Ask me about this work →</a>
              </div>
            </div>
          </section>
        ))}
        <H2 id="more-work">More work</H2>
        <P>API references, integration guides, technical manuals and developer documentation across software and digital product projects. Some of it was written for clients under confidentiality, so I walk through it in interviews rather than publishing it.</P>
      </>
    ),
  },
  {
    id: 'quickstart',
    group: 'Relay API',
    title: 'Quickstart',
    lead: 'Create a payment, watch it settle and refund it. It takes about five minutes.',
    keywords: 'getting started first payment curl javascript python',
    toc: [{ id: 'before-you-begin', label: 'Before you begin' }, { id: 'steps', label: 'Steps' }, { id: 'next-steps', label: 'Next steps' }],
    body: ({ lang, setLang, go, origin }) => (
      <>
        <H2 id="before-you-begin">Before you begin</H2>
        <P>You need a terminal, or Node.js 18+ or Python 3.9+. Use this test key. Test keys only work in the sandbox, so no real money moves.</P>
        <CodeTabs samples={{ Shell: `export RELAY_SECRET_KEY=${KEY}` }} />
        <H2 id="steps">Steps</H2>
        <Steps items={[
          { title: 'Create a payment', body: <>Amounts are in the smallest currency unit, so <Code>5000</Code> NGN is ₦50.00. The response includes the payment&apos;s <Code>id</Code>; keep it for the next steps.<CodeTabs lang={lang} onLang={setLang} samples={createPayment(origin)} /></> },
          { title: 'Check its status', body: <>A new payment is <Code>pending</Code>. It becomes <Code>confirmed</Code> after about 8 seconds and <Code>settled</Code> after about 16. Replace <Code>$PAYMENT_ID</Code> with your id; the docs terminal fills it in for you.<CodeTabs lang={lang} onLang={setLang} samples={retrievePayment(origin)} /><Try><RunCommand cmd="relay status $LAST --watch" label="Watch it settle" /></Try></> },
          { title: 'Refund it', body: <>Refunds work once a payment is settled. Call this too early and you get a <Code>409</Code> that tells you the current status.<CodeTabs lang={lang} onLang={setLang} samples={refundPayment(origin)} /></> },
        ]} />
        <H2 id="next-steps">Next steps</H2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-[0.95rem]">
          <li><button type="button" onClick={() => go('lifecycle')} className="font-semibold text-primary hover:underline">Learn the payment lifecycle</button> to know when it is safe to deliver an order.</li>
          <li><button type="button" onClick={() => go('errors')} className="font-semibold text-primary hover:underline">Handle errors</button> so a failed request never charges twice.</li>
        </ul>
      </>
    ),
  },
  {
    id: 'authentication',
    group: 'Relay API',
    title: 'Authentication',
    lead: 'Every request is authenticated with a secret key, sent as a bearer token.',
    keywords: 'api key secret bearer token 401 authorization header',
    toc: [{ id: 'keys', label: 'API keys' }, { id: 'sending-the-key', label: 'Sending the key' }, { id: 'failed-authentication', label: 'Failed authentication' }],
    body: ({ origin }) => (
      <>
        <H2 id="keys">API keys</H2>
        <Table head={['Key', 'Use it for']} rows={[[<Code key="t">sk_test_…</Code>, 'The sandbox. Payments behave like real ones, but no money moves.'], [<Code key="l">sk_live_…</Code>, 'Real payments. Keep it on your server only.']]} />
        <Callout kind="warning">Never put a secret key in a browser, a mobile app or a public repository. Anyone who has it can create and refund payments.</Callout>
        <H2 id="sending-the-key">Sending the key</H2>
        <P>Send the key in the <Code>Authorization</Code> header of every request.</P>
        <CodeTabs samples={{ cURL: `curl ${api(origin)}/payments/$PAYMENT_ID \\
  -H "Authorization: Bearer $RELAY_SECRET_KEY"` }} />
        <H2 id="failed-authentication">Failed authentication</H2>
        <P>A missing or wrong key returns <Code>401</Code>. Run both to see the difference:</P>
        <Try>
          <RunCommand cmd={`curl ${api(origin)}/payments -d amount=5000 -d currency=NGN`} label="No key" />
          <RunCommand cmd={`curl ${api(origin)}/payments -H "Authorization: Bearer sk_test_wrong" -d amount=5000 -d currency=NGN`} label="Wrong key" />
        </Try>
      </>
    ),
  },
  {
    id: 'create-payment',
    group: 'Relay API',
    title: 'Create a payment',
    lead: 'Creates a payment in the pending state. Send an idempotency key so a retried request never creates a second payment.',
    keywords: 'post payments endpoint reference idempotency parameters try it',
    toc: [{ id: 'request', label: 'Request' }, { id: 'try-it', label: 'Try it' }, { id: 'response', label: 'Response' }],
    body: ({ lang, setLang, origin }) => (
      <>
        <Endpoint method="POST" path="/v1/payments" />
        <H2 id="request">Request</H2>
        <Params title="Headers" items={[
          { name: 'Authorization', type: 'string', required: true, body: 'Bearer followed by your secret key.' },
          { name: 'Idempotency-Key', type: 'string', body: 'A unique value per payment. Repeating it returns the first payment instead of creating another.' },
        ]} />
        <Params items={[
          { name: 'amount', type: 'integer', required: true, body: 'A positive whole number in the smallest currency unit. 5000 NGN is ₦50.00. Maximum 100000000.' },
          { name: 'currency', type: 'string', required: true, body: 'Three-letter code: NGN, USD, GHS or KES.' },
          { name: 'reference', type: 'string', body: 'Your own identifier, up to 64 characters, without full stops. Returned with the payment.' },
        ]} />
        <CodeTabs lang={lang} onLang={setLang} samples={createPayment(origin)} />
        <H2 id="try-it">Try it</H2>
        <P>Change the values and send. Try a negative amount or EUR to see the errors.</P>
        <Playground />
        <H2 id="response">Response</H2>
        <P>Returns <Code>201</Code> with the payment, or <Code>200</Code> with the original payment when the idempotency key was used before.</P>
        <Json title="201 Created" body={`{
  "id": "pay_MTc5NDQwMDE0NDk3NS41MDAwLk5HTi5vcmRlcl8wMTQy",
  "object": "payment",
  "amount": 5000,
  "currency": "NGN",
  "status": "pending",
  "reference": "order_0142",
  "created_at": "2026-11-11T12:29:04.975Z",
  "settled_at": null
}`} />
      </>
    ),
  },
  {
    id: 'retrieve-payment',
    group: 'Relay API',
    title: 'Retrieve a payment',
    lead: 'Returns a payment with its current status.',
    keywords: 'get payment status endpoint',
    toc: [{ id: 'request', label: 'Request' }, { id: 'response', label: 'Response' }],
    body: ({ lang, setLang, origin }) => (
      <>
        <Endpoint method="GET" path="/v1/payments/{id}" />
        <H2 id="request">Request</H2>
        <Params title="Path parameters" items={[{ name: 'id', type: 'string', required: true, body: 'The id returned when the payment was created. It starts with pay_.' }]} />
        <CodeTabs lang={lang} onLang={setLang} samples={retrievePayment(origin)} />
        <Try><RunCommand cmd="relay pay 2500 GHS && relay status $LAST" label="Create one, then retrieve it" /></Try>
        <H2 id="response">Response</H2>
        <Table head={['Field', 'Description']} rows={[
          [<Code key="s">status</Code>, 'pending, confirmed or settled.'],
          [<Code key="c">created_at</Code>, 'When the payment was created, in UTC.'],
          [<Code key="t">settled_at</Code>, 'When the money reached your balance. null until then.'],
        ]} />
        <P>An unknown id returns <Code>404 resource_missing</Code>.</P>
      </>
    ),
  },
  {
    id: 'refund-payment',
    group: 'Relay API',
    title: 'Refund a payment',
    lead: 'Returns all or part of a settled payment to the customer.',
    keywords: 'refund post 409 partial',
    toc: [{ id: 'request', label: 'Request' }, { id: 'rules', label: 'Rules' }],
    body: ({ lang, setLang, origin }) => (
      <>
        <Endpoint method="POST" path="/v1/payments/{id}/refund" />
        <H2 id="request">Request</H2>
        <Params items={[{ name: 'amount', type: 'integer', body: 'How much to refund, in the smallest unit. Leave it out to refund the full payment.' }]} />
        <CodeTabs lang={lang} onLang={setLang} samples={refundPayment(origin)} />
        <H2 id="rules">Rules</H2>
        <Table head={['Payment status', 'Result']} rows={[
          ['pending or confirmed', <><Code key="a">409 payment_not_settled</Code>. Wait for settlement, then try again.</>],
          ['settled', <><Code key="b">201</Code> with the refund.</>],
        ]} />
        <Try>
          <RunCommand cmd="relay pay 3000 NGN && relay refund $LAST" label="Refund too early" />
          <RunCommand cmd="relay pay 3000 NGN && relay status $LAST --watch && relay refund $LAST --amount 1000" label="Wait, then refund part" />
        </Try>
      </>
    ),
  },
  {
    id: 'lifecycle',
    group: 'Relay API',
    title: 'Payment lifecycle',
    lead: 'Every payment moves through three states. Knowing them tells you when it is safe to deliver an order.',
    keywords: 'states pending confirmed settled idempotency fulfil webhook',
    toc: [{ id: 'states', label: 'States' }, { id: 'when-to-fulfil', label: 'When to fulfil an order' }, { id: 'idempotency', label: 'Retrying safely' }],
    body: ({ origin }) => (
      <>
        <H2 id="states">States</H2>
        <Lifecycle />
        <Try><RunCommand cmd="relay pay 5000 NGN && relay status $LAST --watch" label="Follow a real payment" /></Try>
        <H2 id="when-to-fulfil">When to fulfil an order</H2>
        <Table head={['Status', 'Deliver the order?']} rows={[
          ['pending', 'No. The money has not arrived.'],
          ['confirmed', 'Only for low-value digital goods.'],
          ['settled', 'Yes. The money is in your balance.'],
        ]} />
        <H2 id="idempotency">Retrying safely</H2>
        <P>If a request times out, you cannot tell whether the payment was created. Send it again with the same <Code>Idempotency-Key</Code> and Relay returns the first payment instead of creating a second one. Run the same request twice and compare the ids:</P>
        <Try><RunCommand cmd={`curl ${api(origin)}/payments -H "Authorization: Bearer $RELAY_SECRET_KEY" -H "Idempotency-Key: order-77" -d amount=900 -d currency=USD && curl ${api(origin)}/payments -H "Authorization: Bearer $RELAY_SECRET_KEY" -H "Idempotency-Key: order-77" -d amount=900 -d currency=USD`} label="Send the same request twice" /></Try>
        <Callout kind="tip">Build the key from something you already store, such as your order ID, so a retry after a crash sends the same key.</Callout>
      </>
    ),
  },
  {
    id: 'errors',
    group: 'Relay API',
    title: 'Errors',
    lead: 'Errors return a 4xx status and a JSON body that says what went wrong and which parameter caused it.',
    keywords: '401 404 409 422 error codes troubleshooting',
    toc: [{ id: 'format', label: 'Format' }, { id: 'codes', label: 'Error codes' }],
    body: ({ origin }) => (
      <>
        <H2 id="format">Format</H2>
        <Json title="422 Unprocessable Entity" body={`{
  "error": {
    "type": "invalid_request_error",
    "code": "unsupported_currency",
    "message": "EUR is not supported. Use one of NGN, USD, GHS, KES.",
    "param": "currency"
  }
}`} />
        <H2 id="codes">Error codes</H2>
        <P>Run any of these to see the real response.</P>
        <Table head={['Status', 'Code', 'Fix', '']} rows={[
          ['401', <Code key="1">missing_api_key</Code>, 'Send the Authorization header.', <RunCommand key="r1" cmd={`curl ${api(origin)}/payments -d amount=5000 -d currency=NGN`} label="Run" />],
          ['401', <Code key="2">invalid_api_key</Code>, 'Check the key is complete and current.', <RunCommand key="r2" cmd={`curl ${api(origin)}/payments -H "Authorization: Bearer sk_test_old" -d amount=5000 -d currency=NGN`} label="Run" />],
          ['404', <Code key="3">resource_missing</Code>, 'Check the payment id.', <RunCommand key="r3" cmd="relay status pay_doesnotexist" label="Run" />],
          ['409', <Code key="4">payment_not_settled</Code>, 'Wait until the payment is settled.', <RunCommand key="r4" cmd="relay pay 5000 NGN && relay refund $LAST" label="Run" />],
          ['422', <Code key="5">invalid_amount</Code>, 'Send a positive whole number.', <RunCommand key="r5" cmd="relay pay -50 NGN" label="Run" />],
          ['422', <Code key="6">unsupported_currency</Code>, 'Use NGN, USD, GHS or KES.', <RunCommand key="r6" cmd="relay pay 5000 EUR" label="Run" />],
        ]} />
      </>
    ),
  },
  {
    id: 'changelog',
    group: 'Relay API',
    title: 'Changelog',
    lead: 'Changes to the Relay API, newest first.',
    keywords: 'release notes version deprecated',
    toc: [{ id: 'v1-2', label: '1.2.0' }, { id: 'v1-1', label: '1.1.0' }, { id: 'v1-0', label: '1.0.0' }],
    body: ({ go }) => {
      const tag = (kind: 'Added' | 'Changed', cls: string) => <span className={`mr-2 rounded px-1.5 py-0.5 text-[0.7rem] font-bold ${cls}`}>{kind}</span>
      return (
        <>
          <H2 id="v1-2">1.2.0 · November 2026</H2>
          <ul className="mt-4 space-y-3 text-[0.95rem] leading-7">
            <li>{tag('Added', 'bg-success/15 text-success')}Partial refunds. Pass <Code>amount</Code> to <button type="button" onClick={() => go('refund-payment')} className="font-semibold text-primary hover:underline">Refund a payment</button>.</li>
            <li>{tag('Changed', 'bg-primary/15 text-primary')}Refunding a payment that is not settled now returns <Code>409 payment_not_settled</Code> instead of <Code>400</Code>.</li>
          </ul>
          <Callout kind="tip" title="Upgrading">If you check for status 400 after a refund, check for 409 as well.</Callout>
          <H2 id="v1-1">1.1.0 · October 2026</H2>
          <ul className="mt-4 space-y-3 text-[0.95rem] leading-7"><li>{tag('Added', 'bg-success/15 text-success')}KES is a supported currency.</li></ul>
          <H2 id="v1-0">1.0.0 · September 2026</H2>
          <ul className="mt-4 space-y-3 text-[0.95rem] leading-7"><li>{tag('Added', 'bg-success/15 text-success')}Create and retrieve payments in NGN, USD and GHS.</li></ul>
        </>
      )
    },
  },
  {
    id: 'user-guide',
    group: 'Guides',
    title: 'Pay a bill in the Relay app',
    lead: 'Find your way around the home screen, then pay an electricity bill.',
    keywords: 'user guide manual electricity meter token troubleshooting faq',
    toc: [{ id: 'home-screen', label: 'The home screen' }, { id: 'pay-electricity', label: 'Pay an electricity bill' }, { id: 'troubleshooting', label: 'Troubleshooting' }],
    body: () => (
      <>
        <H2 id="home-screen">The home screen</H2>
        <P>Select a number to see what each part of the screen does.</P>
        <Hotspots />
        <H2 id="pay-electricity">Pay an electricity bill</H2>
        <Steps items={[
          { title: 'Select Pay a bill, then Electricity', body: 'Choose your distribution company from the list.' },
          { title: 'Enter your meter number', body: 'Relay checks the meter and shows the name on the account. Stop if the name is not yours.' },
          { title: 'Enter the amount and confirm', body: 'Check the amount and fee, then select Pay.' },
          { title: 'Save your token', body: 'Prepaid meters get a 20-digit token on screen and by email. Enter it on your meter.' },
        ]} />
        <H2 id="troubleshooting">Troubleshooting</H2>
        <Faq items={[
          { q: 'I paid but did not get a token', a: 'Tokens usually arrive within a minute. Open Activity, select the payment and choose Resend token. If the payment failed, the money returns to your balance automatically.' },
          { q: 'The name on the meter is wrong', a: 'Do not continue. Check the meter number on your meter or your last receipt and enter it again.' },
          { q: 'My meter rejected the token', a: 'Enter it again slowly. If it is still rejected, contact your distribution company with the receipt from Activity.' },
        ]} />
      </>
    ),
  },
  {
    id: 'web3-deploy',
    group: 'Guides',
    title: 'Deploy a smart contract',
    lead: 'Write, test and deploy a Solidity contract to an EVM testnet with Hardhat.',
    keywords: 'solidity hardhat evm smart contract blockchain rootstock zksync testnet web3',
    toc: [{ id: 'the-contract', label: 'The contract' }, { id: 'test-it', label: 'Test it' }, { id: 'configure', label: 'Configure the network' }, { id: 'deploy', label: 'Deploy' }],
    body: () => (
      <>
        <H2 id="the-contract">The contract</H2>
        <P>A counter anyone can increase. It emits an event each time, so apps can react without polling.</P>
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
        <H2 id="test-it">Test it</H2>
        <CodeTabs title="test/Counter.js" samples={{ JavaScript: `const { expect } = require("chai")

describe("Counter", () => {
  it("increases by one", async () => {
    const counter = await ethers.deployContract("Counter")
    await counter.increase()
    expect(await counter.count()).to.equal(1n)
  })
})` }} />
        <Try><RunCommand cmd="npx hardhat compile && npx hardhat test" /></Try>
        <H2 id="configure">Configure the network</H2>
        <P>Read the RPC URL and the deployer key from environment variables, never from the file itself.</P>
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
        <Callout kind="warning">Never commit a private key. Deploy from a wallet that only holds testnet funds.</Callout>
        <H2 id="deploy">Deploy</H2>
        <CodeTabs title="scripts/deploy.js" samples={{ JavaScript: `async function main() {
  const counter = await ethers.deployContract("Counter")
  await counter.waitForDeployment()
  console.log("Counter deployed to", await counter.getAddress())
}

main()` }} />
        <Try>
          <RunCommand cmd="npx hardhat run scripts/deploy.js --network testnet" />
          <RunCommand cmd="npx hardhat run scripts/deploy.js" label="Forget the network" />
        </Try>
      </>
    ),
  },
  {
    id: 'skills',
    group: 'Reference',
    title: 'Skills and tools',
    lead: 'What I bring to a documentation team.',
    keywords: 'git github jenkins github actions html css javascript php markdown',
    toc: [{ id: 'writing', label: 'Writing' }, { id: 'technical', label: 'Technical' }],
    body: () => (
      <>
        <H2 id="writing">Writing</H2>
        <Table head={['Skill', 'Includes']} rows={[
          ['API documentation', 'References, authentication, errors, rate limits and SDK guides.'],
          ['Developer documentation', 'Quickstarts, tutorials, concepts and integration guides.'],
          ['Technical manuals and user guides', 'Task-based instructions, troubleshooting and onboarding.'],
          ['Research and information architecture', 'Interviewing engineers, testing products and structuring large doc sets.'],
        ]} />
        <H2 id="technical">Technical</H2>
        <div className="mt-5 flex flex-wrap gap-2">
          {['HTML', 'CSS', 'JavaScript', 'PHP', 'Git', 'GitHub', 'Jenkins', 'GitHub Actions', 'Markdown', 'REST APIs', 'Solidity'].map(t => <span key={t} className="rounded-lg border border-ink-border bg-surface px-3 py-1.5 font-head text-[0.8rem]">{t}</span>)}
        </div>
      </>
    ),
  },
  {
    id: 'contact',
    group: 'Reference',
    title: 'Work with me',
    lead: 'Need documentation that developers and customers can use? Let’s talk.',
    keywords: 'email hire cv recruiter contact',
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
