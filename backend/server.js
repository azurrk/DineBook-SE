const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { specs, swaggerUi } = require('./config/swagger');
const authController = require('./controllers/authController');
const tableController = require('./controllers/tableController');
const reservationController = require('./controllers/reservationController');
const workingHoursController = require('./controllers/workingHoursController');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

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

app.get('/api/reservations', authenticateToken, reservationController.getUserReservations);
app.post('/api/reservations', authenticateToken, reservationController.createReservation);
app.put('/api/reservations/:id/cancel', authenticateToken, reservationController.cancelReservation);
app.put('/api/reservations/:id', authenticateToken, reservationController.updateReservation);

app.get('/api/working-hours', workingHoursController.getWorkingHours);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
});
