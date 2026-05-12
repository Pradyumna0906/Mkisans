import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, Truck, Car, Info, Bike, Tractor } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { useApp } from '../context/AppContext';

export default function LogisticsMap() {
  const navigate = useNavigate();
  const { partner, orders } = useApp();
  
  // Example points from image: Extended Zone (e.g. Berasia to Mandideep)
  const bhopalPoints = [
    [23.6335, 77.4338], // Berasia (North)
    [23.2599, 77.4126], // Bhopal Center
    [23.0970, 77.5342], // Mandideep (South)
  ];

  const vehicleRates = {
    bike: 15,
    mini: 25,
    small_truck: 32,
    heavy_truck: 36.3,
    tractor_trolley: 36.3,
    tempo: 28
  };

  const distance = 37.4;
  const time = '122 mins';
  
  // Use partner's vehicle type or default to heavy_truck
  const vType = partner.vehicleType || 'heavy_truck';
  const rate = vehicleRates[vType] || 30;
  const price = Math.round(distance * rate);

  const getVehicleIcon = (type) => {
    if (type?.includes('bike')) return <Bike size={24} />;
    if (type?.includes('tractor')) return <Tractor size={24} />;
    return <Truck size={24} />;
  };

  return (
    <div style={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      background: '#0f172a',
      color: 'white',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate(-1)} style={{ color: 'white' }}>
            <ChevronLeft size={24} />
          </button>
          <h1 style={{ fontSize: 16, fontWeight: 700 }}>GIS लॉजिस्टिक्स (Bhopal)</h1>
        </div>
        <button style={{ color: 'rgba(255,255,255,0.6)' }}>
          <RefreshCw size={20} />
        </button>
      </div>

      {/* Map Area */}
      <div style={{ flex: 1, position: 'relative' }}>
        <MapComponent points={bhopalPoints} height="100%" interactive={true} />
        
        {/* Karond Mandi Label */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 5,
          pointerEvents: 'none'
        }}>
          <div style={{
            background: 'var(--green)',
            padding: '4px 12px',
            borderRadius: 8,
            fontSize: 10,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}>
            🏢 Karond Mandi
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div style={{
        padding: '24px 20px 80px', // Extra bottom padding for nav bar
        background: '#1e293b',
        borderRadius: '24px 24px 0 0',
        zIndex: 10,
        boxShadow: '0 -10px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'white', marginBottom: 4 }}>Active Orders Tracking</h2>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
              {orders?.active?.length || 0} Current Order(s)
            </div>
          </div>
          <div style={{
            padding: '8px 16px',
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: 12,
            border: '1px solid var(--green)',
            color: 'var(--green)',
            fontSize: 16,
            fontWeight: 800
          }}>
            {orders?.active?.length > 0 ? 'In Transit' : 'Standby'}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
            आपका वाहन (YOUR REGISTERED VEHICLE)
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            padding: '16px 20px',
            background: 'rgba(255,255,255,0.05)',
            borderRadius: 16,
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: 'var(--green)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              {getVehicleIcon(partner.vehicleType)}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{partner.vehicleName || 'Registered Vehicle'}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{partner.vehicleNumber} • Rate: ₹{rate}/km</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
