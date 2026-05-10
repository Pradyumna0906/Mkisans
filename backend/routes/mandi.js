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

// GET /api/mandi-prices/historical — Get historical price series for charts
router.get('/historical', (req, res) => {
  const db = getDB();
  const { commodity, market, days = 30 } = req.query;

  if (!commodity) {
    return res.status(400).json({ success: false, error: 'Commodity is required' });
  }

  try {
    let query = `
      SELECT modal_price, price_date 
      FROM mandi_prices 
      WHERE commodity = ? 
    `;
    const params = [commodity];

    if (market) {
      query += ' AND market = ?';
      params.push(market);
    }

    query += ' ORDER BY price_date ASC LIMIT ?';
    params.push(parseInt(days));

    const history = db.prepare(query).all(...params);
    res.json({ success: true, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/mandi-prices/intelligence — Get AI-based price suggestions and trends
router.get('/intelligence', (req, res) => {
  const db = getDB();
  const { commodity, market } = req.query;

  if (!commodity) {
    return res.status(400).json({ success: false, error: 'Commodity is required' });
  }

  try {
    // 1. Get latest price details
    const latest = db.prepare(`
      SELECT * FROM mandi_prices 
      WHERE commodity = ? ${market ? 'AND market = ?' : ''}
      ORDER BY price_date DESC LIMIT 1
    `).get(...(market ? [commodity, market] : [commodity]));

    if (!latest) {
      return res.status(404).json({ success: false, error: 'No data found for this commodity' });
    }

    // 2. Get ML prediction
    const prediction = db.prepare(`
      SELECT * FROM ml_predictions 
      WHERE commodity = ? 
      ORDER BY target_date DESC LIMIT 1
    `).get(commodity);

    // 3. Get average for the state
    const stateAvg = db.prepare(`
      SELECT AVG(modal_price) as avg_price, MAX(max_price) as max_price, MIN(min_price) as min_price
      FROM mandi_prices 
      WHERE commodity = ? AND state = ? AND price_date = ?
    `).get(commodity, latest.state, latest.price_date);

    // 4. Intelligence Logic
    const intelligence = {
      currentPrice: latest.modal_price,
      suggestedSellingPrice: prediction ? Math.round((latest.modal_price + prediction.predicted_price) / 2) : latest.modal_price + 50,
      trend: prediction ? prediction.predicted_trend : 'STABLE',
      prediction: prediction || null,
      marketStats: {
        min: latest.min_price,
        max: latest.max_price,
        stateAvg: Math.round(stateAvg.avg_price || latest.modal_price),
        stateMax: stateAvg.max_price || latest.max_price,
      },
      recommendation: (prediction && prediction.predicted_trend === 'UP') 
        ? 'HOLD: Prices are expected to rise. Consider selling next week.'
        : 'SELL: Prices are stable or slightly declining. Good time to sell now.'
    };

    res.json({ success: true, data: intelligence });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/mandi-prices/nearby — Compare with nearby mandis
router.get('/nearby', (req, res) => {
  const db = getDB();
  const { commodity, state, district } = req.query;

  if (!commodity || !state) {
    return res.status(400).json({ success: false, error: 'Commodity and state are required' });
  }

  try {
    // Look for prices in the same district or state
    const nearby = db.prepare(`
      SELECT market, modal_price, price_date
      FROM mandi_prices
      WHERE commodity = ? AND state = ? ${district ? 'AND (market LIKE ? OR market IS NOT NULL)' : ''}
      AND price_date = (SELECT MAX(price_date) FROM mandi_prices WHERE commodity = ?)
      ORDER BY modal_price DESC
      LIMIT 10
    `).all(commodity, state, district ? `%${district}%` : null, commodity);

    res.json({ success: true, data: nearby });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
