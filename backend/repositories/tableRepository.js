const pool = require('../db');

class TableRepository {
  async getAvailableTables(date, time, guests) {
    const takenTables = await pool.query(
      'SELECT DISTINCT table_id FROM reservations WHERE date = $1 AND time = $2 AND status != $3',
      [date, time, 'cancelled']
    );

    const takenTableIds = takenTables.rows.map(row => row.table_id);

    const result = await pool.query(
      'SELECT id, number, capacity, location, status FROM tables WHERE id != ALL($1) AND capacity >= $2',
      [takenTableIds.length > 0 ? takenTableIds : [0], guests]
    );

    return result.rows;
  }

  async findById(tableId) {
    const result = await pool.query(
      'SELECT id, number, location FROM tables WHERE id = $1',
      [tableId]
    );
    return result.rows[0];
  }
}

module.exports = new TableRepository();
