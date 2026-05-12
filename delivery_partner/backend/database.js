import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'mkisans.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Database connection error:', err.message);
  else console.log('Connected to the MKisans SQLite database.');
});

// Wrapper for Async/Await support
export const query = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

export const get = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

export const run = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

// Initialize Tables
db.serialize(() => {
  db.run('PRAGMA foreign_keys = ON');

  db.run(`
    CREATE TABLE IF NOT EXISTS partners (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE,
      password TEXT NOT NULL,
      avatar TEXT,
      level TEXT DEFAULT 'bronze',
      rating REAL DEFAULT 4.5,
      is_online INTEGER DEFAULT 0,
      vehicle_type TEXT,
      vehicle_name TEXT,
      vehicle_number TEXT,
      balance REAL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      partner_id TEXT,
      farmer_name TEXT NOT NULL,
      farmer_avatar TEXT,
      pickup_location TEXT NOT NULL,
      delivery_location TEXT NOT NULL,
      distance TEXT,
      estimated_time TEXT,
      delivery_charge REAL,
      weight TEXT,
      status TEXT DEFAULT 'pending',
      items TEXT, 
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (partner_id) REFERENCES partners(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      partner_id TEXT NOT NULL,
      description TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT CHECK(type IN ('credit', 'debit')),
      icon TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (partner_id) REFERENCES partners(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS crop_prices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      crop_name TEXT NOT NULL,
      price REAL NOT NULL,
      region TEXT NOT NULL,
      date TEXT NOT NULL
    )
  `);
});

export default db;
