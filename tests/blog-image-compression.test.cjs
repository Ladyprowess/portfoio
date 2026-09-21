const { test } = require('node:test')
const assert = require('node:assert/strict')
const ts = require('typescript')
const fs = require('node:fs')
const vm = require('node:vm')
function compressor() {
 const exports = {}; let encoded = 0; let revoked = 0
 const canvas = { width: 0, height: 0, getContext: () => ({ drawImage() {} }), toBlob: callback => { encoded++; callback(new Blob(['compressed'], { type: 'image/webp' })) } }
 class Image { naturalWidth = 4000; naturalHeight = 3000; set src(_) { this.onload() } }
 vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/compress-blog-image.ts','utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText, { exports, File, Blob, Image, URL: { createObjectURL: () => 'blob:test', revokeObjectURL: () => revoked++ }, document: { createElement: () => canvas } })
 return { ...exports, calls: () => ({ encoded, revoked }) }
}
test('images below old 3MB threshold are now compressed', async () => {
 const c = compressor(); const file = new File([new Uint8Array(800000)], 'photo.png', { type: 'image/png' })
 const output = await c.compressBlogImage(file)
 assert.equal(output.type, 'image/webp'); assert.ok(output.size < file.size)
 assert.equal(c.calls().encoded, 1); assert.equal(c.calls().revoked, 1)
})
test('small images and permitted animated GIFs remain intact', async () => {
 const c = compressor()
 for (const [type,size] of [['image/png',1000],['image/gif',800000]]) {
  const file = new File([new Uint8Array(size)], 'image', { type })
  assert.equal(await c.compressBlogImage(file), file)
 }
 assert.equal(c.calls().encoded, 0)
})
