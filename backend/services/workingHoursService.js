const workingHoursRepository = require('../repositories/workingHoursRepository');

class WorkingHoursService {
  async getWorkingHours() {
    return await workingHoursRepository.getAll();
  }
}

module.exports = new WorkingHoursService();
