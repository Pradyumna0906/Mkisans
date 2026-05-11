fetch('http://localhost:5000/api/mandi-prices/predictions')
  .then(r => r.text())
  .then(t => console.log('Response:', t.substring(0, 200)))
  .catch(console.error);
