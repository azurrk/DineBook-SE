const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { specs, swaggerUi } = require('./config/swagger');
const authController = require('./controllers/authController');
const tableController = require('./controllers/tableController');
const reservationController = require('./controllers/reservationController');
const workingHoursController = require('./controllers/workingHoursController');
const reviewController = require('./controllers/reviewController');
const { authenticateToken, requireAdmin } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.get('/', (req, res) => {
  res.send('<h1>DineBook API</h1><p><a href="/api-docs">API Documentation</a></p>');
});

app.post('/api/register', authController.register);
app.post('/api/login', authController.login);
app.put('/api/profile', authenticateToken, authController.updateProfile);

app.get('/api/tables/available', tableController.getAvailableTables);
app.get('/api/tables/floor-plan', tableController.getFloorPlan);
app.get('/api/tables', authenticateToken, requireAdmin, tableController.getTables);
app.post('/api/tables', authenticateToken, requireAdmin, tableController.createTable);
app.put('/api/tables/:id', authenticateToken, requireAdmin, tableController.updateTable);
app.delete('/api/tables/:id', authenticateToken, requireAdmin, tableController.deleteTable);

app.get('/api/reservations', authenticateToken, reservationController.getUserReservations);
app.post('/api/reservations', authenticateToken, reservationController.createReservation);
app.put('/api/reservations/:id/cancel', authenticateToken, reservationController.cancelReservation);
app.put('/api/reservations/:id', authenticateToken, reservationController.updateReservation);

app.get('/api/working-hours', workingHoursController.getWorkingHours);
app.put('/api/working-hours', authenticateToken, requireAdmin, workingHoursController.updateWorkingHours);

app.get('/api/reviews', reviewController.getReviews);
app.post('/api/reviews', authenticateToken, reviewController.createReview);

app.get('/api/admin/dashboard', authenticateToken, requireAdmin, reservationController.getAdminDashboard);
app.get('/api/admin/reservations', authenticateToken, requireAdmin, reservationController.getAllReservations);
app.put('/api/admin/reservations/:id/status', authenticateToken, requireAdmin, reservationController.updateReservationStatus);
app.get('/api/admin/users', authenticateToken, requireAdmin, authController.getCustomers);
app.put('/api/admin/users/:id/active', authenticateToken, requireAdmin, authController.setCustomerActive);

async function migrateDB() {
  try {
    const putanjaDoSqlFajla = path.join(__dirname, 'schema.sql');
    const sqlSkripta = fs.readFileSync(putanjaDoSqlFajla, 'utf8');
    
    await pool.query(sqlSkripta);
    console.log('DB Schema created');
  } catch (error) {
    console.error('Error DB Schema', error);
  }
}

if (require.main === module) {
  migrateDB.then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  });
  })
}

module.exports = app;
