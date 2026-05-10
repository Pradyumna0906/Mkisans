const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'mkisans.db');
const db = new Database(DB_PATH);

try {
    console.log('Checking kisans table...');
    const columns = db.pragma('table_info(kisans)');
    const hasRole = columns.some(c => c.name === 'role');
    
    if (!hasRole) {
        console.log('Adding "role" column to kisans table...');
        db.exec('ALTER TABLE kisans ADD COLUMN role TEXT DEFAULT "farmer"');
        console.log('Adding index for role...');
        db.exec('CREATE INDEX IF NOT EXISTS idx_kisans_role ON kisans(role)');
        console.log('Success: role column added.');
    } else {
        console.log('Table "kisans" already has "role" column.');
    }

    const priceCount = db.prepare('SELECT COUNT(*) as count FROM mandi_prices').get();
    console.log(`Current mandi_prices count: ${priceCount.count}`);

} catch (err) {
    console.error('Migration failed:', err.message);
} finally {
    db.close();
}
