/** Restore the saved caret after async uploads, then insert only into this editor. */
export function insertEditorContent(editor: HTMLElement, savedRange: Range | null, value: string, html: boolean) {
 if (!value.trim()) throw new Error('The clipboard has no usable content. Copy the article again and retry.')
 if (!editor.isContentEditable) throw new Error('The editor is not ready. Please try pasting again.')
 editor.focus()
 const selection = window.getSelection()
 if (!selection) throw new Error('Could not place the cursor. Click inside the article and retry.')
 let range: Range
 if (savedRange && editor.contains(savedRange.startContainer) && editor.contains(savedRange.endContainer)) {
  range = savedRange
 } else {
  range = document.createRange()
  range.selectNodeContents(editor)
  range.collapse(false)
 }
 selection.removeAllRanges()
 selection.addRange(range)
 const before = editor.innerHTML
 const inserted = document.execCommand(html ? 'insertHTML' : 'insertText', false, value)
 if (inserted || editor.innerHTML !== before) return
 // Some browsers refuse execCommand after an asynchronous clipboard operation.
 const fragment = html ? range.createContextualFragment(value) : document.createDocumentFragment()
 if (!html) fragment.appendChild(document.createTextNode(value))
 const last = fragment.lastChild
 if (!last) throw new Error('Nothing could be pasted. Copy the article again and retry.')
 range.deleteContents()
 range.insertNode(fragment)
 range.setStartAfter(last)
 range.collapse(true)
 selection.removeAllRanges()
 selection.addRange(range)
 if (!editor.contains(last)) throw new Error('Could not insert the content. Please try again.')
}
