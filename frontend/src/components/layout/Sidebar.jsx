import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Truck, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LanguageContext';
import './Sidebar.css';
import logo from '../../assets/logo.jpg';

const Sidebar = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useLang();

  const navLinks = [
    { title: t.dashboard,        path: '/',                   icon: LayoutDashboard },
    { title: t.farmers,          path: '/farmers',            icon: Users },
    { title: t.deliveryPartners, path: '/delivery-partners',  icon: Truck },
    { title: 'Social',           path: '/social',             icon: Users },
    { title: 'Mandi Intelligence', path: '/mandi-intelligence', icon: LayoutDashboard },
    { title: 'Logistics Map',    path: '/logistics-map',      icon: Truck },
  ];


  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <aside className={`sidebar ${!isOpen ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {/* Logo → clicking navigates home */}
        <Link to="/" className="logo-container" title="Go to Dashboard" style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <img src={logo} alt="MKisans Logo" className="logo-img" style={{ transition: 'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </Link>
      </div>

      <div className="sidebar-menu">
        <p className={`menu-label ${!isOpen ? 'hidden' : ''}`}>{t.zonalOfficer}</p>
        <nav>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link key={link.path} to={link.path} className={`nav-item ${isActive ? 'active' : ''}`}>
                <Icon size={22} className="nav-icon" />
                <span className={`nav-text ${!isOpen ? 'hidden' : ''}`}>{link.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="sidebar-footer">
        <nav>
          <Link to="/settings" className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
            <Settings size={22} className="nav-icon" />
            <span className={`nav-text ${!isOpen ? 'hidden' : ''}`}>{t.settings}</span>
          </Link>
          <button className="nav-item text-danger" onClick={handleLogout}>
            <LogOut size={22} className="nav-icon" />
            <span className={`nav-text ${!isOpen ? 'hidden' : ''}`}>{t.logout}</span>
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
