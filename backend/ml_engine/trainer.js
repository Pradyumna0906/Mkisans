const fs = require('fs');
const path = require('path');
const { getDB } = require('../config/db');
const synaptic = require('synaptic');

const MODEL_PATH = path.join(__dirname, '..', 'crop_model.json');

async function trainDailyModel() {
  console.log('🧠 [ML-Engine] Starting daily Neural Network training on historical prices...');
  const db = getDB();

  const records = db.prepare(`
    SELECT commodity, price_date, modal_price, min_price, max_price 
    FROM mandi_prices 
    ORDER BY commodity, price_date ASC
  `).all();

  if (records.length < 2) {
    console.log('⚠️ [ML-Engine] Not enough historical data to train the model yet. Needs at least 2 days.');
    return;
  }

  const cropHistory = {};
  records.forEach(row => {
    if (!cropHistory[row.commodity]) cropHistory[row.commodity] = [];
    cropHistory[row.commodity].push(row);
  });

  // Synaptic Architecture: 3 Inputs (PrevPrice, PrevMin, PrevMax), 4 Hidden Neurons, 1 Output (NextPrice)
  const { Architect, Trainer } = synaptic;
  const network = new Architect.Perceptron(3, 4, 1);
  const trainer = new Trainer(network);
  
  const trainingSet = [];

  for (const crop in cropHistory) {
    const history = cropHistory[crop];
    if (history.length > 1) {
      for (let i = 1; i < history.length; i++) {
        const prev = history[i - 1];
        const current = history[i];

        const increment = current.modal_price - prev.modal_price;
        const demand = current.modal_price > ((current.max_price + current.min_price) / 2) ? 1 : -1;
        
        db.prepare(`
          INSERT OR REPLACE INTO historical_trends (commodity, market, price_date, modal_price, daily_increment, demand_momentum)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(current.commodity, 'Madhya Pradesh', current.price_date, current.modal_price, increment, demand);

        trainingSet.push({
          input: [
            prev.modal_price / 10000,
            prev.min_price / 10000,
            prev.max_price / 10000
          ],
          output: [current.modal_price / 10000]
        });
      }
    }
  }

  if (trainingSet.length > 0) {
    console.log(`🤖 [ML-Engine] Training Neural Network on ${trainingSet.length} sequential records...`);
    
    trainer.train(trainingSet, {
      rate: .1,
      iterations: 20000,
      error: .005,
      shuffle: true,
      log: 5000,
      cost: Trainer.cost.CROSS_ENTROPY
    });

    const modelJSON = network.toJSON();
    fs.writeFileSync(MODEL_PATH, JSON.stringify(modelJSON));
    console.log('✅ [ML-Engine] Secret Daily Training Complete! Model saved.');

    for (const crop in cropHistory) {
      const history = cropHistory[crop];
      if (history.length > 0) {
        const lastRecord = history[history.length - 1];
        
        const result = network.activate([
          lastRecord.modal_price / 10000,
          lastRecord.min_price / 10000,
          lastRecord.max_price / 10000
        ]);

        const predictedPrice = Math.round(result[0] * 10000);
        const diff = predictedPrice - lastRecord.modal_price;
        const trend = diff > 0 ? 'UP' : 'DOWN';

        db.prepare(`
          INSERT OR REPLACE INTO ml_predictions (commodity, target_date, predicted_trend, predicted_price, confidence)
          VALUES (?, date('now', '+1 day'), ?, ?, ?)
        `).run(crop, trend, predictedPrice, 0.85);
      }
    }
    console.log('📊 [ML-Engine] Tomorrow predictions calculated and stored.');
  } else {
    console.log('⚠️ [ML-Engine] Could not form training sequences.');
  }
}

if (require.main === module) {
  trainDailyModel();
}

module.exports = { trainDailyModel };
