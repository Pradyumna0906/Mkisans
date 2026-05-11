const axios = require('axios');

async function testAPI() {
    try {
        const url = 'http://localhost:5000/api/mandi-prices?state=Madhya%20Pradesh&market=Bhopal&limit=5';
        console.log(`Fetching from: ${url}`);
        const response = await axios.get(url);
        console.log('Status:', response.status);
        console.log('Success:', response.data.success);
        console.log('Count:', response.data.count);
        if (response.data.data.length > 0) {
            console.log('First Item:', response.data.data[0]);
        }
    } catch (err) {
        console.error('API Test Failed:', err.message);
        if (err.response) {
            console.error('Data:', err.response.data);
        }
    }
}

testAPI();
