const express = require("express");
const userRoutes = require("../modules/user/user.routes");
const router = express.Router();

/*
 API Versioning
*/

router.use("/users", userRoutes);

module.exports = router;