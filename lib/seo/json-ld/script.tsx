import type { JsonLdObject, JsonLdProps } from "@/types/seo";

/** Escape HTML delimiters so JSON content cannot close the script element. */
function serialize(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/** Render non-null schema objects in one application/ld+json script. */
export function JsonLdScript({ data }: JsonLdProps) {
  const items = (Array.isArray(data) ? data : [data]).filter(
    (item): item is JsonLdObject => item !== null,
  );

  if (items.length === 0) {
    return null;
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serialize(items.length === 1 ? items[0] : items) }}
    />
  );
}
