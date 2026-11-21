import { SEO_EXCERPT_MAX_LENGTH } from "@/lib/constants/seo";
import { htmlToPlainText } from "@/lib/seo/text";

/**
 * 后台富文本 → 可以直接放进 <meta name="description"> 的摘要。
 *
 * 先丢掉 script / style（连同内容）和注释，再去标签、解实体、压空白；超长时在词边界截断并加省略号。
 * 空正文返回 undefined，让调用方回落到通用文案。
 *
 * 这不是安全过滤器：输出位于 meta 标签，由 React 负责转义；这里只保证摘要描述的是页面上看得见的文字。
 */
export function toSeoExcerpt(
  html: string | null | undefined,
  maxLength = SEO_EXCERPT_MAX_LENGTH,
): string | undefined {
  const text = htmlToPlainText(html);

  if (!text) {
    return undefined;
  }

  if (text.length <= maxLength) {
    return text;
  }

  const cut = text.slice(0, maxLength - 1);
  const lastSpace = cut.lastIndexOf(" ");

  return `${(lastSpace > maxLength / 2 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}
