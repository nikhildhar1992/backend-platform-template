const geminiAdapter = require("./adapters/gemini.adapter");

class EmbeddingsService {
  /**
   * @param {string} text
   * @returns {Promise<number[]>}
   */
  async embed(text) {
    return geminiAdapter.embedText(text);
  }
}

module.exports = new EmbeddingsService();
