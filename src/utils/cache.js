const { client: redisClient, isCacheRedisReady } = require("../config/redis");

async function getCache(key) {
  if (!isCacheRedisReady()) return null;
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

async function setCache(key, value, ttl = 60) {
  if (!isCacheRedisReady()) return;
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: ttl
    });
  } catch {
    // ignore
  }
}

async function deleteCache(pattern) {
  if (!isCacheRedisReady()) return;
  try {
    const stream = redisClient.scanIterator({
      MATCH: pattern,
      COUNT: 100
    });

    for await (const keys of stream) {
      if (keys.length) {
        await redisClient.del(keys);
      }
    }
  } catch {
    // ignore
  }
}

module.exports = {
  getCache,
  setCache,
  deleteCache
};
