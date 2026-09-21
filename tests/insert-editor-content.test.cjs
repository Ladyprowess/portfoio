const { test } = require('node:test')
const assert = require('node:assert/strict')
const vm = require('node:vm')
const fs = require('node:fs')
const ts = require('typescript')
function setup(editable, accepts) {
 const exports = {}; let fallback = false
 const last = {}
 const editor = { isContentEditable: editable, innerHTML: '', focus() {}, contains: node => node === editor || (fallback && node === last) }
 const range = { startContainer: editor, endContainer: editor, selectNodeContents() {}, collapse() {}, createContextualFragment: () => ({ lastChild: last }), deleteContents() {}, insertNode() { fallback = true; editor.innerHTML = '<p>Article</p>' }, setStartAfter() {} }
 const document = { createRange: () => range, execCommand: () => { if (accepts) editor.innerHTML = '<p>Article</p>'; return accepts } }
 const window = { getSelection: () => ({ removeAllRanges() {}, addRange() {} }) }
 vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/insert-editor-content.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, document, window })
 return { insert: exports.insertEditorContent, editor, range, fallback: () => fallback }
}
test('read-only editor cannot report a successful paste', () => {
 const s = setup(false, false)
 assert.throws(() => s.insert(s.editor, s.range, '<p>Article</p>', true), /not ready/)
})
test('editable editor inserts at the saved range', () => {
 const s = setup(true, true)
 s.insert(s.editor, s.range, '<p>Article</p>', true)
 assert.equal(s.editor.innerHTML, '<p>Article</p>')
 assert.equal(s.fallback(), false)
})
test('rejected browser command falls back to inserting DOM nodes', () => {
 const s = setup(true, false)
 s.insert(s.editor, s.range, '<p>Article</p>', true)
 assert.equal(s.fallback(), true)
 assert.equal(s.editor.innerHTML, '<p>Article</p>')
})
test('empty clipboard is an error rather than success', () => {
 const s = setup(true, true)
 assert.throws(() => s.insert(s.editor, s.range, '', true), /no usable content/)
})
