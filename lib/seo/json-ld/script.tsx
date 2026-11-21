import type { JsonLdObject, JsonLdProps } from "@/types/seo";

/** 把 `<` 转成 JSON 的 Unicode 转义，防止数据里出现闭合 script 标签把这段提前截断。 */
function serialize(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

/**
 * 把 json-ld.ts 里的构造结果渲染成 `<script type="application/ld+json">`。
 *
 * 多个对象会合并成一个数组写进同一个 script，全是 null 就什么都不渲染。
 */
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
