const axios = require('axios');
const cheerio = require('cheerio');
const { getDB } = require('../config/db');

const SOURCE = 'agmarknet.gov.in';

// Target commodities with Hindi names
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

async function scrapeMandiPrices() {
  console.log('[Scraper] Mandi Prices: Starting...');
  const db = getDB();

  try {
    // Try agmarknet commodity-wise data page
    const url = 'https://agmarknet.gov.in/SearchCmmMkt.aspx';
    let totalInserted = 0;

    // Attempt to get current prices from agmarknet
    try {
      const { data: html } = await axios.get(url, { timeout: 15000 });
      const $ = cheerio.load(html);

      // Extract any price tables
      $('table tr').each((_, row) => {
        const cells = $(row).find('td');
        if (cells.length >= 5) {
          const commodity = $(cells[0]).text().trim();
          const market = $(cells[1]).text().trim();
          const minPrice = parseFloat($(cells[2]).text().trim().replace(/,/g, ''));
          const maxPrice = parseFloat($(cells[3]).text().trim().replace(/,/g, ''));
          const modalPrice = parseFloat($(cells[4]).text().trim().replace(/,/g, ''));

          if (!isNaN(modalPrice) && commodity) {
            const commInfo = COMMODITIES.find(c =>
              commodity.toLowerCase().includes(c.en.toLowerCase())
            );

            const stmt = db.prepare(`
              INSERT OR REPLACE INTO mandi_prices (commodity, commodity_hindi, variety, market, min_price, max_price, modal_price, price_date, scraped_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `);

            try {
              stmt.run(
                commInfo ? commInfo.en : commodity,
                commInfo ? commInfo.hi : commodity,
                '',
                market,
                minPrice,
                maxPrice,
                modalPrice,
                new Date().toISOString().split('T')[0]
              );
              totalInserted++;
            } catch (e) { /* duplicate */ }
          }
        }
      });
    } catch (e) {
      console.log('[Scraper] Agmarknet direct scrape limited, using data.gov.in fallback');
    }

    // Fallback: Use data.gov.in open API for mandi prices
    // Fallback: Use data.gov.in open API for mandi prices
    // Filter strictly for Bhopal first, then Madhya Pradesh generally
    try {
      const bhopalUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=50&filters[state]=Madhya%20Pradesh&filters[district]=Bhopal';
      const mpUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=150&filters[state]=Madhya%20Pradesh';
      
      const [bhopalRes, mpRes] = await Promise.all([
        axios.get(bhopalUrl, { timeout: 15000 }).catch(() => ({ data: { records: [] } })),
        axios.get(mpUrl, { timeout: 15000 }).catch(() => ({ data: { records: [] } }))
      ]);

      const allRecords = [
        ...(bhopalRes.data?.records || []),
        ...(mpRes.data?.records || [])
      ];

      if (allRecords.length > 0) {
        const stmt = db.prepare(`
          INSERT OR REPLACE INTO mandi_prices (commodity, commodity_hindi, variety, market, state, min_price, max_price, modal_price, price_date, scraped_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `);

        for (const record of allRecords) {
          const commInfo = COMMODITIES.find(c =>
            (record.commodity || '').toLowerCase().includes(c.en.toLowerCase())
          );

          try {
            stmt.run(
              record.commodity || 'Unknown',
              commInfo ? `${commInfo.emoji} ${commInfo.hi}` : record.commodity,
              record.variety || '',
              record.market || '',
              record.state || '',
              parseFloat(record.min_price) || 0,
              parseFloat(record.max_price) || 0,
              parseFloat(record.modal_price) || 0,
              record.arrival_date || new Date().toISOString().split('T')[0]
            );
            totalInserted++;
          } catch (e) { /* duplicate */ }
        }
      }
    } catch (e) {
      console.log('[Scraper] data.gov.in API limited:', e.message);
    }

    console.log(`[Scraper] Mandi Prices: Inserted/updated ${totalInserted} records`);
    return totalInserted;
  } catch (err) {
    console.error('[Scraper] Mandi Prices: Failed —', err.message);
    return 0;
  }
}

module.exports = { scrapeMandiPrices };
