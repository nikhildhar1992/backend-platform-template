require("dotenv").config();

const path = require("path");
const fs = require("fs");
const logger = require("./utils/logger");

// Dev-only: proves which files the process actually read (helps debug Docker bind mounts vs stale image).
if (process.env.NODE_ENV !== "production") {
  const rateLimitFile = path.join(__dirname, "middlewares", "rateLimit.middleware.js");
  try {
    const st = fs.statSync(rateLimitFile);
    logger.info("Boot: rateLimit.middleware.js", {
      mtime: st.mtime.toISOString(),
      size: st.size
    });
  } catch (err) {
    logger.error("Boot: rateLimit.middleware.js not found on disk", {
      path: rateLimitFile,
      message: err.message
    });
  }
}

const pool = require("./config/db");

const app = require("./app");

const PORT = process.env.PORT || 5000;

/*
  Start server
*/
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

async function testDB() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await pool.query("SELECT 1 AS ok");
    console.log("DB result:", rows);
    console.log("Database connected");
    connection.release();
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}
testDB();