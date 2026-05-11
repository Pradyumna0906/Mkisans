const { getDB } = require('./config/db');

function checkMarkets() {
    const db = getDB();
    const markets = db.prepare("SELECT market, count(*) as count FROM mandi_prices WHERE state = 'Madhya Pradesh' GROUP BY market ORDER BY count DESC LIMIT 10").all();
    console.log('Top 10 Markets in Madhya Pradesh:');
    console.table(markets);
}

checkMarkets();
