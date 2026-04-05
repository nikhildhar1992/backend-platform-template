-- USERS TABLE

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- RAG: text chunks + embedding vectors (JSON array of floats; full-table scan for similarity — fine for small/medium KB)

CREATE TABLE IF NOT EXISTS rag_chunks (
  id CHAR(36) NOT NULL PRIMARY KEY,
  chunk_text TEXT NOT NULL,
  embedding_json JSON NOT NULL,
  embedding_dim INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_rag_chunks_created (created_at)
);