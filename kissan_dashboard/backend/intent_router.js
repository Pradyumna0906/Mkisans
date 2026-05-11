/**
 * MKisans JARVIS — Layer 2: Intent Router (v2.2)
 * CONSTRAINED: Strict Scope Firewall & Topic Filtering.
 */

const INTENTS = {
  TUTORIAL: 'TUTORIAL',
  MARKET_PRICE: 'MARKET_PRICE',
  ORDER_STATUS: 'ORDER_STATUS',
  WEATHER_INFO: 'WEATHER_INFO',
  LOGISTICS_CALC: 'LOGISTICS_CALC',
  ACTION_EXECUTION: 'ACTION_EXECUTION',
  FAQ_SUPPORT: 'FAQ_SUPPORT',
  IDENTITY: 'IDENTITY',
  OUT_OF_SCOPE: 'OUT_OF_SCOPE',
  UNKNOWN: 'UNKNOWN'
};

const BLACKLIST = [
  'ipl', 'cricket', 'football', 'sports', 'khel', 'match', 'score',
  'movie', 'film', 'actor', 'song', 'gana', 'entertainment',
  'politics', 'election', 'modi', 'rahul', 'party', 'neta',
  'joke', 'story', 'kahani', 'weather forecast for goa', // Example of irrelevant location
  'who won', 'winner', 'who is', 'general knowledge'
];

const WHITELIST_KEYWORDS = [
  'fasal', 'kisan', 'mandi', 'bhav', 'rate', 'price', 'order', 'delivery',
  'mausam', 'barish', 'kheti', 'gehu', 'chana', 'soyabean', 'listing',
  'paisa', 'kamai', 'tutorial', 'help', 'app', 'mkisans'
];

class StrictIntentRouter {
  classify(query) {
    const q = query.toLowerCase();

    // 1. Mandatory Scope Check (Firewall)
    const isOutofScope = BLACKLIST.some(k => q.includes(k));
    const isRelevant = WHITELIST_KEYWORDS.some(k => q.includes(k));

    if (isOutofScope || (!isRelevant && q.length > 5)) {
      console.warn(`[JARVIS-FIREWALL] Blocked out-of-scope query: "${q}"`);
      return { intent: INTENTS.OUT_OF_SCOPE, confidence: 1.0 };
    }

    // 2. Normal Classification for Relevant Topics
    // ... (using previous pattern matching logic for Market Price, Orders, etc.)
    if (q.includes('bhav') || q.includes('rate')) return { intent: INTENTS.MARKET_PRICE, confidence: 0.9 };
    if (q.includes('order')) return { intent: INTENTS.ORDER_STATUS, confidence: 0.9 };
    if (q.includes('tutorial') || q.includes('guide')) return { intent: INTENTS.TUTORIAL, confidence: 0.9 };
    if (q.includes('mausam') || q.includes('weather')) return { intent: INTENTS.WEATHER_INFO, confidence: 0.9 };
    if (q.includes('kholo') || q.includes('open')) return { intent: INTENTS.ACTION_EXECUTION, confidence: 0.9 };

    return { intent: INTENTS.IDENTITY, confidence: 0.5 };
  }
}

module.exports = new StrictIntentRouter();
