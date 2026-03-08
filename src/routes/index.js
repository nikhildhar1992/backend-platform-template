const express = require("express");
const v1Routes = require("./v1.routes");
const router = express.Router();

/*
 API Versioning
*/

router.use("/v1", v1Routes);

module.exports = router;