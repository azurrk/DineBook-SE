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

  async getFloorPlan(req, res) {
    try {
      const { date, time, guests } = req.query;
      const tables = await tableService.getFloorPlan(date, time, guests);
      res.json(tables);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTables(req, res) {
    try {
      const tables = await tableService.getTables();
      res.json(tables);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async createTable(req, res) {
    try {
      const table = await tableService.createTable(req.body);
      res.status(201).json(table);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateTable(req, res) {
    try {
      const table = await tableService.updateTable(req.params.id, req.body);
      res.json(table);
    } catch (error) {
      res.status(error.message === 'Table not found' ? 404 : 400).json({ error: error.message });
    }
  }

  async deleteTable(req, res) {
    try {
      const result = await tableService.deleteTable(req.params.id);
      res.json(result);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

module.exports = new TableController();
