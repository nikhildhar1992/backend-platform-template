/*
 Repository layer
 Responsible for database queries
*/

const pool = require("../../config/db");

class UserRepository {
  async findByEmail(email) {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    return rows[0];
  }

  async getAllUsers(filters) {
    const { page = 1, limit = 10, search, role, sort } = filters;
    // const offset = (page - 1) * limit;
    // const [rows] = await pool.query("SELECT * FROM users LIMIT ? OFFSET ?", [limit, offset]);
    // return rows;

    let query = "SELECT * FROM users";
    const values = [];

    // 🔍 Search (name/email)
    if (search) {
      query += " where (name LIKE ? OR email LIKE ?)";
      values.push(`%${search}%`, `%${search}%`);
    }

    // 🎯 Filter by role
    if (role) {
      query = search ? query + " AND role = ?" : query + " WHERE role = ?";
      values.push(role);
    }

    // 🔽 Sorting
    if (sort) {
      const [field, order] = sort.split(":");

      const allowedFields = ["name", "email", "created_at"];
      const allowedOrder = ["asc", "desc"];

      if (allowedFields.includes(field) && allowedOrder.includes(order)) {
        query += ` ORDER BY ${field} ${order.toUpperCase()}`;
      }
    } else {
      query += " ORDER BY created_at DESC";
    }

    // 📄 Pagination
    const offset = (page - 1) * limit;
    query += " LIMIT ? OFFSET ?";
    values.push(Number(limit), Number(offset));

    const [rows] = await pool.query(query, values);

    return rows;
  }

  async countUsers() {

    const [rows] = await pool.query(
      "SELECT COUNT(*) as total FROM users"
    );
  
    return rows[0].total;
  }

  async findById(id) {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE id = ?",
      [id]
    );
    return rows[0];
  }

  async createUser(user) {
    const { name, email, password } = user;

    const [result] = await pool.query(
      "INSERT INTO users (name,email,password) VALUES (?,?,?)",
      [name, email, password]
    );

    return result.insertId;
  }

  async deleteById(id) {
    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows;
  }
}
  
  module.exports = new UserRepository();