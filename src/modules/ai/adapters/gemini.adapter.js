const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../../../config");
const AppError = require("../../../utils/appError");
const logger = require("../../../utils/logger");

const DEFAULT_LLM_MODEL = "gemini-2.0-flash";
/** @see https://ai.google.dev/gemini-api/docs/embeddings */
const DEFAULT_EMBEDDING_MODEL = "gemini-embedding-001";

/** Names that 404 on embedContent with the current Generative Language API */
const EMBEDDING_MODEL_ALIASES = {
  "text-embedding-004": "gemini-embedding-001"
};

function resolveEmbeddingModel(name) {
  const trimmed = (name && String(name).trim()) || DEFAULT_EMBEDDING_MODEL;
  return EMBEDDING_MODEL_ALIASES[trimmed] || trimmed;
}

let cachedSettings = null;

function getGeminiSettings() {
  if (cachedSettings) {
    return cachedSettings;
  }
  const { apiKey, llmModel, embeddingModel } = config.ai.gemini;
  if (!apiKey || !String(apiKey).trim()) {
    throw new AppError("Gemini API key is not configured", 503);
  }
  const resolvedEmbed = resolveEmbeddingModel(embeddingModel);
  if (embeddingModel && EMBEDDING_MODEL_ALIASES[String(embeddingModel).trim()]) {
    logger.warn({
      message: "GEMINI_EMBEDDING_MODEL alias applied",
      from: String(embeddingModel).trim(),
      to: resolvedEmbed
    });
  }
  cachedSettings = {
    apiKey: String(apiKey).trim(),
    llmModel: (llmModel && String(llmModel).trim()) || DEFAULT_LLM_MODEL,
    embeddingModel: resolvedEmbed
  };
  return cachedSettings;
}

let cachedClient = null;
let cachedKey = null;

function getClient() {
  const { apiKey } = getGeminiSettings();
  if (!cachedClient || cachedKey !== apiKey) {
    cachedClient = new GoogleGenerativeAI(apiKey);
    cachedKey = apiKey;
  }
  return cachedClient;
}

function mapGeminiError(err, fallbackMessage) {
  if (err instanceof AppError) {
    return err;
  }
  const message = err?.message || fallbackMessage;
  logger.error({ message: "Gemini adapter error", err: message });
  if (
    String(message).includes("429") ||
    String(message).includes("Too Many Requests") ||
    String(message).includes("quota")
  ) {
    return new AppError(
      "Gemini rate limit or quota exceeded; retry later or check billing",
      429
    );
  }
  return new AppError(message, 502);
}

/**
 * @param {string} text
 * @returns {Promise<number[]>}
 */
async function embedText(text) {
  if (typeof text !== "string" || !text.trim()) {
    throw new AppError("Embedding input must be non-empty text", 400);
  }
  try {
    const { embeddingModel } = getGeminiSettings();
    const model = getClient().getGenerativeModel({ model: embeddingModel });
    const result = await model.embedContent(text.trim());
    const values = result?.embedding?.values;
    if (!Array.isArray(values) || values.length === 0) {
      throw new AppError("Invalid embedding response from Gemini", 502);
    }
    return values;
  } catch (err) {
    throw mapGeminiError(err, "Gemini embedding request failed");
  }
}

/**
 * @param {{ prompt: string, systemInstruction?: string }} params
 * @returns {Promise<string>}
 */
async function generateText(params) {
  const { prompt, systemInstruction } = params || {};
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new AppError("Prompt must be non-empty text", 400);
  }
  try {
    const { llmModel } = getGeminiSettings();
    const model = getClient().getGenerativeModel({
      model: llmModel,
      systemInstruction: systemInstruction || undefined
    });
    const result = await model.generateContent(prompt.trim());
    const text = result.response.text();
    if (typeof text !== "string") {
      throw new AppError("Empty or invalid LLM response from Gemini", 502);
    }
    return text;
  } catch (err) {
    throw mapGeminiError(err, "Gemini LLM request failed");
  }
}

module.exports = {
  embedText,
  generateText,
  getGeminiSettings
};
