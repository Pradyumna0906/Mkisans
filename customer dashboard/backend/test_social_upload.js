const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
  try {
    const form = new FormData();
    form.append('kisanId', '5'); // Pradyumna
    form.append('caption', 'Automated Test Post');
    
    // Create a dummy image file if it doesn't exist
    const testFile = path.join(__dirname, 'test_upload.jpg');
    fs.writeFileSync(testFile, 'dummy content');

    form.append('media', fs.createReadStream(testFile));

    const response = await axios.post('http://localhost:5000/api/social/posts', form, {
      headers: form.getHeaders()
    });

    console.log('✅ Upload Success:', response.data);
  } catch (error) {
    console.error('❌ Upload Failed:', error.response ? error.response.data : error.message);
  }
}

testUpload();
