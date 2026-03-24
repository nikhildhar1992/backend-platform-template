const express = require("express");
const router = express.Router();
const authRoutes = require("./auth.routes");
const { globalLimiter } = require("../middlewares/rateLimit.middleware");
const v1Routes = require("./v1.routes");
/*
 API Versioning
*/
router.use(globalLimiter);

router.use("/auth", authRoutes);
router.use("/v1", v1Routes);

module.exports = router;