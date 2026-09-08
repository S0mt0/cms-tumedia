export type RichTextDocument = {
  json: Record<string, unknown>;
  html: string;
};

type JsonValue = Record<string, unknown>;

function isJsonValue(value: unknown): value is JsonValue {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function normaliseMark(value: unknown): JsonValue | undefined {
  if (!isJsonValue(value) || typeof value.type !== "string") return undefined;
  return { type: value.type };
}

function normaliseNode(value: unknown): JsonValue | undefined {
  if (!isJsonValue(value) || typeof value.type !== "string") return undefined;

  const content = Array.isArray(value.content)
    ? value.content
        .map(normaliseNode)
        .filter((node): node is JsonValue => Boolean(node))
    : undefined;
  const marks = Array.isArray(value.marks)
    ? value.marks
        .map(normaliseMark)
        .filter((mark): mark is JsonValue => Boolean(mark))
    : undefined;

  return {
    type: value.type,
    ...(typeof value.text === "string" ? { text: value.text } : {}),
    ...(marks?.length ? { marks } : {}),
    ...(content?.length ? { content } : {}),
  };
}

/**
 * Creates a BSON-safe Tiptap document from the limited node shape we allow.
 * Formatting details remain faithfully represented in the validated HTML.
 */
export function normaliseRichTextJson(value: unknown): Record<string, unknown> {
  const document = normaliseNode(value);
  return document?.type === "doc" ? document : { type: "doc", content: [] };
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      }[character] ?? character)
  );
}

export function richTextFromParagraphs(paragraphs: string[]): RichTextDocument {
  const content = paragraphs.map((text) => ({
    type: "paragraph",
    content: text ? [{ type: "text", text }] : undefined,
  }));

  return {
    json: { type: "doc", content },
    html: paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join(""),
  };
}
