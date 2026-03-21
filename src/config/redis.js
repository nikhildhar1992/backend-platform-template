const { createClient } = require("redis");

/**
 * Optional Redis client for **app cache** (user list, etc.).
 * BullMQ uses `REDIS_URL` in queue/worker files — not this module.
 *
 * ENABLE_REDIS_CACHE=true → connect and use for cache.
 * Otherwise Redis is only for BullMQ (queues).
 */
const cacheEnabled = process.env.ENABLE_REDIS_CACHE === "true";

let redisClient = null;

if (cacheEnabled) {
  redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
    socket: {
      reconnectStrategy: () => false
    }
  });

  redisClient.on("error", () => {});

  (async () => {
    try {
      await redisClient.connect();
      console.log("Redis connected (cache enabled)");
    } catch (err) {
      console.warn("Redis unavailable, cache disabled:", err.message);
    }
  })();
}

function isCacheRedisReady() {
  if (!cacheEnabled || !redisClient) return false;
  return Boolean(redisClient.isOpen ?? redisClient.isReady);
}

module.exports = {
  get client() {
    return redisClient;
  },
  isCacheRedisReady,
  isCacheEnabled: () => cacheEnabled
};
