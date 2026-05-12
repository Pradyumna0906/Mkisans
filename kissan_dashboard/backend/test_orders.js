const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/jarvis/chat', {
      query: 'मेरे कितने ऑर्डर हैं?',
      userContext: { userId: 1 }
    });
    console.log("SUCCESS:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("ERROR:", err.response ? err.response.data : err.message);
  }
}
test();
