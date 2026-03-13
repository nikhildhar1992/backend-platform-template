const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validate.middleware");
const { createUserSchema } = require("./validators/user.validator");
const userController = require("./user.controller");

/*
 GET /api/v1/users
*/

router.get("/", userController.getUsers);
router.post(
    "/",
    validate(createUserSchema),
    userController.createUser
  );
  
module.exports = router;