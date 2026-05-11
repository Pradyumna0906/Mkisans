const fs = require('fs');
const path = require('path');
const { getDB } = require('../config/db');
const synaptic = require('synaptic');

const MODEL_PATH = path.join(__dirname, '..', 'crop_model_expert.json');

async function trainDailyModel() {
  console.log('🚀 [Expert-ML] Starting Synaptic Neural Network Training (CPU-Optimized)...');
  const db = getDB();

  // 1. Fetch deep historical data
  const records = db.prepare(`
    SELECT commodity, price_date, modal_price 
    FROM mandi_prices 
    WHERE price_date IS NOT NULL
    ORDER BY commodity, price_date ASC
  `).all();

  if (records.length < 50) {
    console.log('⚠️ [Expert-ML] Insufficient data. Need at least 50 points.');
    return;
  }

  // 2. Aggregate by month
  const cropSeries = {};
  records.forEach(row => {
    if (!cropSeries[row.commodity]) cropSeries[row.commodity] = [];
    const date = new Date(row.price_date);
    const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
    
    let monthEntry = cropSeries[row.commodity].find(m => m.month === monthKey);
    if (!monthEntry) {
      monthEntry = { month: monthKey, prices: [], avg: 0 };
      cropSeries[row.commodity].push(monthEntry);
    }
    monthEntry.prices.push(row.modal_price);
  });

  for (const crop in cropSeries) {
    cropSeries[crop].forEach(m => {
      m.avg = m.prices.reduce((a, b) => a + b, 0) / m.prices.length;
    });
  }

  // 3. Prepare Training Set
  const trainingSet = [];
  const MAX_PRICE = 15000;

  for (const crop in cropSeries) {
    const series = cropSeries[crop];
    if (series.length >= 4) {
      for (let i = 3; i < series.length; i++) {
        trainingSet.push({
          input: [
            series[i-3].avg / MAX_PRICE,
            series[i-2].avg / MAX_PRICE,
            series[i-1].avg / MAX_PRICE
          ],
          output: [series[i].avg / MAX_PRICE]
        });
      }
    }
  }

  if (trainingSet.length > 0) {
    console.log(`🧠 [Expert-ML] Training Multi-Layer Perceptron on ${trainingSet.length} patterns...`);
    
    const { Architect, Trainer } = synaptic;
    const network = new Architect.Perceptron(3, 10, 1);
    const trainer = new Trainer(network);

    const stats = trainer.train(trainingSet, {
      rate: .01,
      iterations: 5000,
      error: .005,
      shuffle: true,
      log: 1000
    });

    console.log('📊 [Expert-ML] Training complete. Final Error:', stats.error);

    // Save model
    fs.writeFileSync(MODEL_PATH, JSON.stringify(network.toJSON()));
    console.log('💾 [Expert-ML] Model saved to crop_model_expert.json');

    // 4. Update Predictions
    for (const crop in cropSeries) {
      const series = cropSeries[crop];
      if (series.length >= 3) {
        const last3 = [
          series[series.length-3].avg / MAX_PRICE,
          series[series.length-2].avg / MAX_PRICE,
          series[series.length-1].avg / MAX_PRICE
        ];

        const prediction = network.activate(last3);
        const predictedPrice = Math.round(prediction[0] * MAX_PRICE);
        const currentPrice = series[series.length-1].avg;
        const trend = predictedPrice > currentPrice ? 'UP' : 'DOWN';

        db.prepare(`
          INSERT OR REPLACE INTO ml_predictions (commodity, target_date, predicted_trend, predicted_price, confidence)
          VALUES (?, date('now', '+1 day'), ?, ?, ?)
        `).run(crop, trend, predictedPrice, 1 - stats.error);
      }
    }
    console.log('✅ [Expert-ML] Predictions updated.');
  }
}

if (require.main === module) {
  trainDailyModel();
}

module.exports = { trainDailyModel };
