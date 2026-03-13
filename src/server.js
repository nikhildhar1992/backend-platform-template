require("dotenv").config();

const logger = require("./utils/logger");
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