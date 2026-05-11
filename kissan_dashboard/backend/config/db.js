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

    CREATE TABLE IF NOT EXISTS kisans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      mobile_number TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      profile_photo TEXT,
      aadhaar_number TEXT,
      aadhaar_photo TEXT,
      pan_number TEXT,
      pan_photo TEXT,
      land_proof_photo TEXT,
      address_proof_photo TEXT,
      state TEXT,
      district TEXT,
      village TEXT,
      pin_code TEXT,
      geo_lat REAL,
      geo_lng REAL,
      address TEXT,
      role TEXT DEFAULT 'farmer',
      is_verified INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kisan_id INTEGER NOT NULL,
      caption TEXT,
      media_url TEXT NOT NULL,
      media_type TEXT DEFAULT 'image',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (kisan_id) REFERENCES kisans(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      kisan_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(post_id, kisan_id),
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (kisan_id) REFERENCES kisans(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL,
      kisan_id INTEGER NOT NULL,
      comment_text TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
      FOREIGN KEY (kisan_id) REFERENCES kisans(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS follows (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      follower_id INTEGER NOT NULL,
      following_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(follower_id, following_id),
      FOREIGN KEY (follower_id) REFERENCES kisans(id) ON DELETE CASCADE,
      FOREIGN KEY (following_id) REFERENCES kisans(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kisan_id INTEGER NOT NULL,
      media_url TEXT NOT NULL,
      media_type TEXT DEFAULT 'image',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME,
      FOREIGN KEY (kisan_id) REFERENCES kisans(id) ON DELETE CASCADE
    );
  `);

  // Migration: Ensure 'role' column exists in 'kisans' table
  try {
    const kisanCols = db.pragma('table_info(kisans)');
    if (kisanCols.length > 0) {
      const hasRole = kisanCols.some(c => c.name === 'role');
      if (!hasRole) {
        console.log('[DB] Migrating: Adding "role" column to kisans table...');
        db.exec('ALTER TABLE kisans ADD COLUMN role TEXT DEFAULT "farmer"');
      }
      db.exec('CREATE INDEX IF NOT EXISTS idx_kisans_role ON kisans(role)');
    }
  } catch (err) {
    console.error('[DB] Migration error:', err.message);
  }

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_news_active ON news_items(is_active, scraped_at);
    CREATE INDEX IF NOT EXISTS idx_mandi_commodity ON mandi_prices(commodity, price_date);
    CREATE INDEX IF NOT EXISTS idx_trends_commodity ON historical_trends(commodity, price_date);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_kisans_mobile ON kisans(mobile_number);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_kisans_email ON kisans(email);
    CREATE INDEX IF NOT EXISTS idx_stories_kisan ON stories(kisan_id);
    CREATE INDEX IF NOT EXISTS idx_stories_expiry ON stories(expires_at);
    
    -- JARVIS Performance Optimization
    CREATE INDEX IF NOT EXISTS idx_orders_kisan ON orders(kisan_id, status);
    CREATE INDEX IF NOT EXISTS idx_jarvis_notif_unread ON jarvis_notifications(kisan_id, is_read);
    CREATE INDEX IF NOT EXISTS idx_earnings_kisan ON kisan_earnings(kisan_id);
  `);
}

module.exports = { getDB };
