DROP DATABASE IF EXISTS customers;
CREATE DATABASE customers;
USE customers;

DROP TABLE IF EXISTS customer;
CREATE TABLE customers (
    customer_ID INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone_number VARCHAR(20)
);

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    order_ID INT AUTO_INCREMENT PRIMARY KEY,
    customer_ID INT,
    order_date DATE,
    total_amount DECIMAL(10, 2),
    FOREIGN KEY (customer_ID) REFERENCES customers(customer_ID)
);

DROP TABLE IF EXISTS order_files;
CREATE TABLE order_files (
    file_ID INT AUTO_INCREMENT PRIMARY KEY,
    order_ID INT,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(255) NOT NULL,
    FOREIGN KEY (order_ID) REFERENCES orders(order_ID)
);
