/**
 * Character-window chunking with overlap (no tokenizer — good enough for dev / Day 33).
 */
function chunkText(text, { maxChars = 1000, overlap = 100 } = {}) {
  const t = String(text).replace(/\r\n/g, "\n").trim();
  if (!t) {
    return [];
  }
  const chunks = [];
  let start = 0;
  while (start < t.length) {
    const end = Math.min(start + maxChars, t.length);
    chunks.push(t.slice(start, end));
    if (end === t.length) {
      break;
    }
    start = Math.max(0, end - overlap);
  }
  return chunks;
}

module.exports = { chunkText };
