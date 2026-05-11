const engine = require('../ai_engine');

async function test() {
  console.log("Testing Groq AI Engine...");
  try {
    const res = await engine.generateResponse("नमस्ते, आप कैसे हैं?", { name: "Test User", role: "farmer" });
    console.log("Response:", res);
  } catch (err) {
    console.error("Test Failed:", err.message);
    if (err.response) {
      console.error("Status:", err.response.status);
      console.error("Data:", JSON.stringify(err.response.data, null, 2));
    }
  }
}

test();
