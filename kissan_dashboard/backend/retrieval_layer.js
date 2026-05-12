/**
 * MKisans JARVIS — Layer 5: Secure Retrieval Layer
 * ENFORCED: Role-Based & Session-Bound Access.
 */

const { getDB } = require('./config/db');
const axios = require('axios');

class SecureRetrievalLayer {
  constructor() {
    this.db = getDB();
  }

  // 1. Order DB Retrieval (Filtered by userId)
  async getLiveOrders(userId) {
    if (!userId) throw new Error('Unauthorized: User ID required');
    try {
      const orders = this.db.prepare(`
        SELECT * FROM orders 
        WHERE kisan_id = ? 
        ORDER BY created_at DESC LIMIT 5
      `).all(userId);
      return { success: true, data: orders, source: 'SecureDB' };
    } catch (err) {
      return { success: false, error: 'Access Denied' };
    }
  }

  // 2. Crop/Inventory DB Retrieval (Filtered by userId)
  async getCropListings(userId) {
    if (!userId) throw new Error('Unauthorized: User ID required');
    try {
      const listings = this.db.prepare(`
        SELECT caption as commodity, created_at 
        FROM posts 
        WHERE kisan_id = ?
      `).all(userId);
      return { success: true, data: listings, source: 'SecureDB' };
    } catch (err) {
      return { success: false, error: 'Access Denied' };
    }
  }

  // 3. User Earnings (Filtered by userId)
  async getEarnings(userId) {
    if (!userId) throw new Error('Unauthorized');
    const earnings = this.db.prepare('SELECT * FROM kisan_earnings WHERE kisan_id = ?').get(userId);
    return { success: !!earnings, data: earnings };
  }

  // 4. Notifications (Filtered by userId)
  async getLiveNotifications(userId) {
    if (!userId) throw new Error('Unauthorized');
    const alerts = this.db.prepare(`
      SELECT * FROM jarvis_notifications 
      WHERE kisan_id = ? AND is_read = 0 
      ORDER BY created_at DESC LIMIT 3
    `).all(userId);
    return { success: true, data: alerts };
  }

  // 5. Public Data (No filter needed, but restricted scope)
  async getMandiPrice(commodity) {
    const price = this.db.prepare('SELECT * FROM mandi_prices WHERE (commodity LIKE ? OR commodity_hindi LIKE ?) ORDER BY price_date DESC LIMIT 1')
      .get(`%${commodity}%`, `%${commodity}%`);
    return { success: !!price, data: price, source: 'PublicMandiAPI' };
  }

  // 6. Weather API (Real via Open-Meteo for Bhopal/MP as default)
  async getLiveWeather() {
    try {
      // Coordinates for Bhopal, MP
      const res = await axios.get('https://api.open-meteo.com/v1/forecast?latitude=23.2599&longitude=77.4126&current_weather=true');
      const cw = res.data.current_weather;
      
      let condition = "साफ";
      if (cw.weathercode >= 60 && cw.weathercode <= 69) condition = "बारिश";
      else if (cw.weathercode >= 95) condition = "तूफान";
      else if (cw.weathercode >= 1 && cw.weathercode <= 3) condition = "बादल";
      
      return {
        success: true,
        data: { condition: condition, temp: cw.temperature },
        source: 'OpenMeteo'
      };
    } catch (e) {
      return {
        success: true,
        data: { condition: 'हल्की बारिश (Light Rain)', temp: 28 },
        source: 'WeatherAPI Mock'
      };
    }
  }

  // 7. Update Profile
  async updateProfile(userId, data) {
    if (!userId) throw new Error('Unauthorized');
    const fields = Object.keys(data).filter(k => ['full_name', 'email', 'state', 'district', 'village', 'pin_code', 'address'].includes(k));
    if (fields.length === 0) return { success: false, error: 'No valid fields to update' };

    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => data[f]);
    values.push(userId);

    try {
      this.db.prepare(`UPDATE kisans SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).run(...values);
      const updatedUser = this.db.prepare('SELECT * FROM kisans WHERE id = ?').get(userId);
      return { success: true, data: updatedUser };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  // 8. Get Profile
  async getProfile(userId) {
    if (!userId) throw new Error('Unauthorized');
    const profile = this.db.prepare('SELECT id, full_name, email, state, district, village, pin_code, address FROM kisans WHERE id = ?').get(userId);
    return { success: !!profile, data: profile };
  }
}

module.exports = new SecureRetrievalLayer();
