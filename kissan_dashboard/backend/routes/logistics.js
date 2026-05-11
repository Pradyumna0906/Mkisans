const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

// Load GeoJSON Zones
const GEOJSON_PATH = path.join(__dirname, '..', 'config', 'bhopal_geojson.json');
let bhopalGeoJSON = JSON.parse(fs.readFileSync(GEOJSON_PATH, 'utf8'));

/**
 * Detect Zone for a given Lat/Lng
 */
function findZone(lat, lng) {
    const point = turf.point([lng, lat]);
    for (const feature of bhopalGeoJSON.features) {
        if (turf.booleanPointInPolygon(point, feature)) {
            return feature;
        }
    }
    return null;
}

/**
 * Calculate Advanced Logistics Pricing
 * POST /api/logistics/calculate-fare
 */
router.post('/calculate-fare', (req, res) => {
    const { 
        pickup, // { lat, lng }
        drop,   // { lat, lng }
        vehicle_type = 'mini',
        load_type = 'standard',
        is_seasonal_peak = false
    } = req.body;

    if (!pickup || !drop) {
        return res.status(400).json({ success: false, error: 'Pickup and Drop coordinates are required' });
    }

    try {
        // 1. Zone Detection
        const sourceZone = findZone(pickup.lat, pickup.lng);
        const destZone = findZone(drop.lat, drop.lng);

        // Fallback to Base Zone if not found in specific polygons (Outer boundary)
        const activeSourceZone = sourceZone || bhopalGeoJSON.features.find(f => f.id === 'ZONE_E');
        const activeDestZone = destZone || bhopalGeoJSON.features.find(f => f.id === 'ZONE_E');

        // 2. Distance Calculation (Great Circle)
        const from = turf.point([pickup.lng, pickup.lat]);
        const to = turf.point([drop.lng, drop.lat]);
        const distanceKm = parseFloat(turf.distance(from, to, { units: 'kilometers' }).toFixed(2));

        // 3. Time Estimation (Roughly 3 mins per KM + 10 mins buffer)
        const estimatedTimeMins = Math.round(distanceKm * 3 + 10);

        // 4. Pricing Logic
        const config = bhopalGeoJSON.global_config;
        const baseFee = activeSourceZone.properties.base_fee;
        const perKmRate = activeSourceZone.properties.per_km_rate;
        
        const vehicleMultiplier = config.vehicle_multipliers[vehicle_type] || 1.0;
        const loadMultiplier = config.load_multipliers[load_type] || 1.0;
        const surgeMultiplier = is_seasonal_peak ? config.surge_multiplier : 1.0;

        // Formula: (Base + (Distance * Rate) + (Time * 2)) * Multipliers
        const distanceCharge = distanceKm * perKmRate;
        const timeCharge = estimatedTimeMins * 2; // ₹2 per minute

        const subtotal = baseFee + distanceCharge + timeCharge;
        const finalFare = Math.round(subtotal * vehicleMultiplier * loadMultiplier * surgeMultiplier);

        res.json({
            success: true,
            data: {
                fare: finalFare,
                breakdown: {
                    base_fee: baseFee,
                    distance_charge: Math.round(distanceCharge),
                    time_charge: timeCharge,
                    multipliers: {
                        vehicle: vehicleMultiplier,
                        load: loadMultiplier,
                        surge: surgeMultiplier
                    }
                },
                route: {
                    distance_km: distanceKm,
                    estimated_time_mins: estimatedTimeMins
                },
                zones: {
                    pickup: activeSourceZone.properties.name,
                    drop: activeDestZone.properties.name
                }
            }
        });

    } catch (err) {
        console.error('[Logistics] Calculation error:', err);
        res.status(500).json({ success: false, error: 'Failed to calculate fare' });
    }
});

/**
 * Get Map Zones (GeoJSON)
 */
router.get('/zones', (req, res) => {
    res.json(bhopalGeoJSON);
});

/**
 * Admin: Update Zone Pricing/Config
 */
router.post('/admin/update-config', (req, res) => {
    const { features, global_config } = req.body;
    if (features) bhopalGeoJSON.features = features;
    if (global_config) bhopalGeoJSON.global_config = global_config;

    try {
        fs.writeFileSync(GEOJSON_PATH, JSON.stringify(bhopalGeoJSON, null, 2));
        res.json({ success: true, message: 'Logistics configuration updated successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Failed to save configuration' });
    }
});

module.exports = router;
