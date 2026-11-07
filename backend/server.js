const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://user:password@db:5432/workorder_db'
});

// GET: Ambil daftar work orders (Filter & Search)
app.get('/api/orders', async (req, res) => {
  try {
    const { search, status } = req.query;
    let query = 'SELECT * FROM work_orders WHERE 1=1';
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      query += ` AND (title ILIKE $${params.length} OR customer_name ILIKE $${params.length})`;
    }
    if (status && status !== 'All') {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }

    query += ' ORDER BY id DESC';
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Tambah work order baru
app.post('/api/orders', async (req, res) => {
  try {
    const { title, category, customer_name, priority } = req.body;
    const result = await pool.query(
      'INSERT INTO work_orders (title, category, customer_name, priority, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, category, customer_name, priority || 'Medium', 'Pending']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Update status order
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

// DELETE: Hapus work order (dengan Verifikasi)
app.delete('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM work_orders WHERE id = $1', [id]);
    res.json({ message: 'Work order berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`ServiTask API active on port ${PORT}`));