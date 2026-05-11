const { getDB } = require('./config/db');
const db = getDB();

const state = 'Madhya Pradesh';
const market = 'Bhopal';
const limit = 50;

let query = 'SELECT * FROM mandi_prices WHERE 1=1';
const params = [];

if (state) {
    query += ' AND state LIKE ?';
    params.push(`%${state}%`);
}

if (market) {
    query += ' AND market LIKE ?';
    params.push(`%${market}%`);
}

query += ' ORDER BY price_date DESC LIMIT ?';
params.push(limit);

const rows = db.prepare(query).all(...params);
console.log('Results found:', rows.length);
if (rows.length > 0) {
    console.log('Latest record:', rows[0]);
}
