-- Create database
CREATE DATABASE IF NOT EXISTS lms_db;
USE lms_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'coordinator', 'student') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample users with plain text passwords
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@example.com', 'password123', 'admin'),
('coordinator', 'coordinator@example.com', 'password123', 'coordinator'),
('student', 'student@example.com', 'password123', 'student'); 