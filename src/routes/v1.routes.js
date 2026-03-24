const express = require("express");
const userRoutes = require("../modules/user/user.routes");
const router = express.Router();
const healthRoutes = require("./health.routes.js");
/*
 API Versioning
*/

router.use("/users", userRoutes);
router.use("/health", healthRoutes);

module.exports = router;