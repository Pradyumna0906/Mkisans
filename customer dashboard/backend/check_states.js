const { getDB } = require('./config/db');

function checkStates() {
    const db = getDB();
    const states = db.prepare('SELECT state, count(*) as count FROM mandi_prices GROUP BY state').all();
    console.log('State Distribution:');
    console.table(states);
}

checkStates();
