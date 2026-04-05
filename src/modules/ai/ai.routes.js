const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const { ragQuerySchema, ragIngestSchema } = require("../../validations/ai.validation");
const aiController = require("./ai.controller");

const router = express.Router();

router.get("/health", aiController.getHealth);
router.post("/query", validate(ragQuerySchema), aiController.postQuery);
router.post("/ingest", validate(ragIngestSchema), aiController.postIngest);

module.exports = router;
