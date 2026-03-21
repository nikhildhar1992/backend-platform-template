const { Queue } = require("bullmq");
const { URL } = require("url");

function getRedisConnection() {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  const parsed = new URL(redisUrl);

  // BullMQ passes these to ioredis under the hood.
  return {
    host: parsed.hostname,
    port: parsed.port ? parseInt(parsed.port, 10) : 6379,
    password: parsed.password ? parsed.password : undefined
  };
}

const emailQueue = new Queue("emailQueue", {
  connection: getRedisConnection()
});

module.exports = emailQueue;