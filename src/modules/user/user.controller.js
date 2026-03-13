/*
 Controller layer
 Handles HTTP request and response
*/

const userService = require("./user.service");
const asyncHandler = require("../../utils/asyncHandler");
class UserController {

  getUsers = asyncHandler(async (req, res, next) => {
    try {
      const users = await userService.getUsers();
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      next(error);
    }
  });

  createUser = asyncHandler(async (req, res, next) => {
    try {
    const user = await userService.createUser(req.body);
  
    res.status(201).json({
      success: true,
      data: user
    });
    } catch (error) {
      next(error);
    }
  });

};

module.exports = new UserController();