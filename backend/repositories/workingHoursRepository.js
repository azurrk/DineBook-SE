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
}

module.exports = new WorkingHoursRepository();
