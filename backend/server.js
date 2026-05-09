const express = require('express');
const cors = require('cors');
const { db, initDB } = require('./db');
const { runAllScrapers, startScheduler } = require('./scheduler/cron');
const newsRoutes = require('./routes/news');
const mandiRoutes = require('./routes/mandi');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Database
initDB();

// API Routes (Local Delivery System)
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

// API Routes (Remote News/Mandi System)
app.use('/api/news', newsRoutes);
app.use('/api/mandi-prices', mandiRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MKisans Backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Force refresh endpoint (trigger scrapers manually)
app.post('/api/refresh', async (req, res) => {
  try {
    const results = await runAllScrapers();
    res.json({ success: true, message: 'All scrapers executed', results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(PORT, async () => {
  console.log(`
  ╔════════════════════════════════════════════╗
  ║   🌾 MKisans Backend Server               ║
  ║   Running on http://localhost:${PORT}         ║
  ║                                            ║
  ║   API Endpoints:                           ║
  ║   GET  /api/delivery/:id/orders — Delivery ║
  ║   GET  /api/news          — Scheme news    ║
  ║   GET  /api/mandi-prices  — Mandi prices   ║
  ║   GET  /api/health        — Health check   ║
  ║   POST /api/refresh       — Force scrape   ║
  ╚════════════════════════════════════════════╝
  `);

  // Run scrapers on startup
  console.log('[Startup] Running initial scraper cycle...');
  try {
    await runAllScrapers();
  } catch (err) {
    console.error('[Startup] Scraper failed:', err.message);
  }

  // Start cron scheduler
  startScheduler();
});
