const express = require('express');
const router = express.Router();
const jarvisProcessor = require('../knowledge_processor');
const { authenticateToken } = require('../middleware/auth'); // Assuming this exists

// Diagnostic Ping Route
router.get('/ping', (req, res) => {
  res.json({ status: 'JARVIS is online', time: new Date().toISOString() });
});

/**
 * Main JARVIS Query Endpoint (SECURE)
 */
router.post('/query', authenticateToken, async (req, res) => {
  console.log(`[JARVIS-REQUEST] User: ${req.user.id}, Query: "${req.body.query}"`);
  
  try {
    const { query, userContext = {} } = req.body;
    
    const secureContext = {
      ...userContext,
      userId: req.user.id,
      role: req.user.role
    };

    const response = await jarvisProcessor.processRequest(query, secureContext);
    console.log(`[JARVIS-RESPONSE] Success for "${query}"`);
    res.json(response);
  } catch (err) {
    console.error('[JARVIS-PROCESSOR-ERROR]:', err.message);
    // Return a structured error so the frontend knows what happened
    res.status(200).json({ 
      text: "क्षमा करें, मैं अभी जानकारी प्राप्त नहीं कर पा रहा हूँ, लेकिन आपके प्रश्न पर काम कर रहा हूँ।",
      error: err.message 
    });
  }
});

module.exports = router;
