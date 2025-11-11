export function sanitizeMarkdown(raw: string): string {
  if (!raw) return "";

  let text = raw;

  // 1. Convert escaped newlines and tabs
  text = text.replace(/\\n/g, "\n").replace(/\\t/g, "\t");

  // 2. Remove accidental quotes around entire string
  text = text.replace(/^"([\s\S]*)"$/, "$1");

  // 3. Fix double-escaped backticks (common when stringified)
  text = text.replace(/\\`{3}/g, "```");

  // 4. Normalize spacing between paragraphs
  text = text.replace(/\n{3,}/g, "\n\n");

  // 5. Remove unwanted leading/trailing whitespace
  text = text.trim();

  // 6. Optional: decode common HTML entities
  text = text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  return text;
}
