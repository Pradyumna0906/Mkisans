const axios = require('axios');

async function showProof() {
  console.log('--- VERIFYING DATA SOURCE: DATA.GOV.IN ---');
  const url = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
  const apiKey = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
  
  try {
    const res = await axios.get(url, {
      params: {
        'api-key': apiKey,
        format: 'json',
        limit: 3,
        'filters[state]': 'Madhya Pradesh'
      }
    });

    console.log('--- RAW GOVERNMENT RESPONSE (FIRST 3 RECORDS) ---');
    console.log(JSON.stringify(res.data.records, null, 2));
    console.log('\n--- SOURCE VERIFIED: Ministry of Agriculture & Farmers Welfare ---');
    process.exit(0);
  } catch (err) {
    console.error('VERIFICATION FAILED:', err.message);
    process.exit(1);
  }
}

showProof();
