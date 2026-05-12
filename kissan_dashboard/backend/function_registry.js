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
    const result = await retriever.getWallet(userId);
    if (!result.success || !result.data) return "अर्निंग्स डेटा उपलब्ध नहीं है।";
    return `आपकी कुल कमाई (वॉलेट बैलेंस) ₹${result.data.balance} है।`;
  }

  async getRecentTransactions(userId) {
    const result = await retriever.getWalletTransactions(userId);
    if (!result.success || result.data.length === 0) return "अभी कोई नया लेन-देन नहीं हुआ है।";
    
    const last = result.data[0];
    const type = last.type === 'credit' ? 'जमा' : 'निकाली';
    return `आपका आखिरी लेन-देन ₹${last.amount} का है, जो '${last.description}' के लिए ${type} किया गया था।`;
  }

  async getNotifications(userId) {
    const result = await retriever.getLiveNotifications(userId);
    if (!result.success || result.data.length === 0) return "कोई नया नोटिफिकेशन नहीं है।";
    return `नया अपडेट: ${result.data[0].title}।`;
  }

  async openCropListing() {
    return { text: "फसल लिस्टिंग स्क्रीन खोल रहा हूँ...", route: 'MyCrops' };
  }

  async listCropForSale(userId, params) {
    const { commodity, quantity = "कुछ", price } = params;
    
    try {
      // Actually Automate the Task!
      const caption = `Selling ${quantity} of ${commodity}${price ? ` at ₹${price}` : ''}`;
      // In a real scenario we'd upload a placeholder image, but here we just set a default media url
      retriever.db.prepare(`
        INSERT INTO posts (kisan_id, caption, media_url, media_type)
        VALUES (?, ?, ?, 'image')
      `).run(userId, caption, 'assets/crop_placeholder.jpg');
      
      const priceStr = price ? ` ₹${price} के भाव पर ` : " ";
      return JSON.stringify({
        text: `मैंने आपकी ${commodity} (${quantity}) को${priceStr}बिक्री के लिए सफलतापूर्वक लिस्ट कर दिया है। 'My Crops' स्क्रीन पर आपका स्वागत है।`,
        route: '/my-crops'
      });
    } catch (e) {
      return JSON.stringify({ text: "फसल जोड़ने में तकनीकी त्रुटि आई।", route: null });
    }
  }

  async draftMessageToManager(userId, params) {
    const { message } = params;
    
    try {
      // Create support table if not exists just to be safe
      retriever.db.exec(`
        CREATE TABLE IF NOT EXISTS support_messages (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          kisan_id INTEGER NOT NULL,
          message TEXT NOT NULL,
          status TEXT DEFAULT 'sent',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      retriever.db.prepare(`
        INSERT INTO support_messages (kisan_id, message) VALUES (?, ?)
      `).run(userId, message);
      
      return JSON.stringify({
        text: `आपका संदेश जोनल मैनेजर को सफलतापूर्वक भेज दिया गया है। संदेश था: "${message}"।`,
        route: '/support'
      });
    } catch (e) {
      return JSON.stringify({ text: "संदेश भेजने में त्रुटि आई।", route: null });
    }
  }

  async updateProfile(userId, data) {
    const result = await retriever.updateProfile(userId, data);
    if (!result.success) return `प्रोफ़ाइल अपडेट करने में समस्या आई: ${result.error}`;
    
    return JSON.stringify({
      text: `आपकी प्रोफ़ाइल में ${Object.keys(data).join(', ')} को सफलतापूर्वक अपडेट कर दिया गया है। आप प्रोफ़ाइल स्क्रीन पर इसे देख सकते हैं।`,
      route: '/settings'
    });
  }

  async getProfile(userId) {
    const result = await retriever.getProfile(userId);
    if (!result.success) return "मुझे आपकी प्रोफ़ाइल जानकारी नहीं मिल पाई।";
    
    const p = result.data;
    const missing = [];
    if (!p.full_name) missing.push("नाम");
    if (!p.email) missing.push("ईमेल");
    if (!p.state) missing.push("राज्य");
    if (!p.district) missing.push("जिला");
    if (!p.village) missing.push("गांव");
    if (!p.address) missing.push("पता");
    
    let text = `आपकी प्रोफ़ाइल: नाम: ${p.full_name || 'उपलब्ध नहीं'}, गांव: ${p.village || 'उपलब्ध नहीं'}, जिला: ${p.district || 'उपलब्ध नहीं'}।`;
    if (missing.length > 0) {
      text += ` आपकी कुछ जानकारी अधूरी है: ${missing.join(', ')}। क्या आप इन्हें अभी अपडेट करना चाहेंगे?`;
    }
    return text;
  }
}

module.exports = new ProductionFunctionRegistry();
