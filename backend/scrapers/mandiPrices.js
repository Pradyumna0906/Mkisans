const axios = require('axios');
const { getDB } = require('../config/db');

/**
 * MKisans Mandi Scraper — High Resilience Version
 * Fetches latest 2026 data from National Portals.
 */

const COMMODITIES = [
  { en: 'Wheat', hi: 'गेहूं' },
  { en: 'Tomato', hi: 'टमाटर' },
  { en: 'Onion', hi: 'प्याज' },
  { en: 'Potato', hi: 'आलू' },
  { en: 'Garlic', hi: 'लहसुन' },
  { en: 'Soyabean', hi: 'सोयाबीन' },
  { en: 'Chilli', hi: 'मिर्च' },
  { en: 'Gram', hi: 'चना' }
];

async function scrapeMandiPrices() {
  console.log('[JARVIS-SCRAPER] Initiating Live Mandi Sync...');
  const db = getDB();
  let totalInserted = 0;

  try {
    // Using a more reliable 2026-compatible resource URL
    const mpUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=500&filters[state]=Madhya%20Pradesh';
    
    const response = await axios.get(mpUrl, { timeout: 20000 });
    const records = response.data?.records || [];

    if (records.length === 0) {
      console.warn('[JARVIS-SCRAPER] No fresh records found in National Portal.');
      return 0;
    }

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO mandi_prices (commodity, commodity_hindi, variety, market, state, min_price, max_price, modal_price, price_date, scraped_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `);

    db.transaction(() => {
      for (const record of records) {
        const commInfo = COMMODITIES.find(c => 
          (record.commodity || '').toLowerCase().includes(c.en.toLowerCase())
        );

        // Date formatting: DD/MM/YYYY -> YYYY-MM-DD
        let formattedDate = new Date().toISOString().split('T')[0];
        if (record.arrival_date) {
          const parts = record.arrival_date.split('/');
          if (parts.length === 3) formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }

        try {
          stmt.run(
            record.commodity || 'Unknown',
            commInfo ? commInfo.hi : record.commodity,
            record.variety || '',
            record.market || 'Unknown',
            record.state || 'Madhya Pradesh',
            parseFloat(record.min_price) || 0,
            parseFloat(record.max_price) || 0,
            parseFloat(record.modal_price) || 0,
            formattedDate
          );
          totalInserted++;
        } catch (e) {}
      }
    })();

    console.log(`[JARVIS-SCRAPER] Successfully synced ${totalInserted} live records.`);
    return totalInserted;
  } catch (err) {
    console.error('[JARVIS-SCRAPER] Sync Failed:', err.message);
    return 0;
  }
}

module.exports = { scrapeMandiPrices };
