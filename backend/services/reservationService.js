const reservationRepository = require('../repositories/reservationRepository');
const tableService = require('./tableService');
const workingHoursService = require('./workingHoursService');
const notificationService = require('./notificationService');
const { CustomerStatusStrategy, AdminStatusStrategy } = require('../patterns/reservationStatusStrategies');

class ReservationService {
  async getUserReservations(userId) {
    return await reservationRepository.findByUserId(userId);
  }

  async createReservation(userId, tableId, date, time, guests, specialRequest) {
    const table = await tableService.getTableById(tableId);
    if (Number(guests) > table.capacity) {
      throw new Error('Selected table does not fit this party size');
    }

    const isOpen = await workingHoursService.isReservationTimeAllowed(date, time);
    if (!isOpen) {
      throw new Error('Restaurant is closed at the selected time');
    }

    const conflict = await reservationRepository.findConflict(tableId, date, time);
    if (conflict) {
      throw new Error('Table is already reserved for that date and time');
    }

    const reservation = await reservationRepository.create(userId, tableId, date, time, guests, specialRequest);
    
    reservation.table_number = table.number;
    reservation.table_location = table.location;
    reservation.table_capacity = table.capacity;
    await notificationService.publish('reservation.created', {
      user: { id: userId },
      reservation,
    });
    
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

    const strategy = new CustomerStatusStrategy();
    if (!strategy.canTransition(reservation.status, 'cancelled')) {
      throw new Error(strategy.errorMessage());
    }

    const updated = await reservationRepository.updateStatus(reservationId, 'cancelled');
    await notificationService.publish('reservation.cancelled', {
      user: { id: userId },
      reservation: updated,
    });
    return { success: true };
  }

  async updateReservation(reservationId, userId, date, time, guests, specialRequest) {
    const existing = await reservationRepository.findByIdAndUserId(reservationId, userId);
    if (!existing) {
      throw new Error('Reservation not found');
    }

    const table = await tableService.getTableById(existing.table_id);
    if (Number(guests) > table.capacity) {
      throw new Error('Selected table does not fit this party size');
    }

    const isOpen = await workingHoursService.isReservationTimeAllowed(date, time);
    if (!isOpen) {
      throw new Error('Restaurant is closed at the selected time');
    }

    const conflict = await reservationRepository.findConflict(existing.table_id, date, time, reservationId);
    if (conflict) {
      throw new Error('Table is already reserved for that date and time');
    }

    const reservation = await reservationRepository.update(reservationId, date, time, guests, specialRequest, userId);
    reservation.table_number = table.number;
    reservation.table_location = table.location;
    reservation.table_capacity = table.capacity;

    return reservation;
  }

  async getAllReservations(search) {
    return await reservationRepository.findAll({ search });
  }

  async getAdminDashboard(date) {
    const reservations = await reservationRepository.todaysReservations(date);
    const groupedByTime = reservations.reduce((groups, reservation) => {
      groups[reservation.time] = groups[reservation.time] || [];
      groups[reservation.time].push(reservation);
      return groups;
    }, {});

    return {
      date,
      totals: {
        pending: reservations.filter((r) => r.status === 'pending').length,
        confirmed: reservations.filter((r) => r.status === 'confirmed').length,
      },
      groupedByTime,
    };
  }

  async updateReservationStatus(reservationId, nextStatus) {
    const reservation = await reservationRepository.findById(reservationId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    const strategy = new AdminStatusStrategy();
    if (!strategy.canTransition(reservation.status, nextStatus)) {
      throw new Error(strategy.errorMessage());
    }

    const updated = await reservationRepository.updateAdminStatus(reservationId, nextStatus);
    await notificationService.publish('reservation.statusChanged', {
      user: { name: reservation.user_name, email: reservation.user_email },
      reservation: updated,
    });
    return updated;
  }
}

module.exports = new ReservationService();
