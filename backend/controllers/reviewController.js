const reviewService = require('../services/reviewService');

class ReviewController {
  async getReviews(req, res) {
    try {
      const reviews = await reviewService.getReviews();
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createReview(req, res) {
    try {
      const { reservationId, rating, comment } = req.body;
      const review = await reviewService.createReview(req.user.id, reservationId, rating, comment);
      res.status(201).json(review);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new ReviewController();
