const test = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');

process.env.JWT_SECRET = 'test-secret';

const authService = require('../services/authService');
const reservationService = require('../services/reservationService');
const reviewService = require('../services/reviewService');
const tableService = require('../services/tableService');
const userRepository = require('../repositories/userRepository');
const reservationRepository = require('../repositories/reservationRepository');
const reviewRepository = require('../repositories/reviewRepository');
const tableRepository = require('../repositories/tableRepository');
const workingHoursService = require('../services/workingHoursService');
const { AdminStatusStrategy, CustomerStatusStrategy } = require('../patterns/reservationStatusStrategies');

test('register hashes passwords and returns a customer token', async () => {
  userRepository.findByEmail = async () => null;
  userRepository.create = async (name, email, hashedPassword) => ({
    id: 10,
    name,
    email,
    password: hashedPassword,
    role: 'customer',
    active: true,
  });

  const result = await authService.register('Ada Lovelace', 'ada@example.com', 'secret123');

  assert.equal(result.user.role, 'customer');
  assert.ok(result.token);
  assert.notEqual(result.user.password, 'secret123');
  assert.equal(await bcrypt.compare('secret123', result.user.password), true);
});

test('inactive users cannot log in', async () => {
  userRepository.findByEmail = async () => ({
    id: 11,
    email: 'blocked@example.com',
    password: await bcrypt.hash('secret123', 4),
    active: false,
    role: 'customer',
  });

  await assert.rejects(
    () => authService.login('blocked@example.com', 'secret123'),
    /Account is deactivated/
  );
});

test('reservation creation rejects closed restaurant hours', async () => {
  tableService.getTableById = async () => ({ id: 1, number: 'T1', capacity: 4, location: 'Window' });
  workingHoursService.isReservationTimeAllowed = async () => false;

  await assert.rejects(
    () => reservationService.createReservation(1, 1, '2026-06-10', '23:30', 2, ''),
    /Restaurant is closed/
  );
});

test('reservation creation rejects an already reserved table', async () => {
  tableService.getTableById = async () => ({ id: 1, number: 'T1', capacity: 4, location: 'Window' });
  workingHoursService.isReservationTimeAllowed = async () => true;
  reservationRepository.findConflict = async () => ({ id: 99 });

  await assert.rejects(
    () => reservationService.createReservation(1, 1, '2026-06-10', '19:00', 2, ''),
    /already reserved/
  );
});

test('reservation status strategies enforce role-specific transitions', () => {
  const admin = new AdminStatusStrategy();
  const customer = new CustomerStatusStrategy();

  assert.equal(admin.canTransition('pending', 'confirmed'), true);
  assert.equal(admin.canTransition('confirmed', 'rejected'), false);
  assert.equal(customer.canTransition('confirmed', 'cancelled'), true);
  assert.equal(customer.canTransition('confirmed', 'completed'), false);
});

test('reviews are accepted only for completed or past reservations', async () => {
  reservationRepository.findByIdAndUserId = async () => ({
    id: 20,
    user_id: 1,
    status: 'completed',
    date: '2026-06-01',
    time: '19:00',
  });
  reviewRepository.create = async (userId, reservationId, rating, comment) => ({
    id: 5,
    user_id: userId,
    reservation_id: reservationId,
    rating,
    comment,
  });

  const review = await reviewService.createReview(1, 20, 5, 'Great service');

  assert.equal(review.rating, 5);
  assert.equal(review.comment, 'Great service');
});

test('table service returns available floor-plan data from the repository', async () => {
  tableRepository.getFloorPlan = async () => [
    { id: 1, number: 'T1', available: true },
    { id: 2, number: 'T2', available: false },
  ];

  const floorPlan = await tableService.getFloorPlan('2026-06-10', '19:00', 2);

  assert.equal(floorPlan.length, 2);
  assert.equal(floorPlan[0].available, true);
  assert.equal(floorPlan[1].available, false);
});
