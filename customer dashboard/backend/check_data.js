const db = require('./config/db').getDB();

const latest = db.prepare('SELECT commodity, price_date FROM mandi_prices WHERE state = ? ORDER BY price_date DESC LIMIT 50').all('Madhya Pradesh');

console.log('--- LATEST COMMODITIES IN MP ---');
latest.forEach(r => {
  console.log(`- ${r.commodity} (${r.price_date})`);
});
