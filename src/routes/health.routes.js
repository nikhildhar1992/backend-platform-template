const express = require("express");
const healthController = require("../controllers/health.controller");

const router = express.Router();

router.get("/", healthController.basicHealth);
router.get("/full", healthController.fullHealth);

module.exports = router;
