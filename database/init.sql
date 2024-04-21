-- Create permissions table
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    role_type VARCHAR(50) NOT NULL CHECK (role_type IN ('super_admin', 'school_admin', 'parent')),
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    role_id INTEGER REFERENCES roles(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMPTZ
);

-- Create role_permissions table for many-to-many relationship between roles and permissions
CREATE TABLE role_permissions (
    role_id INTEGER REFERENCES roles(id),
    permission_id INTEGER REFERENCES permissions(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (role_id, permission_id)
);

-- Create clients table
CREATE TABLE clients (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(255) UNIQUE NOT NULL,
    client_secret VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    redirect_uri VARCHAR(255) NOT NULL,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create auth_codes table
CREATE TABLE auth_codes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    client_id INTEGER REFERENCES clients(id),
    redirect_uri VARCHAR(255) NOT NULL,
    is_used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create access_tokens table
CREATE TABLE access_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    client_id INTEGER REFERENCES clients(id),
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create refresh_tokens table
CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    client_id INTEGER REFERENCES clients(id),
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create otp_codes table
CREATE TABLE otp_codes (
    id SERIAL PRIMARY KEY,
    otp_code VARCHAR(10) NOT NULL,
    user_id INTEGER REFERENCES users(id),
    expiration_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
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

-- Dummy data for permissions table
INSERT INTO permissions (name, description) VALUES
('view_dashboard', 'Permission to view the dashboard'),
('manage_users', 'Permission to manage users'),
('manage_roles', 'Permission to manage roles'),
('manage_clients', 'Permission to manage clients'),
('generate_reports', 'Permission to generate reports');

-- Dummy data for roles table
INSERT INTO roles (title, role_type, description) VALUES
('Super Admin', 'super_admin', 'Super admin role with all permissions'),
('School Admin', 'school_admin', 'School admin role with limited permissions'),
('Parent', 'parent', 'Parent role with view-only permissions');

-- Dummy data for users table
INSERT INTO users (name, phone, role_id, created_by, last_login) VALUES
('John Doe', '1234567890', 3, NULL, '2024-04-20 12:00:00'),
('Jane Smith', '0987654321', 3, 1, '2024-04-19 15:30:00'),
('Alice Brown', '1122334455', 3, 1, NULL),
('Bob White', '5544332211', 3, 2, '2024-04-20 10:45:00');

-- Dummy data for role_permissions table
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1),
(1, 2),
(1, 3),
(1, 4),
(1, 5),
(2, 1),
(2, 2),
(3, 1);

-- Dummy data for clients table
INSERT INTO clients (client_id, client_secret, name, description, redirect_uri, created_by) VALUES
('client123', 'secret123', 'Client App 1', 'First client application', 'https://example.com/callback', 1),
('client456', 'secret456', 'Client App 2', 'Second client application', 'https://example.com/callback', 2),
('client789', 'secret789', 'Client App 3', 'Third client application', 'https://example.com/callback', 1);

-- Dummy data for auth_codes table
INSERT INTO auth_codes (user_id, client_id, redirect_uri) VALUES
(1, 1, 'https://example.com/callback'),
(2, 2, 'https://example.com/callback'),
(3, 3, 'https://example.com/callback');

-- Dummy data for access_tokens table
INSERT INTO access_tokens (token, user_id, client_id, expires_at) VALUES
('token123', 1, 1, '2024-05-20 12:00:00'),
('token456', 2, 2, '2024-05-21 15:30:00'),
('token789', 3, 3, '2024-05-22 10:45:00');
