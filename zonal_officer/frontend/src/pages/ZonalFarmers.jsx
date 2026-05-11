import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, Filter, Download, 
  Leaf, Droplets, TrendingUp, DollarSign, UserCheck, ShieldCheck, XCircle, Eye
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { useLang } from '../context/LanguageContext';
import './ZonalFarmers.css';

const MOCK_FARMERS = [
  { id: 1, name: 'Ramesh Singh', mobile: '+91 98765 43210', email: 'ramesh.s@example.com', village: 'Khurd', district: 'Ludhiana', state: 'Punjab', size: '12 Acres', soil: 'Alluvial', water: 'Tube Well', crops: 'Wheat, Rice', capacity: '45 Tons', earnings: '₹8,50,000', orders: 124, verified: true },
  { id: 2, name: 'Mahesh Patel', mobile: '+91 87654 32109', email: 'mahesh.p@example.com', village: 'Vesu', district: 'Surat', state: 'Gujarat', size: '8 Acres', soil: 'Black Soil', water: 'Canal', crops: 'Cotton, Groundnut', capacity: '28 Tons', earnings: '₹5,20,000', orders: 89, verified: false },
  { id: 3, name: 'Amit Kumar', mobile: '+91 76543 21098', email: 'amit.k@example.com', village: 'Kaseruwa', district: 'Meerut', state: 'UP', size: '5 Acres', soil: 'Loamy', water: 'Tube Well', crops: 'Sugarcane', capacity: '60 Tons', earnings: '₹4,10,000', orders: 45, verified: true },
  { id: 4, name: 'Suresh Reddy', mobile: '+91 65432 10987', email: 'suresh.r@example.com', village: 'Keesara', district: 'Medchal', state: 'Telangana', size: '15 Acres', soil: 'Red Soil', water: 'Borewell', crops: 'Paddy, Maize', capacity: '55 Tons', earnings: '₹9,80,000', orders: 156, verified: false },
];

const cropProductionData = [
  { name: 'Wheat', production: 400 },
  { name: 'Rice', production: 300 },
  { name: 'Sugarcane', production: 500 },
  { name: 'Cotton', production: 200 },
  { name: 'Maize', production: 278 },
];

const ZonalFarmers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { t } = useLang();

  const filteredFarmers = MOCK_FARMERS.filter(farmer => {
    const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' ? true : 
                          statusFilter === 'verified' ? farmer.verified : !farmer.verified;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="zonal-page-container">
      <div className="page-header">
        <div>
          <h2>{t.farmerManagement}</h2>
          <p className="text-muted">{t.manageFarmers}</p>
        </div>
        <div className="header-actions">
          <button className="secondary-btn flex-center">
            <Download size={16} className="mr-2" />
            Export Data
          </button>
        </div>
      </div>

      <div className="farmers-top-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Verification Section */}
        <Card title="Pending Farmer ID Verification" className="verification-card">
          <div className="pending-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {MOCK_FARMERS.filter(f => !f.verified).map(farmer => (
              <div key={farmer.id} className="pending-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--bg-light-gray)', borderRadius: '8px' }}>
                <div className="flex-center">
                  <div className="avatar" style={{ marginRight: '12px' }}>{farmer.name[0]}</div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.95rem' }}>{farmer.name}</h4>
                    <p className="text-xs text-muted">ID Proof: Aadhar Card</p>
                  </div>
                </div>
                <div className="flex-center" style={{ gap: '8px' }}>
                  <button className="secondary-btn px-3 py-1 text-xs flex-center"><Eye size={12} className="mr-1"/>View ID</button>
                  <button className="text-green flex-center" title="Approve"><ShieldCheck size={20}/></button>
                  <button className="text-danger flex-center" title="Reject"><XCircle size={20}/></button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Regional Production Analytics */}
        <Card title="Regional Production" className="chart-card">
          <div className="chart-container" style={{ height: '220px', marginTop: '10px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropProductionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="production" fill="var(--primary-green)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Farmer Data Table */}
        <Card 
          title="Farmer Directory" 
          className="table-card"
          action={
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div className="search-input-group" style={{ width: '250px', position: 'relative' }}>
                <Search className="input-icon" size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder={t.searchFarmer} 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  style={{ padding: '8px 12px 8px 32px', borderRadius: '6px', border: '1px solid var(--border-color)', width: '100%', fontSize: '0.9rem' }}
                />
              </div>
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--border-color)', fontSize: '0.9rem', backgroundColor: '#fff', cursor: 'pointer' }}
              >
                <option value="all">All Farmers</option>
                <option value="verified">Verified Only</option>
                <option value="non-verified">Non-Verified</option>
              </select>
            </div>
          }
        >
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Farmer Profile</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Farm Details</th>
                  <th>Resources</th>
                  <th>Performance</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredFarmers.map(farmer => (
                  <tr key={farmer.id}>
                    <td>
                      <Link to={`/farmer/${farmer.id}`} className="user-cell" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="avatar">{farmer.name.split(' ').map(n => n[0]).join('')}</div>
                        <div>
                          <span className="block font-medium">{farmer.name}</span>
                          <span className="text-xs text-muted block">ID: #FRM{farmer.id}00{farmer.id}</span>
                          <span className="text-xs text-muted block">{farmer.mobile}</span>
                          <span className="text-xs text-muted block">{farmer.email}</span>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <span className="block">{farmer.village}, {farmer.district}</span>
                      <span className="text-xs text-muted">{farmer.state}</span>
                    </td>
                    <td>
                      {farmer.verified ? (
                        <span className="status-badge delivered" style={{ display: 'flex', alignItems: 'center', width: 'fit-content' }}>
                          <ShieldCheck size={14} className="mr-1" /> Verified
                        </span>
                      ) : (
                        <span className="status-badge processing" style={{ display: 'flex', alignItems: 'center', width: 'fit-content' }}>
                          <XCircle size={14} className="mr-1" /> Unverified
                        </span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp size={14} className="text-green" />
                        <span>{farmer.size}</span>
                      </div>
                      <span className="text-xs text-muted">Crops: {farmer.crops}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 mb-1 text-xs">
                        <Leaf size={12} className="text-green" /> {farmer.soil}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Droplets size={12} className="text-blue" /> {farmer.water}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 mb-1 font-medium">
                        <DollarSign size={14} className="text-orange" /> {farmer.earnings}
                      </div>
                      <span className="text-xs text-muted">{farmer.capacity} Cap | {farmer.orders} Orders</span>
                    </td>
                    <td>
                      <Link to={`/farmer/${farmer.id}`} className="text-btn" style={{ textDecoration: 'none' }}>View Full Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ZonalFarmers;
