const axios = require('axios');
const { getDB } = require('../config/db');

// The Open Government Data API
const API_URL = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
const API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';

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

async function loadHistoricalData() {
  console.log('⏳ [Historical-Loader] Deep Data Mining started for Bhopal/MP (2025-2026)...');
  const db = getDB();
  
  let offset = 0;
  const limit = 500; 
  let totalInserted = 0;
  let recordsFound = true;

  try {
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO mandi_prices (commodity, commodity_hindi, variety, market, state, min_price, max_price, modal_price, price_date, scraped_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    // Extended search to build a deep dataset (up to 10,000 records)
    while (recordsFound && offset < 10000) {
      console.log(`📥 [API] Batch ${offset/limit + 1}: Fetching MP records...`);
      const url = `${API_URL}?api-key=${API_KEY}&format=json&limit=${limit}&offset=${offset}&filters[state]=Madhya%20Pradesh`;
      
      const response = await axios.get(url, { timeout: 30000 });
      const records = response.data.records;

      if (!records || records.length === 0) {
        recordsFound = false;
        break;
      }

      for (const record of records) {
        const itemName = (record.commodity || '').toLowerCase();
        const commInfo = COMMODITIES.find(c => itemName.includes(c.en.toLowerCase()));

        if (commInfo && record.modal_price) {
          // Format date for SQLite
          let formattedDate = record.arrival_date;
          if (formattedDate && formattedDate.includes('/')) {
            const parts = formattedDate.split('/');
            if (parts.length === 3) formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
          }

          const info = stmt.run(
            commInfo.en,
            `${commInfo.emoji} ${commInfo.hi}`,
            record.variety || '',
            record.market || 'Unknown',
            record.state || 'Madhya Pradesh',
            parseFloat(record.min_price) || 0,
            parseFloat(record.max_price) || 0,
            parseFloat(record.modal_price) || 0,
            formattedDate
          );

          if (info.changes > 0) totalInserted++;
        }
      }

      console.log(`✨ Processed batch. Total unique records in DB: ${totalInserted}`);
      offset += limit;
      // Faster throughput for deep mining, but still respecting rate limits
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log(`✅ [Historical-Loader] Massive Data Sync Complete! ${totalInserted} records stored.`);
    
    // Trigger Deep Training
    console.log('🧠 [Historical-Loader] Initializing LSTM Deep Learning Trainer...');
    const { trainDailyModel } = require('../ml_engine/trainer');
    await trainDailyModel();

  } catch (err) {
    console.error('❌ [Historical-Loader] Deep mining failed:', err.message);
  }
}

// Run if called directly
if (require.main === module) {
  loadHistoricalData();
}

module.exports = { loadHistoricalData };
