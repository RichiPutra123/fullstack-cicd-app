CREATE TABLE IF NOT EXISTS work_orders (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  priority VARCHAR(20) DEFAULT 'Medium',
  status VARCHAR(50) DEFAULT 'Pending',
  image_url VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO work_orders (title, category, customer_name, priority, status, image_url) VALUES
('Perbaikan Server Utama & Firewall', 'IT & Network', 'Fajar', 'High', 'In Progress', NULL),
('Instalasi Access Point Lt. 2', 'IT & Network', 'Budi', 'Medium', 'Pending', NULL),
('Pemeliharaan Panel Listrik Utama', 'Kelistrikan', 'Siti', 'High', 'Completed', NULL),
('Pengantian Unit AC Ruang Server', 'Elektronik', 'Andi', 'Low', 'Pending', NULL);