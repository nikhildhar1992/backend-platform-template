/*
 Service layer
 Contains business logic
*/

const userRepository = require("./user.repository");

class UserService {

  async getUsers() {

    const users = await userRepository.getAllUsers();

    return users;

  }

}

module.exports = new UserService();