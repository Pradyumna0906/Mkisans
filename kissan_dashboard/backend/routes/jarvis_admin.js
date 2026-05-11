const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { runIndexer } = require('../auto_indexer_wrapper');

const CONFIG_PATH = path.join(__dirname, '../config/jarvis_admin_settings.json');

// 1. Get Current Config
router.get('/config', (req, res) => {
  const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  res.json(data);
});

// 2. Update Config
router.post('/config', (req, res) => {
  const newConfig = req.body;
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(newConfig, null, 2));
  res.json({ success: true, message: 'JARVIS Config updated.' });
});

// 3. Trigger Retraining (Manual Indexing)
router.post('/retrain', async (req, res) => {
  try {
    await runIndexer();
    res.json({ success: true, message: 'Knowledge base successfully re-indexed.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Get Conversation Logs (Mocked for now)
router.get('/logs', (req, res) => {
  // In production, fetch from a logs table
  res.json([
    { id: 1, user: 'Farmer Ram', query: 'Mandi bhav', intent: 'MARKET_PRICE', time: '2026-05-10T10:00:00Z' },
    { id: 2, user: 'Farmer Shyam', query: 'Barish kab hogi?', intent: 'WEATHER_INFO', time: '2026-05-10T11:30:00Z' }
  ]);
});

module.exports = router;
