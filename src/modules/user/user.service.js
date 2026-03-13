/*
 Service layer
 Contains business logic
*/
const AppError = require("../../utils/appError");
const logger = require("../../utils/logger");

const userRepository = require("./user.repository");

class UserService {

  async getUsers() {

    const users = await userRepository.getAllUsers();
    if (!users) {
      throw new AppError("User not found", 404);
    }
  
    return users;

  } 

  async createUser(userData) {

    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    const newUser = await userRepository.createUser(userData);
  
    return newUser;
  
  }

}

module.exports = new UserService();