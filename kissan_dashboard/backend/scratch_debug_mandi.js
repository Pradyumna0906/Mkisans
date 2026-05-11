const axios = require('axios');
const bhopalUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b&format=json&limit=100&filters[state]=Madhya%20Pradesh&filters[district]=Bhopal';

axios.get(bhopalUrl).then(res => {
  console.log('Total Records:', res.data.total);
  console.log('Sample Records:', JSON.stringify(res.data.records.slice(0, 3), null, 2));
}).catch(err => {
  console.error('Error:', err.message);
});
