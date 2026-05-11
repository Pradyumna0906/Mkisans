const axios = require('axios');
const cheerio = require('cheerio');
const { getDB } = require('../config/db');

const SOURCE = 'enam.gov.in';
const URL = 'https://enam.gov.in/web/';

async function scrapeENAM() {
  console.log('[Scraper] eNAM: Starting...');
  const db = getDB();

  try {
    const { data: html } = await axios.get(URL, { timeout: 15000 });
    const $ = cheerio.load(html);

    const items = [];
    const pageText = $('body').text();

    // eNAM core info
    items.push({
      source_id: 'enam-core-platform',
      title: 'eNAM: राष्ट्रीय कृषि बाजार',
      description: 'National Agriculture Market (eNAM) — ऑनलाइन मंडी प्लेटफॉर्म। किसान अपनी फसल किसी भी eNAM मंडी में बेच सकते हैं। पारदर्शी मूल्य, सीधा भुगतान।',
      source: SOURCE,
      source_url: URL,
      category: 'मंडी',
      icon: '🏪',
      color: '#E65100',
      link: URL,
      date_text: 'सक्रिय',
    });

    // Extract stats — mandis, farmers, traders
    const mandiMatch = pageText.match(/([\d,]+)\s*(?:Mandi|Mandis|mandis)/i);
    const farmerMatch = pageText.match(/([\d.]+)\s*(?:Cr|Crore|Lakh).*?(?:Farmer|farmer|किसान)/i);
    const traderMatch = pageText.match(/([\d.]+)\s*(?:Cr|Crore|Lakh).*?(?:Trader|trader|व्यापारी)/i);

    if (mandiMatch || farmerMatch) {
      const mandis = mandiMatch ? mandiMatch[1] : '1,361';
      const farmers = farmerMatch ? farmerMatch[0].trim() : '1.76 Cr+';
      items.push({
        source_id: 'enam-stats-latest',
        title: `eNAM: ${mandis} मंडियां जुड़ चुकी हैं`,
        description: `राष्ट्रीय कृषि बाजार (eNAM) पर ${mandis} मंडियां, ${farmers} किसान पंजीकृत। ऑनलाइन बोली लगाएं, बेहतर दाम पाएं।`,
        source: SOURCE,
        source_url: URL,
        category: 'आँकड़े',
        icon: '📈',
        color: '#BF360C',
        link: URL,
        date_text: 'ताज़ा',
      });
    }

    // Extract any news/updates links
    $('a[href*="notification"], a[href*="circular"], a[href*="news"]').each((_, el) => {
      const text = $(el).text().trim();
      const href = $(el).attr('href') || '';
      if (text.length > 10) {
        items.push({
          source_id: `enam-notice-${Buffer.from(text.slice(0, 40)).toString('base64').slice(0, 20)}`,
          title: text.length > 80 ? text.slice(0, 80) + '...' : text,
          description: `eNAM सूचना: ${text}`,
          source: SOURCE,
          source_url: URL,
          category: 'सूचना',
          icon: '📢',
          color: '#E65100',
          link: href.startsWith('http') ? href : `${URL}${href}`,
          date_text: new Date().toLocaleDateString('hi-IN'),
        });
      }
    });

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO news_items (source_id, title, description, source, source_url, category, icon, color, link, date_text, scraped_at)
      VALUES (@source_id, @title, @description, @source, @source_url, @category, @icon, @color, @link, @date_text, CURRENT_TIMESTAMP)
    `);

    let count = 0;
    for (const item of items) {
      try { stmt.run(item); count++; } catch (e) { /* skip */ }
    }

    console.log(`[Scraper] eNAM: Inserted/updated ${count} items`);
    return count;
  } catch (err) {
    console.error('[Scraper] eNAM: Failed —', err.message);
    return 0;
  }
}

module.exports = { scrapeENAM };
