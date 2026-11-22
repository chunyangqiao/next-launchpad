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

function decodeEntity(match: string): string {
  if (match.startsWith("&#x") || match.startsWith("&#X")) {
    return fromCodePoint(parseInt(match.slice(3, -1), 16));
  }

  if (match.startsWith("&#")) {
    return fromCodePoint(parseInt(match.slice(2, -1), 10));
  }

  return NAMED_ENTITIES[match.slice(1, -1).toLowerCase()] ?? match;
}

/** Decode non-visible markup into text for metadata and structured data. */
export function htmlToPlainText(html: string | null | undefined): string {
  return (html ?? "")
    .replace(SCRIPT_BLOCK, " ")
    .replace(STYLE_BLOCK, " ")
    .replace(HTML_COMMENT, " ")
    .replace(HTML_TAG, " ")
    .replace(ENTITY, decodeEntity)
    .replace(/\s+/g, " ")
    .trim();
}

export function seoExcerpt(html: string | null | undefined, maxLength = 155): string | undefined {
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
