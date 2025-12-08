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
    profile_image TEXT,
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
    points_value INT NOT NULL COMMENT 'Points earned when purchasing (20% of price)',
    stock_quantity INT NOT NULL DEFAULT 0,
    image_url TEXT,
    is_available BOOLEAN DEFAULT TRUE COMMENT 'Whether product is available for purchase',
    category_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES category(category_id) ON DELETE SET NULL,
    INDEX idx_product_name (product_name),
    INDEX idx_available (is_available),
    INDEX idx_category (category_id)
);



-- Reservation table
CREATE TABLE IF NOT EXISTS reservation (
    reservation_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    total_amount DECIMAL(10, 2) NOT NULL,
    points_used INT DEFAULT 0,
    points_earned INT DEFAULT 0,
    archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status),
    INDEX idx_code (code),
    INDEX idx_archived (archived)
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
    code VARCHAR(50) UNIQUE NOT NULL,
    user_id BIGINT NOT NULL,
    reservation_id BIGINT,
    type ENUM('EARNED', 'REDEEMED', 'REFUND') NOT NULL,
    points INT NOT NULL,
    balance_after INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservation(reservation_id) ON DELETE SET NULL,
    INDEX idx_user_transaction (user_id),
    INDEX idx_code (code),
    INDEX idx_created_at (created_at)
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
INSERT INTO product (product_name, description, price, points_value, stock_quantity, is_available, category_id) VALUES
('Classic School T-Shirt', 'High-quality cotton t-shirt with school logo', 350.00, 70, 10, TRUE, 1),
('Premium Hoodie Jacket', 'Warm and comfortable hoodie with embroidered logo', 750.00, 150, 10, TRUE, 2),
('School Baseball Cap', 'Adjustable baseball cap with school colors', 250.00, 50, 0, TRUE, 3),
('Coffee Mug', 'Ceramic mug with school emblem', 150.00, 30, 0, TRUE, 4),
('Canvas Backpack', 'Durable backpack with multiple compartments', 850.00, 170, 0, TRUE, 5),
('Notebook Set', 'Set of 3 notebooks with school branding', 200.00, 40, 0, TRUE, 6),
('School Lanyard', 'Branded lanyard with ID holder', 100.00, 20, 0, TRUE, 7),
('Water Bottle', 'Insulated water bottle with school logo', 300.00, 60, 0, TRUE, 3);

-- Insert admin record
INSERT INTO admin (user_id, admin_level) VALUES
(1, 'SUPER_ADMIN');
