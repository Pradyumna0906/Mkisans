const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

async function test() {
  const tts = new MsEdgeTTS();
  await tts.setMetadata('hi-IN-MadhurNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
  const stream = tts.toStream('नमस्ते, मैं एम किसान का एआई असिस्टेंट हूँ।');
  console.log("Stream created successfully");
}

test().catch(console.error);
