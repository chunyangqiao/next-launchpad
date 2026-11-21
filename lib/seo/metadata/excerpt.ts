import { SEO_EXCERPT_MAX_LENGTH } from "@/lib/constants/seo";

const SCRIPT_BLOCK = /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi;
const STYLE_BLOCK = /<style\b[^>]*>[\s\S]*?<\/style\s*>/gi;
const HTML_COMMENT = /<!--[\s\S]*?-->/g;
const HTML_TAG = /<[^>]*>/g;
const ENTITY = /&#x[0-9a-f]+;|&#\d+;|&[a-z][a-z0-9]*;/gi;

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  apos: "'",
  gt: ">",
  hellip: "…",
  ldquo: "“",
  lsquo: "‘",
  lt: "<",
  mdash: "—",
  nbsp: " ",
  ndash: "–",
  quot: '"',
  rdquo: "”",
  rsquo: "’",
};

function fromCodePoint(value: number): string {
  return Number.isFinite(value) && value > 0 && value <= 0x10ffff
    ? String.fromCodePoint(value)
    : "";
}

/**
 * 单趟解码实体：`&amp;lt;` 得到字面量 `&lt;` 而不是 `<`，和作者看到的文字一致。
 */
function decodeEntity(match: string): string {
  if (match.startsWith("&#x") || match.startsWith("&#X")) {
    return fromCodePoint(parseInt(match.slice(3, -1), 16));
  }

  if (match.startsWith("&#")) {
    return fromCodePoint(parseInt(match.slice(2, -1), 10));
  }

  return NAMED_ENTITIES[match.slice(1, -1).toLowerCase()] ?? match;
}

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
  const text = (html ?? "")
    .replace(SCRIPT_BLOCK, " ")
    .replace(STYLE_BLOCK, " ")
    .replace(HTML_COMMENT, " ")
    .replace(HTML_TAG, " ")
    .replace(ENTITY, decodeEntity)
    .replace(/\s+/g, " ")
    .trim();

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
