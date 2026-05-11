import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import { Truck, MapPin, Navigation, Info, IndianRupee, Layers } from 'lucide-react';
import L from 'leaflet';
import './LogisticsMap.css';

// Fix for default marker icons in React-Leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const LogisticsMap = () => {
    const [zones, setZones] = useState([]);
    const [mandi, setMandi] = useState(null);
    const [pickup, setPickup] = useState(null);
    const [estimation, setEstimation] = useState(null);
    const [loading, setLoading] = useState(true);

    const bhopalCenter = [23.2599, 77.4126];

    useEffect(() => {
        fetch('http://localhost:5000/api/logistics/zones')
            .then(res => res.json())
            .then(data => {
                setZones(data.zones);
                setMandi(data.reference_mandi);
                setLoading(false);
            })
            .catch(err => console.error('Failed to load zones:', err));
    }, []);

    const LocationPicker = () => {
        useMapEvents({
            click(e) {
                const { lat, lng } = e.latlng;
                setPickup({ lat, lng });
                calculatePrice(lat, lng);
            },
        });
        return pickup ? <Marker position={[pickup.lat, pickup.lng]} /> : null;
    };

    const calculatePrice = async (lat, lng) => {
        try {
            const res = await fetch('http://localhost:5000/api/logistics/calculate-price', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lat, lng })
            });
            const data = await res.json();
            setEstimation(data);
        } catch (err) {
            console.error('Price calculation failed:', err);
        }
    };

    if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading Bhopal Smart Map...</div>;

    return (
        <div className="logistics-container">
            {/* Left Column: Map */}
            <div className="map-wrapper">
                <div className="map-header">
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                            <Navigation size={24} />
                            Bhopal Logistics Smart Zones
                        </h2>
                        <p style={{ fontSize: '0.8rem', opacity: 0.8, margin: '0.2rem 0 0 0' }}>Click on the map to set your pickup point</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.75rem', backdropFilter: 'blur(5px)' }}>
                        Live Traffic Sync
                    </div>
                </div>
                
                <div className="map-container-inner">
                    <MapContainer center={bhopalCenter} zoom={12} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        />
                        
                        {/* Render Zones */}
                        {zones.map(zone => (
                            <Circle 
                                key={zone.id}
                                center={[zone.center.lat, zone.center.lng]}
                                radius={2500}
                                pathOptions={{ 
                                    color: zone.color, 
                                    fillColor: zone.color, 
                                    fillOpacity: 0.2,
                                    dashArray: '5, 10'
                                }}
                            >
                                <Popup>
                                    <div style={{ fontWeight: 'bold' }}>{zone.name}</div>
                                    <div style={{ fontSize: '0.8rem' }}>{zone.description}</div>
                                    <div style={{ marginTop: '0.5rem', color: '#059669', fontWeight: 'bold' }}>Price Factor: {zone.price_factor}x</div>
                                </Popup>
                            </Circle>
                        ))}

                        {/* Mandi Marker */}
                        {mandi && (
                            <Marker position={[mandi.lat, mandi.lng]} icon={L.divIcon({
                                className: 'custom-mandi-icon',
                                html: `<div style="background: #10b981; color: white; padding: 5px 12px; border-radius: 20px; font-weight: bold; border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); white-space: nowrap; font-size: 14px;">🏢 ${mandi.name}</div>`,
                                iconSize: [120, 40],
                                iconAnchor: [60, 20]
                            })}>
                                <Popup>Main Delivery Hub: {mandi.name}</Popup>
                            </Marker>
                        )}

                        <LocationPicker />
                    </MapContainer>

                    {!pickup && (
                        <div className="overlay-hint">
                            <div className="hint-box">
                                <MapPin className="mx-auto" size={48} style={{ color: '#10b981', marginBottom: '1rem' }} />
                                <h3 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Select Pickup Location</h3>
                                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>Please click on your farm or location on the map to calculate transport price</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Pricing & Info */}
            <div className="pricing-sidebar">
                {/* Estimation Card */}
                {estimation && (
                    <div className="estimate-card">
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <IndianRupee size={20} />
                            Transport Estimate
                        </h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <p style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Distance to Mandi</p>
                                    <p style={{ fontSize: '1.8rem', fontWeight: 'bold', margin: 0 }}>{estimation.distance_km} KM</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.7rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '1px' }}>Zone</p>
                                    <p style={{ fontWeight: 'bold', margin: 0 }}>{estimation.nearest_zone}</p>
                                </div>
                            </div>

                            <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <span>Base Fare</span>
                                    <span>₹{estimation.base_price}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                    <span>Zone Multiplier</span>
                                    <span>{estimation.zone_factor}x</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                                    <span style={{ fontSize: '1.2rem', fontWeight: '500' }}>Total Price</span>
                                    <span className="price-total">₹{estimation.estimated_price}</span>
                                </div>
                            </div>

                            <button className="book-btn">
                                Book Transport Now
                            </button>
                        </div>
                    </div>
                )}

                {/* Zones Legend */}
                <div className="zone-legend">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Layers size={20} style={{ color: '#059669' }} />
                        Bhopal Logistics Zones
                    </h3>
                    <div className="zones-list">
                        {zones.map(zone => (
                            <div key={zone.id} className="zone-item">
                                <div className="zone-dot" style={{ backgroundColor: zone.color }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <h4 style={{ fontWeight: '600', fontSize: '0.9rem', margin: 0 }}>{zone.name}</h4>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#94a3b8' }}>{zone.price_factor}x</span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>{zone.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Card */}
                <div style={{ backgroundColor: '#eff6ff', border: '1px solid #dbeafe', borderRadius: '24px', padding: '1.5rem' }}>
                    <h4 style={{ color: '#1e3a8a', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                        <Info size={16} />
                        Smart Pricing Logic
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#1e40af', lineHeight: '1.6', margin: 0 }}>
                        Pricing is dynamic based on your location. <b>Old Bhopal</b> has higher factors due to congestion, while <b>Industrial zones</b> offer standard rates. Distance is calculated to the <b>Karond Mandi</b> hub.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LogisticsMap;
