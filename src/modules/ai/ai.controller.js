const asyncHandler = require("../../utils/asyncHandler");
const config = require("../../config");
const ragService = require("./rag.service");
const vectorStore = require("./vectorStore.service");
const { chunkText } = require("./utils/chunkText");

class AiController {
  getHealth = asyncHandler(async (_req, res) => {
    const { providers } = config.ai;
    res.status(200).json({
      success: true,
      message: "AI module status",
      data: {
        status: "ok",
        providers: {
          gemini: providers.gemini(),
          openai: providers.openai(),
          pinecone: providers.pinecone()
        },
        knowledgeBase: {
          chunks: await vectorStore.count(),
          backend: "mysql"
        }
      },
      meta: null
    });
  });

  postQuery = asyncHandler(async (req, res) => {
    const data = await ragService.query(req.body);
    res.status(200).json({
      success: true,
      message: "RAG answer generated",
      data,
      meta: null
    });
  });

  /**
   * Ingest raw text: chunk → embed → MySQL `rag_chunks`.
   */
  postIngest = asyncHandler(async (req, res) => {
    const { text, maxChars, overlap } = req.body;
    const chunks = chunkText(text, {
      maxChars: maxChars ?? 1000,
      overlap: overlap ?? 100
    });
    if (chunks.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No chunks produced from text"
      });
    }
    const stored = await vectorStore.addTexts(chunks);
    res.status(201).json({
      success: true,
      message: "Text ingested into knowledge base (MySQL)",
      data: {
        chunksCreated: chunks.length,
        vectorsStored: stored
      },
      meta: null
    });
  });
}

module.exports = new AiController();
