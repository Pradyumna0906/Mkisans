const axios = require('axios');

async function test() {
  console.log('--- TESTING API: /api/mandi-prices ---');
  try {
    const res = await axios.get('http://localhost:5000/api/mandi-prices', {
      params: { state: 'Madhya Pradesh', limit: 10 }
    });
    console.log('SUCCESS:', res.data.success);
    console.log('COUNT:', res.data.count);
    if (res.data.data.length > 0) {
      console.log('LATEST ITEM:', res.data.data[0]);
    } else {
      console.log('DATA ARRAY IS EMPTY');
    }
    process.exit(0);
  } catch (err) {
    console.error('API ERROR:', err.message);
    process.exit(1);
  }
}

test();
