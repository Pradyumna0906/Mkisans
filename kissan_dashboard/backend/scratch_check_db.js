const { getDB } = require('./config/db');

async function checkData() {
    try {
        const db = getDB();
        const prices = db.prepare('SELECT COUNT(*) as count FROM mandi_prices').get();
        const news = db.prepare('SELECT COUNT(*) as count FROM news_items').get();
        
        console.log('Database Statistics:');
        console.log(`- Mandi Prices: ${prices.count} records`);
        console.log(`- News Items: ${news.count} records`);
        
        if (prices.count > 0) {
            const latest = db.prepare('SELECT * FROM mandi_prices ORDER BY price_date DESC LIMIT 1').get();
            console.log('Latest Price Record:', latest);
        }
    } catch (err) {
        console.error('Error checking database:', err.message);
    }
}

checkData();
