import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { get, run, query } from './database.js';
import { createPricePredictionModel, predictPrice } from './ai_engine.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'mkisans_secret_key_2026';

app.use(cors());
app.use(express.json());

// Initialize AI Model
const priceModel = createPricePredictionModel();

// --- Authentication Routes ---

app.post('/api/auth/register', async (req, res) => {
  const { name, phone, email, password, vehicleType, vehicleName, vehicleNumber } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const id = 'P' + Math.floor(Math.random() * 10000);

  try {
    await run(`
      INSERT INTO partners (id, name, phone, email, password, vehicle_type, vehicle_name, vehicle_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [id, name, phone, email, hashedPassword, vehicleType, vehicleName, vehicleNumber]);
    
    const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, partnerId: id });
  } catch (error) {
    res.status(400).json({ success: false, message: 'Phone or Email already exists' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { phone, password } = req.body;
  try {
    const partner = await get('SELECT * FROM partners WHERE phone = ?', [phone]);

    if (!partner || !(await bcrypt.compare(password, partner.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: partner.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ success: true, token, partnerId: partner.id });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// --- Partner Routes ---

app.get('/api/partner/profile', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const partner = await get('SELECT id, name, phone, email, avatar, level, rating, is_online, vehicle_type, vehicle_name, vehicle_number, balance FROM partners WHERE id = ?', [decoded.id]);
    res.json(partner);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// --- Orders Routes ---

app.get('/api/orders/available', async (req, res) => {
  try {
    const orders = await query('SELECT * FROM orders WHERE status = "pending"');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

app.post('/api/orders/accept', async (req, res) => {
  const { orderId, partnerId } = req.body;
  try {
    await run('UPDATE orders SET partner_id = ?, status = "accepted" WHERE id = ?', [partnerId, orderId]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting order' });
  }
});

// --- AI Prediction Route ---

app.get('/api/ai/predict-price', (req, res) => {
  const { season, region, lastPrice } = req.query;
  const input = [
    parseFloat(season) || 0.5, 
    parseFloat(region) || 0.5, 
    (parseFloat(lastPrice) || 500) / 1000 
  ];
  
  const prediction = predictPrice(priceModel, input);
  const finalPrice = prediction[0] * 1000;

  res.json({
    crop: req.query.crop || 'Wheat',
    predictedPrice: Math.round(finalPrice),
    confidence: 0.88
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
