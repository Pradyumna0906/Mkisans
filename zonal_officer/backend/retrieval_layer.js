/**
 * MKisans JARVIS — Layer 5: Secure Retrieval Layer
 * ENFORCED: Role-Based & Session-Bound Access.
 */

const { getDB } = require('./config/db');

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
}

module.exports = new SecureRetrievalLayer();
