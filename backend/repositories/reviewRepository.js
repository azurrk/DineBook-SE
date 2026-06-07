const pool = require('../db');

class ReviewRepository {
  async findAll() {
    const result = await pool.query(
      `SELECT rv.*, u.name as user_name, r.date as reservation_date
       FROM reviews rv
       JOIN users u ON u.id = rv.user_id
       JOIN reservations r ON r.id = rv.reservation_id
       ORDER BY rv.created_at DESC`
    );
    return result.rows;
  }

  async create(userId, reservationId, rating, comment) {
    const result = await pool.query(
      `INSERT INTO reviews (user_id, reservation_id, rating, comment)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, reservation_id, rating, comment, created_at`,
      [userId, reservationId, rating, comment]
    );
    return result.rows[0];
  }
}

module.exports = new ReviewRepository();
