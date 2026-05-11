const express = require('express');
const router = express.Router();
const axios = require('axios');

// Crop Requirements Database (Real-world criteria)
// Sources: ICAR, FAO, and Agricultural Datasets
// Bhopal-Specific Geological & Commercial Data
const BHOPAL_CONTEXT = {
  soilType: 'Black Soil (Vertisols)',
  elevation: 427, // meters
  avgRainfall: 1200, // mm
  irrigationSources: ['Upper Lake', 'Lower Lake', 'Wells', 'Tanks'],
  commercialHubs: ['Sanchi Dairy VLCC', 'Bhopal Mandi', 'Hoshangabad Road Cluster'],
  portals: ['MP Agri Tech (Unnati)', 'MP Agriculture Land Portal']
};

const CROP_CRITERIA = [
  {
    name: 'Soyabean (सोयाबीन)',
    hindi: 'सोयाबीन',
    tempRange: [15, 35],
    optimalRange: [20, 30], // Ideal for growth
    stressTemp: 38, // Heat stress threshold
    humidityRange: [50, 90],
    rainfallMin: 70,
    phRange: [6.0, 7.5],
    soilType: 'Black Soil',
    npk: { N: 20, P: 60, K: 40 },
    season: 'Kharif',
    commercialValue: 'High',
    reasoning: `Bhopal's high-potential black soil (Vertisols) is excellent for moisture retention, which is critical for Soyabean. With ~1200mm rainfall and professional consultation from firms like Impetus Greens, this remains the most stable Kharif investment.`
  },
  {
    name: 'Wheat (गेहूं)',
    hindi: 'गेहूं',
    tempRange: [10, 25],
    optimalRange: [12, 22],
    stressTemp: 28,
    humidityRange: [30, 60],
    rainfallMin: 20,
    phRange: [6.0, 7.5],
    soilType: 'Black Soil',
    npk: { N: 120, P: 60, K: 40 },
    season: 'Rabi',
    commercialValue: 'Very High',
    reasoning: `As the dominant Rabi crop in Bhopal, Wheat benefits from the Upper Lake catchment area irrigation. Elevation of 427m provides the necessary cool climate for grain filling.`
  },
  {
    name: 'Jowar (Sorghum)',
    hindi: 'ज्वार',
    tempRange: [20, 40],
    optimalRange: [25, 35],
    stressTemp: 42,
    humidityRange: [30, 70],
    rainfallMin: 40,
    phRange: [5.5, 8.0],
    soilType: 'Any',
    npk: { N: 80, P: 40, K: 40 },
    season: 'Kharif',
    commercialValue: 'Moderate',
    reasoning: `Ideal for gently undulating plains near the Bhopal airport. Jowar is drought-tolerant and performs well in varied soil health conditions.`
  },
  {
    name: 'Gram (चना)',
    hindi: 'चना (दाल)',
    tempRange: [15, 30],
    optimalRange: [18, 25],
    stressTemp: 32,
    humidityRange: [30, 70],
    rainfallMin: 40,
    phRange: [6.0, 8.0],
    soilType: 'Black Soil',
    npk: { N: 20, P: 40, K: 20 },
    season: 'Rabi',
    commercialValue: 'High',
    reasoning: `Gram is the king of pulses in Bhopal. It thrives in the residual moisture of black soil (Vertisols) and requires very little irrigation, making it a highly profitable Rabi crop.`
  },
  {
    name: 'Tomato (टमाटर)',
    hindi: 'टमाटर (सब्जी)',
    tempRange: [18, 32],
    optimalRange: [20, 28],
    stressTemp: 35,
    humidityRange: [50, 80],
    rainfallMin: 50,
    phRange: [6.0, 7.0],
    soilType: 'Any',
    npk: { N: 100, P: 80, K: 60 },
    season: 'All',
    commercialValue: 'High',
    reasoning: `Vegetable farming is highly lucrative near Bhopal city peripheries. Tomato performs exceptionally well in well-drained undulating plains with consistent irrigation from local tanks/wells.`
  },
  {
    name: 'Onion (प्याज)',
    hindi: 'प्याज (सब्जी)',
    tempRange: [15, 30],
    optimalRange: [18, 26],
    stressTemp: 33,
    humidityRange: [40, 70],
    rainfallMin: 40,
    phRange: [6.0, 7.5],
    soilType: 'Black Soil',
    npk: { N: 120, P: 50, K: 80 },
    season: 'Rabi',
    commercialValue: 'High',
    reasoning: `Onion is a cash-crop staple in MP. The black soil provides the necessary potassium levels and moisture retention for bulb development during the cool winter months.`
  }
];

router.get('/insights', async (req, res) => {
  try {
    const { lat = 23.2599, lon = 77.4126 } = req.query;

    // 1. Fetch Real-time Weather
    const weatherRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`);
    
    // 2. Fetch Seasonal Climatology (Proxy for deep forecast)
    const seasonalRes = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=16&timezone=auto`);
    
    const current = weatherRes.data.current;
    const daily = weatherRes.data.daily;

    // Deep Analysis Logic
    const avgTemp = (daily.temperature_2m_max.reduce((a, b) => a + b, 0) / daily.temperature_2m_max.length);
    const totalRain = daily.precipitation_sum.reduce((a, b) => a + b, 0);
    const humidity = current.relative_humidity_2m;

    const month = new Date().getMonth();
    let currentSeason = 'Kharif';
    if (month >= 10 || month <= 2) currentSeason = 'Rabi';
    else if (month >= 3 && month <= 5) currentSeason = 'Zaid';

    const scoredCrops = CROP_CRITERIA.map(crop => {
      let score = 0;
      if (crop.season === currentSeason || crop.season === 'All') score += 50;
      if (avgTemp >= crop.tempRange[0] && avgTemp <= crop.tempRange[1]) score += 20;
      
      // Bhopal Specific Multipliers
      if (BHOPAL_CONTEXT.soilType === 'Black Soil (Vertisols)' && crop.soilType === 'Black Soil') score += 20;
      if (BHOPAL_CONTEXT.avgRainfall >= 1000) score += 10;

      return { ...crop, score };
    }).sort((a, b) => b.score - a.score);

    const bestCrop = scoredCrops[0];

    res.json({
      success: true,
      context: BHOPAL_CONTEXT,
      weather: {
        current: {
          temp: current.temperature_2m,
          humidity: current.relative_humidity_2m,
          code: current.weather_code,
        },
        forecast: daily
      },
      recommendation: {
        crop: bestCrop.name,
        hindi: bestCrop.hindi,
        reasoning: bestCrop.reasoning,
        criteria: {
          temp: `${bestCrop.tempRange[0]}°C - ${bestCrop.tempRange[1]}°C`,
          optimal: bestCrop.optimalRange,
          stress: bestCrop.stressTemp,
          soil: BHOPAL_CONTEXT.soilType,
          irrigation: 'Upper Lake Catchment / Wells',
          commercial: bestCrop.commercialValue,
          sources: BHOPAL_CONTEXT.portals
        },
        analysisDetails: {
          elevation: `${BHOPAL_CONTEXT.elevation}m ASL`,
          landType: 'Gently undulating plains',
          potentialMarkets: BHOPAL_CONTEXT.commercialHubs
        }
      }
    });

  } catch (error) {
    console.error('Weather API Error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch weather insights' });
  }
});

module.exports = router;
