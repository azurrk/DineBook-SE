const reservationRepository = require('../repositories/reservationRepository');
const tableService = require('./tableService');

class ReservationService {
  async getUserReservations(userId) {
    return await reservationRepository.findByUserId(userId);
  }

  async createReservation(userId, tableId, date, time, guests, specialRequest) {
    const table = await tableService.getTableById(tableId);
    const reservation = await reservationRepository.create(userId, tableId, date, time, guests, specialRequest);
    
    reservation.table_number = table.number;
    reservation.table_location = table.location;
    
    return reservation;
  }

  async cancelReservation(reservationId, userId) {
    const reservation = await reservationRepository.findByIdAndUserId(reservationId, userId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    const reservationDateTime = new Date(`${reservation.date}T${reservation.time}`);
    const now = new Date();
    const diffHours = (reservationDateTime - now) / (1000 * 60 * 60);

    if (diffHours < 2) {
      throw new Error('Cannot cancel within 2 hours of reservation');
    }

    await reservationRepository.updateStatus(reservationId, 'cancelled');
    return { success: true };
  }

  async updateReservation(reservationId, userId, date, time, guests, specialRequest) {
    const reservation = await reservationRepository.update(reservationId, date, time, guests, specialRequest, userId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    const table = await tableService.getTableById(reservation.table_id);
    reservation.table_number = table.number;
    reservation.table_location = table.location;

    return reservation;
  }
}

module.exports = new ReservationService();
