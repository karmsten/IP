-- Insert mock data into the customers table
INSERT INTO customers (company_name, contact_person, phone_number)
VALUES
    ('Company A', 'John Doe', '+1234567890'),
    ('Company B', 'Jane Smith', '+9876543210'),
    ('Company C', 'Alice Johnson', '+5555555555');

-- Insert mock data into the orders table
INSERT INTO orders (customer_ID, order_date, total_amount)
VALUES
    (1, '2023-09-19', 100.00),
    (2, '2023-09-20', 150.00),
    (3, '2023-09-21', 200.00);

-- Insert mock data into the order_files table
INSERT INTO order_files (order_ID, file_name, file_path)
VALUES
    (1, 'Invoice1.pdf', '/path/to/invoice1.pdf'),
    (1, 'Receipt1.jpg', '/path/to/receipt1.jpg'),
    (2, 'Invoice2.pdf', '/path/to/invoice2.pdf'),
    (3, 'Invoice3.pdf', '/path/to/invoice3.pdf');