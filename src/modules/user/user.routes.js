const express = require("express");
const router = express.Router();

const userController = require("./user.controller");

/*
 GET /api/v1/users
*/

router.get("/", userController.getUsers);

module.exports = router;