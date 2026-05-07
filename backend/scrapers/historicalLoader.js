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
  console.log('⏳ [Historical-Loader] Connecting to Government Database (data.gov.in)...');
  const db = getDB();
  
  let offset = 0;
  const limit = 500; // Max allowed per request by the API
  let totalInserted = 0;
  let recordsFound = true;

  try {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO mandi_prices (commodity, commodity_hindi, variety, market, state, min_price, max_price, modal_price, price_date, scraped_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    // Loop through past records (Fetch up to 2000 historical records for MP)
    while (recordsFound && offset < 2000) {
      console.log(`📥 Fetching records ${offset} to ${offset + limit}...`);
      const url = `${API_URL}?api-key=${API_KEY}&format=json&limit=${limit}&offset=${offset}&filters[state]=Madhya%20Pradesh`;
      
      const response = await axios.get(url, { timeout: 20000 });
      const records = response.data.records;

      if (!records || records.length === 0) {
        recordsFound = false;
        break;
      }

      for (const record of records) {
        // Strict agriculture filter
        const itemName = (record.commodity || '').toLowerCase();
        if (['cotton', 'apple', 'pomegranate', 'mango', 'milk', 'ghee'].some(ex => itemName.includes(ex))) {
          continue; 
        }

        const commInfo = COMMODITIES.find(c => itemName.includes(c.en.toLowerCase()));

        if (commInfo && record.modal_price) {
          const info = stmt.run(
            commInfo.en,
            `${commInfo.emoji} ${commInfo.hi}`,
            record.variety || '',
            record.market || 'Unknown',
            record.state || 'Madhya Pradesh',
            parseFloat(record.min_price) || 0,
            parseFloat(record.max_price) || 0,
            parseFloat(record.modal_price) || 0,
            record.arrival_date || new Date().toISOString().split('T')[0]
          );

          if (info.changes > 0) totalInserted++;
        }
      }

      offset += limit;
      // Rate limiting buffer
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`✅ [Historical-Loader] Successfully downloaded and injected ${totalInserted} historical agriculture records!`);
    
    // Trigger the ML trainer now that we have data!
    console.log('🧠 [Historical-Loader] Triggering ML Neural Network Trainer on new dataset...');
    const { trainDailyModel } = require('../ml_engine/trainer');
    await trainDailyModel();

  } catch (err) {
    console.error('❌ [Historical-Loader] Failed to fetch historical data:', err.message);
  }
}

// Run if called directly
if (require.main === module) {
  loadHistoricalData();
}

module.exports = { loadHistoricalData };
