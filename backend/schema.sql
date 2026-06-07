CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'customer',
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'customer';
ALTER TABLE users ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;

CREATE TABLE IF NOT EXISTS tables (
    id SERIAL PRIMARY KEY,
    number VARCHAR(10) UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    location VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'available',
    x INTEGER DEFAULT 0,
    y INTEGER DEFAULT 0
);

ALTER TABLE tables ADD COLUMN IF NOT EXISTS x INTEGER DEFAULT 0;
ALTER TABLE tables ADD COLUMN IF NOT EXISTS y INTEGER DEFAULT 0;

CREATE TABLE IF NOT EXISTS working_hours (
    day VARCHAR(20) PRIMARY KEY,
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    closed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    table_id INTEGER REFERENCES tables(id),
    date DATE NOT NULL,
    time TIME NOT NULL,
    guests INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    special_request TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    reservation_id INTEGER UNIQUE REFERENCES reservations(id),
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tables (id, number, capacity, location, status, x, y) VALUES
(1, 'T1', 2, 'Window', 'available', 12, 20),
(2, 'T2', 2, 'Window', 'available', 32, 20),
(3, 'T3', 4, 'Center', 'available', 18, 48),
(4, 'T4', 4, 'Center', 'available', 45, 48),
(5, 'T5', 4, 'Terrace', 'available', 72, 24),
(6, 'T6', 6, 'Private', 'available', 70, 58),
(7, 'T7', 6, 'Terrace', 'available', 84, 42),
(8, 'T8', 8, 'Private', 'available', 48, 76)
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (name, email, password, role, active)
VALUES ('DineBook Admin', 'admin@dinebook.test', '$2a$10$QF0kHPEYZ9m0rMZFRo0t3e5wBCkS9KY9Y1P4m9UZrj96E.2z0dbSa', 'admin', TRUE)
ON CONFLICT (email) DO NOTHING;

INSERT INTO working_hours (day, open_time, close_time, closed) VALUES
('Monday', '11:00', '22:00', FALSE),
('Tuesday', '11:00', '22:00', FALSE),
('Wednesday', '11:00', '22:00', FALSE),
('Thursday', '11:00', '23:00', FALSE),
('Friday', '11:00', '23:00', FALSE),
('Saturday', '10:00', '23:00', FALSE),
('Sunday', '10:00', '21:00', FALSE)
ON CONFLICT (day) DO NOTHING;
