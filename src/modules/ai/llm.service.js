const geminiAdapter = require("./adapters/gemini.adapter");

class LlmService {
  /**
   * @param {{ prompt: string, systemInstruction?: string }} params
   * @returns {Promise<string>}
   */
  async complete(params) {
    return geminiAdapter.generateText(params);
  }
}

module.exports = new LlmService();
