/**
 * MKisans JARVIS — Proactive Intelligence
 * Monitors data in background to trigger spontaneous alerts.
 */

const { getDB } = require('./config/db');

class ProactiveService {
  constructor() {
    this.db = getDB();
  }

  async checkAlerts(userId) {
    const alerts = [];

    // 1. Check for Weather Alerts (Mocked for demo)
    // In production, this would hit an API and check against user location
    const rainForecast = true; // Mock trigger
    if (rainForecast) {
      alerts.push({
        type: 'WEATHER_WARNING',
        text: "किसान भाई, आज बारिश की संभावना है। अपनी फसल को सुरक्षित स्थान पर रखें।",
        tone: 'empathetic'
      });
    }

    // 2. Check for New Orders
    const newOrder = this.db.prepare('SELECT * FROM orders WHERE kisan_id = ? AND status = "pending" AND created_at > datetime("now", "-10 minutes")').get(userId);
    if (newOrder) {
      alerts.push({
        type: 'NEW_ORDER',
        text: `खुशखबरी! ${newOrder.buyer_name} से ${newOrder.commodity} का एक नया ऑर्डर आया है।`,
        tone: 'excited'
      });
    }

    return alerts;
  }
}

module.exports = new ProactiveService();
