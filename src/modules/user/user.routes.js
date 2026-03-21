const express = require("express");
const router = express.Router();
const validate = require("../../middlewares/validate.middleware");
const { registerSchema } = require("../../validations/auth.validation");
const userController = require("./user.controller");
const { authenticate, authorize } = require("../../middlewares/auth.middleware");
/*
 GET /api/v1/users
*/

router.get("/", authenticate, userController.getUsers);
router.post(
    "/",
    authenticate,
    authorize(["admin","user","superadmin"]),
    validate(registerSchema),
    userController.createUser
  );
router.delete(
    "/:id",
    authenticate,
    authorize(["admin","superadmin"]),
    userController.deleteUser
  );
module.exports = router;