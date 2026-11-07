const pool = require('../config/db');

exports.getOrders = async (req, res) => {
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
};

exports.createOrder = async (req, res) => {
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
};

exports.updateStatus = async (req, res) => {
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
};

exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM work_orders WHERE id = $1', [id]);
    res.json({ message: 'Work order berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};