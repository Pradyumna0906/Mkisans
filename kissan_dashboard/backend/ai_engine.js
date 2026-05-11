require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const axios = require('axios');

/**
 * MKisans AI Engine — Groq LPU Integration
 * Handles natural language understanding and responses.
 */
class GroqAIEngine {
  constructor() {
    this.apiKey = process.env.GROQ_API_KEY;
    this.apiUrl = 'https://api.groq.com/openai/v1/chat/completions';
    this.model = 'llama-3.3-70b-versatile';
  }

  async generateResponse(query, context = {}) {
    if (!this.apiKey) {
      console.error('[GroqAI] Error: API Key missing');
      return { text: "माफ़ कीजिये, मैं अभी कनेक्ट नहीं हो पा रहा हूँ।" };
    }

    try {
      console.log(`[GroqAI] Querying Llama-3 for: "${query}"`);
      
      const systemPrompt = `
        You are JARVIS, an advanced AI assistant for MKisans, a government-backed agricultural platform in India.
        Role: Help farmers with crop prices, weather, schemes, and app navigation.
        Language: Respond primarily in HINDI (Devanagari script) with an empathetic and professional tone.
        Context: The user is a ${context.role || 'farmer'} named ${context.name || 'Kisan'}.
        App Features: Mandi Rates, Social Feed, Logistics Booking, My Crops, Government News.
        Instructions: Keep responses concise and helpful. If they ask about mandi prices, tell them you can check for wheat (gehu), tomato (tamatar), etc.
      `;

      const response = await axios.post(
        this.apiUrl,
        {
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ],
          temperature: 0.7,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiText = response.data.choices[0].message.content;
      return { text: aiText, source: 'Groq-LPU' };
    } catch (err) {
      console.error('[GroqAI] API Error:', err.response?.data || err.message);
      throw err;
    }
  }
}

module.exports = new GroqAIEngine();
