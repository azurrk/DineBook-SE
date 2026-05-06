const reservationService = require('../services/reservationService');

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateReservationRequest:
 *       type: object
 *       required:
 *         - tableId
 *         - date
 *         - time
 *         - guests
 *       properties:
 *         tableId:
 *           type: integer
 *           description: Table ID
 *         date:
 *           type: string
 *           format: date
 *           description: Reservation date
 *         time:
 *           type: string
 *           format: time
 *           description: Reservation time
 *         guests:
 *           type: integer
 *           description: Number of guests
 *         specialRequest:
 *           type: string
 *           description: Special requests
 *     UpdateReservationRequest:
 *       type: object
 *       required:
 *         - date
 *         - time
 *         - guests
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           description: Reservation date
 *         time:
 *           type: string
 *           format: time
 *           description: Reservation time
 *         guests:
 *           type: integer
 *           description: Number of guests
 *         specialRequest:
 *           type: string
 *           description: Special requests
 */

class ReservationController {
  /**
   * @swagger
   * /api/reservations:
   *   get:
   *     summary: Get user reservations
   *     tags: [Reservations]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: User reservations retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Reservation'
   *       401:
   *         description: Unauthorized - Token required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getUserReservations(req, res) {
    try {
      const userId = req.user.id;
      const reservations = await reservationService.getUserReservations(userId);
      res.json(reservations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/reservations:
   *   post:
   *     summary: Create a new reservation
   *     tags: [Reservations]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateReservationRequest'
   *     responses:
   *       200:
   *         description: Reservation created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Reservation'
   *       401:
   *         description: Unauthorized - Token required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async createReservation(req, res) {
    try {
      const { tableId, date, time, guests, specialRequest } = req.body;
      const userId = req.user.id;
      const reservation = await reservationService.createReservation(userId, tableId, date, time, guests, specialRequest);
      res.json(reservation);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * @swagger
   * /api/reservations/{id}/cancel:
   *   put:
   *     summary: Cancel a reservation
   *     tags: [Reservations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Reservation ID
   *     responses:
   *       200:
   *         description: Reservation cancelled successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *       400:
   *         description: Bad request - Cannot cancel within 2 hours
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       401:
   *         description: Unauthorized - Token required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Reservation not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async cancelReservation(req, res) {
    try {
      const reservationId = req.params.id;
      const userId = req.user.id;
      const result = await reservationService.cancelReservation(reservationId, userId);
      res.json(result);
    } catch (error) {
      if (error.message === 'Reservation not found') {
        res.status(404).json({ error: error.message });
      } else {
        res.status(400).json({ error: error.message });
      }
    }
  }

  /**
   * @swagger
   * /api/reservations/{id}:
   *   put:
   *     summary: Update a reservation
   *     tags: [Reservations]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Reservation ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateReservationRequest'
   *     responses:
   *       200:
   *         description: Reservation updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Reservation'
   *       401:
   *         description: Unauthorized - Token required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   *       404:
   *         description: Reservation not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async updateReservation(req, res) {
    try {
      const reservationId = req.params.id;
      const { date, time, guests, specialRequest } = req.body;
      const userId = req.user.id;
      const reservation = await reservationService.updateReservation(reservationId, userId, date, time, guests, specialRequest);
      res.json(reservation);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new ReservationController();
