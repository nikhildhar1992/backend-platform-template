require("dotenv").config();

const { Worker } = require("bullmq");
const { URL } = require("url");

function getRedisConnection() {
  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
  const parsed = new URL(redisUrl);
  return {
    host: parsed.hostname,
    port: parsed.port ? parseInt(parsed.port, 10) : 6379,
    password: parsed.password ? parsed.password : undefined
  };
}

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("Processing job:", job.data);

    // Uncomment to force a failed job and see worker.on("failed", ...)
    // throw new Error("Test: forced worker failure");

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log(`Email sent to ${job.data.email}`);
  },
  {
    connection: getRedisConnection()
  }
);

worker.on("failed", (job, err) => {
  console.error(`Job failed: ${job?.id}`, err?.message ?? err);
});

worker.on("completed", (job) => {
  console.log(`Job completed: ${job.id}`);
});

module.exports = worker;