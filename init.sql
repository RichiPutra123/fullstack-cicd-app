CREATE TABLE IF NOT EXISTS work_orders (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  customer_name VARCHAR(150) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO work_orders (title, category, customer_name, status) VALUES
('Perbaikan AC Ruang Server', 'Elektronik', 'Fajar', 'In Progress'),
('Instalasi Jaringan LAN Utama', 'IT & Network', 'Budi', 'Pending'),
('Pemeliharaan Panel Listrik', 'Kelistrikan', 'Siti', 'Completed');