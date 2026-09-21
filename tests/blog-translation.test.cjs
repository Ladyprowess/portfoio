const { test } = require('node:test')
const assert = require('node:assert/strict')
const ts = require('typescript')
const fs = require('node:fs')
const vm = require('node:vm')
const htmlExports = {}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/igbo-html.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: htmlExports })
const exportsObject = {}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/blog-translation.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: exportsObject, require: () => htmlExports })
const { hasIgboTranslation, translationRecord } = exportsObject
const complete = { titleIg: 'Aha', excerptIg: 'Nchịkọta', bodyIg: 'Paragraf nke mbụ.\n\nParagraf nke abụọ.', igboApproved: true }
test('only complete approved translations enable switching', () => {
 assert.equal(hasIgboTranslation({}), false)
 assert.equal(hasIgboTranslation(translationRecord(complete)), true)
 assert.equal(hasIgboTranslation(translationRecord({ ...complete, igboApproved: false })), false)
 assert.equal(hasIgboTranslation({ title_ig: 'Aha', igbo_approved: true }), false)
})
test('incomplete drafts can be saved but cannot be approved', () => {
 assert.equal(translationRecord({ titleIg: 'Aha' }).igbo_approved, false)
 assert.throws(() => translationRecord({ ...complete, bodyIg: '  ' }), /Complete/)
 assert.throws(() => translationRecord({ ...complete, titleIg: 'a'.repeat(501) }), /too long/)
})
test('Igbo diacritics and paragraph boundaries survive storage', () => {
 assert.equal(translationRecord(complete).excerpt_ig, complete.excerptIg)
 assert.equal(translationRecord(complete).body_ig, complete.bodyIg)
})

test('rich translations retain formatting and reject empty editor markup', () => {
 const rich = htmlExports.storeIgboHtml('<h2>Isiokwu</h2><p><strong>Okwu</strong></p>')
 assert.match(translationRecord({ ...complete, bodyIg: rich }).body_ig, /<strong>Okwu<\/strong>/)
 assert.throws(() => translationRecord({ ...complete, bodyIg: htmlExports.storeIgboHtml('<p><br></p>') }), /Complete/)
})
test('translation rendering strips unsafe tags and attributes', () => {
 const safe = htmlExports.igboEditorHtml(htmlExports.storeIgboHtml('<p onclick="bad()">Text</p><script>alert(1)</script><img src="javascript:bad()"><a href="javascript:bad()">Link</a>'))
 assert.ok(!/onclick|script|alert|javascript/.test(safe))
 assert.match(safe, /<p>Text<\/p>/)
 assert.equal(htmlExports.igboEditorHtml('<script>plain text</script>'), '<p>&lt;script&gt;plain text&lt;/script&gt;</p>')
})
