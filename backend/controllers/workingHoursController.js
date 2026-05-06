const workingHoursService = require('../services/workingHoursService');

/**
 * @swagger
 * components:
 *   schemas:
 *     WorkingHoursResponse:
 *       type: object
 *       properties:
 *         Monday:
 *           $ref: '#/components/schemas/WorkingHours'
 *         Tuesday:
 *           $ref: '#/components/schemas/WorkingHours'
 *         Wednesday:
 *           $ref: '#/components/schemas/WorkingHours'
 *         Thursday:
 *           $ref: '#/components/schemas/WorkingHours'
 *         Friday:
 *           $ref: '#/components/schemas/WorkingHours'
 *         Saturday:
 *           $ref: '#/components/schemas/WorkingHours'
 *         Sunday:
 *           $ref: '#/components/schemas/WorkingHours'
 */

class WorkingHoursController {
  /**
   * @swagger
   * /api/working-hours:
   *   get:
   *     summary: Get restaurant working hours
   *     tags: [Working Hours]
   *     responses:
   *       200:
   *         description: Working hours retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/WorkingHoursResponse'
   *       500:
   *         description: Internal server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  async getWorkingHours(req, res) {
    try {
      const workingHours = await workingHoursService.getWorkingHours();
      res.json(workingHours);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new WorkingHoursController();
