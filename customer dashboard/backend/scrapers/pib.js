const axios = require('axios');
const cheerio = require('cheerio');
const { getDB } = require('../config/db');

const SOURCE = 'pib.gov.in';
const URL = 'https://pib.gov.in/allRel.aspx';

// Keywords to filter agriculture-related press releases
const AGRI_KEYWORDS = [
  'kisan', 'farmer', 'agriculture', 'crop', 'mandi', 'fasal',
  'krishi', 'pm-kisan', 'pmfby', 'enam', 'msp', 'irrigation',
  'fertilizer', 'urea', 'soil', 'harvest', 'horticulture',
  'dairy', 'fisheries', 'animal husbandry', 'rural',
];

async function scrapePIB() {
  console.log('[Scraper] PIB: Starting...');
  const db = getDB();

  try {
    const { data: html } = await axios.get(URL, { timeout: 15000 });
    const $ = cheerio.load(html);

    const items = [];

    // Find press release entries
    $('a').each((_, el) => {
      const text = $(el).text().trim().toLowerCase();
      const fullText = $(el).text().trim();
      const href = $(el).attr('href') || '';

      // Check if this release is agriculture-related
      const isAgri = AGRI_KEYWORDS.some(kw => text.includes(kw));
      if (isAgri && fullText.length > 20 && fullText.length < 300) {
        const title = fullText.length > 100 ? fullText.slice(0, 100) + '...' : fullText;
        items.push({
          source_id: `pib-${Buffer.from(fullText.slice(0, 60)).toString('base64').slice(0, 25)}`,
          title: title,
          description: `सरकारी प्रेस विज्ञप्ति: ${fullText}`,
          source: SOURCE,
          source_url: URL,
          category: 'प्रेस',
          icon: '🗞️',
          color: '#283593',
          link: href.startsWith('http') ? href : `https://pib.gov.in/${href}`,
          date_text: new Date().toLocaleDateString('hi-IN'),
        });
      }
    });

    // Limit to top 10 most recent
    const topItems = items.slice(0, 10);

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO news_items (source_id, title, description, source, source_url, category, icon, color, link, date_text, scraped_at)
      VALUES (@source_id, @title, @description, @source, @source_url, @category, @icon, @color, @link, @date_text, CURRENT_TIMESTAMP)
    `);

    let count = 0;
    for (const item of topItems) {
      try { stmt.run(item); count++; } catch (e) { /* skip */ }
    }

    console.log(`[Scraper] PIB: Inserted/updated ${count} items`);
    return count;
  } catch (err) {
    console.error('[Scraper] PIB: Failed —', err.message);
    return 0;
  }
}

module.exports = { scrapePIB };
