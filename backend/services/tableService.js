const tableRepository = require('../repositories/tableRepository');

class TableService {
  async getAvailableTables(date, time, guests) {
    return await tableRepository.getAvailableTables(date, time, guests);
  }

  async getTableById(tableId) {
    const table = await tableRepository.findById(tableId);
    if (!table) {
      throw new Error('Table not found');
    }
    return table;
  }
}

module.exports = new TableService();
