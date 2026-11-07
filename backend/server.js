const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@db:5432/workorder_db'
});

// GET: Ambil semua work orders & statistik
app.get('/api/orders', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM work_orders ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Tambah work order baru
app.post('/api/orders', async (req, res) => {
  try {
    const { title, category, customer_name } = req.body;
    const result = await pool.query(
      'INSERT INTO work_orders (title, category, customer_name, status) VALUES ($1, $2, $3, $4) RETURNING *',
      [title, category, customer_name, 'Pending']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update status order (Pending -> In Progress -> Completed)
app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const result = await pool.query(
      'UPDATE work_orders SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ServiTask Backend running on port ${PORT}`));