const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

const inputPath = 'C:\\Users\\ANKIT PC\\.gemini\\antigravity\\brain\\8c20716c-8a4d-4fc5-a853-3ad1e2bc2a09\\mkisans_app_icon_1778324649827.png';
const outputPath = 'f:\\project\\ANTI_GRAVITY\\Mkishan\\mkisans_icon.ico';

pngToIco(inputPath)
  .then(buf => {
    fs.writeFileSync(outputPath, buf);
    console.log('Icon converted successfully!');
  })
  .catch(err => {
    console.error('Error converting icon:', err);
  });
