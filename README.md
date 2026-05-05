# 🍽️ DineBook

> A web-based restaurant table reservation platform — browse tables, book in seconds, manage everything from an admin dashboard.

#### Preview Link: https://dine-book-se.vercel.app

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Roadmap](#project-roadmap)
- [Getting Started](#getting-started)
- [API Overview](#api-overview)
- [Project Paper](#project-paper)
- [Non-Functional Requirements](#non-functional-requirements)

---

## Project Overview

**DineBook** is a full-stack web application that allows customers to browse restaurant tables, make and manage reservations, and leave reviews. Restaurant staff can manage tables, configure working hours, and control bookings through a dedicated admin panel.

---

## Tech Stack

| Layer      | Technology                            |
| ---------- | ------------------------------------- |
| Frontend   | React.js                              |
| Backend    | Node.js / Express.js                  |
| Database   | PostgreSQL                            |
| API Style  | RESTful API                           |
| Deployment | Vercel (frontend) + Railway (backend) |

---

## Features

### Customer

- Register and log in to a personal account
- Browse available tables by date, time, and group size
- Make, modify, and cancel reservations
- View upcoming reservations and booking history
- Receive email confirmations for bookings and cancellations
- Leave star ratings and reviews after a visit
- View a visual floor plan with colour-coded table availability
- Add special requests to a reservation
- View restaurant working hours

### Admin

- Dashboard showing today's reservations grouped by time slot
- Confirm or reject pending reservation requests
- Manage tables (add, edit, delete)
- Set working hours per day and mark specific days as closed
- Search reservations by customer name or email
- Deactivate user accounts

---

## Project Roadmap

The project is developed using **Agile / Scrum** across two major releases and six sprints.

### v1.0 – Core Booking _(Target: 3rd May 2026)_

User auth, table browsing, make/cancel/modify reservation, email confirmation, responsive UI.

### v2.0 – Full Platform _(Target: 7th June 2026)_

Admin panel, reviews, special requests, floor plan, working hours management, tests, deployment.

| Sprint | Goal                  | Deliverables                                                            | Duration        |
| ------ | --------------------- | ----------------------------------------------------------------------- | --------------- |
| 1      | Backend foundation    | DB schema, User auth API, Table CRUD API, Reservation API               | Mar 9 – Mar 22  |
| 2      | Frontend – Customer   | React setup, auth pages, reservation flow, email integration            | Mar 23 – Apr 5  |
| 3      | Integration & release | Frontend-backend integration, responsive UI, GitHub release v1.0        | Apr 6 – May 3   |
| 4      | Admin panel           | Admin dashboard, table management, working hours, reservation approval  | May 4 – May 17  |
| 5      | Extra features        | Floor plan, reviews, special requests                                   | May 18 – May 31 |
| 6      | Tests & deployment    | 5+ unit tests, deployment (Vercel + Railway), docs, GitHub release v2.0 | Jun 1 – Jun 7   |

---

## Getting Started

### Prerequisites

- Node.js v18+
- PostgreSQL 15+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/dinebook.git
cd dinebook

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/dinebook
JWT_SECRET=your_jwt_secret
EMAIL_SERVICE_API_KEY=your_email_api_key
PORT=5000
```

### Running Locally

```bash
# Start the backend
cd backend
npm run dev

# Start the frontend (in a separate terminal)
cd frontend
npm start
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:5000`.

---

## API Overview

The backend exposes a RESTful API. Key resource groups:

| Resource      | Endpoints                                                    |
| ------------- | ------------------------------------------------------------ |
| Auth          | `POST /auth/register`, `POST /auth/login`                    |
| Tables        | `GET/POST /tables`, `PUT/DELETE /tables/:id`                 |
| Reservations  | `GET/POST /reservations`, `PUT/DELETE /reservations/:id`     |
| Reviews       | `POST /reviews`, `GET /reviews`                              |
| Admin         | `GET /admin/dashboard`, `PUT /admin/reservations/:id/status` |
| Working Hours | `GET/PUT /admin/working-hours`                               |

---

## Project Paper

[Google Drive Link](https://docs.google.com/document/d/1JvRY-kUyP7mjswDI1pAo0D70kBvbaQZsiaj2s1uV-SI/edit?tab=t.0)

## Non-Functional Requirements

| ID    | Requirement                 | Acceptance Criteria                                             |
| ----- | --------------------------- | --------------------------------------------------------------- |
| NF-01 | Performance                 | Server responds within 2 seconds under 50 concurrent users      |
| NF-02 | Responsiveness              | UI works correctly on mobile, tablet, and desktop screen sizes  |
| NF-03 | Security (password hashing) | Passwords are hashed with bcrypt and never stored in plain text |

---
