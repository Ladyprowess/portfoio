const { test } = require('node:test')
const assert = require('node:assert/strict')
const ts = require('typescript')
const fs = require('node:fs')
const vm = require('node:vm')
const exportsObject = {}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/blog-translation.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports: exportsObject })
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
