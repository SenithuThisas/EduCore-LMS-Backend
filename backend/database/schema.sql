-- Use existing database
USE lms_db;

-- Modify existing users table to add new fields
ALTER TABLE users
ADD COLUMN IF NOT EXISTS first_name VARCHAR(50) AFTER email,
ADD COLUMN IF NOT EXISTS last_name VARCHAR(50) AFTER first_name,
ADD COLUMN IF NOT EXISTS batch_id INT AFTER role,
ADD COLUMN IF NOT EXISTS status ENUM('active', 'blocked', 'inactive') DEFAULT 'active' AFTER batch_id,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER created_at;

-- Create batches table
CREATE TABLE IF NOT EXISTS batches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    coordinator_id INT,
    start_date DATE,
    end_date DATE,
    status ENUM('active', 'completed', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (coordinator_id) REFERENCES users(id)
);

-- Add foreign key for batch_id in users table
ALTER TABLE users
ADD CONSTRAINT fk_user_batch
FOREIGN KEY (batch_id) REFERENCES batches(id);

-- Create courses table
CREATE TABLE IF NOT EXISTS courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    duration INT, -- in weeks
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create course-batch relationship table
CREATE TABLE IF NOT EXISTS course_batches (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    batch_id INT NOT NULL,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    FOREIGN KEY (batch_id) REFERENCES batches(id)
);

-- Create activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action_type VARCHAR(50) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id INT,
    details JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create system configuration table
CREATE TABLE IF NOT EXISTS system_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    config_key VARCHAR(50) UNIQUE NOT NULL,
    config_value JSON,
    description TEXT,
    updated_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (updated_by) REFERENCES users(id)
);

-- Create announcements table
CREATE TABLE IF NOT EXISTS announcements (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    target_batch_id INT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (target_batch_id) REFERENCES batches(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Insert default system configurations if they don't exist
INSERT IGNORE INTO system_config (config_key, config_value, description) VALUES
('password_policy', '{"min_length": 8, "require_special": true, "require_number": true}', 'Password policy settings'),
('notification_settings', '{"email_notifications": true, "system_notifications": true}', 'Global notification settings');

-- Update existing users to have default values for new columns
UPDATE users 
SET first_name = username,
    last_name = '',
    status = 'active'
WHERE first_name IS NULL; 