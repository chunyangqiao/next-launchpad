/** Next.js dynamic route parameters shared by localized metadata helpers. */
export type RouteParams = Record<string, string | string[] | undefined>;

/** A JSON-serializable schema.org object. */
export type JsonLdObject = Record<string, unknown>;

/** Accepted values for a structured-data date field. */
export type SeoDate = Date | number | string | null;

/** A single JSON-LD object, an array, or an omitted result from a builder. */
export type JsonLdData = JsonLdObject | null | readonly (JsonLdObject | null)[];
