/*
 Controller layer
 Handles HTTP request and response
*/

const userService = require("./user.service");
const asyncHandler = require("../../utils/asyncHandler");
const { successResponse } = require("../../utils/apiResponse");
const logger = require("../../utils/logger");
class UserController {

  getUsers = asyncHandler(async (req, res, next) => {
    try {
      const { page = 1, limit = 10, search, role, sort } = req.query;
      const { users, total } = await userService.getUsers({page, limit, search, role, sort});
      logger.info({
        requestId: req.requestId,
        message: "Fetching users",
        route: req.originalUrl
      });
      successResponse(
        res,
        users,
        "Users fetched successfully",
        {
          page,
          limit,
          total
        }
      );
    } catch (error) {
      next(error);
    }
  });

  createUser = asyncHandler(async (req, res, next) => {
    try {
    const user = await userService.createUser(req.body);
    successResponse(
      res,
      user,
      user ? 'User created successfully' : 'User not created',
      null,
      201
    );
    } catch (error) {
      next(error);
    }
  });

  deleteUser = asyncHandler(async (req, res, next) => {
    try {
      await userService.deleteUser(req.params.id);
      logger.info({
        requestId: req.requestId,
        message: "User deleted successfully",
        route: req.originalUrl
      });
      successResponse(res, null, "User deleted successfully", null, 200);
    } catch (error) {
        next(error);
    }
  });

}

module.exports = new UserController();