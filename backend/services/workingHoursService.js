const workingHoursRepository = require('../repositories/workingHoursRepository');

class WorkingHoursService {
  async getWorkingHours() {
    return await workingHoursRepository.getAll();
  }

  async getDayHours(date) {
    const day = new Date(`${date}T00:00:00`).toLocaleString('en-US', { weekday: 'long' });
    return await workingHoursRepository.findByDay(day);
  }

  async isReservationTimeAllowed(date, time) {
    const hours = await this.getDayHours(date);
    if (!hours || hours.closed) return false;
    const reservationTime = time.slice(0, 5);
    return reservationTime >= hours.open.slice(0, 5) && reservationTime < hours.close.slice(0, 5);
  }

  async updateWorkingHours(hoursByDay) {
    const updated = {};
    for (const [day, values] of Object.entries(hoursByDay)) {
      updated[day] = await workingHoursRepository.updateDay(day, values);
    }
    return updated;
  }
}

module.exports = new WorkingHoursService();
