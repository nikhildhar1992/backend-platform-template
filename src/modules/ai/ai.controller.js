const asyncHandler = require("../../utils/asyncHandler");
const config = require("../../config");
const ragService = require("./rag.service");

class AiController {
  getHealth = asyncHandler(async (req, res) => {
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
        }
      },
      meta: null
    });
  });

  postQuery = asyncHandler(async (req, res) => {
    await ragService.query(req.body);
  });
}

module.exports = new AiController();
