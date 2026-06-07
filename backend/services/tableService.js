const tableRepository = require('../repositories/tableRepository');

class TableService {
  async getAvailableTables(date, time, guests) {
    return await tableRepository.getAvailableTables(date, time, guests);
  }

  async getFloorPlan(date, time, guests) {
    return await tableRepository.getFloorPlan(date, time, guests);
  }

  async getTables() {
    return await tableRepository.findAll();
  }

  async getTableById(tableId) {
    const table = await tableRepository.findById(tableId);
    if (!table) {
      throw new Error('Table not found');
    }
    return table;
  }

  async createTable(data) {
    this.validateTable(data);
    return await tableRepository.create(data);
  }

  async updateTable(id, data) {
    this.validateTable(data);
    const table = await tableRepository.update(id, data);
    if (!table) {
      throw new Error('Table not found');
    }
    return table;
  }

  async deleteTable(id) {
    const table = await tableRepository.delete(id);
    if (!table) {
      throw new Error('Table not found');
    }
    return { success: true };
  }

  validateTable({ number, capacity, location }) {
    if (!number || !location || Number(capacity) < 1) {
      throw new Error('Table number, location, and capacity are required');
    }
  }
}

module.exports = new TableService();
