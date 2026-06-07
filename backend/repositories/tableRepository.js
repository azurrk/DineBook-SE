const pool = require('../db');

class TableRepository {
  async getAvailableTables(date, time, guests) {
    const takenTables = await pool.query(
      "SELECT DISTINCT table_id FROM reservations WHERE date = $1 AND time = $2 AND status IN ('pending', 'confirmed')",
      [date, time]
    );

    const takenTableIds = takenTables.rows.map(row => row.table_id);

    const result = await pool.query(
      "SELECT id, number, capacity, location, status, x, y FROM tables WHERE id != ALL($1) AND capacity >= $2 AND status = 'available' ORDER BY capacity, number",
      [takenTableIds.length > 0 ? takenTableIds : [0], guests]
    );

    return result.rows;
  }

  async getFloorPlan(date, time, guests = 1) {
    const result = await pool.query(
      `SELECT t.id, t.number, t.capacity, t.location, t.status, t.x, t.y,
              CASE
                WHEN t.status != 'available' THEN FALSE
                WHEN t.capacity < $3 THEN FALSE
                WHEN EXISTS (
                  SELECT 1 FROM reservations r
                  WHERE r.table_id = t.id AND r.date = $1 AND r.time = $2
                  AND r.status IN ('pending', 'confirmed')
                ) THEN FALSE
                ELSE TRUE
              END as available
       FROM tables t
       ORDER BY t.id`,
      [date, time, guests]
    );
    return result.rows;
  }

  async findById(tableId) {
    const result = await pool.query(
      'SELECT id, number, capacity, location, status, x, y FROM tables WHERE id = $1',
      [tableId]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await pool.query(
      'SELECT id, number, capacity, location, status, x, y FROM tables ORDER BY id'
    );
    return result.rows;
  }

  async create({ number, capacity, location, status = 'available', x = 0, y = 0 }) {
    const result = await pool.query(
      'INSERT INTO tables (number, capacity, location, status, x, y) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, number, capacity, location, status, x, y',
      [number, capacity, location, status, x, y]
    );
    return result.rows[0];
  }

  async update(id, { number, capacity, location, status = 'available', x = 0, y = 0 }) {
    const result = await pool.query(
      'UPDATE tables SET number = $1, capacity = $2, location = $3, status = $4, x = $5, y = $6 WHERE id = $7 RETURNING id, number, capacity, location, status, x, y',
      [number, capacity, location, status, x, y, id]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query('DELETE FROM tables WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }
}

module.exports = new TableRepository();
