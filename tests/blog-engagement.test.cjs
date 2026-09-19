const { test } = require('node:test')
const assert = require('node:assert/strict')
const ts = require('typescript')
const fs = require('node:fs')
const vm = require('node:vm')
function route(file, allowed = true) {
 const calls = []
 const exports = {}
 const db = async (path, init) => { calls.push({ path, init }); return path === 'rpc/blog_rate_limit' ? allowed : [] }
 const mocks = {
  'next/server': { NextResponse: { json: (body, options) => Response.json(body, options) } },
  '@/lib/email-store': { db, dbCount: async () => 0 },
  '@/lib/blog-posts': { getBlogPost: slug => slug === 'example' ? { slug } : null },
  '@/lib/blog-cms': { getPublishedPost: async () => null },
 }
 const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText
 vm.runInNewContext(code, { exports, require: name => mocks[name] || require(name), process: { env: { COMPOSE_PASSWORD: 'secret', SUPABASE_SERVICE_ROLE_KEY: 'test-key' } }, URL, Buffer })
 return { ...exports, calls }
}
const payload = { slug: 'example', visitor: '11111111-1111-4111-8111-111111111111', action: 'comment', name: 'Reader', body: 'A useful article.' }
const request = data => new Request('https://example.com/api/blog-engagement', { method: 'POST', body: JSON.stringify(data) })
test('comments always enter moderation even if caller supplies approved status', async () => {
 const r = route('app/api/blog-engagement/route.ts')
 assert.equal((await r.POST(request({ ...payload, status: 'approved' }))).status, 201)
 const saved = JSON.parse(r.calls.find(c => c.path === 'blog_comments').init.body)
 assert.equal(saved.status, 'pending')
})
test('rate limit rejects comment before insertion', async () => {
 const r = route('app/api/blog-engagement/route.ts', false)
 assert.equal((await r.POST(request(payload))).status, 429)
 assert.ok(!r.calls.some(c => c.path === 'blog_comments'))
})
test('unknown posts and invalid comments cannot be submitted', async () => {
 const r = route('app/api/blog-engagement/route.ts')
 assert.equal((await r.POST(request({ ...payload, slug: 'missing' }))).status, 404)
 assert.equal((await r.POST(request({ ...payload, body: 'x' }))).status, 400)
 assert.equal((await r.POST(request({ ...payload, website: 'spam' }))).status, 400)
 assert.equal(r.calls.length, 0)
})
test('public listing selects only approved comments and public fields', async () => {
 const r = route('app/api/blog-engagement/route.ts')
 assert.equal((await r.GET(new Request('https://example.com/api/blog-engagement?slug=example'))).status, 200)
 const query = r.calls.find(c => c.path.startsWith('blog_comments')).path
 assert.match(query, /status=eq.approved/)
 assert.match(query, /select=id,name,body,created_at/)
})
test('likes use database uniqueness for retries, unlike deletes only this visitor', async () => {
 const r = route('app/api/blog-engagement/route.ts')
 assert.equal((await r.POST(request({ ...payload, action: 'like', liked: true }))).status, 200)
 assert.ok(r.calls.some(c => c.init?.headers?.Prefer.includes('ignore-duplicates')))
 await r.POST(request({ ...payload, action: 'like', liked: false }))
 assert.ok(r.calls.some(c => c.init?.method === 'DELETE' && c.path.includes(`visitor_id=eq.${payload.visitor}`)))
})
test('admin cannot list or moderate without password, invalid actions rejected', async () => {
 const r = route('app/api/blog-comments-admin/route.ts')
 assert.equal((await r.POST(request({ action: 'list' }))).status, 401)
 assert.equal((await r.POST(request({ password: 'secret', action: 'bad', id: payload.visitor }))).status, 400)
 assert.equal(r.calls.length, 0)
 assert.equal((await r.POST(request({ password: 'secret', action: 'approved', id: payload.visitor }))).status, 200)
 assert.equal(JSON.parse(r.calls[0].init.body).status, 'approved')
})
test('anonymous comments discard supplied names and remain pending', async () => {
 const r = route('app/api/blog-engagement/route.ts')
 assert.equal((await r.POST(request({ ...payload, anonymous: true, name: 'Private name' }))).status, 201)
 const saved = JSON.parse(r.calls.find(c => c.path === 'blog_comments').init.body)
 assert.equal(saved.name, 'Anonymous')
 assert.equal(saved.status, 'pending')
})
test('anonymous comments need no name, named comments still require one', async () => {
 const r = route('app/api/blog-engagement/route.ts')
 assert.equal((await r.POST(request({ ...payload, anonymous: true, name: undefined }))).status, 201)
 assert.equal((await r.POST(request({ ...payload, anonymous: false, name: '' }))).status, 400)
})
