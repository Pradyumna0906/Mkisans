import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Power, Package, IndianRupee, Clock, Star, TrendingUp, ChevronRight,
  Navigation, AlertTriangle, Zap, ShieldAlert, Flame
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import MapComponent from '../components/MapComponent';
import translations from '../translations.json';

export default function Dashboard() {
  const navigate = useNavigate();
  const { partner, toggleOnline, stats, orders, language } = useApp();
  const t = (translations[language] || translations['en'] || {});

  const levelConfig = {
    bronze: { gradient: 'linear-gradient(135deg, #CD7F32, #A0522D)' },
    silver: { gradient: 'linear-gradient(135deg, #C0C0C0, #A8A8A8)' },
    gold: { gradient: 'linear-gradient(135deg, #FFD700, #FFA500)' },
  }[partner.level] || { gradient: 'linear-gradient(135deg, #CD7F32, #A0522D)' };

  return (
    <div className="page-container" style={{ background: 'var(--surface-secondary)' }}>
      {/* Header Banner */}
      <div style={{
        background: partner.isOnline
          ? 'linear-gradient(165deg, #0A5E04 0%, #138808 50%, #1A9E0A 100%)'
          : 'linear-gradient(165deg, #1E293B 0%, #334155 100%)',
        padding: '24px 20px 28px',
        borderRadius: '0 0 28px 28px',
        transition: 'all 0.5s ease',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -80, right: -60 }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, position: 'relative', zIndex: 1 }}>
          <div style={{ width: 50, height: 50, borderRadius: 16, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: 20, backdropFilter: 'blur(10px)' }}>
            {partner.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>{partner.name}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
              <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: levelConfig.gradient, color: 'white' }}>
                🥇 {partner.level.toUpperCase()}
              </span>
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>⭐ {partner.rating}</span>
            </div>
          </div>
          <button onClick={() => navigate('/app/emergency')} style={{ width: 44, height: 44, borderRadius: 14, background: 'rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FCA5A5', border: 'none' }}>
            <ShieldAlert size={22} />
          </button>
        </div>

        <button onClick={toggleOnline} style={{ width: '100%', padding: '16px 20px', borderRadius: 18, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', gap: 14, color: 'white', transition: 'all 0.3s ease', position: 'relative', zIndex: 1, cursor: 'pointer' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: partner.isOnline ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease' }}>
            <Power size={22} style={{ color: partner.isOnline ? '#22C55E' : 'rgba(255,255,255,0.5)' }} />
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontWeight: 800, fontSize: 15 }}>{partner.isOnline ? t.online : t.offline}</div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>{partner.isOnline ? 'Ready for orders' : 'Tap to start earning'}</div>
          </div>
          <div style={{ width: 52, height: 28, borderRadius: 20, background: partner.isOnline ? '#22C55E' : 'rgba(255,255,255,0.2)', padding: 2, transition: 'all 0.3s ease' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'white', transform: partner.isOnline ? 'translateX(24px)' : 'translateX(0)', transition: 'all 0.3s cubic-bezier(0.68,-0.55,0.27,1.55)' }} />
          </div>
        </button>
      </div>

      <div style={{ padding: '24px 16px' }}>
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 20 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)' }}>
                <IndianRupee size={16} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{t.earnings.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)' }}>₹{stats.todayEarnings}</div>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--saffron-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--saffron)' }}>
                <Package size={16} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)' }}>{t.orders.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--text-primary)' }}>{stats.todayOrders}</div>
          </div>
        </div>

        {/* Active Order Card */}
        {orders.active.length > 0 && orders.active.map(order => (
          <div key={order.id} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, padding: '0 4px' }}>
              <span className="section-title" style={{ margin: 0 }}>Active Delivery</span>
              <span className="badge badge-orange" style={{ fontSize: 10 }}>URGENT</span>
            </div>
            <button 
              onClick={() => navigate(`/app/delivery/${order.id}`)} 
              style={{ width: '100%', background: 'linear-gradient(135deg, var(--green), var(--green-dark))', borderRadius: 24, padding: 20, color: 'white', textAlign: 'left', border: 'none', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Navigation size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>Order #{order.id}</div>
                  <div style={{ fontSize: 13, opacity: 0.8 }}>Navigating to Farm</div>
                </div>
                <ChevronRight size={24} />
              </div>
              <div style={{ display: 'flex', gap: 20, fontSize: 14, fontWeight: 600 }}>
                <span>📍 {order.distance}</span>
                <span>⏱ {order.estimatedTime}</span>
              </div>
            </button>
          </div>
        ))}

        {/* Smart Logistics Map Link */}
        <div style={{ marginBottom: 24 }}>
          <div className="section-title" style={{ padding: '0 4px', marginBottom: 12 }}>Smart Delivery Zones</div>
          <button 
            onClick={() => navigate('/app/logistics')}
            style={{ 
              width: '100%', height: 160, borderRadius: 24, padding: 0, overflow: 'hidden', 
              position: 'relative', border: 'none', cursor: 'pointer'
            }}
          >
            <MapComponent points={[[23.2599, 77.4126]]} height="100%" interactive={false} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15,23,42,0.6), transparent)', display: 'flex', alignItems: 'flex-end', padding: 16 }}>
              <div style={{ padding: '4px 12px', background: 'white', borderRadius: 10, fontSize: 11, fontWeight: 800, color: 'var(--text-primary)' }}>
                📍 View High Demand Areas
              </div>
            </div>
          </button>
        </div>


      </div>
    </div>
  );
}
