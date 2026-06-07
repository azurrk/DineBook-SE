const workingHoursRepository = require('../repositories/workingHoursRepository');

class WorkingHoursService {
  async getWorkingHours() {
    return await workingHoursRepository.getAll();
  }

  async getDayHours(date) {
    const day = new Date(`${date}T00:00:00`).toLocaleString('en-US', { weekday: 'long' });
    return await workingHoursRepository.findByDay(day);
  }

  timeToMinutes(value) {
    const [hours, minutes] = String(value).slice(0, 5).split(':').map(Number);
    return hours * 60 + minutes;
  }

  async isReservationTimeAllowed(date, time) {
    const hours = await this.getDayHours(date);
    if (!hours || hours.closed) return false;

    const reservationMin = this.timeToMinutes(time);
    const openMin = this.timeToMinutes(hours.open);
    let closeMin = this.timeToMinutes(hours.close);

    // 00:00 close with a later open means "open until midnight"
    if (closeMin === 0 && openMin > 0) closeMin = 24 * 60;

    if (closeMin > openMin) {
      return reservationMin >= openMin && reservationMin < closeMin;
    }

    // Overnight hours (e.g. 18:00 – 02:00)
    return reservationMin >= openMin || reservationMin < closeMin;
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
