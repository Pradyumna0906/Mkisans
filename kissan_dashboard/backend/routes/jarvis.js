const express = require('express');
const router = express.Router();
const aiEngine = require('../ai_engine');
const { authenticateToken } = require('../middleware/auth');
const { MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts');

// Diagnostic Ping Route
router.get('/ping', (req, res) => {
  res.json({
    status: 'JARVIS is online',
    time: new Date().toISOString(),
    engine: 'Groq-LPU',
    model: 'llama-3.3-70b-versatile',
  });
});

/**
 * Main JARVIS Chat Endpoint
 * POST /api/jarvis/chat
 * Body: { query, history: [...], userContext: {} }
 */
router.post('/chat', authenticateToken, async (req, res) => {
  const startTime = Date.now();
  const { query, history = [], userContext = {} } = req.body;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({
      text: "Please provide a valid question.",
      error: 'EMPTY_QUERY'
    });
  }

  const trimmedQuery = query.trim();

  console.log(`[JARVIS] User: ${req.user?.id || 'unknown'}, Query: "${trimmedQuery.substring(0, 80)}"`);

  try {
    const context = {
      ...userContext,
      userId: req.user?.id,
      role: req.user?.role || 'officer',
      name: userContext.name || 'User',
    };

    const response = await aiEngine.generateResponse(trimmedQuery, context, history);
    const elapsed = Date.now() - startTime;

    console.log(`[JARVIS] Response in ${elapsed}ms | Source: ${response.source || 'unknown'}`);

    res.json({
      text: response.text,
      source: response.source,
      model: response.model,
      route: response.route || null,
      responseTime: elapsed,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[JARVIS] Unhandled Error:', err.message);
    res.status(200).json({
      text: "I'm having trouble processing your request right now. Please try again.",
      error: err.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * Legacy query endpoint (backwards compatibility)
 */
router.post('/query', authenticateToken, async (req, res) => {
  const { query, userContext = {} } = req.body;

  if (!query) {
    return res.status(400).json({ text: 'No query provided.' });
  }

  try {
    const context = {
      ...userContext,
      userId: req.user?.id,
      role: req.user?.role || 'officer',
    };

    const response = await aiEngine.generateResponse(query, context);
    res.json(response);
  } catch (err) {
    console.error('[JARVIS-LEGACY] Error:', err.message);
    res.status(200).json({
      text: "I'm experiencing issues. Please try again shortly.",
      error: err.message,
    });
  }
});

/**
 * Quick suggestions endpoint
 * GET /api/jarvis/suggestions
 */
router.get('/suggestions', (req, res) => {
  res.json({
    suggestions: [
      { id: 1, text: "How do I check mandi prices?", icon: "📊", category: "tutorial" },
      { id: 2, text: "Show me today's weather advisory", icon: "🌤️", category: "info" },
      { id: 3, text: "How to add a new farmer?", icon: "👨‍🌾", category: "tutorial" },
      { id: 4, text: "What are the latest critical alerts?", icon: "🚨", category: "info" },
      { id: 5, text: "Guide me through logistics booking", icon: "🚛", category: "tutorial" },
      { id: 6, text: "How does the social feed work?", icon: "📱", category: "tutorial" },
      { id: 7, text: "Show trade analytics overview", icon: "📈", category: "navigation" },
      { id: 8, text: "Help me verify a delivery partner", icon: "✅", category: "tutorial" },
    ]
  });
});

/**
 * Text-to-Speech Endpoint using Edge TTS (Prabhat Voice)
 * POST /api/jarvis/tts
 * Body: { text }
 */
router.post('/tts', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).send('Text is required');

  try {
    const tts = new MsEdgeTTS();
    // Using MadhurNeural for crystal clear native Hindi accent (Prabhat was deprecated for native Hindi)
    await tts.setMetadata('hi-IN-MadhurNeural', OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);
    
    // Configure pronunciation rate to be slightly heavy and deliberate
    const ssml = `<speak version='1.0' xml:lang='hi-IN'><voice name='hi-IN-MadhurNeural'><prosody rate='-5%' pitch='-10%'>${text}</prosody></voice></speak>`;
    
    const stream = tts.toStream(ssml);
    
    res.set('Content-Type', 'audio/mpeg');
    stream.pipe(res);
  } catch (err) {
    console.error('[JARVIS-TTS] Error:', err.message);
    res.status(500).send('TTS Generation Failed');
  }
});

module.exports = router;
