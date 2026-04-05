const pool = require("../../config/db");

class RagChunksRepository {
  /**
   * @param {{ id: string, chunkText: string, vector: number[] }} row
   */
  async insert({ id, chunkText, vector }) {
    const dim = vector.length;
    const [result] = await pool.query(
      `INSERT INTO rag_chunks (id, chunk_text, embedding_json, embedding_dim)
       VALUES (?, ?, CAST(? AS JSON), ?)`,
      [id, chunkText, JSON.stringify(vector), dim]
    );
    return result.affectedRows === 1;
  }

  /**
   * @returns {Promise<{ id: string, text: string, vector: number[] }[]>}
   */
  async findAllWithEmbeddings() {
    const [rows] = await pool.query(
      `SELECT id, chunk_text AS text, embedding_json
       FROM rag_chunks
       ORDER BY created_at ASC`
    );
    return rows.map((row) => ({
      id: row.id,
      text: row.text,
      vector: normalizeEmbedding(row.embedding_json)
    }));
  }

  async count() {
    const [[{ total }]] = await pool.query(
      "SELECT COUNT(*) AS total FROM rag_chunks"
    );
    return Number(total) || 0;
  }
}

function normalizeEmbedding(value) {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string") {
    return JSON.parse(value);
  }
  if (value && typeof value === "object") {
    return Object.values(value).map(Number);
  }
  return [];
}

module.exports = new RagChunksRepository();
