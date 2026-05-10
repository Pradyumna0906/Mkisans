const { getDB } = require('./config/db');

async function migrate() {
  const db = getDB();
  console.log('[JARVIS-MIGRATE] Setting up live data tables...');

  // 1. Orders Table (if not already handled)
  db.prepare(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kisan_id INTEGER,
      buyer_name TEXT,
      commodity TEXT,
      quantity TEXT,
      amount REAL,
      status TEXT, -- 'pending', 'confirmed', 'delivered', 'rejected'
      city TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // 2. Notifications Table
  db.prepare(`
    CREATE TABLE IF NOT EXISTS jarvis_notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      kisan_id INTEGER,
      title TEXT,
      message TEXT,
      is_urgent INTEGER DEFAULT 0,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `).run();

  // 3. User Earnings Summary
  db.prepare(`
    CREATE TABLE IF NOT EXISTS kisan_earnings (
      kisan_id INTEGER PRIMARY KEY,
      total_earned REAL DEFAULT 0,
      pending_payout REAL DEFAULT 0,
      last_payment_date DATETIME
    )
  `).run();

  // Seed some dummy data for demo
  const check = db.prepare('SELECT COUNT(*) as count FROM orders').get();
  if (check.count === 0) {
    db.prepare("INSERT INTO orders (kisan_id, buyer_name, commodity, quantity, amount, status, city) VALUES (1, 'Ram Kumar', 'Gehu', '10 Quintal', 24500, 'pending', 'Bhopal')").run();
    db.prepare("INSERT INTO orders (kisan_id, buyer_name, commodity, quantity, amount, status, city) VALUES (1, 'Hotel Shiv', 'Tomato', '50 KG', 1750, 'delivered', 'Indore')").run();
    db.prepare("INSERT INTO kisan_earnings (kisan_id, total_earned, pending_payout) VALUES (1, 54200, 12500)").run();
  }

  console.log('[JARVIS-MIGRATE] Data layer ready for Mode 2.');
}

migrate();
