import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, Filter, Download, 
  Truck, CheckCircle, Clock, Star, TrendingUp
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from 'recharts';
import Card from '../components/ui/Card';
import { useLang } from '../context/LanguageContext';
import './ZonalDelivery.css';

const MOCK_PARTNERS = [
  { id: 1, name: 'Suresh Kumar', vehicle: 'Tata Ace', vehicleNo: 'MH-12-AB-1234', capacity: '1000 kg', zone: 'North Zone', completed: 1450, pending: 12, rate: '98%', rating: 4.8 },
  { id: 2, name: 'Ramesh Singh', vehicle: 'Mahindra Bolero Pickup', vehicleNo: 'GJ-05-CD-5678', capacity: '1200 kg', zone: 'West Zone', completed: 890, pending: 5, rate: '95%', rating: 4.5 },
  { id: 3, name: 'Vikram Yadav', vehicle: 'Ashok Leyland Dost', vehicleNo: 'UP-16-EF-9012', capacity: '1500 kg', zone: 'East Zone', completed: 2100, pending: 24, rate: '99%', rating: 4.9 },
  { id: 4, name: 'Amit Patel', vehicle: 'Maruti Suzuki Super Carry', vehicleNo: 'TS-09-GH-3456', capacity: '750 kg', zone: 'South Zone', completed: 650, pending: 8, rate: '92%', rating: 4.2 },
];

const performanceDataDaily = Array.from({ length: 30 }, (_, i) => ({
  name: `${i + 1}`,
  deliveries: Math.floor(Math.random() * 100) + 120,
  time: Math.floor(Math.random() * 15) + 35
}));



const performanceDataMonthly = [
  { name: 'Jan', deliveries: 3200, time: 42 },
  { name: 'Feb', deliveries: 3500, time: 41 },
  { name: 'Mar', deliveries: 4100, time: 38 },
  { name: 'Apr', deliveries: 3900, time: 39 },
  { name: 'May', deliveries: 4500, time: 36 },
  { name: 'Jun', deliveries: 4800, time: 35 },
  { name: 'Jul', deliveries: 4900, time: 34 },
  { name: 'Aug', deliveries: 5100, time: 33 },
  { name: 'Sep', deliveries: 4700, time: 36 },
  { name: 'Oct', deliveries: 5200, time: 35 },
  { name: 'Nov', deliveries: 5400, time: 34 },
  { name: 'Dec', deliveries: 6000, time: 32 },
];

const performanceDataYearly = [
  { name: '2021', deliveries: 25000, time: 48 },
  { name: '2022', deliveries: 32000, time: 45 },
  { name: '2023', deliveries: 38000, time: 42 },
  { name: '2024', deliveries: 45000, time: 39 },
  { name: '2025', deliveries: 51000, time: 37 },
  { name: '2026', deliveries: 58000, time: 35 },
];

const acceptanceData = [
  { month: 'Jan', rate: 92 },
  { month: 'Feb', rate: 94 },
  { month: 'Mar', rate: 91 },
  { month: 'Apr', rate: 96 },
  { month: 'May', rate: 95 },
  { month: 'Jun', rate: 98 },
];

const ZonalDelivery = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeFilter, setTimeFilter] = useState('Daily');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toLocaleString('default', { month: 'short' }));
  const { t } = useLang();

  const getPerformanceData = () => {
    switch(timeFilter) {
      case 'Monthly': return performanceDataMonthly;
      case 'Yearly': return performanceDataYearly;
      case 'Daily':
      default: return performanceDataDaily;
    }
  };

  return (
    <div className="zonal-page-container">
      <div className="page-header">
        <div>
          <h2>{t.deliveryManagement}</h2>
          <p className="text-muted">{t.managePartners}</p>
        </div>
        <div className="header-actions">
          <button className="secondary-btn flex-center">
            <Filter size={16} className="mr-2" />
            Filters
          </button>
          <button className="secondary-btn flex-center">
            <Download size={16} className="mr-2" />
            Export Data
          </button>
          <button className="primary-btn flex-center">{t.addPartner}</button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="search-card">
        <div className="search-grid">
          <div className="search-input-group">
            <Search className="input-icon" size={18} />
            <input type="text" placeholder="Search partner name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="search-input-group">
            <Truck className="input-icon text-blue" size={18} />
            <input type="text" placeholder="Vehicle number..." />
          </div>
        </div>
      </Card>

      {/* Live Tracking Map */}
      <Card title="Live Delivery Tracking" className="map-card mb-6">
        <div className="map-placeholder full-width">
          <MapPin size={48} className="text-muted mb-4" opacity={0.5} />
          <h3>Live Tracking Will Be Connected Through Backend</h3>
          <p className="text-muted text-center mt-2">Real-time GPS tracking of all active delivery vehicles across zones.</p>
        </div>
      </Card>

      <div className="delivery-main-grid">
        {/* Left Column: Analytics */}
        <div className="analytics-column">
          <div className="kpi-score-cards">
            <Card className="score-card">
              <p className="score-label">Acceptance Rate</p>
              <h3 className="score-value">96<span className="score-unit">%</span></h3>
            </Card>
          </div>

          <Card 
            title="Delivery Performance" 
            action={
              <div style={{ display: 'flex', gap: '8px' }}>
                {timeFilter === 'Daily' && (
                  <select 
                    value={selectedMonth} 
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.875rem', backgroundColor: '#fff', color: 'var(--text-dark)', cursor: 'pointer', outline: 'none' }}
                  >
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                )}
                <select 
                  value={timeFilter} 
                  onChange={(e) => setTimeFilter(e.target.value)}
                  style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.875rem', backgroundColor: '#fff', color: 'var(--text-dark)', cursor: 'pointer', outline: 'none' }}
                >
                  <option value="Daily">Daily</option>
                  <option value="Monthly">Monthly</option>
                  <option value="Yearly">Yearly</option>
                </select>
              </div>
            }
            className="chart-card mt-6"
          >
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getPerformanceData()} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis 
                    dataKey="name" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    label={{ 
                      value: timeFilter === 'Daily' ? `Days (${selectedMonth})` : timeFilter === 'Monthly' ? `Months (${new Date().getFullYear()})` : 'Years', 
                      position: 'insideBottom', 
                      offset: -15,
                      fill: 'var(--text-muted)',
                      fontSize: 12
                    }} 
                  />
                  <YAxis 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false} 
                    label={{ 
                      value: 'Total Deliveries', 
                      angle: -90, 
                      position: 'insideLeft', 
                      offset: -5,
                      fill: 'var(--text-muted)',
                      fontSize: 12
                    }} 
                  />
                  <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }} />
                  <Bar dataKey="deliveries" name="Deliveries" fill="var(--primary-green)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Acceptance Rate Trend" className="chart-card mt-6">
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={acceptanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                  <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} domain={[80, 100]} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                  <Area type="monotone" dataKey="rate" name="Acceptance %" stroke="var(--orange-accent)" fill="var(--orange-accent-light)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Column: Delivery Partner Cards */}
        <div className="partners-column">
          <h3 className="section-title">Active Partners</h3>
          <div className="partner-cards-list">
            {MOCK_PARTNERS.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).map(partner => (
              <Card key={partner.id} className="partner-item-card">
                <div className="partner-card-header">
                  <div className="partner-info">
                    <div className="avatar bg-blue-light text-blue">
                      <Truck size={20} />
                    </div>
                    <div>
                      <h4 className="partner-name">{partner.name}</h4>
                    </div>
                  </div>
                  <div className="partner-rating flex-center text-xs font-medium bg-orange-light text-orange px-2 py-1 rounded">
                    <Star size={12} fill="currentColor" className="mr-1" /> {partner.rating}
                  </div>
                </div>
                
                <div className="partner-vehicle-info">
                  <div className="info-row">
                    <span className="text-muted text-xs">Vehicle:</span>
                    <span className="text-sm font-medium">{partner.vehicle} ({partner.vehicleNo})</span>
                  </div>
                  <div className="info-row">
                    <span className="text-muted text-xs">Capacity:</span>
                    <span className="text-sm">{partner.capacity}</span>
                  </div>
                </div>

                <div className="partner-stats">
                  <div className="stat-box">
                    <CheckCircle size={16} className="text-green mb-1" />
                    <span className="stat-val">{partner.completed}</span>
                    <span className="stat-lbl">Completed</span>
                  </div>
                  <div className="stat-box">
                    <Clock size={16} className="text-orange mb-1" />
                    <span className="stat-val">{partner.pending}</span>
                    <span className="stat-lbl">Pending</span>
                  </div>
                  <div className="stat-box">
                    <TrendingUp size={16} className="text-blue mb-1" />
                    <span className="stat-val">{partner.rate}</span>
                    <span className="stat-lbl">Success Rate</span>
                  </div>
                </div>
                
                <div className="partner-card-action mt-4">
                  <Link to={`/delivery/${partner.id}`} className="secondary-btn w-full text-sm flex-center" style={{ textDecoration: 'none' }}>View Logistics Report</Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZonalDelivery;
