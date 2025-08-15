-- CoffeeFlow Database Schema
-- This will be automatically created by Spring Boot JPA
-- But you can run this manually if needed

USE coffee_flow_db;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(120) NOT NULL,
    role ENUM('TECHNICIAN', 'ADMIN') NOT NULL,
    office_name VARCHAR(100) NULL, -- Office for technicians, NULL for admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Coffee machines table
CREATE TABLE IF NOT EXISTS coffee_machine (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    machine_id VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    office VARCHAR(100) NOT NULL,
    floor VARCHAR(50) NOT NULL,
    status ENUM('OPERATIONAL', 'MAINTENANCE', 'OFFLINE') NOT NULL DEFAULT 'OPERATIONAL',
    
    -- Supply levels (0-100)
    water_level INT DEFAULT 100,
    milk_level INT DEFAULT 100,
    coffee_beans_level INT DEFAULT 100,
    sugar_level INT DEFAULT 100,
    
    -- Maintenance status
    filter_status ENUM('GOOD', 'NEEDS_REPLACEMENT', 'CRITICAL') DEFAULT 'GOOD',
    cleaning_status ENUM('CLEAN', 'NEEDS_CLEANING', 'OVERDUE') DEFAULT 'CLEAN',
    
    -- Performance metrics
    temperature DOUBLE DEFAULT 85.0,
    pressure DOUBLE DEFAULT 9.0,
    daily_cups INT DEFAULT 0,
    weekly_cups INT DEFAULT 0,
    monthly_revenue DECIMAL(10,2) DEFAULT 0.00,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample admin user (password: "password" encoded with BCrypt)
INSERT INTO users (username, name, password, role, office_name) VALUES 
('admin1', 'System Administrator', '$2a$10$8.UnVuG9HHgffUDAlk8qfOuVGkqRzgVymGe07xd00DMxs.AQubh4a', 'ADMIN', NULL);

-- Insert sample coffee machines
INSERT INTO coffee_machine (machine_id, name, location, office, floor, water_level, milk_level, coffee_beans_level, sugar_level) VALUES 
('CM-001', 'Coffee Maker Alpha', 'New York', 'Main Office', '2nd Floor', 85, 75, 90, 80),
('CM-002', 'Coffee Maker Beta', 'New York', 'Main Office', '1st Floor', 60, 85, 70, 95),
('CM-003', 'Coffee Maker Gamma', 'Los Angeles', 'West Branch', 'Ground Floor', 95, 60, 85, 75),
('CM-004', 'Coffee Maker Delta', 'Chicago', 'Downtown Office', '3rd Floor', 40, 90, 55, 85);

-- Check if tables were created
SHOW TABLES;
DESCRIBE users;
DESCRIBE coffee_machine;
