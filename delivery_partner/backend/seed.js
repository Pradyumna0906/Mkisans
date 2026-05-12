import { run } from './database.js';
import bcrypt from 'bcryptjs';

async function seed() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  try {
    // Seed Partner
    await run(`
      INSERT OR IGNORE INTO partners (id, name, phone, email, password, level, rating, vehicle_type, vehicle_name, vehicle_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'P1001', 'Ankit Sharma', '9876543210', 'ankit@mkisans.com', hashedPassword,
      'gold', 4.9, 'bike', 'Hero Splendor+', 'MP 09 AB 1234'
    ]);

    // Seed Pending Orders
    const orders = [
      {
        id: 'MK-4523',
        farmer_name: 'Rajesh Kumar',
        farmer_avatar: 'RK',
        pickup_location: 'Arera Colony, Bhopal',
        delivery_location: 'Mandideep Hub',
        distance: '12 km',
        estimated_time: '25 min',
        delivery_charge: 180,
        weight: '45 kg',
        items: JSON.stringify([{ name: 'Wheat Seeds', icon: '🌾', qty: '2 bags' }])
      },
      {
        id: 'MK-4525',
        farmer_name: 'Suresh Singh',
        farmer_avatar: 'SS',
        pickup_location: 'Misrod, Bhopal',
        delivery_location: 'Mandideep Hub',
        distance: '8 km',
        estimated_time: '15 min',
        delivery_charge: 120,
        weight: '20 kg',
        items: JSON.stringify([{ name: 'Organic Fertilizer', icon: '🌱', qty: '1 bag' }])
      }
    ];

    for (const order of orders) {
      await run(`
        INSERT OR IGNORE INTO orders (id, farmer_name, farmer_avatar, pickup_location, delivery_location, distance, estimated_time, delivery_charge, weight, items)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        order.id, order.farmer_name, order.farmer_avatar, order.pickup_location, 
        order.delivery_location, order.distance, order.estimated_time, 
        order.delivery_charge, order.weight, order.items
      ]);
    }

    // Seed Transactions
    await run(`
      INSERT INTO transactions (partner_id, description, amount, type, icon)
      VALUES (?, ?, ?, ?, ?)
    `, ['P1001', 'Order #MK-4520 Delivered', 150, 'credit', 'package']);

    console.log('Database seeded successfully!');
  } catch (err) {
    console.error('Seeding error:', err.message);
  } finally {
    process.exit(0);
  }
}

seed();
