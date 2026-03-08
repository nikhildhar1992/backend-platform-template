/*
 Controller layer
 Handles HTTP request and response
*/

const userService = require("./user.service");

class UserController {

  async getUsers(req, res) {

    const users = await userService.getUsers();

    res.json({
      success: true,
      data: users
    });

  }

}

module.exports = new UserController();