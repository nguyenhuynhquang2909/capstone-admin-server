-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ
);

-- Create user_sessions table
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    access_token VARCHAR(255) NOT NULL,
    refresh_token VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    access_token_expiration_time TIMESTAMPTZ NOT NULL,
    refresh_token_expiration_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Dummy data for users table
INSERT INTO users (name, phone, last_login) VALUES
('John Doe', '1234567890', '2024-04-20 12:00:00'),
('Jane Smith', '0987654321', '2024-04-19 15:30:00'),
('Alice Brown', '1122334455', NULL),
('Bob White', '5544332211', '2024-04-20 10:45:00');

-- Dummy data for user_sessions table
-- INSERT INTO user_sessions (access_token, refresh_token, user_id, access_token_expiration_time, refresh_token_expiration_time) VALUES
-- ('token123', 'refresh123', 1, '2024-05-20 12:00:00', '2024-05-21 12:00:00'),
-- ('token456', 'refresh456', 2, '2024-05-21 15:30:00', '2024-05-22 15:30:00'),
-- ('token789', 'refresh789', 4, '2024-05-22 10:45:00', '2024-05-23 10:45:00');
