/*
 Service layer
 Contains business logic
*/
const AppError = require("../../utils/appError");
const logger = require("../../utils/logger");
const userRepository = require("./user.repository");
const { getCache,setCache,deleteCache } = require("../../utils/cache");

class UserService {

  async getUsers(filters) {
    const cacheKey = `users:${JSON.stringify(filters)}`;
    const cachedUsers = await getCache(cacheKey);
    if (cachedUsers) {
      return cachedUsers;
    }
    const users = await userRepository.getAllUsers(filters);
    const total = await userRepository.countUsers();
    if (!users) {
      throw new AppError("User not found", 404);
    }
    await setCache(cacheKey, {users, total}, 120);
    return {users, total};
  } 

  async getUsersByEmail(email) {
    const users = await userRepository.findByEmail(email);
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
    await deleteCache("users:*");
    return newUser;  
  }

}

module.exports = new UserService();