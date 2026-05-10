import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, Platform, ScrollView } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, RADIUS, SPACING, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');
const BASE_URL = 'http://localhost:5000';

export default function LogisticsMapScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [estimation, setEstimation] = useState(null);
    const [vehicle, setVehicle] = useState('mini');
    const [loadType, setLoadType] = useState('standard');
    const [pickupCoords, setPickupCoords] = useState(null);
    const [error, setError] = useState(null);
    
    const webViewRef = useRef(null);
    const mandiCoords = { lat: 23.3087, lng: 77.4208 };

    // HTML Content - Robust version with internal error handling
    const mapHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
            body { margin: 0; padding: 0; background: #0f172a; }
            #map { height: 100vh; width: 100vw; background: #0f172a; }
            .mandi-icon {
                background: #10b981; color: white; padding: 4px 8px; border-radius: 12px;
                font-weight: bold; border: 2px solid white; font-size: 10px;
                white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            }
        </style>
    </head>
    <body>
        <div id="map"></div>
        <script>
            function sendToParent(msg) {
                if (window.ReactNativeWebView) {
                    window.ReactNativeWebView.postMessage(JSON.stringify(msg));
                } else {
                    window.parent.postMessage(JSON.stringify(msg), "*");
                }
            }

            try {
                var map = L.map('map', { zoomControl: false }).setView([23.2599, 77.4126], 12);
                
                L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    timeout: 5000 // Prevent hanging on tiles
                }).addTo(map);

                // Fetch Zones
                fetch('${BASE_URL}/api/logistics/zones')
                    .then(res => res.json())
                    .then(zonesData => {
                        if (zonesData) {
                            L.geoJSON(zonesData, {
                                style: (f) => ({
                                    fillColor: f.properties.color, weight: 1, opacity: 1,
                                    color: 'white', fillOpacity: 0.15
                                })
                            }).addTo(map);
                        }
                    }).catch(e => console.warn('Zones failed', e));

                var mandiIcon = L.divIcon({
                    className: 'custom-div-icon',
                    html: '<div class="mandi-icon">🏢 Karond Mandi</div>',
                    iconSize: [100, 25], iconAnchor: [50, 12]
                });
                L.marker([${mandiCoords.lat}, ${mandiCoords.lng}], { icon: mandiIcon }).addTo(map);

                var marker;
                map.on('click', function(e) {
                    if (marker) map.removeLayer(marker);
                    marker = L.marker(e.latlng).addTo(map);
                    sendToParent({ type: 'LOCATION_SELECTED', lat: e.latlng.lat, lng: e.latlng.lng });
                });

                // Immediate ready signal
                sendToParent({ type: 'MAP_LOADED' });

            } catch (e) {
                sendToParent({ type: 'MAP_ERROR', error: e.message });
            }
        </script>
    </body>
    </html>
    `;

    const handleMessage = (event) => {
        let data;
        try {
            data = typeof event.nativeEvent?.data === 'string' 
                ? JSON.parse(event.nativeEvent.data) 
                : (event.data ? JSON.parse(event.data) : null);
        } catch (e) { return; }

        if (!data) return;

        if (data.type === 'MAP_LOADED') {
            setLoading(false);
            setError(null);
        } else if (data.type === 'MAP_ERROR') {
            setError(data.error);
            setLoading(false);
        } else if (data.type === 'LOCATION_SELECTED') {
            setPickupCoords({ lat: data.lat, lng: data.lng });
            calculateFare(data.lat, data.lng, vehicle, loadType);
        }
    };

    const calculateFare = async (lat, lng, v, l) => {
        try {
            const res = await fetch(`${BASE_URL}/api/logistics/calculate-fare`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    pickup: { lat, lng }, drop: mandiCoords,
                    vehicle_type: v, load_type: l
                })
            });
            const result = await res.json();
            if (result.success) setEstimation(result.data);
        } catch (err) {
            console.error('Fare calculation failed:', err);
        }
    };

    useEffect(() => {
        if (Platform.OS === 'web') {
            window.addEventListener('message', handleMessage);
            return () => window.removeEventListener('message', handleMessage);
        }
    }, []);

    useEffect(() => {
        if (pickupCoords) calculateFare(pickupCoords.lat, pickupCoords.lng, vehicle, loadType);
    }, [vehicle, loadType]);

    // Safety timeout to prevent infinite loading
    useEffect(() => {
        const timer = setTimeout(() => {
            if (loading) setLoading(false);
        }, 8000);
        return () => clearTimeout(timer);
    }, [loading]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>GIS लॉजिस्टिक्स (Bhopal)</Text>
                <TouchableOpacity onPress={() => setLoading(true)}>
                    <Ionicons name="refresh" size={20} color="#94a3b8" />
                </TouchableOpacity>
            </View>

            <View style={styles.mapContainer}>
                {Platform.OS === 'web' ? (
                    <iframe 
                        srcDoc={mapHtml}
                        style={{ flex: 1, border: 'none', width: '100%', height: '100%' }}
                        title="Logistics Map"
                    />
                ) : (
                    <WebView
                        ref={webViewRef}
                        originWhitelist={['*']}
                        source={{ html: mapHtml }}
                        onMessage={handleMessage}
                        style={{ flex: 1 }}
                        onError={(e) => setError("WebView failed to load")}
                    />
                )}
                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#10b981" />
                        <Text style={{ marginTop: 10, color: '#FFF' }}>GIS डाटा लोड हो रहा है...</Text>
                    </View>
                )}
                {error && (
                    <View style={styles.errorOverlay}>
                        <Ionicons name="alert-circle" size={32} color="#ef4444" />
                        <Text style={styles.errorText}>{error}</Text>
                        <TouchableOpacity style={styles.retryBtn} onPress={() => setLoading(true)}>
                            <Text style={styles.retryBtnText}>Retry</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.pricingSheet}>
                {estimation ? (
                    <View>
                        <View style={styles.estimationHeader}>
                            <View>
                                <Text style={styles.zoneName}>{estimation.zones.pickup}</Text>
                                <Text style={styles.distance}>{estimation.route.distance_km} KM • {estimation.route.estimated_time_mins} mins</Text>
                            </View>
                            <View style={styles.priceContainer}>
                                <Text style={styles.price}>₹{estimation.fare}</Text>
                            </View>
                        </View>
                        <Text style={styles.sectionLabel}>गाड़ी चुनें (Select Vehicle)</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
                            {['mini', 'small_truck', 'heavy_truck'].map(v => (
                                <TouchableOpacity 
                                    key={v} 
                                    style={[styles.chip, vehicle === v && styles.chipActive]}
                                    onPress={() => setVehicle(v)}
                                >
                                    <Text style={[styles.chipText, vehicle === v && styles.chipTextActive]}>
                                        {v.replace('_', ' ').toUpperCase()}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity style={styles.bookBtn}>
                            <Text style={styles.bookBtnText}>गाड़ी बुक करें (Confirm Booking)</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.placeholder}>
                        <Ionicons name="navigate-circle" size={48} color="#10b981" />
                        <Text style={styles.placeholderText}>
                            नक्शे पर क्लिक करके अपना खेत चुनें
                        </Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#0f172a' },
    header: {
        flexDirection: 'row', alignItems: 'center',
        paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20,
        backgroundColor: '#0f172a',
    },
    backBtn: { marginRight: 15 },
    headerTitle: { fontSize: 18, fontWeight: '800', color: '#FFF', flex: 1 },
    mapContainer: { flex: 1, position: 'relative' },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        justifyContent: 'center', alignItems: 'center', zIndex: 10
    },
    errorOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        justifyContent: 'center', alignItems: 'center', zIndex: 11, padding: 20
    },
    errorText: { color: '#ef4444', marginTop: 10, textAlign: 'center' },
    retryBtn: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#334155', borderRadius: 8 },
    retryBtnText: { color: '#FFF', fontWeight: 'bold' },
    pricingSheet: {
        backgroundColor: '#1e293b', padding: 24,
        borderTopLeftRadius: 30, borderTopRightRadius: 30,
        ...SHADOWS.large, minHeight: 250,
    },
    estimationHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    zoneName: { fontSize: 20, fontWeight: '900', color: '#FFF' },
    distance: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
    priceContainer: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 15, paddingVertical: 10,
        borderRadius: 12, borderWidth: 1, borderColor: '#10b981',
    },
    price: { fontSize: 28, fontWeight: '900', color: '#10b981' },
    sectionLabel: { color: '#94a3b8', fontSize: 12, textTransform: 'uppercase', marginBottom: 12, fontWeight: '700' },
    chipScroll: { marginBottom: 20 },
    chip: {
        paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10,
        backgroundColor: '#0f172a', marginRight: 10,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    chipActive: { backgroundColor: '#10b981', borderColor: '#10b981' },
    chipText: { color: '#94a3b8', fontSize: 12, fontWeight: '800' },
    chipTextActive: { color: '#FFF' },
    bookBtn: {
        backgroundColor: '#10b981', paddingVertical: 16, borderRadius: RADIUS.lg,
        alignItems: 'center', shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8
    },
    bookBtnText: { color: '#FFF', fontSize: 16, fontWeight: '800' },
    placeholder: { alignItems: 'center', paddingVertical: 40 },
    placeholderText: { marginTop: 15, fontSize: 14, color: '#94a3b8', fontWeight: '600', textAlign: 'center' }
});
