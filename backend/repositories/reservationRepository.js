const pool = require('../db');

class ReservationRepository {
  async findByUserId(userId) {
    const result = await pool.query(`
      SELECT r.*, t.number as table_number, t.location as table_location, t.capacity as table_capacity,
             rv.id as review_id, rv.rating as review_rating, rv.comment as review_comment
      FROM reservations r 
      JOIN tables t ON r.table_id = t.id 
      LEFT JOIN reviews rv ON rv.reservation_id = r.id
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

  async findById(reservationId) {
    const result = await pool.query(
      `SELECT r.*, u.name as user_name, u.email as user_email, t.number as table_number, t.location as table_location
       FROM reservations r
       JOIN users u ON u.id = r.user_id
       JOIN tables t ON t.id = r.table_id
       WHERE r.id = $1`,
      [reservationId]
    );
    return result.rows[0];
  }

  async findConflict(tableId, date, time, excludeReservationId = null) {
    const params = [tableId, date, time];
    let excludeClause = '';
    if (excludeReservationId) {
      params.push(excludeReservationId);
      excludeClause = 'AND id != $4';
    }

    const result = await pool.query(
      `SELECT id FROM reservations
       WHERE table_id = $1 AND date = $2 AND time = $3
       AND status IN ('pending', 'confirmed') ${excludeClause}
       LIMIT 1`,
      params
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

  async updateAdminStatus(reservationId, status) {
    return await this.updateStatus(reservationId, status);
  }

  async findAll({ search = '' } = {}) {
    const result = await pool.query(
      `SELECT r.*, u.name as user_name, u.email as user_email, t.number as table_number, t.location as table_location
       FROM reservations r
       JOIN users u ON u.id = r.user_id
       JOIN tables t ON t.id = r.table_id
       WHERE ($1 = '' OR LOWER(u.name) LIKE LOWER($2) OR LOWER(u.email) LIKE LOWER($2))
       ORDER BY r.date DESC, r.time DESC`,
      [search, `%${search}%`]
    );
    return result.rows;
  }

  async todaysReservations(date) {
    const result = await pool.query(
      `SELECT r.*, u.name as user_name, u.email as user_email, t.number as table_number, t.location as table_location
       FROM reservations r
       JOIN users u ON u.id = r.user_id
       JOIN tables t ON t.id = r.table_id
       WHERE r.date = $1 AND r.status IN ('pending', 'confirmed')
       ORDER BY r.time, t.number`,
      [date]
    );
    return result.rows;
  }
}

module.exports = new ReservationRepository();
