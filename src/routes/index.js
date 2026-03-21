const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const rateLimiterMiddleware = require("../middlewares/rateLimiter.js");
const v1Routes = require("./v1.routes");
/*
 API Versioning
*/
router.use("/auth", authRoutes);
router.use("/v1", rateLimiterMiddleware, v1Routes);

module.exports = router;