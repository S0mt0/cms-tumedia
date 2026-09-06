import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { MediaRef } from "../types/landing";

/**
 * Combines conditional class names and resolves conflicting Tailwind classes.
 *
 * @param inputs - Class values accepted by `clsx`.
 * @returns A merged class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Creates a deep clone of a JSON-serializable value.
 *
 * @param value - The value to clone.
 * @returns A deep copy of the provided value.
 */
export function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/**
 * Converts a camelCase or PascalCase string into a human-readable label.
 *
 * @example
 * humanize("heroSection") // "Hero Section"
 *
 * @param value - The string to humanize.
 * @returns The formatted, human-readable string.
 */
export function humanize(value: string) {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (letter) => letter.toUpperCase());
}

type RecordValue = Record<string, unknown>;
type OrderedItem = RecordValue & { id: string; order?: number };

/**
 * Checks whether a value is a non-null, non-array object.
 *
 * @param value - The value to inspect.
 * @returns `true` if the value is a record-like object.
 */
export function isRecord(value: unknown): value is RecordValue {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

/**
 * Checks whether a value conforms to the expected media reference shape.
 *
 * A valid media reference must contain string `url` and `alt` properties.
 *
 * @param value - The value to inspect.
 * @returns `true` if the value is a valid `MediaRef`.
 */
export function isMedia(value: unknown): value is MediaRef {
  return (
    isRecord(value) &&
    typeof value.url === "string" &&
    typeof value.alt === "string"
  );
}

/**
 * Creates a unique ID using a normalized label and a UUID.
 *
 * @example
 * createId("Hero Section")
 * // "hero-section-550e8400-e29b-41d4-a716-446655440000"
 *
 * @param label - The label to use as the ID prefix.
 * @returns A unique, URL-friendly ID.
 */
export function createId(label: string) {
  return `${label
    .toLowerCase()
    .replace(/\s+/g, "-")}-${globalThis.crypto.randomUUID()}`;
}

/**
 * Normalizes the ordering of a collection.
 *
 * Items that already contain an `order` property are assigned their
 * zero-based position in the array. Items without an `order` property
 * remain unchanged.
 *
 * @param items - The items to normalize.
 * @returns A new array with normalized order values.
 */
export function normalise(items: OrderedItem[]) {
  return items.map((item, order) => ({
    ...item,
    ...(Object.hasOwn(item, "order") ? { order } : {}),
  }));
}

/**
 * Creates an empty value that preserves the structure of the provided value.
 *
 * Strings become empty strings, numbers become zero, arrays become empty
 * arrays, and nested objects are recursively emptied. `id` properties receive
 * newly generated IDs, while `order` properties are reset to zero.
 *
 * Values that are not strings, numbers, arrays, or records are returned
 * unchanged.
 *
 * @param value - The value whose structure should be emptied.
 * @param label - The label used when generating replacement IDs.
 * @returns An emptied version of the value with its object structure preserved.
 */
export function emptyFrom(value: unknown, label: string): unknown {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (Array.isArray(value)) return [];
  if (!isRecord(value)) return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [
      key,
      key === "id"
        ? createId(label)
        : key === "order"
        ? 0
        : emptyFrom(child, label),
    ])
  );
}

/**
 * Reassigns each item's `order` value based on its zero-based position
 * in the array.
 *
 * @param items - The ordered items to normalize.
 * @returns A new array with sequential `order` values.
 */
export function normaliseOrder<TItem extends OrderedItem>(items: TItem[]) {
  return items.map((item, order) => ({ ...item, order }));
}

/**
 * Creates a unique item ID using the provided prefix.
 *
 * Uses `crypto.randomUUID()` when available and falls back to the current
 * timestamp otherwise.
 *
 * @param prefix - The prefix to prepend to the generated identifier.
 * @returns A unique item identifier.
 */
export function createItemId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? Date.now()}`;
}
