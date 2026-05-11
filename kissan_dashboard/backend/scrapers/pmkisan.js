const axios = require('axios');
const cheerio = require('cheerio');
const { getDB } = require('../config/db');

const SOURCE = 'pmkisan.gov.in';
const URL = 'https://pmkisan.gov.in';

async function scrapePMKisan() {
  console.log('[Scraper] PM-KISAN: Starting...');
  const db = getDB();

  try {
    const { data: html } = await axios.get(URL, { timeout: 15000 });
    const $ = cheerio.load(html);

    const items = [];

    // Extract marquee / notice board text
    $('marquee, .marqueeStyle, .scrolling-text, .ticker-text, .blink, .notice-board').each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 20) {
        items.push({
          source_id: `pmkisan-notice-${Buffer.from(text.slice(0, 50)).toString('base64').slice(0, 20)}`,
          title: text.length > 100 ? text.slice(0, 100) + '...' : text,
          description: text,
          source: SOURCE,
          source_url: URL,
          category: 'सूचना',
          icon: '🏛️',
          color: '#138808',
          link: URL,
          date_text: new Date().toLocaleDateString('hi-IN'),
        });
      }
    });

    // Extract key scheme facts from the page
    const pageText = $('body').text();

    // 22nd installment info
    const installmentMatch = pageText.match(/(\d+)(?:st|nd|rd|th)\s+installment/i);
    if (installmentMatch) {
      items.push({
        source_id: `pmkisan-installment-${installmentMatch[1]}`,
        title: `PM-KISAN: ${installmentMatch[1]}वीं किस्त जारी`,
        description: `माननीय प्रधानमंत्री ने PM-KISAN की ${installmentMatch[1]}वीं किस्त जारी की। ₹6,000/वर्ष सीधे बैंक खाते में तीन किस्तों में।`,
        source: SOURCE,
        source_url: URL,
        category: 'योजना',
        icon: '💰',
        color: '#138808',
        link: URL,
        date_text: 'ताज़ा',
      });
    }

    // eKYC notice
    if (pageText.includes('eKYC') || pageText.includes('EKYC')) {
      items.push({
        source_id: 'pmkisan-ekyc-mandatory',
        title: 'PM-KISAN: eKYC अनिवार्य',
        description: 'सभी PM-KISAN लाभार्थियों के लिए eKYC अनिवार्य है। OTP आधारित eKYC PMKISAN पोर्टल पर या नजदीकी CSC केंद्र पर बायोमेट्रिक eKYC करवाएं।',
        source: SOURCE,
        source_url: URL,
        category: 'सूचना',
        icon: '📋',
        color: '#FF9933',
        link: 'https://pmkisan.gov.in/KnowAboutEKYC.aspx',
        date_text: 'सक्रिय',
      });
    }

    // KCC campaign
    if (pageText.includes('KCC') || pageText.includes('Kisan Credit Card')) {
      items.push({
        source_id: 'pmkisan-kcc-campaign',
        title: 'किसान क्रेडिट कार्ड (KCC) अभियान',
        description: 'सभी PM-KISAN लाभार्थियों को किसान क्रेडिट कार्ड (KCC) दिलाने का अभियान। KCC फॉर्म pmkisan.gov.in से डाउनलोड करें।',
        source: SOURCE,
        source_url: URL,
        category: 'अभियान',
        icon: '💳',
        color: '#1565C0',
        link: 'https://pmkisan.gov.in/Documents/Kcc.pdf',
        date_text: 'सक्रिय',
      });
    }

    // PM-KMY (Kisan Maandhan Yojana)
    if (pageText.includes('PM-KMY') || pageText.includes('Maandhan')) {
      items.push({
        source_id: 'pmkisan-kmy-pension',
        title: 'PM किसान मानधन योजना (PM-KMY)',
        description: 'छोटे और सीमांत किसानों के लिए पेंशन योजना। 60 वर्ष की आयु के बाद ₹3,000 प्रति माह पेंशन। 18-40 वर्ष के किसान आवेदन करें।',
        source: SOURCE,
        source_url: URL,
        category: 'पेंशन',
        icon: '👴',
        color: '#6A1B9A',
        link: 'http://pmkmy.gov.in',
        date_text: 'सक्रिय',
      });
    }

    // Beneficiary stats
    const beneficiaryMatch = pageText.match(/([\d,]+)\s*(?:DEC-MAR|AUG-NOV|APR-JUL)\s*(\d{4}-\d{2})/);
    if (beneficiaryMatch) {
      const count = beneficiaryMatch[1];
      const period = beneficiaryMatch[2];
      items.push({
        source_id: `pmkisan-stats-${period}`,
        title: `PM-KISAN: ${count} किसान लाभान्वित`,
        description: `PM किसान सम्मान निधि — ${count} किसानों को ${period} की अवधि में लाभ दिया गया। ₹6,000 प्रति वर्ष, 3 किस्तों में ₹2,000 सीधे बैंक खाते में।`,
        source: SOURCE,
        source_url: URL,
        category: 'आँकड़े',
        icon: '📊',
        color: '#00695C',
        link: URL,
        date_text: period,
      });
    }

    // Insert into DB
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO news_items (source_id, title, description, source, source_url, category, icon, color, link, date_text, scraped_at)
      VALUES (@source_id, @title, @description, @source, @source_url, @category, @icon, @color, @link, @date_text, CURRENT_TIMESTAMP)
    `);

    let count = 0;
    for (const item of items) {
      try { stmt.run(item); count++; } catch (e) { /* duplicate, skip */ }
    }

    console.log(`[Scraper] PM-KISAN: Inserted/updated ${count} items`);
    return count;
  } catch (err) {
    console.error('[Scraper] PM-KISAN: Failed —', err.message);
    return 0;
  }
}

module.exports = { scrapePMKisan };
