/**
 * Smoke test for Gemini embedding + LLM (Day 32). Run from project root:
 *   npm run test:gemini
 * Requires GEMINI_API_KEY (and optional model env vars) in .env
 */
require("dotenv").config();

const embeddingsService = require("../modules/ai/embeddings.service");
const llmService = require("../modules/ai/llm.service");

async function main() {
  const vector = await embeddingsService.embed("hello world");
  console.log("Embedding length:", vector.length);

  const reply = await llmService.complete({
    prompt: "Reply with exactly one word: pong"
  });
  console.log("LLM reply:", reply.trim());
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
