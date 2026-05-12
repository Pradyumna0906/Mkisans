import { useNavigate } from 'react-router-dom';
import { 
  Users, ShoppingBag, Clock, IndianRupee, AlertCircle, 
  Map as MapIcon, ChevronRight, Search, Filter, ShieldCheck
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Live Partners', value: '124', icon: Users, color: 'var(--green)', bg: 'var(--green-light)' },
    { label: 'Active Deliveries', value: '86', icon: ShoppingBag, color: 'var(--blue)', bg: 'var(--blue-light)' },
    { label: 'Delayed Orders', value: '04', icon: Clock, color: 'var(--red)', bg: 'var(--red-light)' },
    { label: 'Total Payouts', value: '₹4.2L', icon: IndianRupee, color: 'var(--saffron)', bg: 'var(--saffron-light)' },
  ];

  const recentDeliveries = [
    { id: 'MK-4521', partner: 'Rajesh K.', status: 'In Transit', time: '12 min late', delay: true },
    { id: 'MK-4522', partner: 'Suresh V.', status: 'Picked Up', time: 'On Time', delay: false },
    { id: 'MK-4523', partner: 'Amit J.', status: 'Delivering', time: 'On Time', delay: false },
    { id: 'MK-4524', partner: 'Rohit M.', status: 'Navigating', time: '5 min late', delay: true },
  ];

  return (
    <div className="page-container" style={{ background: 'var(--white)' }}>
      <div style={{ padding: '20px', borderBottom: '1px solid var(--border-light)' }}>
        <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>Admin Control Panel</h1>
        <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>MKisans Logistics Monitoring</p>
      </div>

      <div style={{ padding: 16 }}>
        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          {stats.map(s => (
            <div key={s.label} className="card" style={{ padding: 14 }}>
              <div style={{ 
                width: 36, height: 36, borderRadius: 'var(--radius-sm)', 
                background: s.bg, color: s.color, display: 'flex', 
                alignItems: 'center', justifyContent: 'center', marginBottom: 8 
              }}>
                <s.icon size={18} />
              </div>
              <div style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>{s.value}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Live Map Placeholder */}
        <div className="section-title">Live Partner Tracking</div>
        <div className="card" style={{ 
          height: 180, marginBottom: 20, background: '#f1f5f9', 
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden'
        }}>
          <MapIcon size={40} color="var(--text-muted)" style={{ opacity: 0.3 }} />
          <div style={{ position: 'absolute', top: '20%', left: '30%', width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', boxShadow: '0 0 10px var(--green)' }} />
          <div style={{ position: 'absolute', top: '60%', left: '70%', width: 10, height: 10, borderRadius: '50%', background: 'var(--red)', boxShadow: '0 0 10px var(--red)' }} />
          <div style={{ position: 'absolute', top: '40%', left: '50%', width: 10, height: 10, borderRadius: '50%', background: 'var(--blue)', boxShadow: '0 0 10px var(--blue)' }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, background: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>
             86 Active Partners
          </div>
        </div>

        {/* Monitoring Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>Delayed Deliveries</span>
              <AlertCircle size={16} color="var(--red)" />
            </div>
            {recentDeliveries.filter(d => d.delay).map(d => (
              <div key={d.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderTop: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: 'var(--font-xs)', fontWeight: 600 }}>{d.id} • {d.partner}</span>
                <span style={{ fontSize: 'var(--font-xs)', color: 'var(--red)', fontWeight: 700 }}>{d.time}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ fontWeight: 700, fontSize: 'var(--font-sm)' }}>Fraud Detection</span>
              <ShieldCheck size={16} color="var(--green)" />
            </div>
            <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', textAlign: 'center', padding: '10px 0' }}>
              No suspicious activities detected today.
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/app')}
          className="btn btn-outline btn-block" 
          style={{ marginTop: 24 }}
        >
          Return to Partner View
        </button>
      </div>
    </div>
  );
}
