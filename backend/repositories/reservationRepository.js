const pool = require('../db');

class ReservationRepository {
  async findByUserId(userId) {
    const result = await pool.query(`
      SELECT r.*, t.number as table_number, t.location as table_location 
      FROM reservations r 
      JOIN tables t ON r.table_id = t.id 
      WHERE r.user_id = $1 
      ORDER BY r.date DESC, r.time DESC
    `, [userId]);
    return result.rows;
  }

  async create(userId, tableId, date, time, guests, specialRequest) {
    const result = await pool.query(
      'INSERT INTO reservations (user_id, table_id, date, time, guests, special_request) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, tableId, date, time, guests, specialRequest]
    );
    return result.rows[0];
  }

  async findByIdAndUserId(reservationId, userId) {
    const result = await pool.query(
      'SELECT * FROM reservations WHERE id = $1 AND user_id = $2',
      [reservationId, userId]
    );
    return result.rows[0];
  }

  async updateStatus(reservationId, status) {
    const result = await pool.query(
      'UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *',
      [status, reservationId]
    );
    return result.rows[0];
  }

  async update(reservationId, date, time, guests, specialRequest, userId) {
    const result = await pool.query(
      'UPDATE reservations SET date = $1, time = $2, guests = $3, special_request = $4 WHERE id = $5 AND user_id = $6 RETURNING *',
      [date, time, guests, specialRequest, reservationId, userId]
    );
    return result.rows[0];
  }
}

module.exports = new ReservationRepository();
