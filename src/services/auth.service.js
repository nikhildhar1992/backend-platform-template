const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userRepository = require("../modules/user/user.repository");
const logger = require("../utils/logger");
const emailQueue = require("../queues/email.queue.js");

async function registerUser(data) {
  const existingUser = await userRepository.findByEmail(data.email);
  if (existingUser) {
    logger.error({
      // requestId: req.requestId,
      message: "User already exists",
      // route: req.originalUrl
    });
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await userRepository.createUser({
    ...data,
    password: hashedPassword
  });
  await emailQueue.add("sendWelcomeEmail", {
    email: data.email,
    name: data.name
  },
  {
    attempts: 3, // retry 3 times
    backoff: {
      type: "exponential",
      delay: 2000 // 2 sec → 4 sec → 8 sec
    }
  });
  return user;
}

async function loginUser(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  return { user, token };
}

module.exports = {
  registerUser,
  loginUser
};
