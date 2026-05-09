import { Link, useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import { Users, Truck, TrendingUp, Download, Building2, UserCheck, ShieldAlert } from 'lucide-react';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import './AdminDashboard.css';

const zoneMonthlyData = [
  { month: 'Jan', production: 2800, revenue: 1900 },
  { month: 'Feb', production: 3100, revenue: 2100 },
  { month: 'Mar', production: 3600, revenue: 2500 },
  { month: 'Apr', production: 3200, revenue: 2300 },
  { month: 'May', production: 4100, revenue: 3000 },
  { month: 'Jun', production: 4500, revenue: 3400 },
  { month: 'Jul', production: 4200, revenue: 3200 },
  { month: 'Aug', production: 5000, revenue: 3800 },
  { month: 'Sep', production: 4700, revenue: 3600 },
  { month: 'Oct', production: 5200, revenue: 4000 },
  { month: 'Nov', production: 5400, revenue: 4200 },
  { month: 'Dec', production: 6000, revenue: 4700 },
];

const cropDistributionData = [
  { name: 'Wheat', value: 400 },
  { name: 'Rice', value: 300 },
  { name: 'Sugarcane', value: 300 },
  { name: 'Cotton', value: 200 },
];
const COLORS = ['#138808', '#FF9933', '#0284c7', '#8b5cf6'];

const AdminDashboard = () => {
  const { officer } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();

  const exportFarmersCSV = () => {
    const data = 'Farmer Name,Location,Land Size,Status\nRamesh Singh,Punjab Ludhiana,12 Acres,Verified\nMahesh Patel,Gujarat Surat,8 Acres,Pending Review\nAmit Kumar,UP Meerut,5 Acres,Verified';
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'farmer_registrations.csv'; a.click();
  };

  const exportPartnersCSV = () => {
    const data = 'Partner Name,Vehicle,Plate No.,Capacity,Status\nSuresh Kumar,Tata Ace,MH-12-AB-1234,1000 kg,Active\nRamesh Singh,Mahindra Bolero Pickup,GJ-05-CD-5678,1200 kg,Active\nVikram Yadav,Ashok Leyland Dost,UP-16-EF-9012,1500 kg,Active';
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'delivery_partners.csv'; a.click();
  };

  return (
    <div className="dashboard-container admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h2>{t.officerDashboard(officer?.zone || '')}</h2>
          <p className="text-muted">{t.welcomeMsg(officer?.name || '')}</p>
        </div>
        <div className="header-actions">
          <button className="secondary-btn flex-center" onClick={exportFarmersCSV}>
            <Download size={16} className="mr-2" />
            {t.exportReport}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-green-light">
            <Users className="text-green" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">{t.registeredFarmers}</p>
            <h3 className="kpi-value">2,450</h3>
            <p className="kpi-trend positive">+124 this month</p>
          </div>
        </Card>
        
        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-blue-light">
            <Truck className="text-blue" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">{t.activePartners}</p>
            <h3 className="kpi-value">342</h3>
            <p className="kpi-trend positive">94% availability</p>
          </div>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-orange-light">
            <TrendingUp className="text-orange" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">{t.tradeVolume}</p>
            <h3 className="kpi-value">₹4.2 Cr</h3>
            <p className="kpi-trend positive">+8% vs last month</p>
          </div>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon-wrapper" style={{ backgroundColor: '#fee2e2' }}>
            <ShieldAlert style={{ color: '#ef4444' }} size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">{t.criticalAlerts}</p>
            <h3 className="kpi-value">3</h3>
            <p className="kpi-trend negative">Require immediate action</p>
          </div>
        </Card>
      </div>

      <div className="charts-grid-admin">
        {/* Zone-specific Monthly Performance */}
        <Card title={t.monthlyPerformance(officer?.zone || 'Zone')} className="chart-card">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={zoneMonthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'var(--bg-light-gray)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Legend iconType="circle" />
                <Bar dataKey="production" name="Production (Tons)" fill="var(--primary-green)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="revenue" name="Revenue (x1000 ₹)" fill="var(--orange-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Crop Distribution Pie */}
        <Card title={t.cropDistribution} className="chart-card">
          <div className="chart-container flex-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cropDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="admin-tables-grid" style={{ display:'flex', flexDirection:'column', gap:24 }}>
        {/* Recent Farmer Registrations */}
        <Card title="Recent Farmer Registrations" action={<button className="text-btn" onClick={exportFarmersCSV}><Download size={14} style={{marginRight:4, verticalAlign:'middle'}}/>Export CSV</button>} className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Farmer Name</th><th>Location</th><th>Land Size</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                <tr><td><div className="user-cell"><div className="avatar">RS</div><span>Ramesh Singh</span></div></td><td>Punjab, Ludhiana</td><td>12 Acres</td><td><span className="status-badge delivered">Verified</span></td><td><Link to="/farmer/1" className="text-btn" style={{ textDecoration: 'none' }}>View Profile</Link></td></tr>
                <tr><td><div className="user-cell"><div className="avatar">MP</div><span>Mahesh Patel</span></div></td><td>Gujarat, Surat</td><td>8 Acres</td><td><span className="status-badge processing">Pending Review</span></td><td><button className="text-btn">Review</button></td></tr>
                <tr><td><div className="user-cell"><div className="avatar">AK</div><span>Amit Kumar</span></div></td><td>UP, Meerut</td><td>5 Acres</td><td><span className="status-badge delivered">Verified</span></td><td><Link to="/farmer/3" className="text-btn" style={{ textDecoration: 'none' }}>View Profile</Link></td></tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Recent Delivery Partner Registrations */}
        <Card title="Recent Delivery Partner Registrations" action={<button className="text-btn" onClick={exportPartnersCSV}><Download size={14} style={{marginRight:4, verticalAlign:'middle'}}/>Export CSV</button>} className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead><tr><th>Partner Name</th><th>Vehicle</th><th>Plate No.</th><th>Capacity</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                <tr><td><div className="user-cell"><div className="avatar bg-blue-light text-blue">SK</div><span>Suresh Kumar</span></div></td><td>Tata Ace</td><td>MH-12-AB-1234</td><td>1000 kg</td><td><span className="status-badge delivered">Active</span></td><td><Link to="/delivery/1" className="text-btn" style={{textDecoration:'none'}}>View</Link></td></tr>
                <tr><td><div className="user-cell"><div className="avatar bg-blue-light text-blue">RS</div><span>Ramesh Singh</span></div></td><td>Mahindra Bolero Pickup</td><td>GJ-05-CD-5678</td><td>1200 kg</td><td><span className="status-badge delivered">Active</span></td><td><Link to="/delivery/2" className="text-btn" style={{textDecoration:'none'}}>View</Link></td></tr>
                <tr><td><div className="user-cell"><div className="avatar bg-blue-light text-blue">VY</div><span>Vikram Yadav</span></div></td><td>Ashok Leyland Dost</td><td>UP-16-EF-9012</td><td>1500 kg</td><td><span className="status-badge processing">Pending Verify</span></td><td><Link to="/partner-verification" className="text-btn" style={{textDecoration:'none'}}>Review</Link></td></tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Monitoring Actions */}
        <Card title="Monitoring Actions" className="actions-card">
          <div className="actions-list">
            <button className="action-item" onClick={() => navigate('/market-prices')}>
              <div className="action-icon bg-green-light"><Building2 className="text-green" size={20} /></div>
              <div className="action-text"><h4>Market Price Control</h4><p>Update minimum support prices</p></div>
              <span style={{ marginLeft:'auto', color:'var(--text-muted)' }}>›</span>
            </button>
            <button className="action-item" onClick={() => navigate('/partner-verification')}>
              <div className="action-icon bg-blue-light"><UserCheck className="text-blue" size={20} /></div>
              <div className="action-text"><h4>Delivery Partner Verification</h4><p>12 new applications pending</p></div>
              <span style={{ marginLeft:'auto', color:'var(--text-muted)' }}>›</span>
            </button>
            <button className="action-item" onClick={() => navigate('/weather-advisories')}>
              <div className="action-icon bg-orange-light"><ShieldAlert className="text-orange" size={20} /></div>
              <div className="action-text"><h4>Weather / Pest Advisories</h4><p>Broadcast alerts to farmers</p></div>
              <span style={{ marginLeft:'auto', color:'var(--text-muted)' }}>›</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
