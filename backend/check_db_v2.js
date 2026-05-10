const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'mkisans.db');
const db = new Database(DB_PATH);

try {
    const prices = db.prepare('SELECT COUNT(*) as count FROM mandi_prices').get();
    const news = db.prepare('SELECT COUNT(*) as count FROM news_items').get();
    
    console.log('Database Statistics:');
    console.log(`- Mandi Prices: ${prices.count} records`);
    console.log(`- News Items: ${news.count} records`);
    
    if (prices.count > 0) {
        console.log('Sample Price Data:');
        const samples = db.prepare('SELECT * FROM mandi_prices LIMIT 3').all();
        console.table(samples);

        const commodities = db.prepare('SELECT commodity, count(*) as count FROM mandi_prices GROUP BY commodity').all();
        console.log('Commodity Distribution:');
        console.table(commodities);
    } else {
        console.log('No mandi prices found in database.');
    }
} catch (err) {
    console.error('Check failed:', err.message);
} finally {
    db.close();
}
