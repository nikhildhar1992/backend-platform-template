const embeddingsService = require("./embeddings.service");
const llmService = require("./llm.service");
const vectorStore = require("./vectorStore.service");
const AppError = require("../../utils/appError");

const DEFAULT_TOP_K = 5;

const SYSTEM_RAG = `You are a precise assistant for a knowledge base.
Answer using only the provided context when it supports the answer.
If the context is empty or does not contain the answer, say clearly that the knowledge base does not contain enough information — do not invent facts.`;

class RagService {
  /**
   * @param {{ question: string, topK?: number }} body
   * @returns {Promise<{ answer: string, citations: { id: string, score: number, text: string }[], retrievedCount: number }>}
   */
  async query(body) {
    const question = body?.question;
    if (typeof question !== "string" || !question.trim()) {
      throw new AppError("question is required", 400);
    }
    const q = question.trim();
    const topK = Math.min(
      Math.max(Number(body?.topK) || DEFAULT_TOP_K, 1),
      20
    );

    const queryVector = await embeddingsService.embed(q);
    const hits = await vectorStore.queryTopK(queryVector, topK);

    const contextBlock =
      hits.length === 0
        ? "(No documents in the knowledge store yet.)"
        : hits.map((h, i) => `[#${i + 1}] (score ${h.score.toFixed(4)})\n${h.text}`).join("\n\n---\n\n");

    const prompt = `Context from knowledge base:\n\n${contextBlock}\n\nUser question:\n${q}`;

    const answer = await llmService.complete({
      prompt,
      systemInstruction: SYSTEM_RAG
    });

    return {
      answer: answer.trim(),
      citations: hits.map((h) => ({
        id: h.id,
        score: h.score,
        text: h.text
      })),
      retrievedCount: hits.length
    };
  }
}

module.exports = new RagService();
