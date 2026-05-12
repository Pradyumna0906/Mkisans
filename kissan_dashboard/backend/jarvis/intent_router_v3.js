/**
 * MKisans JARVIS — Layer 2: Advanced Intent Router v3.0
 * Multi-language intent classification with entity extraction.
 * Supports: Hindi, Hinglish, English
 * Strict scope firewall — agriculture & app operations only.
 */

const INTENTS = {
  TUTORIAL_START: 'TUTORIAL_START',
  TUTORIAL_NEXT: 'TUTORIAL_NEXT',
  TUTORIAL_PREV: 'TUTORIAL_PREV',
  TUTORIAL_REPEAT: 'TUTORIAL_REPEAT',
  TUTORIAL_EXAMPLE: 'TUTORIAL_EXAMPLE',
  TUTORIAL_OPEN: 'TUTORIAL_OPEN',
  MARKET_PRICE: 'MARKET_PRICE',
  ORDER_STATUS: 'ORDER_STATUS',
  ORDER_COUNT: 'ORDER_COUNT',
  WEATHER_INFO: 'WEATHER_INFO',
  LOGISTICS_CALC: 'LOGISTICS_CALC',
  LOGISTICS_BOOK: 'LOGISTICS_BOOK',
  CROP_LISTING: 'CROP_LISTING',
  CROP_ADD: 'CROP_ADD',
  CROP_UPDATE: 'CROP_UPDATE',
  EARNINGS_CHECK: 'EARNINGS_CHECK',
  PAYMENT_STATUS: 'PAYMENT_STATUS',
  NOTIFICATION_CHECK: 'NOTIFICATION_CHECK',
  NAVIGATE: 'NAVIGATE',
  FAQ_SUPPORT: 'FAQ_SUPPORT',
  GREETING: 'GREETING',
  IDENTITY: 'IDENTITY',
  OUT_OF_SCOPE: 'OUT_OF_SCOPE',
  UNKNOWN: 'UNKNOWN'
};

// Blacklisted topics — politely refused
const BLACKLIST_PATTERNS = [
  /\b(ipl|cricket|football|sports?|khel|match|score)\b/i,
  /\b(movie|film|actor|actress|song|gana|entertainment|bollywood|hollywood)\b/i,
  /\b(politics|election|modi|rahul|party|neta|vote|bjp|congress)\b/i,
  /\b(joke|chutkula|story\b(?!.*order)|kahani)\b/i,
  /\b(betting|gambling|satta|lottery)\b/i,
  /\b(who won|winner|kaun jeeta|general knowledge)\b/i,
  /\b(recipe|cooking|khana banana)\b/i,
];

// Intent patterns — ordered by priority (Hindi + Hinglish + English)
const INTENT_PATTERNS = [
  // Tutorial Controls
  { intent: INTENTS.TUTORIAL_START, patterns: [/tutorial|walkthrough|सिखा|sikha|app\s*tour|ऐप\s*टूर|batao.*features|सभी\s*सुविधा|onboarding/i], confidence: 0.95 },
  { intent: INTENTS.TUTORIAL_NEXT, patterns: [/\b(agla|agle|अगला|next|aage|आगे)\b/i], confidence: 0.95 },
  { intent: INTENTS.TUTORIAL_PREV, patterns: [/\b(pichla|पीछे|previous|back|peechhe|पिछला)\b/i], confidence: 0.95 },
  { intent: INTENTS.TUTORIAL_REPEAT, patterns: [/\b(dobara|दोबारा|repeat|phir\s*se|फिर\s*से|samajh\s*nahi|समझ\s*नहीं)\b/i], confidence: 0.95 },
  { intent: INTENTS.TUTORIAL_EXAMPLE, patterns: [/\b(udaharan|उदाहरण|example|demo\s*do)\b/i], confidence: 0.9 },

  // Market Intelligence
  { intent: INTENTS.MARKET_PRICE, patterns: [
    /bhav|भाव|rate|reet|रेट|price|daam|दाम|mandi|मंडी|mehnga|सस्ता|sasta|महंग|demand|maang|मांग|bik\s*raha|बिक\s*रहा/i
  ], confidence: 0.92 },

  // Order Management
  { intent: INTENTS.ORDER_COUNT, patterns: [/kitne\s*order|कितने\s*ऑर्डर|order\s*count|total\s*order/i], confidence: 0.93 },
  { intent: INTENTS.ORDER_STATUS, patterns: [
    /order|ऑर्डर|pending|delivered|deliver|rejected|cancel|acceptance|new\s*order|naya\s*order|नया\s*ऑर्डर|aaya|आया/i
  ], confidence: 0.9 },

  // Weather
  { intent: INTENTS.WEATHER_INFO, patterns: [
    /mausam|मौसम|weather|barish|बारिश|rain|taapmaan|तापमान|temperature|garmi|गर्मी|thand|ठंड|heat|cold|forecast|dhoop|धूप/i
  ], confidence: 0.92 },

  // Logistics
  { intent: INTENTS.LOGISTICS_BOOK, patterns: [/pickup\s*book|पिकअप\s*बुक|book\s*karo|बुक\s*करो|gadi\s*manga|गाड़ी\s*मंगा/i], confidence: 0.93 },
  { intent: INTENTS.LOGISTICS_CALC, patterns: [
    /delivery\s*ka\s*kharch|डिलीवरी.*खर्च|freight|logistics|transport|vehicle|vahan|वाहन|najdiki|नजदीकी|delivery\s*kab/i
  ], confidence: 0.9 },

  // Crop / Inventory
  { intent: INTENTS.CROP_ADD, patterns: [/nayi?\s*fasal\s*jod|नई\s*फसल\s*जोड़|add\s*crop|new\s*listing/i], confidence: 0.93 },
  { intent: INTENTS.CROP_UPDATE, patterns: [/matra\s*update|मात्रा\s*अपडेट|update\s*quantity|update\s*inventory/i], confidence: 0.92 },
  { intent: INTENTS.CROP_LISTING, patterns: [
    /listing|लिस्टिंग|listed|fasal|फसल|crop|inventory|kitni\s*fasal|कितनी\s*फसल/i
  ], confidence: 0.88 },

  // Earnings / Payments
  { intent: INTENTS.EARNINGS_CHECK, patterns: [/kamai|कमाई|earning|revenue|income|report|रिपोर्ट/i], confidence: 0.9 },
  { intent: INTENTS.PAYMENT_STATUS, patterns: [/payment|पेमेंट|paisa|पैसा|settlement|withdrawal|aaya\s*kya/i], confidence: 0.9 },

  // Notifications
  { intent: INTENTS.NOTIFICATION_CHECK, patterns: [
    /notification|नोटिफिकेशन|update|अपडेट|alert|urgent|message|msg|sandesh|संदेश|kharidaar|खरीदार/i
  ], confidence: 0.88 },

  // Navigation
  { intent: INTENTS.NAVIGATE, patterns: [
    /kholo|खोलो|open|dikhao|दिखाओ|le\s*chalo|ले\s*चलो|navigate|show\s*me|go\s*to|take\s*me/i
  ], confidence: 0.9 },

  // FAQ / Help
  { intent: INTENTS.FAQ_SUPPORT, patterns: [
    /kaise|कैसे|how\s*to|kyon|क्यों|why|help|madad|मदद|problem|samasya|समस्या|complaint|shikayat|शिकायत/i
  ], confidence: 0.85 },

  // Greeting
  { intent: INTENTS.GREETING, patterns: [/\b(namaste|नमस्ते|hello|hi\b|hey|jarvis|जार्विस|suprabhat|good\s*morning)\b/i], confidence: 0.8 },

  // Identity
  { intent: INTENTS.IDENTITY, patterns: [/\b(kaun\s*ho|कौन\s*हो|who\s*are|tumhara\s*naam|तुम्हारा\s*नाम|your\s*name)\b/i], confidence: 0.85 },
];

// Entity extraction patterns
const ENTITY_EXTRACTORS = {
  crop: /\b(gehu|गेहूं|wheat|chana|चना|gram|soyabean|सोयाबीन|tamatar|टमाटर|tomato|pyaz|प्याज|onion|lahsun|लहसुन|garlic|dhan|धान|rice|makka|मक्का|corn|sarson|सरसों|mustard|aaloo|आलू|potato|mirch|मिर्च|chilli)\b/i,
  city: /\b(bhopal|भोपाल|indore|इंदौर|ujjain|उज्जैन|jabalpur|जबलपुर|gwalior|ग्वालियर|sagar|सागर|dewas|देवास|rewa|रीवा|satna|सतना|hoshangabad|होशंगाबाद)\b/i,
  status: /\b(pending|पेंडिंग|delivered|complete|reject|cancel|active|new|naya|नया)\b/i,
  timeframe: /\b(aaj|आज|today|kal|कल|tomorrow|yesterday|pichhle|पिछले|last|is\s*mahine|इस\s*महीने|this\s*month|is\s*hafte|इस\s*हफ्ते|this\s*week)\b/i,
};

class AdvancedIntentRouter {
  classify(query) {
    const q = query.toLowerCase().trim();

    // 1. Scope Firewall — Block off-topic queries
    for (const pattern of BLACKLIST_PATTERNS) {
      if (pattern.test(q)) {
        return {
          intent: INTENTS.OUT_OF_SCOPE,
          confidence: 1.0,
          entities: {},
          blocked: true
        };
      }
    }

    // 2. Intent Classification — first match with highest confidence
    let bestMatch = { intent: INTENTS.UNKNOWN, confidence: 0, entities: {} };

    for (const rule of INTENT_PATTERNS) {
      for (const pattern of rule.patterns) {
        if (pattern.test(q)) {
          if (rule.confidence > bestMatch.confidence) {
            bestMatch = {
              intent: rule.intent,
              confidence: rule.confidence,
              entities: this.extractEntities(q)
            };
          }
          break;
        }
      }
    }

    // 3. If nothing matched and query is very short, treat as greeting
    if (bestMatch.intent === INTENTS.UNKNOWN && q.length <= 10) {
      bestMatch.intent = INTENTS.GREETING;
      bestMatch.confidence = 0.6;
    }

    return bestMatch;
  }

  extractEntities(query) {
    const entities = {};
    for (const [type, pattern] of Object.entries(ENTITY_EXTRACTORS)) {
      const match = query.match(pattern);
      if (match) {
        entities[type] = match[1].toLowerCase();
      }
    }
    return entities;
  }

  isInScope(query) {
    const result = this.classify(query);
    return result.intent !== INTENTS.OUT_OF_SCOPE;
  }
}

module.exports = { IntentRouter: new AdvancedIntentRouter(), INTENTS };
