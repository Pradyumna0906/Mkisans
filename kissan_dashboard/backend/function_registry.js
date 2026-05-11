/**
 * MKisans JARVIS — Layer 3 & 5: Function Implementation
 * Uses the Retrieval Layer for real-time app data.
 */

const retriever = require('./retrieval_layer');

class ProductionFunctionRegistry {
  async getOrders(userId) {
    const result = await retriever.getLiveOrders(userId);
    if (!result.success || result.data.length === 0) return "अभी आपके पास कोई नया ऑर्डर नहीं है।";
    
    const latest = result.data[0];
    return `आपका ताज़ा ऑर्डर ${latest.buyer_name} से है, ${latest.commodity} के लिए। इसका स्टेटस '${latest.status}' है।`;
  }

  async getMandiPrices(commodity) {
    if (!commodity) return "कृपया फसल का नाम बताएं।";
    const result = await retriever.getMandiPrice(commodity);
    
    if (!result.success || !result.data) return `क्षमा करें, ${commodity} का आज का भाव मेरे पास नहीं है।`;
    
    const d = result.data;
    return `${d.commodity_hindi || d.commodity} का ${d.market} मंडी में भाव ₹${d.modal_price} है। (Source: ${result.source})`;
  }

  async getWeather() {
    const result = await retriever.getLiveWeather();
    if (!result.success) return "मौसम की जानकारी अभी उपलब्ध नहीं है।";
    return `आज आपके क्षेत्र में ${result.data.condition} रहेगा, तापमान ${result.data.temp} डिग्री है।`;
  }

  async getEarnings(userId) {
    // Queries the earnings table via DB
    const result = await retriever.db.prepare('SELECT * FROM kisan_earnings WHERE kisan_id = ?').get(userId);
    if (!result) return "अर्निंग्स डेटा उपलब्ध नहीं है।";
    return `आपकी कुल कमाई ₹${result.total_earned} है।`;
  }

  async getNotifications(userId) {
    const result = await retriever.getLiveNotifications(userId);
    if (!result.success || result.data.length === 0) return "कोई नया नोटिफिकेशन नहीं है।";
    return `नया अपडेट: ${result.data[0].title}।`;
  }

  async openCropListing() {
    return { text: "फसल लिस्टिंग स्क्रीन खोल रहा हूँ...", route: 'MyCrops' };
  }
}

module.exports = new ProductionFunctionRegistry();
