import { useEffect, useRef } from 'react';

export default function MapComponent({ 
  points = [[23.2599, 77.4126]], // Default Bhopal
  height = '300px',
  interactive = true 
}) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize Map
    if (typeof L === 'undefined') {
      console.warn('Leaflet (L) is not loaded yet.');
      return;
    }

    mapRef.current = L.map(containerRef.current, {
      zoomControl: false,
      attributionControl: false,
      dragging: interactive,
      touchZoom: interactive,
      scrollWheelZoom: false,
    }).setView(points[0], 12);

    // Dark Mode Tiles (Stadia Alidade Smooth Dark)
    L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
    }).addTo(mapRef.current);

    // Add Markers and Line
    if (points.length > 1) {
      const markers = points.map((p, i) => {
        const color = i === 0 ? '#138808' : '#FF9933'; // Green for start, Saffron for end
        const icon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${color}"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });
        return L.marker(p, { icon }).addTo(mapRef.current);
      });

      // Draw Route Line
      L.polyline(points, {
        color: '#138808',
        weight: 4,
        opacity: 0.6,
        dashArray: '10, 10',
        lineJoin: 'round'
      }).addTo(mapRef.current);

      // Fit Bounds
      const group = new L.featureGroup(markers);
      mapRef.current.fitBounds(group.getBounds().pad(0.2));
    } else {
      L.marker(points[0], {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #138808; width: 15px; height: 15px; border-radius: 50%; border: 2px solid white; animation: pulse 2s infinite"></div>`,
          iconSize: [15, 15],
          iconAnchor: [7, 7]
        })
      }).addTo(mapRef.current);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [points, interactive]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        height, 
        width: '100%', 
        borderRadius: 'inherit',
        background: '#1a1a1a',
        overflow: 'hidden',
        zIndex: 1
      }} 
    />
  );
}
