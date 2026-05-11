const express = require('express');
const { getDB } = require('../config/db');

const router = express.Router();

// GET /api/news — Get all government scheme news
router.get('/', (req, res) => {
  const db = getDB();
  const { category, source, limit = 20 } = req.query;

  let query = 'SELECT * FROM news_items WHERE is_active = 1';
  const params = [];

  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }

  if (source) {
    query += ' AND source = ?';
    params.push(source);
  }

  query += ' ORDER BY scraped_at DESC LIMIT ?';
  params.push(parseInt(limit));

  try {
    const rows = db.prepare(query).all(...params);

    // Format for the app's NewsTicker component
    const news = rows.map((row) => ({
      id: String(row.id),
      title: row.title,
      description: row.description,
      source: row.source,
      category: row.category,
      icon: row.icon,
      color: row.color,
      link: row.link,
      date: row.date_text,
      scrapedAt: row.scraped_at,
    }));

    res.json({
      success: true,
      count: news.length,
      lastUpdated: rows[0]?.scraped_at || null,
      data: news,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/news/sources — List unique sources
router.get('/sources', (req, res) => {
  const db = getDB();
  try {
    const sources = db.prepare('SELECT DISTINCT source, COUNT(*) as count FROM news_items WHERE is_active = 1 GROUP BY source').all();
    res.json({ success: true, data: sources });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
