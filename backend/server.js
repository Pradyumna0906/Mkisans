const express = require('express');
const cors = require('cors');
const { runAllScrapers, startScheduler } = require('./scheduler/cron');
const newsRoutes = require('./routes/news');
const mandiRoutes = require('./routes/mandi');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
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
  ║   GET  /api/news          — Scheme news    ║
  ║   GET  /api/mandi-prices  — Mandi prices   ║
  ║   GET  /api/health        — Health check   ║
  ║   POST /api/refresh       — Force scrape   ║
  ╚════════════════════════════════════════════╝
  `);

  // Run scrapers on startup
  console.log('[Startup] Running initial scraper cycle...');
  await runAllScrapers();

  // Start cron scheduler
  startScheduler();
});
