/**
 * MKisans JARVIS — Emotional Tone & Persona Layer
 * Personalized greetings and context-aware empathy.
 */

const intentRouter = require('./intent_router');
const functions = require('./function_registry');
const proactive = require('./proactive_service');
const { getDB } = require('./config/db');

class PersonalizedJarvisAgent {
  constructor() {
    this.db = getDB();
  }

  async handle(query, context = {}) {
    const { intent } = intentRouter.classify(query);
    const userId = context.userId || 1;
    
    // 1. Fetch Farmer Name for Personalization
    const user = this.db.prepare('SELECT full_name FROM kisans WHERE id = ?').get(userId);
    const name = user ? user.full_name.split(' ')[0] : 'किसान भाई';

    // 2. Check for Proactive Alerts FIRST
    const alerts = await proactive.checkAlerts(userId);
    let alertPrefix = "";
    if (alerts.length > 0 && query.includes('jarvis')) {
       alertPrefix = `${alerts[0].text} वैसे, `;
    }

    console.log(`[JARVIS-PERSONA] Greeting: ${name} | Tone: ${intent}`);

    // 3. Command Execution Mapping
    if (query.includes('jodo') || query.includes('add')) {
       return { text: `नमस्ते ${name}! मैं नई फसल जोड़ने की स्क्रीन खोल रहा हूँ।`, route: 'MyCrops', tone: 'helpful' };
    }
    if (query.includes('mandi') && (query.includes('kholo') || query.includes('dikhao'))) {
       return { text: `जी ${name}, मंडी भाव की ताज़ा जानकारी हाज़िर है।`, route: 'MandiRates', tone: 'professional' };
    }

    // 4. Handle Standard Intents with Personalization
    switch (intent) {
      case 'MARKET_PRICE':
        const res = await functions.getMandiPrices(this.extractCrop(query));
        return { text: `${alertPrefix} ${name}, ${res}`, tone: 'informative' };
      case 'ORDER_STATUS':
        const orderRes = await functions.getOrders(userId);
        const tone = orderRes.includes('koi nahi') ? 'empathetic' : 'excited';
        return { text: `${name}, ${orderRes}`, tone };
      default:
        return { text: `नमस्ते ${name}! मैं आपकी कैसे मदद कर सकता हूँ?`, tone: 'warm' };
    }
  }

  extractCrop(q) {
    const crops = ['gehu', 'chana', 'tamatar'];
    return crops.find(c => q.includes(c)) || null;
  }
}

const agent = new PersonalizedJarvisAgent();
module.exports = {
  processRequest: async (q, ctx) => agent.handle(q, ctx)
};
