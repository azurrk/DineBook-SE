const reviewRepository = require('../repositories/reviewRepository');
const reservationRepository = require('../repositories/reservationRepository');

class ReviewService {
  async getReviews() {
    return await reviewRepository.findAll();
  }

  async createReview(userId, reservationId, rating, comment) {
    const reservation = await reservationRepository.findByIdAndUserId(reservationId, userId);
    if (!reservation) {
      throw new Error('Reservation not found');
    }

    const reservationDate = new Date(`${reservation.date}T${reservation.time}`);
    if (reservation.status !== 'completed' && reservationDate > new Date()) {
      throw new Error('Reviews can only be left after a visit');
    }

    if (!Number.isInteger(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      throw new Error('Rating must be between 1 and 5');
    }

    return await reviewRepository.create(userId, reservationId, Number(rating), comment || '');
  }
}

module.exports = new ReviewService();
