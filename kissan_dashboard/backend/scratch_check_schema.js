const { getDB } = require('./config/db');
const db = getDB();

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables.map(t => t.name));

tables.forEach(t => {
    const cols = db.prepare(`PRAGMA table_info(${t.name})`).all();
    console.log(`Table ${t.name} columns:`, cols.map(c => c.name));
});
