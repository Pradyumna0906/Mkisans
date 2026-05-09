const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'mkishan.db');
const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

const initDB = () => {
  db.exec(`
    CREATE TABLE IF NOT EXISTS delivery_orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL,
      partner_id INTEGER NOT NULL,
      status TEXT NOT NULL, -- 'completed_today', 'pending', 'total', 'future'
      scheduled_date TEXT,
      customer_name TEXT,
      customer_type TEXT,
      address TEXT,
      amount INTEGER
    );

    CREATE TABLE IF NOT EXISTS delivery_earnings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      transaction_id TEXT NOT NULL,
      partner_id INTEGER NOT NULL,
      amount INTEGER NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL -- 'daily', 'bonus', etc.
    );
  `);
};

module.exports = { db, initDB };
