const { scrapeMandiPrices } = require('./scrapers/mandiPrices');

async function run() {
  console.log('--- STARTING MANUAL FORCE SYNC ---');
  try {
    const count = await scrapeMandiPrices();
    console.log('--- SYNC SUCCESSFUL ---');
    console.log('RECORDS SYNCED:', count);
    process.exit(0);
  } catch (err) {
    console.error('--- SYNC FAILED ---');
    console.error(err.message);
    process.exit(1);
  }
}

run();
