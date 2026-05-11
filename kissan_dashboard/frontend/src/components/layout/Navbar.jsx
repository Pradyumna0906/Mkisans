import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Menu, LogOut, Users, Truck, AlertTriangle, X, CheckCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import './Navbar.css';

const TYPE_ICON = {
  farmer:  { icon: Users,         bg: '#dcfce7', color: '#138808' },
  partner: { icon: Truck,         bg: '#dbeafe', color: '#0284c7' },
  alert:   { icon: AlertTriangle, bg: '#fee2e2', color: '#ef4444' },
};

const Navbar = ({ toggleSidebar }) => {
  const { officer, logout } = useAuth();
  const { t } = useLang();
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  const navigate = useNavigate();
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  const initials = officer?.name
    ? officer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'ZO';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={toggleSidebar}>
          <Menu size={24} />
        </button>
        <div className="search-container">
          <Search className="search-icon" size={18} />
          <input type="text" placeholder={t.searchPlaceholder} className="search-input" />
        </div>
      </div>

      <div className="navbar-right">
        {/* ── Bell button with dropdown ── */}
        <div className="notif-wrapper" ref={dropRef}>
          <button
            className="icon-btn notification-btn"
            onClick={() => setDropOpen(o => !o)}
            title={t.notifications}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge-count">{unreadCount > 9 ? '9+' : unreadCount}</span>
            )}
          </button>

          {dropOpen && (
            <div className="notif-dropdown">
              {/* Header */}
              <div className="notif-header">
                <span className="notif-title">{t.notifications}</span>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  {unreadCount > 0 && (
                    <button className="notif-mark-all" onClick={markAllRead} title={t.markAllRead}>
                      <CheckCheck size={15}/> {t.markAllRead}
                    </button>
                  )}
                  <button className="notif-close-btn" onClick={() => setDropOpen(false)}><X size={16}/></button>
                </div>
              </div>

              {/* List */}
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">{t.noNotifications}</div>
                ) : (
                  notifications.map(n => {
                    const cfg = TYPE_ICON[n.type] || TYPE_ICON.alert;
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={n.id}
                        className={`notif-item ${!n.read ? 'notif-unread' : ''}`}
                        onClick={() => markRead(n.id)}
                      >
                        <div className="notif-icon-wrap" style={{ background: cfg.bg }}>
                          <Icon size={16} style={{ color: cfg.color }} />
                        </div>
                        <div className="notif-body">
                          <p className="notif-item-title">{n.title}</p>
                          <p className="notif-item-msg">{n.msg}</p>
                          <p className="notif-time">{n.time}</p>
                        </div>
                        {!n.read && <span className="notif-dot" />}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="notif-footer">
                <button className="notif-view-all" onClick={() => { setDropOpen(false); navigate('/settings'); }}>
                  {t.viewAll}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="profile-section">
          <div className="profile-info">
            <p className="profile-name">{officer?.name || 'Zonal Officer'}</p>
            <p className="profile-role" style={{ color: 'var(--orange-accent)', fontWeight: 600 }}>
              {officer?.zone || 'Zone'}
            </p>
          </div>
          <div className="profile-avatar-initials">{initials}</div>
        </div>

        {/* Logout */}
        <button className="icon-btn logout-btn" onClick={handleLogout} title={t.logout} style={{ color: '#ef4444' }}>
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
