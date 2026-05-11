const { db, initDB } = require('./db');

initDB();

const seed = () => {
  // Clear existing data
  db.exec('DELETE FROM delivery_orders');
  db.exec('DELETE FROM delivery_earnings');

  const insertOrder = db.prepare(`
    INSERT INTO delivery_orders (order_id, partner_id, status, scheduled_date, customer_name, customer_type, address, amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertEarning = db.prepare(`
    INSERT INTO delivery_earnings (transaction_id, partner_id, amount, date, type)
    VALUES (?, ?, ?, ?, ?)
  `);

  const partnerId = 1; // Default for our UI dashboard 'Suresh'

  // Insert "Completed Today"
  for (let i = 1; i <= 14; i++) {
    insertOrder.run(`ORD-T-00${i}`, partnerId, 'completed_today', new Date().toISOString(), 'Customer ' + i, 'Wholesaler', 'Sector 45, Mandi', 850);
  }

  // Insert "Pending Deliveries"
  for (let i = 1; i <= 3; i++) {
    insertOrder.run(`ORD-P-00${i}`, partnerId, 'pending', new Date().toISOString(), 'Pending Customer ' + i, 'Retailer', 'Sector 22, Farm', 1200);
  }

  // Insert "Future Orders"
  for (let i = 1; i <= 28; i++) {
    insertOrder.run(`ORD-F-00${i}`, partnerId, 'future', new Date(Date.now() + 86400000).toISOString(), 'Future Customer ' + i, 'Retailer', 'Sector 10, Hub', 900);
  }

  // Insert "Total Orders Completed" (Adding a few to represent the 1450)
  for (let i = 1; i <= 20; i++) {
    insertOrder.run(`ORD-H-00${i}`, partnerId, 'total', '2026-05-01T10:00:00Z', 'Historical Customer ' + i, 'Wholesaler', 'Sector 1, City', 1500);
  }

  // Insert Earnings
  insertEarning.run('TXN-001', partnerId, 1050, new Date().toISOString(), 'daily');
  insertEarning.run('TXN-002', partnerId, 200, new Date().toISOString(), 'bonus');

  console.log("Database seeded successfully.");
};

seed();
