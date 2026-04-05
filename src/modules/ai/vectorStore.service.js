const { v4: uuidv4 } = require("uuid");
const embeddingsService = require("./embeddings.service");
const ragChunksRepository = require("./ragChunks.repository");
const { cosineSimilarity } = require("./utils/cosineSimilarity");

/**
 * MySQL-backed chunk store + in-process similarity (loads all rows — OK for modest KB sizes).
 */
class VectorStoreService {
  /**
   * @param {string[]} texts
   * @returns {Promise<number>}
   */
  async addTexts(texts) {
    let added = 0;
    for (const text of texts) {
      const trimmed = String(text).trim();
      if (!trimmed) {
        continue;
      }
      const vector = await embeddingsService.embed(trimmed);
      const id = uuidv4();
      await ragChunksRepository.insert({
        id,
        chunkText: trimmed,
        vector
      });
      added += 1;
    }
    return added;
  }

  /**
   * @param {number[]} queryVector
   * @param {number} k
   * @returns {Promise<{ id: string, text: string, score: number }[]>}
   */
  async queryTopK(queryVector, k) {
    const items = await ragChunksRepository.findAllWithEmbeddings();
    const scored = items.map((item) => ({
      id: item.id,
      text: item.text,
      score: cosineSimilarity(queryVector, item.vector)
    }));
    scored.sort((x, y) => y.score - x.score);
    return scored.slice(0, Math.max(0, k));
  }

  async count() {
    return ragChunksRepository.count();
  }
}

module.exports = new VectorStoreService();
