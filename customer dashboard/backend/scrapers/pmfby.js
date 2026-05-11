const axios = require('axios');
const cheerio = require('cheerio');
const { getDB } = require('../config/db');

const SOURCE = 'pmfby.gov.in';
const URL = 'https://pmfby.gov.in';

async function scrapePMFBY() {
  console.log('[Scraper] PMFBY: Starting...');
  const db = getDB();

  try {
    const { data: html } = await axios.get(URL, { timeout: 15000 });
    const $ = cheerio.load(html);

    const items = [];
    const pageText = $('body').text();

    // Core scheme info — always present
    items.push({
      source_id: 'pmfby-core-scheme',
      title: 'PM फसल बीमा योजना (PMFBY)',
      description: 'प्रधानमंत्री फसल बीमा योजना — किसानों को प्राकृतिक आपदाओं से फसल नुकसान पर बीमा कवर। खरीफ फसलों के लिए 2%, रबी फसलों के लिए 1.5%, और वाणिज्यिक/बागवानी फसलों के लिए 5% प्रीमियम।',
      source: SOURCE,
      source_url: URL,
      category: 'बीमा',
      icon: '🛡️',
      color: '#2E7D32',
      link: URL,
      date_text: 'सक्रिय',
    });

    // Extract any notification/news links
    $('a').each((_, el) => {
      const href = $(el).attr('href') || '';
      const text = $(el).text().trim();
      if ((text.includes('notification') || text.includes('circular') || text.includes('order') || text.includes('guideline')) && text.length > 15) {
        items.push({
          source_id: `pmfby-notice-${Buffer.from(text.slice(0, 40)).toString('base64').slice(0, 20)}`,
          title: text.length > 80 ? text.slice(0, 80) + '...' : text,
          description: `PMFBY आधिकारिक सूचना: ${text}`,
          source: SOURCE,
          source_url: URL,
          category: 'सूचना',
          icon: '📄',
          color: '#F57F17',
          link: href.startsWith('http') ? href : `${URL}${href}`,
          date_text: new Date().toLocaleDateString('hi-IN'),
        });
      }
    });

    // Extract stats if available
    const statsMatch = pageText.match(/([\d.]+)\s*(?:Crore|Cr|crore)/i);
    if (statsMatch) {
      items.push({
        source_id: 'pmfby-stats-latest',
        title: `PMFBY: ${statsMatch[1]} करोड़+ किसानों को कवर`,
        description: `प्रधानमंत्री फसल बीमा योजना के तहत ${statsMatch[1]} करोड़ से अधिक किसान बीमित। ऑनलाइन या CSC केंद्र पर नामांकन करें।`,
        source: SOURCE,
        source_url: URL,
        category: 'आँकड़े',
        icon: '📊',
        color: '#1B5E20',
        link: URL,
        date_text: 'ताज़ा',
      });
    }

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO news_items (source_id, title, description, source, source_url, category, icon, color, link, date_text, scraped_at)
      VALUES (@source_id, @title, @description, @source, @source_url, @category, @icon, @color, @link, @date_text, CURRENT_TIMESTAMP)
    `);

    let count = 0;
    for (const item of items) {
      try { stmt.run(item); count++; } catch (e) { /* skip */ }
    }

    console.log(`[Scraper] PMFBY: Inserted/updated ${count} items`);
    return count;
  } catch (err) {
    console.error('[Scraper] PMFBY: Failed —', err.message);
    return 0;
  }
}

module.exports = { scrapePMFBY };
