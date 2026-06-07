const pool = require('../db');

class WorkingHoursRepository {
  async getAll() {
    const result = await pool.query(
      'SELECT day, open_time as open, close_time as close, closed FROM working_hours ORDER BY CASE day WHEN \'Monday\' THEN 1 WHEN \'Tuesday\' THEN 2 WHEN \'Wednesday\' THEN 3 WHEN \'Thursday\' THEN 4 WHEN \'Friday\' THEN 5 WHEN \'Saturday\' THEN 6 WHEN \'Sunday\' THEN 7 END'
    );

    const workingHours = {};
    result.rows.forEach(row => {
      workingHours[row.day] = {
        open: row.open,
        close: row.close,
        closed: row.closed
      };
    });

    return workingHours;
  }

  async findByDay(day) {
    const result = await pool.query(
      'SELECT day, open_time as open, close_time as close, closed FROM working_hours WHERE day = $1',
      [day]
    );
    return result.rows[0];
  }

  async updateDay(day, { open, close, closed }) {
    const result = await pool.query(
      `INSERT INTO working_hours (day, open_time, close_time, closed)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (day) DO UPDATE SET open_time = EXCLUDED.open_time, close_time = EXCLUDED.close_time, closed = EXCLUDED.closed
       RETURNING day, open_time as open, close_time as close, closed`,
      [day, open, close, closed]
    );
    return result.rows[0];
  }
}

module.exports = new WorkingHoursRepository();
