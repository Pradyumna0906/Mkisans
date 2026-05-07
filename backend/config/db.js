const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'mkisans.db');

let db;

function getDB() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initTables();
  }
  return db;
}

function initTables() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS news_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT UNIQUE,
      title TEXT NOT NULL,
      description TEXT,
      source TEXT NOT NULL,
      source_url TEXT,
      category TEXT,
      icon TEXT DEFAULT '📰',
      color TEXT DEFAULT '#138808',
      link TEXT,
      date_text TEXT,
      scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS mandi_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      commodity TEXT NOT NULL,
      commodity_hindi TEXT,
      variety TEXT,
      market TEXT,
      state TEXT,
      min_price REAL,
      max_price REAL,
      modal_price REAL,
      unit TEXT DEFAULT 'Quintal',
      price_date TEXT,
      scraped_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(commodity, market, price_date)
    );

    CREATE TABLE IF NOT EXISTS historical_trends (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      commodity TEXT NOT NULL,
      market TEXT NOT NULL,
      price_date TEXT NOT NULL,
      modal_price REAL,
      daily_increment REAL DEFAULT 0,
      demand_momentum REAL DEFAULT 0,
      UNIQUE(commodity, market, price_date)
    );

    CREATE TABLE IF NOT EXISTS ml_predictions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      commodity TEXT NOT NULL,
      target_date TEXT NOT NULL,
      predicted_trend TEXT,
      predicted_price REAL,
      confidence REAL,
      UNIQUE(commodity, target_date)
    );

    CREATE INDEX IF NOT EXISTS idx_news_active ON news_items(is_active, scraped_at);
    CREATE INDEX IF NOT EXISTS idx_mandi_commodity ON mandi_prices(commodity, price_date);
    CREATE INDEX IF NOT EXISTS idx_trends_commodity ON historical_trends(commodity, price_date);
  `);
}

module.exports = { getDB };
