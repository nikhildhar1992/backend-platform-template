const fs = require("fs");
const mysql = require("mysql2/promise");
require("dotenv").config();
const path = require("path");

async function setupDatabase() {

  try {
    
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT, 10) || 3306,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log("Connected to DB");

    const sql = fs.readFileSync(path.join(__dirname, "../sql/init.sql"), "utf-8");

    await connection.query(sql);

    console.log("Database setup completed");

    await connection.end();

  } catch (error) {
    console.error("DB Setup Error:", error.message);
  }
}

setupDatabase();