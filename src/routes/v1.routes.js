const express = require("express");
const userRoutes = require("../modules/user/user.routes");
const aiRoutes = require("../modules/ai/ai.routes");
const documentsRoutes = require("../modules/documents/documents.routes");
const router = express.Router();
const healthRoutes = require("./health.routes.js");
/*
 API Versioning
*/

router.use("/users", userRoutes);
router.use("/health", healthRoutes);
router.use("/ai", aiRoutes);
router.use("/documents", documentsRoutes);

module.exports = router;