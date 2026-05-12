import { useNavigate } from 'react-router-dom';
import {
  User, Star, Award, Package, MapPin, Phone, ChevronRight, Shield,
  Truck, Calendar, TrendingUp, Clock, LogOut, Settings, HelpCircle,
  FileText, Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const navigate = useNavigate();
  const { partner, stats } = useApp();

  const levelConfig = {
    bronze: { label: 'Bronze', emoji: '🥉', color: '#CD7F32', bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', desc: 'New partner', next: 'Silver', progress: 35 },
    silver: { label: 'Silver', emoji: '🥈', color: '#94A3B8', bg: 'linear-gradient(135deg, #F1F5F9, #E2E8F0)', desc: 'Good rating', next: 'Gold', progress: 65 },
    gold: { label: 'Gold', emoji: '🥇', color: '#F59E0B', bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)', desc: 'High performance', next: 'Platinum', progress: 88 },
  };

  const lv = levelConfig[partner.level] || levelConfig.bronze;

  return (
    <div className="page-container">
      {/* Profile Header */}
      <div style={{
        background: 'linear-gradient(165deg, #0A5E04 0%, #138808 100%)',
        padding: '24px 20px 40px',
        textAlign: 'center', color: 'white',
        borderRadius: '0 0 32px 32px',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', top: -80, right: -60 }} />

        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, margin: '0 auto 12px',
          border: '3px solid rgba(255,255,255,0.3)',
        }}>
          {partner.avatar}
        </div>
        <h2 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, marginBottom: 4 }}>{partner.name}</h2>
        <p style={{ fontSize: 'var(--font-sm)', opacity: 0.8, marginBottom: 8 }}>{partner.phone}</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
          <span style={{
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            background: 'rgba(255,255,255,0.2)', fontSize: 'var(--font-xs)', fontWeight: 600,
          }}>
            {lv.emoji} {lv.label} Partner
          </span>
          <span style={{
            padding: '4px 12px', borderRadius: 'var(--radius-full)',
            background: 'rgba(255,255,255,0.2)', fontSize: 'var(--font-xs)', fontWeight: 600,
          }}>
            ⭐ {partner.rating}
          </span>
        </div>
      </div>

      <div style={{ padding: '16px 16px 0', marginTop: -20 }}>
        {/* Stats Row */}
        <div className="card" style={{ padding: 16, marginBottom: 16, display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
          {[
            { label: 'Deliveries', value: partner.totalDeliveries.toLocaleString(), icon: Package },
            { label: 'On-time', value: `${partner.onTimeRate}%`, icon: Clock },
            { label: 'Accept Rate', value: `${partner.acceptanceRate}%`, icon: TrendingUp },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <s.icon size={18} color="var(--green)" style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: 'var(--font-lg)', fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Partner Level Card */}
        <div className="card" style={{ padding: 16, marginBottom: 16, background: lv.bg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ fontSize: 32 }}>{lv.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{lv.label} Partner</div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>{lv.desc}</div>
            </div>
            <Award size={24} color={lv.color} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: 4 }}>
              <span>Progress to {lv.next}</span>
              <span style={{ fontWeight: 700 }}>{lv.progress}%</span>
            </div>
            <div className="progress-bar" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${lv.progress}%`, background: `linear-gradient(90deg, ${lv.color}, #FBBF24)` }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['Higher Incentives', 'Priority Orders', 'Faster Payouts'].map(b => (
              <span key={b} style={{
                fontSize: 'var(--font-xs)', padding: '3px 8px',
                background: 'rgba(255,255,255,0.6)', borderRadius: 'var(--radius-full)',
                fontWeight: 500,
              }}>✓ {b}</span>
            ))}
          </div>
        </div>

        {/* Vehicle Info */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Truck size={16} color="var(--green)" /> Vehicle Details
          </div>
          {[
            { label: 'Vehicle', value: partner.vehicleName },
            { label: 'Number', value: partner.vehicleNumber },
            { label: 'Type', value: partner.vehicleType === 'bike' ? '🏍️ Two Wheeler' : partner.vehicleType },
          ].map(v => (
            <div key={v.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{v.label}</span>
              <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{v.value}</span>
            </div>
          ))}
        </div>

        {/* Verification Status */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Shield size={16} color="var(--green)" /> Verification
          </div>
          {[
            { label: 'Aadhaar Card', verified: partner.aadhaarVerified },
            { label: 'Driving License', verified: partner.licenseVerified },
            { label: 'Bank Account', verified: partner.bankVerified },
          ].map(v => (
            <div key={v.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{v.label}</span>
              <span className={`badge ${v.verified ? 'badge-green' : 'badge-saffron'}`}>
                {v.verified ? '✓ Verified' : 'Pending'}
              </span>
            </div>
          ))}
        </div>

        {/* Rating Breakdown */}
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
            <Star size={16} color="#F59E0B" /> Ratings
          </div>
          {[
            { label: 'Delivery Speed', value: 4.9 },
            { label: 'Behavior', value: 4.8 },
            { label: 'Product Safety', value: 4.7 },
            { label: 'Pickup Timing', value: 4.9 },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{r.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 'var(--font-sm)', fontWeight: 700 }}>{r.value}</span>
                <Star size={12} fill="#F59E0B" color="#F59E0B" />
              </div>
            </div>
          ))}
        </div>

        {/* Menu Items */}
        <div className="card" style={{ padding: 0, marginBottom: 20, overflow: 'hidden' }}>
          {[
            { label: 'Settings', icon: Settings, color: 'var(--text-secondary)', action: () => navigate('/app/settings') },
            { label: 'Help & Support', icon: HelpCircle, color: 'var(--text-secondary)' },
            { label: 'Terms & Conditions', icon: FileText, color: 'var(--text-secondary)' },
            { label: 'Logout', icon: LogOut, color: 'var(--red)', action: () => navigate('/login') },
          ].map((item, i) => (
            <button key={item.label} onClick={item.action || (() => {})} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px', textAlign: 'left',
              borderBottom: i < 3 ? '1px solid var(--border-light)' : 'none',
            }}>
              <item.icon size={18} color={item.color} />
              <span style={{ flex: 1, fontSize: 'var(--font-sm)', fontWeight: 500, color: item.color }}>{item.label}</span>
              <ChevronRight size={16} color="var(--text-muted)" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
