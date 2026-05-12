import { Bell, Package, IndianRupee, Zap, AlertTriangle, Settings, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

const iconMap = {
  order: Package,
  payment: IndianRupee,
  bonus: Zap,
  alert: AlertTriangle,
  system: Settings,
};

const colorMap = {
  order: { color: 'var(--green)', bg: 'var(--green-light)' },
  payment: { color: 'var(--saffron)', bg: 'var(--saffron-light)' },
  bonus: { color: 'var(--purple)', bg: 'var(--purple-light)' },
  alert: { color: 'var(--red)', bg: 'var(--red-light)' },
  system: { color: 'var(--blue)', bg: 'var(--blue-light)' },
};

export default function Notifications() {
  const { notifications, markNotificationRead } = useApp();
  const unread = notifications.filter(n => !n.read);
  const read = notifications.filter(n => n.read);

  return (
    <div className="page-container">
      <div style={{ background: 'var(--white)', padding: '20px', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800 }}>Notifications</h1>
          {unread.length > 0 && (
            <span className="badge badge-green">{unread.length} New</span>
          )}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Unread */}
        {unread.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: 10, padding: '0 4px' }}>
              NEW
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {unread.map((n, idx) => {
                const Icon = iconMap[n.type] || Bell;
                const c = colorMap[n.type] || colorMap.system;
                return (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className="card animate-fadeInUp"
                    style={{
                      padding: 14, textAlign: 'left',
                      borderLeft: `3px solid ${c.color}`,
                      animationDelay: `${idx * 0.05}s`, animationFillMode: 'both',
                    }}
                  >
                    <div style={{ display: 'flex', gap: 12 }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-md)',
                        background: c.bg, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', color: c.color, flexShrink: 0,
                      }}>
                        <Icon size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)', marginBottom: 2 }}>{n.title}</div>
                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.message}</div>
                        <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</div>
                      </div>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color, flexShrink: 0, marginTop: 6 }} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Read */}
        {read.length > 0 && (
          <div>
            <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 10, padding: '0 4px' }}>
              EARLIER
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {read.map((n, idx) => {
                const Icon = iconMap[n.type] || Bell;
                const c = colorMap[n.type] || colorMap.system;
                return (
                  <div key={n.id} style={{
                    display: 'flex', gap: 12, padding: '12px 4px',
                    borderBottom: idx < read.length - 1 ? '1px solid var(--border-light)' : 'none',
                    opacity: 0.7,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 'var(--radius-md)',
                      background: 'var(--surface-tertiary)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0,
                    }}>
                      <Icon size={16} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 'var(--font-sm)', marginBottom: 2 }}>{n.title}</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{n.message}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</div>
                    </div>
                    <Check size={14} color="var(--text-muted)" style={{ marginTop: 6, flexShrink: 0 }} />
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
