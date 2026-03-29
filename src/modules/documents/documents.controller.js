const asyncHandler = require("../../utils/asyncHandler");
const documentsService = require("./documents.service");

class DocumentsController {
  getHealth = asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      message: "Documents module status",
      data: { status: "ok", module: "documents" },
      meta: null
    });
  });

  postUpload = asyncHandler(async (req) => {
    await documentsService.ingestUpload(req);
  });
}

module.exports = new DocumentsController();
