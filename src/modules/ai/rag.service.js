const AppError = require("../../utils/appError");

class RagService {
  /**
   * End-to-end RAG: embed question → retrieve → LLM answer.
   * @returns {Promise<never>}
   */
  async query() {
    throw new AppError("RAG query not implemented", 501);
  }
}

module.exports = new RagService();
