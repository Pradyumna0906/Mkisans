const axios = require('axios');
async function test() {
  try {
    const res = await axios.get('http://localhost:5000/api/jarvis/ping');
    console.log("PING:", res.data);
  } catch (err) {
    console.error("PING ERROR:", err.message);
  }
}
test();
