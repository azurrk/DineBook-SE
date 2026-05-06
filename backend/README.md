## Setup

1. Install dependencies:
```bash
npm install
```

3. Create .env like in .env.example

5. Start server:
```bash
npm start
```

## API Endpoints

### Auth
- POST /api/register
- POST /api/login
- PUT /api/profile

### Tables
- GET /api/tables/available?date=YYYY-MM-DD&time=HH:MM&guests=N

### Reservations
- GET /api/reservations
- POST /api/reservations
- PUT /api/reservations/:id/cancel
- PUT /api/reservations/:id

### Working Hours
- GET /api/working-hours
