const ai = require("./ai.config");

const config = {
  port: process.env.PORT || 5000,

  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME
  },

  redis: {
    url: process.env.REDIS_URL
  },

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES || "1d"
  },

  ai
};

module.exports = config;