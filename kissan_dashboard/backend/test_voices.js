const { MsEdgeTTS } = require('msedge-tts');

async function getVoices() {
  const tts = new MsEdgeTTS();
  const voices = await tts.getVoices();
  console.log(voices.filter(v => v.Locale.includes('en-IN')));
}

getVoices().catch(console.error);
