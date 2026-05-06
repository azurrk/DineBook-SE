const tableService = require('../services/tableService');

/**
 * @swagger
 * components:
 *   schemas:
 *     AvailableTablesQuery:
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
 */

class TableController {
  /**
   * @swagger
   * /api/tables/available:
   *   get:
   *     summary: Get available tables for a specific date and time
   *     tags: [Tables]
   *     parameters:
   *       - in: query
   *         name: date
   *         required: true
   *         schema:
   *           type: string
   *           format: date
   *         description: Reservation date (YYYY-MM-DD)
   *       - in: query
   *         name: time
   *         required: true
   *         schema:
   *           type: string
   *           format: time
   *         description: Reservation time (HH:MM)
   *       - in: query
   *         name: guests
   *         required: true
   *         schema:
   *           type: integer
   *         description: Number of guests
   *     responses:
   *       200:
   *         description: Available tables retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Table'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getAvailableTables(req, res) {
    try {
      const { date, time, guests } = req.query;
      const tables = await tableService.getAvailableTables(date, time, guests);
      res.json(tables);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new TableController();
