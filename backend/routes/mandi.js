const express = require('express');
const { getDB } = require('../config/db');

const router = express.Router();

// GET /api/mandi-prices — Get latest mandi commodity prices
router.get('/', (req, res) => {
  const db = getDB();
  const { commodity, state, market, limit = 50 } = req.query;

  let query = 'SELECT * FROM mandi_prices WHERE 1=1';
  const params = [];

  if (commodity) {
    query += ' AND (commodity LIKE ? OR commodity_hindi LIKE ?)';
    params.push(`%${commodity}%`, `%${commodity}%`);
  }

  if (state) {
    query += ' AND state LIKE ?';
    params.push(`%${state}%`);
  }

  if (market) {
    query += ' AND market LIKE ?';
    params.push(`%${market}%`);
  }

  query += ` 
    ORDER BY 
      price_date DESC, 
      CASE 
        WHEN commodity LIKE '%Wheat%' THEN 1
        WHEN commodity LIKE '%Potato%' THEN 2
        WHEN commodity LIKE '%Tomato%' THEN 3
        WHEN commodity LIKE '%Onion%' THEN 4
        WHEN commodity LIKE '%Garlic%' THEN 5
        WHEN commodity LIKE '%Soyabean%' THEN 6
        WHEN commodity LIKE '%Soybean%' THEN 6
        WHEN commodity LIKE '%Maize%' THEN 7
        ELSE 99 
      END ASC,
      commodity ASC 
    LIMIT ?
  `;
  params.push(parseInt(limit));

  try {
    const rows = db.prepare(query).all(...params);

    const prices = rows.map((row) => ({
      id: row.id,
      commodity: row.commodity,
      commodityHindi: row.commodity_hindi,
      variety: row.variety,
      market: row.market,
      state: row.state,
      minPrice: row.min_price,
      maxPrice: row.max_price,
      modalPrice: row.modal_price,
      unit: row.unit,
      priceDate: row.price_date,
      scrapedAt: row.scraped_at,
    }));

    res.json({
      success: true,
      count: prices.length,
      lastUpdated: rows[0]?.scraped_at || null,
      data: prices,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/mandi-prices/commodities — List unique commodities
router.get('/commodities', (req, res) => {
  const db = getDB();
  try {
    const commodities = db.prepare(
      'SELECT DISTINCT commodity, commodity_hindi FROM mandi_prices ORDER BY commodity'
    ).all();
    res.json({ success: true, data: commodities });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/mandi-prices/predictions — Get tomorrow's ML predictions
router.get('/predictions', (req, res) => {
  const db = getDB();
  try {
    const predictions = db.prepare(`
      SELECT commodity, predicted_trend, predicted_price, confidence 
      FROM ml_predictions 
      WHERE target_date >= date('now')
    `).all();
    res.json({ success: true, data: predictions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
