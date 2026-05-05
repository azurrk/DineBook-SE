CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS tables (
    id SERIAL PRIMARY KEY,
    number VARCHAR(10) UNIQUE NOT NULL,
    capacity INTEGER NOT NULL,
    location VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'available'
);

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
    status VARCHAR(20) DEFAULT 'confirmed',
    special_request TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tables (id, number, capacity, location, status) VALUES
(1, 'T1', 2, 'Window', 'available'),
(2, 'T2', 2, 'Window', 'available'),
(3, 'T3', 4, 'Center', 'available'),
(4, 'T4', 4, 'Center', 'available'),
(5, 'T5', 4, 'Terrace', 'available'),
(6, 'T6', 6, 'Private', 'available'),
(7, 'T7', 6, 'Terrace', 'available'),
(8, 'T8', 8, 'Private', 'available')
ON CONFLICT (id) DO NOTHING;

INSERT INTO working_hours (day, open_time, close_time, closed) VALUES
('Monday', '11:00', '22:00', FALSE),
('Tuesday', '11:00', '22:00', FALSE),
('Wednesday', '11:00', '22:00', FALSE),
('Thursday', '11:00', '23:00', FALSE),
('Friday', '11:00', '23:00', FALSE),
('Saturday', '10:00', '23:00', FALSE),
('Sunday', '10:00', '21:00', FALSE)
ON CONFLICT (day) DO NOTHING;
