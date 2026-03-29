/**
 * AI / RAG configuration (env var names only; values come from process.env at runtime).
 * Do not commit secrets.
 *
 * Current phase: Gemini-only (LLM + embeddings when implemented). Pinecone is optional;
 * leave PINECONE_* unset until you add a vector index.
 */

function isConfigured(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function pineconeHealthStatus() {
  if (isConfigured(process.env.PINECONE_API_KEY)) {
    return "configured";
  }
  const wantPinecone =
    process.env.PINECONE_ENABLED === "1" || process.env.PINECONE_ENABLED === "true";
  if (wantPinecone) {
    return "missing";
  }
  return "disabled";
}

function openaiHealthStatus() {
  if (isConfigured(process.env.OPENAI_API_KEY)) {
    return "configured";
  }
  const wantOpenai =
    process.env.OPENAI_FALLBACK_ENABLED === "1" ||
    process.env.OPENAI_FALLBACK_ENABLED === "true";
  if (wantOpenai) {
    return "missing";
  }
  return "disabled";
}

const ai = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    /** e.g. gemini-2.0-flash — set when wiring LLM */
    llmModel: process.env.GEMINI_LLM_MODEL,
    /** Prefer gemini-embedding-001 for embedContent (legacy text-embedding-004 is aliased in code) */
    embeddingModel: process.env.GEMINI_EMBEDDING_MODEL
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    llmModel: process.env.OPENAI_LLM_MODEL,
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL
  },
  pinecone: {
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
    index: process.env.PINECONE_INDEX
  },
  /** Presence flags for health checks (no secret values) */
  providers: {
    gemini: () => (isConfigured(process.env.GEMINI_API_KEY) ? "configured" : "missing"),
    openai: openaiHealthStatus,
    pinecone: pineconeHealthStatus
  }
};

module.exports = ai;
