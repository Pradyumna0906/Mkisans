import { useState } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Package, Truck, Navigation, Clock, CheckCircle, MapPin, Phone, Archive, Calendar } from 'lucide-react';
import Card from '../components/ui/Card';
import './DeliveryDashboard.css';

const performanceData = [
  { name: 'Mon', deliveries: 12 },
  { name: 'Tue', deliveries: 15 },
  { name: 'Wed', deliveries: 10 },
  { name: 'Thu', deliveries: 18 },
  { name: 'Fri', deliveries: 22 },
  { name: 'Sat', deliveries: 25 },
  { name: 'Sun', deliveries: 20 },
];

const DeliveryDashboard = () => {
  const navigate = useNavigate();
  const partnerId = 1;
  const [profilePhoto, setProfilePhoto] = useState(null);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Delivery Partner Dashboard</h2>
          <p className="text-muted">Welcome back, Suresh. Drive safe!</p>
        </div>
        <div className="status-toggle">
          <span className="status-indicator online"></span>
          <span className="status-text">Online & Ready</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <Card className="kpi-card" onClick={() => navigate(`/delivery/${partnerId}/orders/completed_today`)} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-wrapper bg-green-light">
            <CheckCircle className="text-green" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Completed Today</p>
            <h3 className="kpi-value">14</h3>
            <p className="kpi-trend positive">98% Success Rate</p>
          </div>
        </Card>
        
        <Card className="kpi-card" onClick={() => navigate(`/delivery/${partnerId}/orders/pending`)} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-wrapper bg-orange-light">
            <Package className="text-orange" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Pending Deliveries</p>
            <h3 className="kpi-value">3</h3>
            <p className="kpi-trend neutral">Next in 15 mins</p>
          </div>
        </Card>

        <Card className="kpi-card" onClick={() => navigate(`/delivery/${partnerId}/orders/total`)} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-wrapper bg-blue-light">
            <Archive className="text-blue" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Total Orders Completed</p>
            <h3 className="kpi-value">1,450</h3>
            <p className="kpi-trend neutral">All-time</p>
          </div>
        </Card>

        <Card className="kpi-card" onClick={() => navigate(`/delivery/${partnerId}/orders/future`)} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-wrapper bg-orange-light">
            <Calendar className="text-orange" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Future Orders</p>
            <h3 className="kpi-value">28</h3>
            <p className="kpi-trend positive">Scheduled</p>
          </div>
        </Card>

        <Card className="kpi-card" onClick={() => navigate(`/delivery/${partnerId}/earnings`)} style={{ cursor: 'pointer' }}>
          <div className="kpi-icon-wrapper bg-green-light">
            <Truck className="text-green" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Today's Earnings</p>
            <h3 className="kpi-value">₹1,250</h3>
            <p className="kpi-trend positive">+₹200 bonus</p>
          </div>
        </Card>
      </div>

      <div className="map-and-tracking-grid">
        {/* Map Integration Placeholder */}
        <Card title="Live Route Optimization" className="map-card">
          <div className="map-placeholder">
            <div className="map-overlay">
              <Navigation className="text-orange navigation-icon" size={32} />
              <p>Navigating to: Sector 45, Farm House</p>
              <div className="route-stats">
                <span>12 km</span>
                <span className="dot">•</span>
                <span>24 mins away</span>
              </div>
            </div>
            {/* Using a static map background placeholder */}
            <div className="map-bg"></div>
          </div>
        </Card>

        {/* Partner & Vehicle Profile — moved here */}
        <Card title="Partner & Vehicle Profile" className="vehicle-card">
          {/* Photo Section */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '8px 0 20px', borderBottom: '1px solid var(--border-color)', marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Partner"
                  style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--primary-green)' }}
                />
              ) : (
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'var(--primary-green-light)', border: '3px solid var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: '700', color: 'var(--primary-green)' }}>
                  SK
                </div>
              )}
              <label
                htmlFor="photo-upload"
                style={{ position: 'absolute', bottom: '2px', right: '2px', width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'var(--orange-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.2)' }}
                title="Upload Photo"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
                <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
              </label>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-dark)' }}>Suresh Kumar</p>
              <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '2px 10px', borderRadius: '12px', backgroundColor: 'var(--primary-green-light)', color: 'var(--primary-green)' }}>Active Partner</span>
            </div>
          </div>

          <div className="vehicle-info-grid">
            <div className="vehicle-detail">
              <p className="label">Full Name</p>
              <p className="value">Suresh Kumar</p>
            </div>
            <div className="vehicle-detail">
              <p className="label">Contact Number</p>
              <p className="value">+91 98765 43210</p>
            </div>
            <div className="vehicle-detail">
              <p className="label">Driving License</p>
              <p className="value">DL-1420110012345</p>
            </div>
            <div className="vehicle-detail">
              <p className="label">Vehicle Name</p>
              <p className="value">Mahindra Bolero Pickup</p>
            </div>
            <div className="vehicle-detail">
              <p className="label">License Plate (No.)</p>
              <p className="value">UP 16 AB 1234</p>
            </div>
            <div className="vehicle-detail">
              <p className="label">Loading Capacity</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: '65%' }}></div>
              </div>
              <p className="progress-text">650 kg / 1000 kg Used</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="bottom-grid-delivery">
        {/* Performance Chart */}
        <Card title="Weekly Deliveries" className="chart-card">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Line type="monotone" dataKey="deliveries" stroke="var(--primary-green)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary-green)' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Current Active Delivery — moved here */}
        <Card title="Active Delivery" className="active-delivery-card">
          <div className="delivery-details">
            <div className="delivery-header">
              <span className="order-id">#ORD-9932</span>
              <span className="status-badge processing">In Transit</span>
            </div>
            
            <div className="timeline">
              <div className="timeline-item completed">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Pickup (Ramesh Farm)</h4>
                  <p>10:30 AM</p>
                </div>
              </div>
              <div className="timeline-item active">
                <div className="timeline-marker"></div>
                <div className="timeline-content">
                  <h4>Delivery (Mandi Hub)</h4>
                  <p>Expected 11:15 AM</p>
                </div>
              </div>
            </div>

            <div className="customer-info">
              <div className="customer-avatar">RC</div>
              <div className="customer-details">
                <h4>Rahul Chaudhary</h4>
                <p>Wholesaler</p>
              </div>
              <button className="call-btn">
                <Phone size={18} />
              </button>
            </div>

            <button className="primary-btn w-full mt-4">
              Mark as Delivered
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DeliveryDashboard;
