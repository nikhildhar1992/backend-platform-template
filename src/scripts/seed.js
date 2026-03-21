import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

async function seedDatabase() {

  try {

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3307,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "Nikhil@123",
      database: process.env.DB_NAME || "backend_template"
    });

    console.log("Connected to DB");

    // Clear existing users (optional)
    await connection.query("DELETE FROM users");

    const hashedPassword = await bcrypt.hash("123456", 10);

    const users = [];

    for (let i = 1; i <= 10; i++) {
      users.push([
        `User${i}`,
        `user${i}@test.com`,
        hashedPassword,
        i === 1 ? "admin" : "user"
      ]);
    }

    await connection.query(
      "INSERT INTO users (name, email, password, role) VALUES ?",
      [users]
    );

    console.log("Seeding completed");

    await connection.end();

  } catch (error) {
    console.error("Seeding error:", error.message);
  }
}

seedDatabase();