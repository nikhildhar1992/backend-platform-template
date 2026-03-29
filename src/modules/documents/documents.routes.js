const express = require("express");
const documentsController = require("./documents.controller");

const router = express.Router();

router.get("/health", documentsController.getHealth);
router.post("/", documentsController.postUpload);

module.exports = router;
