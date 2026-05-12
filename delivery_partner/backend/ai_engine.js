import synaptic from 'synaptic';
const { Layer, Network, Trainer } = synaptic;

// Define a simple Neural Network for Crop Price Prediction
// Inputs: [Normalized Date/Season, Normalized Region, Previous Price]
// Outputs: [Predicted Price]

export function createPricePredictionModel() {
  const inputLayer = new Layer(3);
  const hiddenLayer = new Layer(6);
  const outputLayer = new Layer(1);

  inputLayer.project(hiddenLayer);
  hiddenLayer.project(outputLayer);

  const myNetwork = new Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
  });

  return myNetwork;
}

// Training function (Mock data simulation for now)
export function trainModel(network, trainingData) {
  const trainer = new Trainer(network);
  
  // trainingData format: [{ input: [0.1, 0.5, 0.8], output: [0.85] }]
  trainer.train(trainingData, {
    rate: .1,
    iterations: 20000,
    error: .005,
    shuffle: true,
    log: 1000,
    cost: Trainer.cost.MSE
  });

  return network;
}

export function predictPrice(network, inputData) {
  return network.activate(inputData);
}
