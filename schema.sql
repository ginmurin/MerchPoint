-- MerchPoint Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS merchpointdb;
USE merchpointdb;

-- User table
CREATE TABLE IF NOT EXISTS user (
    user_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    address TEXT,
    student_staff_id VARCHAR(50),
    points_balance INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Category table
CREATE TABLE IF NOT EXISTS category (
    category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Product table
CREATE TABLE IF NOT EXISTS product (
    product_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    points_value INT NOT NULL,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_name (product_name),
    INDEX idx_available (is_available)
);

-- Product_Stock table
CREATE TABLE IF NOT EXISTS product_stock (
    stock_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    quantity_available INT NOT NULL DEFAULT 0,
    quantity_reserved INT NOT NULL DEFAULT 0,
    minimum_stock INT DEFAULT 10,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    UNIQUE KEY unique_product (product_id)
);

-- Product_Category (many-to-many relationship)
CREATE TABLE IF NOT EXISTS product_category (
    product_category_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    category_id BIGINT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_category (product_id, category_id)
);

-- Reservation table
CREATE TABLE IF NOT EXISTS reservation (
    reservation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    approved_by_admin_id BIGINT,
    status ENUM('PENDING', 'APPROVED', 'COLLECTED', 'CANCELLED') DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL,
    points_earned INT DEFAULT 0,
    reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_date TIMESTAMP NULL,
    collected_date TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (approved_by_admin_id) REFERENCES user(user_id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_reservation_date (reservation_date)
);

-- Reservation_Item table
CREATE TABLE IF NOT EXISTS reservation_item (
    reservation_item_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    reservation_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE,
    INDEX idx_reservation (reservation_id),
    INDEX idx_product (product_id)
);

-- Admin table (extended admin functionalities)
CREATE TABLE IF NOT EXISTS admin (
    admin_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    admin_level VARCHAR(50) DEFAULT 'STANDARD',
    permissions JSON,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- User_Profile table (extended user information)
CREATE TABLE IF NOT EXISTS user_profile (
    profile_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT UNIQUE NOT NULL,
    date_of_birth DATE,
    department VARCHAR(100),
    year_level VARCHAR(50),
    profile_picture_url TEXT,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE
);

-- Points_Transaction table
CREATE TABLE IF NOT EXISTS points_transaction (
    transaction_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    reservation_id BIGINT,
    transaction_type ENUM('EARNED', 'REDEEMED', 'ADJUSTED') NOT NULL,
    points_amount INT NOT NULL,
    description TEXT,
    transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id) ON DELETE SET NULL,
    INDEX idx_user_transaction (user_id),
    INDEX idx_transaction_date (transaction_date)
);

-- Insert default categories
INSERT INTO category (category_name, description) VALUES
('T-Shirts', 'School branded t-shirts and polo shirts'),
('Hoodies', 'Warm hoodies and jackets'),
('Caps', 'Baseball caps and beanies'),
('Mugs', 'Coffee mugs and tumblers'),
('Bags', 'Backpacks and tote bags'),
('Stationery', 'Notebooks, pens, and school supplies'),
('Accessories', 'Keychains, lanyards, and other accessories');

-- Insert default admin user (password: admin123)
-- Note: Password is hashed using BCrypt
INSERT INTO user (username, email, password, full_name, role, points_balance) VALUES
('admin', 'admin@merchpoint.com', '$2a$10$YzB5LX3jYF6vXBLxqH9c3.SqW.KH1VNxL8bBqYRm6p5rGqKl0WZBK', 'System Administrator', 'ADMIN', 0);

-- Insert sample products
INSERT INTO product (product_name, description, price, points_value, is_available) VALUES
('Classic School T-Shirt', 'High-quality cotton t-shirt with school logo', 350.00, 35, TRUE),
('Premium Hoodie Jacket', 'Warm and comfortable hoodie with embroidered logo', 750.00, 75, TRUE),
('School Baseball Cap', 'Adjustable baseball cap with school colors', 250.00, 25, TRUE),
('Coffee Mug', 'Ceramic mug with school emblem', 150.00, 15, TRUE),
('Canvas Backpack', 'Durable backpack with multiple compartments', 850.00, 85, TRUE),
('Notebook Set', 'Set of 3 notebooks with school branding', 200.00, 20, TRUE),
('School Lanyard', 'Branded lanyard with ID holder', 100.00, 10, TRUE),
('Water Bottle', 'Insulated water bottle with school logo', 300.00, 30, TRUE);

-- Link products to categories
INSERT INTO product_category (product_id, category_id) VALUES
(1, 1), -- T-Shirt -> T-Shirts
(2, 2), -- Hoodie -> Hoodies
(3, 3), -- Cap -> Caps
(4, 4), -- Mug -> Mugs
(5, 5), -- Backpack -> Bags
(6, 6), -- Notebook -> Stationery
(7, 7), -- Lanyard -> Accessories
(8, 7); -- Water Bottle -> Accessories

-- Initialize product stock
INSERT INTO product_stock (product_id, quantity_available, quantity_reserved, minimum_stock) VALUES
(1, 50, 0, 10),
(2, 30, 0, 5),
(3, 75, 0, 15),
(4, 100, 0, 20),
(5, 40, 0, 10),
(6, 80, 0, 15),
(7, 150, 0, 30),
(8, 60, 0, 15);

-- Insert admin record
INSERT INTO admin (user_id, admin_level) VALUES
(1, 'SUPER_ADMIN');
