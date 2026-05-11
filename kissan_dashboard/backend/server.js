require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { db, initDB } = require('./db');
const { runAllScrapers, startScheduler } = require('./scheduler/cron');
const newsRoutes = require('./routes/news');
const mandiRoutes = require('./routes/mandi');
const authRoutes = require('./routes/auth');
const weatherRoutes = require('./routes/weather');
const socialRoutes = require('./routes/social');
const logisticsRoutes = require('./routes/logistics');
const jarvisRoutes = require('./routes/jarvis');
const jarvisAdminRoutes = require('./routes/jarvis_admin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true
}));
app.use(express.json());

// Serve uploaded files (profile photos, documents)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/mandi-prices', mandiRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/logistics', logisticsRoutes);
app.use('/api/jarvis', jarvisRoutes);
app.use('/api/jarvis/admin', jarvisAdminRoutes);

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
  ║   POST /api/auth/register — Kisan Register ║
  ║   POST /api/auth/login    — Kisan Login    ║
  ║   POST /api/auth/send-otp — Send OTP       ║
  ║   GET  /api/news          — Scheme news    ║
  ║   GET  /api/mandi-prices  — Mandi prices   ║
  ║   GET  /api/health        — Health check   ║
  ║   POST /api/social/posts  — Create post    ║
  ║   GET  /api/social/feed   — Social feed    ║
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

  // Run JARVIS Auto-Indexer (Auto-Learn New Features)
  try {
    const { runIndexer } = require('./auto_indexer_wrapper');
    await runIndexer();
  } catch (err) {
    console.error('[JARVIS-INDEXER] Auto-indexing failed:', err.message);
  }

  // Start cron scheduler
  startScheduler();
});
