const { getDB } = require('./config/db');

async function check() {
    try {
        console.log('Initializing DB via getDB()...');
        const db = getDB();
        
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        console.log('Existing Tables:', tables.map(t => t.name).join(', '));

        const prices = db.prepare('SELECT COUNT(*) as count FROM mandi_prices').get();
        console.log(`- Mandi Prices: ${prices.count} records`);
        
        if (prices.count > 0) {
            const sample = db.prepare('SELECT * FROM mandi_prices LIMIT 1').get();
            console.log('Sample record:', sample);
        } else {
            console.log('No data in mandi_prices. Running scraper test...');
            const { scrapeMandiPrices } = require('./scrapers/mandiPrices');
            await scrapeMandiPrices();
            const newCount = db.prepare('SELECT COUNT(*) as count FROM mandi_prices').get();
            console.log(`- New Mandi Prices count: ${newCount.count}`);
        }
    } catch (err) {
        console.error('Check failed:', err);
    }
}

check();
