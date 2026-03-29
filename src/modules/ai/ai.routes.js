const express = require("express");
const aiController = require("./ai.controller");

const router = express.Router();

router.get("/health", aiController.getHealth);
router.post("/query", aiController.postQuery);

module.exports = router;
