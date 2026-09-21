const checklistMarker = /^\s*(?:☐|☑|☒|□|✓|✔|\[\s?\]|\[[xX]\])\s*/;

function flattenChecklistWrappers(list: HTMLUListElement | HTMLOListElement) {
  let foundWrapper = true;

  while (foundWrapper) {
    foundWrapper = false;

    Array.from(list.children).forEach((item) => {
      if (item.tagName !== "LI") return;
      const nestedList = item.querySelector("ul, ol");
      if (!nestedList) return;

      const visibleCopy = item.cloneNode(true) as HTMLElement;
      visibleCopy
        .querySelectorAll("ul, ol")
        .forEach((childList) => childList.remove());
      visibleCopy
        .querySelectorAll('input[type="checkbox"], [aria-hidden="true"]')
        .forEach((element) => element.remove());
      const ownText = (visibleCopy.textContent || "")
        .replace(checklistMarker, "")
        .replace(/\u200B/g, "")
        .trim();
      const hasWrittenContent = /[A-Za-z0-9]/.test(ownText);
      if (hasWrittenContent || visibleCopy.querySelector("img, table")) return;

      Array.from(nestedList.children).forEach((nestedItem) =>
        list.insertBefore(nestedItem, item),
      );
      item.remove();
      foundWrapper = true;
    });
  }
}

function prepareChecklist(
  list: HTMLUListElement | HTMLOListElement,
  removeEmptyItems = false,
) {
  flattenChecklistWrappers(list);
  list.className = "blog-checklist";
  list.querySelectorAll(":scope > li").forEach((item) => {
    const sourceCheckboxes = Array.from(
      item.querySelectorAll('input[type="checkbox"]'),
    ) as HTMLInputElement[];
    const itemText = (item.textContent || "")
      .replace(checklistMarker, "")
      .replace(/\u200B/g, "")
      .trim();
    if (removeEmptyItems && !itemText && !item.querySelector("img, table")) {
      item.remove();
      return;
    }
    const checked =
      sourceCheckboxes.some(
        (checkbox) => checkbox.checked || checkbox.hasAttribute("checked"),
      ) ||
      /^(?:☑|☒|✓|✔|\[[xX]\])/i.test(item.textContent?.trim() || "") ||
      item.getAttribute("aria-checked") === "true";
    sourceCheckboxes.forEach((checkbox) => checkbox.remove());
    item
      .querySelectorAll("label")
      .forEach((sourceLabel) =>
        sourceLabel.replaceWith(...Array.from(sourceLabel.childNodes)),
      );
    const textWalker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT);
    let textNode = textWalker.nextNode();
    while (textNode) {
      if (textNode.textContent && checklistMarker.test(textNode.textContent)) {
        textNode.textContent = textNode.textContent.replace(
          checklistMarker,
          "",
        );
        break;
      }
      textNode = textWalker.nextNode();
    }
    const contents = document.createElement("span");
    while (item.firstChild) contents.appendChild(item.firstChild);
    const label = document.createElement("label");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = checked;
    if (checked) checkbox.setAttribute("checked", "");
    label.append(checkbox, contents);
    item.replaceChildren(label);
    item.removeAttribute("aria-checked");
  });
}

export function normaliseGoogleDocsPaste(html: string) {
  const documentCopy = new DOMParser().parseFromString(html, "text/html");
  // Google Docs uses a document-wide <b style="font-weight:normal"> wrapper.
  // Removing its style without unwrapping the element makes the whole article bold.
  documentCopy.querySelectorAll('b, strong').forEach(element => {
    const weight = (element as HTMLElement).style.fontWeight;
    if (weight === 'normal' || weight === '400' || element.id.startsWith('docs-internal-guid')) {
      element.replaceWith(...Array.from(element.childNodes));
    }
  });
  // Preserve intentional inline emphasis as semantic tags before cleaning styles.
  documentCopy.querySelectorAll('span').forEach(element => {
    const style = element.style;
    let content: Node = documentCopy.createDocumentFragment();
    while (element.firstChild) content.appendChild(element.firstChild);
    for (const tag of [(/^(bold|[6-9]00)$/.test(style.fontWeight) ? 'strong' : ''), (style.fontStyle === 'italic' ? 'em' : ''), (style.textDecoration.includes('underline') ? 'u' : '')].filter(Boolean)) {
      const wrapper = documentCopy.createElement(tag); wrapper.appendChild(content); content = wrapper;
    }
    element.appendChild(content);
  });
  const isGoogleDocs = /docs-internal-guid|google-docs|kix-/i.test(html);

  documentCopy
    .querySelectorAll("script, meta, link")
    .forEach((element) => element.remove());
  const checklistLists = new Set<HTMLUListElement | HTMLOListElement>();
  documentCopy.querySelectorAll("li").forEach((item) => {
    const text = item.textContent?.trim() || "";
    const style = item.getAttribute("style") || "";
    const list = item.closest("ul, ol");
    const looksLikeChecklist =
      item.hasAttribute("aria-checked") ||
      checklistMarker.test(text) ||
      (isGoogleDocs && /list-style-type:\s*none/i.test(style));
    if (looksLikeChecklist && list)
      checklistLists.add(list as HTMLUListElement | HTMLOListElement);
  });
  Array.from(checklistLists)
    .filter(
      (list) =>
        !Array.from(checklistLists).some(
          (otherList) => otherList !== list && otherList.contains(list),
        ),
    )
    .forEach((list) => prepareChecklist(list, true));
  documentCopy.querySelectorAll("p, div").forEach((block) => {
    if (
      block.closest(".blog-checklist") ||
      !checklistMarker.test(block.textContent?.trim() || "")
    )
      return;
    const list = documentCopy.createElement("ul");
    list.className = "blog-checklist";
    const item = documentCopy.createElement("li");
    const label = documentCopy.createElement("label");
    const checkbox = documentCopy.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = /^(?:☑|☒|✓|✔|\[[xX]\])/i.test(
      block.textContent?.trim() || "",
    );
    if (checkbox.checked) checkbox.setAttribute("checked", "");
    const contents = documentCopy.createElement("span");
    contents.innerHTML = block.innerHTML.replace(checklistMarker, "");
    label.append(checkbox, contents);
    item.appendChild(label);
    list.appendChild(item);
    block.replaceWith(list);
  });

  documentCopy.querySelectorAll('font[face]').forEach(element => {
    const span = documentCopy.createElement('span');
    const face = element.getAttribute('face') || '';
    if (['Inter', 'Georgia', 'monospace'].includes(face)) span.style.fontFamily = face;
    span.append(...Array.from(element.childNodes)); element.replaceWith(span);
  });
  documentCopy.querySelectorAll("style").forEach((element) => element.remove());
  documentCopy.querySelectorAll("img").forEach((image) => {
    if (/^data:/i.test(image.getAttribute("src") || "")) image.remove();
  });
  documentCopy.querySelectorAll("*").forEach((element) => {
    Array.from(element.attributes).forEach((attribute) => {
      const allowed = [
        "href",
        "src",
        "alt",
        "checked",
        "scope",
        "colspan",
        "rowspan",
        "target",
        "rel",
      ];
      const quizAttribute =
        (attribute.name === "data-quiz" ||
          attribute.name === "contenteditable") &&
        element.classList.contains("blog-quiz");
      if (quizAttribute) return;
      if (attribute.name === "class") {
        const usefulClasses = attribute.value
          .split(/\s+/)
          .filter(
            (value) =>
              value === "blog-checklist" ||
              value === "blog-table-wrap" ||
              value.startsWith("blog-quiz"),
          );
        if (usefulClasses.length)
          element.setAttribute("class", usefulClasses.join(" "));
        else element.removeAttribute("class");
      } else if (attribute.name === "style") {
        const usefulStyles = attribute.value
          .split(";")
          .filter((value) =>
            // Colour is deliberately NOT carried over. Pasted documents stamp
            // every block with their own ink (Google Docs uses #000000), which
            // beats the stylesheet and leaves the text invisible in dark mode.
            /^(?:text-align|font-family|font-weight|font-style|text-decoration)\s*:/i.test(
              value.trim(),
            ),
          );
        if (usefulStyles.length)
          element.setAttribute("style", usefulStyles.join(";"));
        else element.removeAttribute("style");
      } else if (!allowed.includes(attribute.name))
        element.removeAttribute(attribute.name);
    });
  });
  return documentCopy.body.innerHTML;
}


/** Upload image bytes before cleanup; keep each image in its original position. */
export async function prepareBlogPaste(html: string, files: File[], upload: (file: File) => Promise<string>) {
 const doc = new DOMParser().parseFromString(html, 'text/html');
 const images = Array.from(doc.querySelectorAll('img'));
 let fileIndex = 0;
 let hadEmbedded = false;
 for (const image of images) {
  const source = image.getAttribute('src') || '';
  if (/^(data:image\/|blob:)/i.test(source)) {
   hadEmbedded = true;
   const response = await fetch(source);
   if (!response.ok) throw new Error('Could not read a pasted image. Try pasting the image file directly.');
   const blob = await response.blob();
   image.src = await upload(new File([blob], 'pasted-image', { type: blob.type }));
  } else if (files[fileIndex]) {
   image.src = await upload(files[fileIndex++]);
  } else if (/^(file:|cid:)/i.test(source)) {
   throw new Error('This document contains a local image that the browser cannot read. Paste or upload the image file directly.');
  }
 }
 // Clipboard applications often provide both HTML data images and duplicate files.
 if (!hadEmbedded) for (const file of files.slice(fileIndex)) {
  const p = doc.createElement('p'); const img = doc.createElement('img');
  img.src = await upload(file); img.alt = ''; p.appendChild(img); doc.body.appendChild(p);
 }
 return normaliseGoogleDocsPaste(doc.body.innerHTML);
}
