const AppError = require("../../utils/appError");

class DocumentsService {
  /**
   * Ingest: upload → extract → chunk → embed → vector upsert (stub).
   */
  async ingestUpload() {
    throw new AppError("Document ingest not implemented", 501);
  }
}

module.exports = new DocumentsService();
