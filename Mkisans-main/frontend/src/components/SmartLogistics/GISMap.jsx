import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
    Navigation, MapPin, Truck, Package, Clock, 
    ChevronRight, Zap, ShieldCheck, Info 
} from 'lucide-react';
import { debounce } from 'lodash';
import './GISMap.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const BASE_URL = 'http://localhost:5000';

const GISMap = () => {
    const [zones, setZones] = useState(null);
    const [pickup, setPickup] = useState({ lat: 23.2333, lng: 77.4348 }); // MP Nagar
    const [drop, setDrop] = useState({ lat: 23.3087, lng: 77.4208 }); // Karond Mandi
    const [estimation, setEstimation] = useState(null);
    const [loading, setLoading] = useState(false);
    const [vehicle, setVehicle] = useState('mini');
    const [loadType, setLoadType] = useState('standard');

    const bhopalCenter = [23.2599, 77.4126];

    // Fetch Zones on mount
    useEffect(() => {
        fetch(`${BASE_URL}/api/logistics/zones`)
            .then(res => res.json())
            .then(data => setZones(data))
            .catch(err => console.error('Failed to fetch zones:', err));
    }, []);

    // Debounced Price Calculation
    const calculateFare = useCallback(
        debounce(async (p, d, v, l) => {
            setLoading(true);
            try {
                const res = await fetch(`${BASE_URL}/api/logistics/calculate-fare`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        pickup: p, 
                        drop: d, 
                        vehicle_type: v, 
                        load_type: l 
                    })
                });
                const result = await res.json();
                if (result.success) setEstimation(result.data);
            } catch (err) {
                console.error('Fare calculation failed:', err);
            } finally {
                setLoading(false);
            }
        }, 500),
        []
    );

    useEffect(() => {
        calculateFare(pickup, drop, vehicle, loadType);
    }, [pickup, drop, vehicle, loadType, calculateFare]);

    // Zone Styling
    const zoneStyle = (feature) => ({
        fillColor: feature.properties.color || '#10b981',
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.15
    });

    const onEachZone = (feature, layer) => {
        layer.on({
            mouseover: (e) => {
                const l = e.target;
                l.setStyle({ fillOpacity: 0.4, weight: 3 });
            },
            mouseout: (e) => {
                const l = e.target;
                l.setStyle({ fillOpacity: 0.15, weight: 2 });
            },
            click: (e) => {
                // Set pickup on click if needed
            }
        });
        layer.bindTooltip(feature.properties.name, { sticky: true, className: 'zone-tooltip' });
    };

    return (
        <div className="gis-dashboard-container">
            {/* Sidebar Controls */}
            <div className="gis-sidebar">
                <div className="sidebar-header">
                    <Navigation size={24} className="text-emerald" />
                    <h2>Smart Logistics</h2>
                    <span className="badge-live">LIVE BHOPAL</span>
                </div>

                <div className="location-inputs">
                    <div className="input-group">
                        <MapPin size={18} className="text-emerald" />
                        <div className="input-wrap">
                            <label>Pickup Location</label>
                            <input 
                                value={`${pickup.lat.toFixed(4)}, ${pickup.lng.toFixed(4)}`}
                                readOnly
                                placeholder="Drag marker on map" 
                            />
                        </div>
                    </div>
                    <div className="location-line"></div>
                    <div className="input-group">
                        <MapPin size={18} className="text-orange" />
                        <div className="input-wrap">
                            <label>Drop Location (Mandi/Storage)</label>
                            <input 
                                value={`${drop.lat.toFixed(4)}, ${drop.lng.toFixed(4)}`}
                                readOnly
                                placeholder="Drag marker on map" 
                            />
                        </div>
                    </div>
                </div>

                <div className="config-section">
                    <h3>Vehicle Type</h3>
                    <div className="chip-group">
                        {['mini', 'small_truck', 'heavy_truck'].map(v => (
                            <button 
                                key={v}
                                className={`chip ${vehicle === v ? 'active' : ''}`}
                                onClick={() => setVehicle(v)}
                            >
                                {v === 'mini' && <Truck size={14} />}
                                {v.replace('_', ' ')}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="config-section">
                    <h3>Load Sensitivity</h3>
                    <div className="chip-group">
                        {['standard', 'perishable', 'oversized'].map(l => (
                            <button 
                                key={l}
                                className={`chip ${loadType === l ? 'active' : ''}`}
                                onClick={() => setLoadType(l)}
                            >
                                {l}
                            </button>
                        ))}
                    </div>
                </div>

                {estimation && (
                    <div className="fare-result-card">
                        <div className="fare-main">
                            <span className="label">Estimated Fare</span>
                            <div className="price-row">
                                <span className="currency">₹</span>
                                <span className="amount">{estimation.fare}</span>
                            </div>
                        </div>
                        <div className="fare-details">
                            <div className="detail-item">
                                <Clock size={14} />
                                <span>{estimation.route.estimated_time_mins} mins</span>
                            </div>
                            <div className="detail-item">
                                <Zap size={14} />
                                <span>{estimation.route.distance_km} km</span>
                            </div>
                        </div>
                        <div className="zone-indicator">
                            <ShieldCheck size={14} />
                            <span>{estimation.zones.pickup} → {estimation.zones.drop}</span>
                        </div>
                        <button className="book-now-btn">
                            Confirm Pickup <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>

            {/* Map Canvas */}
            <div className="gis-map-canvas">
                <MapContainer center={bhopalCenter} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />
                    
                    {zones && (
                        <GeoJSON 
                            data={zones} 
                            style={zoneStyle} 
                            onEachFeature={onEachZone} 
                        />
                    )}

                    {/* Pickup Marker */}
                    <Marker 
                        position={[pickup.lat, pickup.lng]} 
                        draggable={true}
                        eventHandlers={{
                            dragend: (e) => {
                                const latLng = e.target.getLatLng();
                                setPickup({ lat: latLng.lat, lng: latLng.lng });
                            }
                        }}
                    >
                    </Marker>

                    {/* Drop Marker */}
                    <Marker 
                        position={[drop.lat, drop.lng]} 
                        draggable={true}
                        eventHandlers={{
                            dragend: (e) => {
                                const latLng = e.target.getLatLng();
                                setDrop({ lat: latLng.lat, lng: latLng.lng });
                            }
                        }}
                    >
                    </Marker>

                    {/* Route Line */}
                    <Polyline 
                        positions={[[pickup.lat, pickup.lng], [drop.lat, drop.lng]]}
                        color="#10b981"
                        weight={4}
                        dashArray="10, 10"
                        className="animated-route"
                    />

                    <MapControls />
                </MapContainer>

                <div className="map-overlay-info">
                    <div className="info-pill">
                        <Info size={14} />
                        Drag markers to calculate dynamic zone pricing
                    </div>
                </div>
            </div>
        </div>
    );
};

const MapControls = () => {
    const map = useMap();
    return (
        <div className="custom-map-controls">
            <button onClick={() => map.zoomIn()}>+</button>
            <button onClick={() => map.zoomOut()}>-</button>
        </div>
    );
};

export default GISMap;
