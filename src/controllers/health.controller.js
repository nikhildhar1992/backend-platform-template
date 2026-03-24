const pool = require("../config/db");
const redisConfig = require("../config/redis");

const basicHealth = (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server is running"
  });
};

const fullHealth = async (req, res) => {
  let dbStatus = "DOWN";
  let redisStatus = "DOWN";

  try {
    await pool.query("SELECT 1");
    dbStatus = "UP";
  } catch {
    /* ignore */
  }

  try {
    const client = redisConfig.client;
    if (client && (client.isReady || client.isOpen)) {
      redisStatus = "UP";
    } else if (redisConfig.isCacheRedisReady && redisConfig.isCacheRedisReady()) {
      redisStatus = "UP";
    }
  } catch {
    /* ignore */
  }

  res.status(200).json({
    status: "OK",
    services: {
      database: dbStatus,
      redis: redisStatus
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = {
  basicHealth,
  fullHealth
};
