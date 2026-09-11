export const newsletterTopics = [
  "Web3",
  "AI",
  "Technology",
  "Business",
  "Lifestyle",
] as const;

export type NewsletterTopic = (typeof newsletterTopics)[number];
export type SubscriberTier = "free" | "paid";

export type NewsletterSubscriber = {
  id: string;
  email: string;
  name: string | null;
  topics: string[];
  tier: SubscriberTier;
  status: "active" | "unsubscribed";
  source: string;
  unsubscribe_token: string;
  created_at: string;
  updated_at: string;
};

export function publicationName(topic: string) {
  return topic === "Web3" ? "Decode Web3" : "Lady Prowess";
}

export function senderName(topic: string) {
  if (topic === "All") return "Lady Prowess";
  return `Lady Prowess from ${topic === "Web3" ? "Decode Web3" : topic}`;
}

function emailSafeArticleHtml(contentHtml: string) {
  const cleanStyle = (style: string) =>
    style
      .split(";")
      .filter((rule) =>
        /^\s*(?:color|background-color|font-weight|font-style|text-decoration|text-align|border-color)\s*:/i.test(rule),
      )
      .join(";");
  const styleTag = (html: string, tag: string, baseStyle: string) =>
    html.replace(
      new RegExp(`<${tag}\\b([^>]*)>`, "gi"),
      (_match, rawAttributes: string) => {
        const existingStyle = cleanStyle(rawAttributes.match(/\sstyle=["']([^"']*)["']/i)?.[1] || "");
        const attributes = rawAttributes.replace(/\sstyle=["'][^"']*["']/i, "");
        return `<${tag}${attributes} style="${baseStyle}${existingStyle}">`;
      },
    );

  let html = contentHtml
    .replace(/text-align\s*:\s*justify\s*;?/gi, "text-align:left;")
    .replace(/<div\b([^>]*class=["'][^"']*blog-table-wrap[^"']*["'][^>]*)>/gi, '<div style="width:100%;max-width:100%;margin:24px 0;overflow:hidden;">')
    .replace(/<(table|th|td|img)\b([^>]*)>/gi, (_match, tag: string, attributes: string) =>
      `<${tag}${attributes.replace(/\s(?:width|height)=["'][^"']*["']/gi, "")}>`,
    );

  html = html.replace(/\sstyle=["']([^"']*)["']/gi, (_match, style: string) => {
    const safeStyle = cleanStyle(style);
    return safeStyle ? ` style="${safeStyle}"` : "";
  });
  html = styleTag(html, "table", "width:100%;max-width:100%;border-collapse:collapse;table-layout:fixed;background:#FFFFFF;font-size:13px;line-height:1.45;")
    .replace(/<table\b([^>]*)>/gi, (_match, attributes: string) => {
      const cleanAttributes = attributes
        .replace(/\s(?:role|width|cellpadding|cellspacing)=["'][^"']*["']/gi, "");
      return `<table${cleanAttributes} role="presentation" width="100%" cellpadding="0" cellspacing="0">`;
    });
  html = styleTag(html, "th", "border:1px solid #DDE1E8;background:#EEF4FF;color:#17191D;padding:8px 6px;text-align:left;vertical-align:top;font-weight:700;overflow-wrap:anywhere;word-break:break-word;");
  html = styleTag(html, "td", "border:1px solid #DDE1E8;padding:8px 6px;text-align:left;vertical-align:top;overflow-wrap:anywhere;word-break:break-word;");
  html = styleTag(html, "blockquote", "width:auto;max-width:100%;margin:22px 0;padding:16px;border-left:3px solid #2563EB;background:#EEF4FF;white-space:normal;overflow-wrap:anywhere;word-break:break-word;");
  html = styleTag(html, "pre", "width:auto;max-width:100%;margin:20px 0;padding:14px;background:#121820;color:#E7EDF6;white-space:pre-wrap;overflow-wrap:anywhere;word-break:break-word;");
  html = styleTag(html, "img", "display:block;width:100%;max-width:100%;height:auto;margin:20px auto;")
    .replace(/<img\b([^>]*)>/gi, (_match, attributes: string) => {
      const cleanAttributes = attributes.replace(/\swidth=["'][^"']*["']/gi, "");
      return `<img${cleanAttributes} width="100%">`;
    });

  html = html.replace(
    /<ul\b[^>]*class=["'][^"']*blog-checklist[^"']*["'][^>]*>([\s\S]*?)<\/ul>/gi,
    (_list, items: string) => {
      const rows = Array.from(items.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/gi))
        .map((match) => {
          const item = match[1];
          const checked = /<input\b[^>]*(?:checked(?:=["'][^"']*["'])?)[^>]*>/i.test(item);
          const copy = item
            .replace(/<input\b[^>]*>/gi, "")
            .replace(/<\/?label\b[^>]*>/gi, "")
            .replace(/^\s*<span\b[^>]*>|<\/span>\s*$/gi, "")
            .trim();
          return `<tr><td width="28" valign="top" style="width:28px;padding:9px 8px 9px 0;border:0;border-bottom:1px solid #E5E7EB;color:#2563EB;font-size:18px;line-height:1.4;">${checked ? "☑" : "☐"}</td><td valign="top" style="padding:9px 0;border:0;border-bottom:1px solid #E5E7EB;color:#25282D;font-size:15px;line-height:1.65;text-align:left;overflow-wrap:anywhere;word-break:break-word;">${copy}</td></tr>`;
        })
        .join("");
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:100%;margin:18px 0 26px;border-collapse:collapse;table-layout:fixed;"><col width="28"><col>${rows}</table>`;
    },
  );

  return html;
}

function visibleCharacterCount(html: string) {
  return html.replace(/<[^>]+>/g, " ").replace(/&[a-z0-9#]+;/gi, " ").replace(/\s+/g, " ").trim().length;
}

function emailArticlePreview(contentHtml: string, postUrl?: string) {
  const totalCharacters = visibleCharacterCount(contentHtml);
  if (!postUrl || totalCharacters <= 4000) {
    return { html: contentHtml, shortened: false };
  }

  const blocks = Array.from(
    contentHtml.matchAll(/<(h[1-6]|p|blockquote|pre|ul|ol|table)\b[^>]*>[\s\S]*?<\/\1>/gi),
  ).map((match) => match[0]);
  const selected: string[] = [];
  let characterCount = 0;
  const previewTarget = Math.min(Math.ceil(totalCharacters / 2), 3500);

  for (const block of blocks) {
    const blockLength = visibleCharacterCount(block);
    if (selected.length >= 2 && characterCount + blockLength > previewTarget) break;
    selected.push(block);
    characterCount += blockLength;
  }

  return {
    html: selected.length ? selected.join("") : `<p>${contentHtml.replace(/<[^>]+>/g, " ").slice(0, previewTarget)}</p>`,
    shortened: true,
  };
}

export function emailDocument(input: {
  title: string;
  excerpt: string;
  contentHtml: string;
  topic: string;
  postUrl?: string;
  unsubscribeUrl?: string;
}) {
  const publication = publicationName(input.topic);
  const preview = emailArticlePreview(input.contentHtml, input.postUrl);
  const articleHtml = emailSafeArticleHtml(preview.html);
  const button = input.postUrl
    ? `<a href="${input.postUrl}" style="display:inline-block;background:#2563EB;color:#FFFFFF;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:8px;">Read the full article</a>`
    : "";
  const unsubscribe = input.unsubscribeUrl
    ? `<p style="margin:24px 0 0;text-align:center;font-size:12px;line-height:1.6;color:#8A909B;">You received this email because you subscribed to ${publication}.<br><a href="${input.unsubscribeUrl}" style="color:#4B5563;text-decoration:underline;">Unsubscribe from these emails</a></p>`
    : "";
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>@media only screen and (max-width:520px){.email-outer{padding:12px 6px!important}.email-content{padding:24px 16px!important}.email-title{font-size:26px!important;line-height:1.2!important}}</style></head><body style="margin:0;padding:0;width:100%;background:#F5F6F8;color:#17191D;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;">${input.excerpt}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;table-layout:fixed;"><tr><td class="email-outer" style="padding:28px 10px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;max-width:680px;margin:0 auto;border-collapse:collapse;table-layout:fixed;background:#FFFFFF;border:1px solid #E5E7EB;"><tr><td class="email-content" style="min-width:0;padding:34px 24px;font-family:Arial,Helvetica,sans-serif;overflow-wrap:anywhere;word-break:break-word;"><p style="margin:0 0 32px;color:#2563EB;font-size:13px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;">${publication}</p><h1 class="email-title" style="margin:0;font-size:32px;line-height:1.18;letter-spacing:-0.5px;overflow-wrap:anywhere;">${input.title}</h1><p style="margin:16px 0 0;color:#6B7280;font-size:17px;line-height:1.65;text-align:left;">${input.excerpt}</p><p style="margin:22px 0 0;color:#6B7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Ngozi Peace Okafor</p><div style="height:1px;background:#E5E7EB;margin:28px 0;"></div><div style="width:100%;max-width:100%;font-size:16px;line-height:1.8;color:#25282D;text-align:left;overflow-wrap:anywhere;word-break:break-word;">${articleHtml}</div>${preview.shortened ? `<p style="margin:28px 0 0;color:#6B7280;font-size:14px;line-height:1.6;">Continue reading the complete article on the website.</p>` : ""}${button ? `<div style="margin-top:20px;">${button}</div>` : ""}<div style="height:1px;background:#E5E7EB;margin:34px 0 22px;"></div><p style="margin:0;font-size:13px;color:#6B7280;">© ${new Date().getFullYear()} ${publication}</p>${unsubscribe}</td></tr></table></td></tr></table></body></html>`;
}
