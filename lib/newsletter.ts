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
  return topic === "Web3" ? "Lady Prowess from Decode Web3" : "Lady Prowess";
}

function emailSafeArticleHtml(contentHtml: string) {
  const styleTag = (html: string, tag: string, baseStyle: string) =>
    html.replace(
      new RegExp(`<${tag}\\b([^>]*)>`, "gi"),
      (_match, rawAttributes: string) => {
        const existingStyle = rawAttributes.match(/\sstyle=["']([^"']*)["']/i)?.[1] || "";
        const attributes = rawAttributes.replace(/\sstyle=["'][^"']*["']/i, "");
        return `<${tag}${attributes} style="${baseStyle}${existingStyle}">`;
      },
    );

  let html = contentHtml
    .replace(/text-align\s*:\s*justify\s*;?/gi, "text-align:left;")
    .replace(/<div\b([^>]*class=["'][^"']*blog-table-wrap[^"']*["'][^>]*)>/gi, '<div style="width:100%;margin:24px 0;">');

  html = styleTag(html, "table", "width:100%;border-collapse:collapse;table-layout:fixed;background:#FFFFFF;font-size:13px;line-height:1.45;")
    .replace(/<table\b/i, '<table role="presentation" width="100%" cellpadding="0" cellspacing="0"')
  html = styleTag(html, "th", "border:1px solid #DDE1E8;background:#EEF4FF;color:#17191D;padding:10px 8px;text-align:left;vertical-align:top;font-weight:700;overflow-wrap:anywhere;");
  html = styleTag(html, "td", "border:1px solid #DDE1E8;padding:10px 8px;text-align:left;vertical-align:top;overflow-wrap:anywhere;");

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
          return `<tr><td width="28" valign="top" style="width:28px;padding:9px 8px 9px 0;border-bottom:1px solid #E5E7EB;color:#2563EB;font-size:18px;line-height:1.4;">${checked ? "☑" : "☐"}</td><td valign="top" style="padding:9px 0;border-bottom:1px solid #E5E7EB;color:#25282D;font-size:15px;line-height:1.65;text-align:left;">${copy}</td></tr>`;
        })
        .join("");
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;margin:18px 0 26px;border-collapse:collapse;">${rows}</table>`;
    },
  );

  return html;
}

export function emailDocument(input: {
  title: string;
  excerpt: string;
  contentHtml: string;
  topic: string;
  postUrl?: string;
  subscribeUrl?: string;
  unsubscribeUrl?: string;
}) {
  const publication = publicationName(input.topic);
  const articleHtml = emailSafeArticleHtml(input.contentHtml);
  const button = input.postUrl
    ? `<a href="${input.postUrl}" style="display:inline-block;background:#2563EB;color:#FFFFFF;text-decoration:none;font-weight:700;padding:13px 22px;border-radius:8px;">Read on the website</a>`
    : "";
  const unsubscribe = input.unsubscribeUrl
    ? `<p style="margin:24px 0 0;text-align:center;font-size:12px;line-height:1.6;color:#8A909B;">You received this email because you subscribed to ${publication}.<br><a href="${input.unsubscribeUrl}" style="color:#4B5563;text-decoration:underline;">Unsubscribe from these emails</a></p>`
    : "";
  const subscribe = input.subscribeUrl
    ? `<p style="margin:24px 0 0;font-size:14px;color:#4B5563;">If someone forwarded this email to you, <a href="${input.subscribeUrl}" style="color:#2563EB;font-weight:700;">subscribe here</a> to receive future posts.</p>`
    : "";

  return `<!doctype html><html><body style="margin:0;background:#F5F6F8;color:#17191D;"><div style="display:none;max-height:0;overflow:hidden;opacity:0;">${input.excerpt}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:28px 10px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:680px;margin:0 auto;background:#FFFFFF;border:1px solid #E5E7EB;"><tr><td style="padding:34px 24px;font-family:Arial,Helvetica,sans-serif;"><p style="margin:0 0 32px;color:#2563EB;font-size:13px;font-weight:800;letter-spacing:1.6px;text-transform:uppercase;">${publication}</p><h1 style="margin:0;font-size:32px;line-height:1.18;letter-spacing:-0.5px;">${input.title}</h1><p style="margin:16px 0 0;color:#6B7280;font-size:17px;line-height:1.65;text-align:left;">${input.excerpt}</p><p style="margin:22px 0 0;color:#6B7280;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Ngozi Peace Okafor</p><div style="height:1px;background:#E5E7EB;margin:28px 0;"></div><div style="font-size:16px;line-height:1.8;color:#25282D;text-align:left;">${articleHtml}</div>${button ? `<div style="margin-top:32px;">${button}</div>` : ""}${subscribe}<div style="height:1px;background:#E5E7EB;margin:34px 0 22px;"></div><p style="margin:0;font-size:13px;color:#6B7280;">© ${new Date().getFullYear()} ${publication}</p>${unsubscribe}</td></tr></table></td></tr></table></body></html>`;
}
