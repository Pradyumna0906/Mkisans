const cron = require('node-cron');
const { scrapePMKisan } = require('../scrapers/pmkisan');
const { scrapePMFBY } = require('../scrapers/pmfby');
const { scrapeENAM } = require('../scrapers/enam');
const { scrapePIB } = require('../scrapers/pib');
const { scrapeMandiPrices } = require('../scrapers/mandiPrices');
const { trainDailyModel } = require('../ml_engine/trainer');

async function runAllScrapers() {
  console.log('\n════════════════════════════════════════');
  console.log('  🌾 MKisans Scraper Cycle Starting...');
  console.log('  ⏰ ' + new Date().toLocaleString('hi-IN'));
  console.log('════════════════════════════════════════\n');

  const results = {};

  results.pmkisan = await scrapePMKisan();
  results.pmfby = await scrapePMFBY();
  results.enam = await scrapeENAM();
  results.pib = await scrapePIB();
  results.mandiPrices = await scrapeMandiPrices();

  const total = Object.values(results).reduce((a, b) => a + b, 0);
  console.log(`\n✅ Scraper cycle complete — ${total} total items processed`);
  console.log('  Breakdown:', JSON.stringify(results));
  console.log('════════════════════════════════════════\n');

  return results;
}

function startScheduler() {
  // Run every 6 hours: at 00:00, 06:00, 12:00, 18:00
  cron.schedule('0 */6 * * *', () => {
    console.log('[Scheduler] Cron triggered — running all scrapers...');
    runAllScrapers();
  });

  // Also run mandi prices more frequently — every 2 hours (prices change fast)
  cron.schedule('0 */2 * * *', () => {
    console.log('[Scheduler] Cron triggered — refreshing mandi prices...');
    scrapeMandiPrices();
  });

  // Train the ML LSTM Model daily at 1:00 AM using historical data
  cron.schedule('0 1 * * *', () => {
    console.log('[Scheduler] Cron triggered — running secret ML LSTM trainer...');
    trainDailyModel();
  });

  console.log('[Scheduler] Cron jobs registered:');
  console.log('  📰 Full scrape:  Every 6 hours (0 */6 * * *)');
  console.log('  📊 Mandi prices: Every 2 hours (0 */2 * * *)');
  console.log('  🧠 ML Trainer:   Every day at 1:00 AM (0 1 * * *)');
}

module.exports = { runAllScrapers, startScheduler };
