const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { getDB } = require('../config/db');

const CSV_FILE = path.join(__dirname, '..', 'kaggle_data', 'Agriculture_price_dataset.csv');

const COMMODITIES = [
  { en: 'Wheat', hi: 'गेहूं', emoji: '🌾' },
  { en: 'Rice', hi: 'चावल', emoji: '🍚' },
  { en: 'Maize', hi: 'मक्का', emoji: '🌽' },
  { en: 'Tomato', hi: 'टमाटर', emoji: '🍅' },
  { en: 'Onion', hi: 'प्याज', emoji: '🧅' },
  { en: 'Potato', hi: 'आलू', emoji: '🥔' },
  { en: 'Green Chilli', hi: 'हरी मिर्च', emoji: '🌶️' },
  { en: 'Gram', hi: 'चना', emoji: '🫘' },
  { en: 'Soybean', hi: 'सोयाबीन', emoji: '🫛' },
  { en: 'Mustard', hi: 'सरसों', emoji: '🌻' },
];

function formatDate(dateStr) {
  // Parses "6/6/2023" to "2023-06-06"
  if (!dateStr) return null;
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const month = parts[0].padStart(2, '0');
    const day = parts[1].padStart(2, '0');
    return `${parts[2]}-${month}-${day}`;
  }
  return dateStr;
}

async function loadKaggleData() {
  console.log('⏳ [Kaggle-Loader] Opening Kaggle Dataset (Agriculture_price_dataset.csv)...');
  const db = getDB();
  
  if (!fs.existsSync(CSV_FILE)) {
    console.error('❌ Kaggle dataset not found!');
    return;
  }

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO mandi_prices (commodity, commodity_hindi, variety, market, state, min_price, max_price, modal_price, price_date, scraped_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `);

  let mpCount = 0;
  let totalProcessed = 0;
  
  // Use a transaction for bulk insert speed
  const insertMany = db.transaction((records) => {
    for (const record of records) {
      const commInfo = COMMODITIES.find(c => record.Commodity.toLowerCase().includes(c.en.toLowerCase()));
      if (commInfo && record.Modal_Price) {
        const info = stmt.run(
          commInfo.en,
          `${commInfo.emoji} ${commInfo.hi}`,
          record.Variety || '',
          record['Market Name'] || 'Unknown',
          record.STATE || 'Madhya Pradesh',
          parseFloat(record.Min_Price) || 0,
          parseFloat(record.Max_Price) || 0,
          parseFloat(record.Modal_Price) || 0,
          formatDate(record['Price Date'])
        );
        if (info.changes > 0) mpCount++;
      }
    }
  });

  let batch = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(CSV_FILE)
      .pipe(csv())
      .on('data', (row) => {
        totalProcessed++;
        
        // Strict Filter: Only Madhya Pradesh
        if (row.STATE && row.STATE.toLowerCase() === 'madhya pradesh') {
          // Strict Filter: No Cotton/Fruits
          const itemName = (row.Commodity || '').toLowerCase();
          if (!['cotton', 'apple', 'pomegranate', 'mango', 'milk', 'ghee'].some(ex => itemName.includes(ex))) {
            batch.push(row);
          }
        }

        // Process in chunks of 5000 to prevent memory crashes
        if (batch.length >= 5000) {
          insertMany(batch);
          batch = [];
        }
      })
      .on('end', async () => {
        if (batch.length > 0) {
          insertMany(batch); // Insert remaining
        }
        console.log(`✅ [Kaggle-Loader] Processed ${totalProcessed} total lines.`);
        console.log(`🌾 [Kaggle-Loader] Extracted and inserted ${mpCount} historical agriculture records for Madhya Pradesh!`);
        
        if (mpCount > 0) {
          console.log('🧠 [Kaggle-Loader] Triggering Synaptic ML Neural Network on massive Kaggle dataset...');
          const { trainDailyModel } = require('../ml_engine/trainer');
          await trainDailyModel();
        }
        resolve();
      })
      .on('error', reject);
  });
}

if (require.main === module) {
  loadKaggleData();
}

module.exports = { loadKaggleData };
