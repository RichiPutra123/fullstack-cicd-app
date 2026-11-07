CREATE TABLE IF NOT EXISTS work_orders (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  priority VARCHAR(20) DEFAULT 'Medium',
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO work_orders (title, category, customer_name, priority, status) VALUES
('Perbaikan Server Utama & Firewall', 'IT & Network', 'Fajar', 'High', 'In Progress'),
('Instalasi Access Point Lt. 2', 'IT & Network', 'Budi', 'Medium', 'Pending'),
('Pemeliharaan Panel Listrik Utama', 'Kelistrikan', 'Siti', 'High', 'Completed'),
('Pengantian Unit AC Ruang Server', 'Elektronik', 'Andi', 'Low', 'Pending');