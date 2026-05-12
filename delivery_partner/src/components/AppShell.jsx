import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, Package, Wallet, Bell, User, Menu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import translations from '../translations.json';

export default function AppShell() {
  const { partner, language } = useApp();
  const navigate = useNavigate();
  const t = (translations[language] || translations['en'] || {});

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-secondary)', paddingBottom: 80 }}>
      {/* Global Top Header */}
      <header style={{
        background: 'white',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Exact Logo - No changes */}
          <button 
            onClick={() => navigate('/app')}
            style={{ 
              width: 50, 
              height: 50, 
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--radius-full)',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <img 
              src="/logo.png" 
              alt="MKisans" 
              style={{ width: '75%', height: '75%', objectFit: 'contain' }}
              onError={(e) => {
                e.target.src = 'https://cdn-icons-png.flaticon.com/512/3061/3061323.png';
              }}
            />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--green-dark)', letterSpacing: '-0.5px' }}>MKisans</span>
            <span style={{ fontSize: 9, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>Delivery Partner</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{partner.name}</div>
            <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700 }}>{partner.rating} ★</div>
          </div>
          <button 
            onClick={() => navigate('/app/profile')}
            style={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%', 
              overflow: 'hidden',
              border: '2px solid var(--green-light)',
              padding: 0,
              background: 'var(--surface-tertiary)'
            }}
          >
            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--green)' }}>
              {partner.name?.[0]}
            </div>
          </button>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(15px)',
        borderTop: '1px solid var(--border-light)',
        padding: '12px 20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <NavButton to="/app" icon={Home} label={t.dashboard} />
        <NavButton to="/app/orders" icon={Package} label={t.orders} />
        <NavButton to="/app/wallet" icon={Wallet} label={t.wallet} />
        <NavButton to="/app/notifications" icon={Bell} label={t.alerts} badge="3" />
        <NavButton to="/app/profile" icon={User} label={t.profile} />
      </nav>
    </div>
  );
}

function NavButton({ to, icon: Icon, label, badge }) {
  return (
    <NavLink 
      to={to} 
      end={to === '/app'}
      style={({ isActive }) => ({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        color: isActive ? 'var(--green)' : 'var(--text-muted)',
        textDecoration: 'none',
        position: 'relative',
        transition: 'all 0.2s ease'
      })}
    >
      {({ isActive }) => (
        <>
          <div style={{ position: 'relative' }}>
            <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            {badge && (
              <div style={{
                position: 'absolute',
                top: -5,
                right: -8,
                background: 'var(--red)',
                color: 'white',
                fontSize: 10,
                fontWeight: 800,
                minWidth: 16,
                height: 16,
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white'
              }}>
                {badge}
              </div>
            )}
          </div>
          <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>
        </>
      )}
    </NavLink>
  );
}
