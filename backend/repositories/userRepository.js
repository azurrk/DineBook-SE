const pool = require('../db');

class UserRepository {
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT id, name, email, password, phone, role, active FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  async create(name, email, hashedPassword) {
    const result = await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, phone, role, active, created_at',
      [name, email, hashedPassword]
    );
    return result.rows[0];
  }

  async update(userId, name, email, phone) {
    const result = await pool.query(
      'UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING id, name, email, phone, role, active, created_at',
      [name, email, phone, userId]
    );
    return result.rows[0];
  }

  async findById(id) {
    const result = await pool.query(
      'SELECT id, name, email, phone, role, active FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async findAllCustomers() {
    const result = await pool.query(
      'SELECT id, name, email, phone, active, created_at FROM users WHERE role = $1 ORDER BY created_at DESC',
      ['customer']
    );
    return result.rows;
  }

  async setActive(userId, active) {
    const result = await pool.query(
      'UPDATE users SET active = $1 WHERE id = $2 AND role = $3 RETURNING id, name, email, phone, role, active, created_at',
      [active, userId, 'customer']
    );
    return result.rows[0];
  }
}

module.exports = new UserRepository();
