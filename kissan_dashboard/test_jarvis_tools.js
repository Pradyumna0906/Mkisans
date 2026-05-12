const engine = require('./backend/ai_engine');

async function test() {
  console.log("Testing Tool Calling...");
  const res = await engine.generateResponse("mere koi naye orders hain kya?", {userId: 1});
  console.log("Result:", res.text);
}

test();
