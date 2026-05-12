const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');

// 1. GET WALLET BALANCE & INFO
router.get('/:id', (req, res) => {
  try {
    const db = getDB();
    const kisanId = req.params.id;

    // Check if wallet exists, if not create one
    let wallet = db.prepare('SELECT * FROM wallets WHERE kisan_id = ?').get(kisanId);
    
    if (!wallet) {
      db.prepare('INSERT INTO wallets (kisan_id, balance) VALUES (?, ?)').run(kisanId, 0.0);
      wallet = { kisan_id: kisanId, balance: 0.0, upi_id: null, currency: 'INR' };
    }

    res.json({ success: true, wallet });
  } catch (error) {
    console.error('[Wallet] Error fetching balance:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// 2. GET TRANSACTION HISTORY
router.get('/:id/history', (req, res) => {
  try {
    const db = getDB();
    const history = db.prepare(`
      SELECT * FROM wallet_transactions 
      WHERE kisan_id = ? 
      ORDER BY created_at DESC 
      LIMIT 20
    `).all(req.params.id);
    
    res.json({ success: true, history });
  } catch (error) {
    console.error('[Wallet] Error fetching history:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// 3. UPDATE UPI ID (For QR Generation)
router.post('/update-upi', (req, res) => {
  const { kisanId, upiId } = req.body;
  if (!kisanId || !upiId) {
    return res.status(400).json({ success: false, error: 'Kisan ID and UPI ID required.' });
  }

  try {
    const db = getDB();
    db.prepare('UPDATE wallets SET upi_id = ?, updated_at = CURRENT_TIMESTAMP WHERE kisan_id = ?').run(upiId, kisanId);
    res.json({ success: true, message: 'UPI ID updated successfully.' });
  } catch (error) {
    console.error('[Wallet] Error updating UPI:', error);
    res.status(500).json({ success: false, error: 'Internal server error.' });
  }
});

// 4. ADD MONEY (Simulated / Real World Link)
// In a real app, this would be triggered by a Payment Gateway Webhook
router.post('/credit', (req, res) => {
  const { kisanId, amount, description, category, referenceId } = req.body;
  
  if (!kisanId || !amount) {
    return res.status(400).json({ success: false, error: 'Invalid data' });
  }

  const db = getDB();
  const transaction = db.transaction(() => {
    // 1. Update Balance
    db.prepare('UPDATE wallets SET balance = balance + ?, updated_at = CURRENT_TIMESTAMP WHERE kisan_id = ?').run(amount, kisanId);
    
    // 2. Record Transaction
    db.prepare(`
      INSERT INTO wallet_transactions (kisan_id, amount, type, category, description, reference_id)
      VALUES (?, ?, 'credit', ?, ?, ?)
    `).run(kisanId, amount, category || 'mandi_sale', description || 'Funds credited to wallet', referenceId || null);
  });

  try {
    transaction();
    res.json({ success: true, message: 'Wallet credited successfully.' });
  } catch (error) {
    console.error('[Wallet] Credit error:', error);
    res.status(500).json({ success: false, error: 'Failed to credit wallet.' });
  }
});

module.exports = router;
