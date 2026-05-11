import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
    MapPin, Users, Layers, Wheat, Eye, ShieldCheck, Navigation
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './GISMap.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// ─── REAL BHOPAL ZONE GEOFENCE POLYGONS ────────────────────
// These are real GPS coordinates dividing Bhopal into 5 named zones
const ZONE_GEOFENCES = {
    'Pradyumna Zone': {
        id: 1,
        color: '#10b981',       // Emerald
        officer: 'Pradyumna',
        area: 'North Bhopal — Karond, Lalghati, Katara Hills',
        polygon: [
            [23.3200, 77.3600], [23.3200, 77.4300],
            [23.2900, 77.4500], [23.2800, 77.4200],
            [23.2850, 77.3800], [23.3000, 77.3500],
        ],
    },
    'Pramod Zone': {
        id: 2,
        color: '#f59e0b',       // Amber
        officer: 'Pramod',
        area: 'Central Bhopal — MP Nagar, Arera Colony, New Market',
        polygon: [
            [23.2800, 77.3800], [23.2800, 77.4200],
            [23.2900, 77.4500], [23.2500, 77.4500],
            [23.2400, 77.4200], [23.2400, 77.3900],
            [23.2600, 77.3700],
        ],
    },
    'Akshat Zone': {
        id: 3,
        color: '#3b82f6',       // Blue
        officer: 'Akshat',
        area: 'East Bhopal — Govindpura, BHEL, Mandideep',
        polygon: [
            [23.2900, 77.4500], [23.3100, 77.5000],
            [23.2600, 77.5200], [23.2200, 77.4800],
            [23.2500, 77.4500],
        ],
    },
    'Aviral Zone': {
        id: 4,
        color: '#8b5cf6',       // Violet
        officer: 'Aviral',
        area: 'South Bhopal — Bagsewania, Misrod, Ratibad',
        polygon: [
            [23.2400, 77.3900], [23.2400, 77.4200],
            [23.2500, 77.4500], [23.2200, 77.4800],
            [23.1900, 77.4600], [23.1900, 77.4000],
            [23.2100, 77.3800],
        ],
    },
    'Ankit Zone': {
        id: 5,
        color: '#ef4444',       // Red
        officer: 'Ankit',
        area: 'West Bhopal — Hoshangabad Rd, Sehore Rd, Kolar',
        polygon: [
            [23.3000, 77.3500], [23.2850, 77.3800],
            [23.2600, 77.3700], [23.2400, 77.3900],
            [23.2100, 77.3800], [23.1900, 77.4000],
            [23.2000, 77.3400], [23.2500, 77.3200],
            [23.2800, 77.3300],
        ],
    },
};

// ─── MOCK FARM DATA — Real GPS locations inside each zone ───
const ALL_FARMS = [
    // Pradyumna Zone (North)
    { id: 1, name: 'Ramesh Singh Farm', zone: 'Pradyumna Zone', crop: 'Wheat', area: '12 Acres', lat: 23.3050, lng: 77.3950, status: 'Active' },
    { id: 2, name: 'Sunil Yadav Farm', zone: 'Pradyumna Zone', crop: 'Soybean', area: '8 Acres', lat: 23.3100, lng: 77.4100, status: 'Active' },
    { id: 3, name: 'Kamal Verma Farm', zone: 'Pradyumna Zone', crop: 'Rice', area: '5 Acres', lat: 23.2950, lng: 77.4000, status: 'Inactive' },
    // Pramod Zone (Central)
    { id: 4, name: 'Mahesh Patel Farm', zone: 'Pramod Zone', crop: 'Cotton', area: '15 Acres', lat: 23.2650, lng: 77.4050, status: 'Active' },
    { id: 5, name: 'Dinesh Sharma Farm', zone: 'Pramod Zone', crop: 'Wheat', area: '10 Acres', lat: 23.2550, lng: 77.4200, status: 'Active' },
    { id: 6, name: 'Gopal Mishra Farm', zone: 'Pramod Zone', crop: 'Sugarcane', area: '7 Acres', lat: 23.2700, lng: 77.4300, status: 'Active' },
    // Akshat Zone (East)
    { id: 7, name: 'Vijay Kumar Farm', zone: 'Akshat Zone', crop: 'Soybean', area: '20 Acres', lat: 23.2750, lng: 77.4700, status: 'Active' },
    { id: 8, name: 'Arun Tiwari Farm', zone: 'Akshat Zone', crop: 'Wheat', area: '9 Acres', lat: 23.2600, lng: 77.4900, status: 'Active' },
    { id: 9, name: 'Rakesh Jain Farm', zone: 'Akshat Zone', crop: 'Rice', area: '6 Acres', lat: 23.2500, lng: 77.4700, status: 'Inactive' },
    // Aviral Zone (South)
    { id: 10, name: 'Prakash Lodhi Farm', zone: 'Aviral Zone', crop: 'Cotton', area: '18 Acres', lat: 23.2150, lng: 77.4300, status: 'Active' },
    { id: 11, name: 'Bhanu Pratap Farm', zone: 'Aviral Zone', crop: 'Wheat', area: '11 Acres', lat: 23.2050, lng: 77.4500, status: 'Active' },
    { id: 12, name: 'Mohan Das Farm', zone: 'Aviral Zone', crop: 'Soybean', area: '14 Acres', lat: 23.2250, lng: 77.4150, status: 'Active' },
    // Ankit Zone (West)
    { id: 13, name: 'Amit Kumar Farm', zone: 'Ankit Zone', crop: 'Sugarcane', area: '22 Acres', lat: 23.2400, lng: 77.3550, status: 'Active' },
    { id: 14, name: 'Sandeep Rajput Farm', zone: 'Ankit Zone', crop: 'Wheat', area: '13 Acres', lat: 23.2600, lng: 77.3500, status: 'Active' },
    { id: 15, name: 'Raju Thakur Farm', zone: 'Ankit Zone', crop: 'Rice', area: '16 Acres', lat: 23.2200, lng: 77.3700, status: 'Inactive' },
];

// Custom farm marker icon
const farmIcon = (color, isSelected) => L.divIcon({
    className: 'custom-farm-marker',
    html: `<div style="
        width: ${isSelected ? 22 : 16}px; 
        height: ${isSelected ? 22 : 16}px; 
        background: ${color}; 
        border-radius: 50%; 
        border: 3px solid white; 
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        ${isSelected ? 'animation: pulse-marker 1.5s infinite;' : ''}
    "></div>`,
    iconSize: [isSelected ? 22 : 16, isSelected ? 22 : 16],
    iconAnchor: [isSelected ? 11 : 8, isSelected ? 11 : 8],
});

// Component to fit map to zone bounds
const FitToZone = ({ polygon }) => {
    const map = useMap();
    React.useEffect(() => {
        if (polygon && polygon.length > 0) {
            const bounds = L.latLngBounds(polygon);
            map.fitBounds(bounds, { padding: [40, 40] });
        }
    }, [polygon, map]);
    return null;
};

const GISMap = () => {
    const { officer } = useAuth();
    const [selectedFarm, setSelectedFarm] = useState(null);
    const [showAllZones, setShowAllZones] = useState(false);

    const currentZone = officer?.zone || 'Ankit Zone';
    const currentZoneData = ZONE_GEOFENCES[currentZone];

    // Filter farms to this officer's zone
    const zoneFarms = useMemo(() => 
        ALL_FARMS.filter(f => f.zone === currentZone), 
        [currentZone]
    );

    const bhopalCenter = [23.2599, 77.4126];

    return (
        <div className="gis-dashboard-container">
            {/* Sidebar */}
            <div className="gis-sidebar">
                <div className="sidebar-header">
                    <Navigation size={24} className="text-emerald" />
                    <h2>Zone Farm Map</h2>
                    <span className="badge-live">LIVE GPS</span>
                </div>

                {/* Current Zone Info */}
                <div className="zone-info-card" style={{ borderLeft: `4px solid ${currentZoneData?.color}` }}>
                    <div className="zone-info-header">
                        <ShieldCheck size={16} style={{ color: currentZoneData?.color }} />
                        <span style={{ color: currentZoneData?.color, fontWeight: 700, fontSize: 13 }}>
                            {currentZone}
                        </span>
                    </div>
                    <p className="zone-area-desc">{currentZoneData?.area}</p>
                    <div className="zone-stats-row">
                        <div className="zone-stat">
                            <Users size={14} />
                            <span>{zoneFarms.length} Farms</span>
                        </div>
                        <div className="zone-stat">
                            <Wheat size={14} />
                            <span>{zoneFarms.filter(f => f.status === 'Active').length} Active</span>
                        </div>
                    </div>
                </div>

                {/* Toggle All Zones */}
                <button 
                    className={`toggle-all-zones-btn ${showAllZones ? 'active' : ''}`}
                    onClick={() => setShowAllZones(!showAllZones)}
                >
                    <Layers size={16} />
                    {showAllZones ? 'Show Only My Zone' : 'Show All 5 Zones'}
                </button>

                {/* Farm List */}
                <div className="farm-list-section">
                    <h3 className="section-label">
                        <MapPin size={14} />
                        Farms in Your Zone
                    </h3>
                    <div className="farm-list">
                        {zoneFarms.map(farm => (
                            <button 
                                key={farm.id}
                                className={`farm-list-item ${selectedFarm?.id === farm.id ? 'selected' : ''}`}
                                onClick={() => setSelectedFarm(farm)}
                            >
                                <div className="farm-dot" style={{ background: farm.status === 'Active' ? currentZoneData?.color : '#64748b' }} />
                                <div className="farm-info">
                                    <span className="farm-name">{farm.name}</span>
                                    <span className="farm-meta">{farm.crop} · {farm.area}</span>
                                </div>
                                <span className={`farm-status-tag ${farm.status === 'Active' ? 'active' : 'inactive'}`}>
                                    {farm.status}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Selected Farm Detail */}
                {selectedFarm && (
                    <div className="selected-farm-card">
                        <h4>{selectedFarm.name}</h4>
                        <div className="farm-detail-grid">
                            <div><span className="label">Crop</span><span className="value">{selectedFarm.crop}</span></div>
                            <div><span className="label">Area</span><span className="value">{selectedFarm.area}</span></div>
                            <div><span className="label">Status</span><span className="value">{selectedFarm.status}</span></div>
                            <div><span className="label">GPS</span><span className="value">{selectedFarm.lat.toFixed(4)}, {selectedFarm.lng.toFixed(4)}</span></div>
                        </div>
                        <button className="view-farm-btn" onClick={() => {}}>
                            <Eye size={14} /> View Full Dashboard
                        </button>
                    </div>
                )}

                {/* All Zones Legend (when toggled) */}
                {showAllZones && (
                    <div className="all-zones-legend">
                        <h3 className="section-label"><Layers size={14} /> All 5 Zones</h3>
                        {Object.entries(ZONE_GEOFENCES).map(([name, zone]) => (
                            <div key={zone.id} className="legend-item">
                                <div className="legend-color" style={{ background: zone.color }} />
                                <div>
                                    <span className="legend-name">{name}</span>
                                    <span className="legend-area">{zone.area}</span>
                                </div>
                            </div>
                        ))}
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

                    {/* Render zone geofence polygons */}
                    {showAllZones ? (
                        // Show ALL zones when toggled
                        Object.entries(ZONE_GEOFENCES).map(([name, zone]) => (
                            <Polygon
                                key={zone.id}
                                positions={zone.polygon}
                                pathOptions={{
                                    color: zone.color,
                                    fillColor: zone.color,
                                    fillOpacity: name === currentZone ? 0.25 : 0.08,
                                    weight: name === currentZone ? 3 : 1.5,
                                    dashArray: name === currentZone ? null : '6, 6',
                                }}
                            >
                                <Tooltip sticky className="zone-tooltip">
                                    {name} — {zone.officer}
                                </Tooltip>
                            </Polygon>
                        ))
                    ) : (
                        // Show only current zone
                        currentZoneData && (
                            <Polygon
                                positions={currentZoneData.polygon}
                                pathOptions={{
                                    color: currentZoneData.color,
                                    fillColor: currentZoneData.color,
                                    fillOpacity: 0.2,
                                    weight: 3,
                                }}
                            >
                                <Tooltip sticky className="zone-tooltip">
                                    {currentZone} — Geofenced Area
                                </Tooltip>
                            </Polygon>
                        )
                    )}

                    {/* Farm markers */}
                    {zoneFarms.map(farm => (
                        <Marker
                            key={farm.id}
                            position={[farm.lat, farm.lng]}
                            icon={farmIcon(currentZoneData?.color || '#10b981', selectedFarm?.id === farm.id)}
                            eventHandlers={{ click: () => setSelectedFarm(farm) }}
                        >
                            <Popup>
                                <div style={{ fontWeight: 700, fontSize: 14 }}>{farm.name}</div>
                                <div style={{ fontSize: 12, color: '#64748b', marginTop: 4 }}>
                                    🌾 {farm.crop} · {farm.area}
                                </div>
                                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                                    📍 {farm.lat.toFixed(4)}, {farm.lng.toFixed(4)}
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Fit to current zone */}
                    {!showAllZones && currentZoneData && (
                        <FitToZone polygon={currentZoneData.polygon} />
                    )}

                    <MapControls />
                </MapContainer>

                {/* Map Overlay Info */}
                <div className="map-overlay-info">
                    <div className="info-pill">
                        <ShieldCheck size={14} />
                        Geofenced: {currentZone} · {zoneFarms.length} farms tracked
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
            <button onClick={() => map.zoomOut()}>−</button>
        </div>
    );
};

export default GISMap;
