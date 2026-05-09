const express = require('express');
const cors = require('cors');
const { db, initDB } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

initDB();

app.get('/api/delivery/:id/orders', (req, res) => {
  const partnerId = req.params.id;
  const { status } = req.query; // 'completed_today', 'pending', 'total', 'future'

  let query = 'SELECT * FROM delivery_orders WHERE partner_id = ?';
  let params = [partnerId];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  try {
    const orders = db.prepare(query).all(params);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/delivery/:id/earnings', (req, res) => {
  const partnerId = req.params.id;
  try {
    const earnings = db.prepare('SELECT * FROM delivery_earnings WHERE partner_id = ?').all([partnerId]);
    res.json(earnings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
