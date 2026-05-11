import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, MapPin, Filter, Download, 
  Leaf, Droplets, TrendingUp, DollarSign
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import Card from '../components/ui/Card';
import { useLang } from '../context/LanguageContext';
import './ZonalFarmers.css';

const MOCK_FARMERS = [
  { id: 1, name: 'Ramesh Singh', village: 'Khurd', district: 'Ludhiana', state: 'Punjab', size: '12 Acres', soil: 'Alluvial', water: 'Tube Well', crops: 'Wheat, Rice', capacity: '45 Tons', earnings: '₹8,50,000', orders: 124 },
  { id: 2, name: 'Mahesh Patel', village: 'Vesu', district: 'Surat', state: 'Gujarat', size: '8 Acres', soil: 'Black Soil', water: 'Canal', crops: 'Cotton, Groundnut', capacity: '28 Tons', earnings: '₹5,20,000', orders: 89 },
  { id: 3, name: 'Amit Kumar', village: 'Kaseruwa', district: 'Meerut', state: 'UP', size: '5 Acres', soil: 'Loamy', water: 'Tube Well', crops: 'Sugarcane', capacity: '60 Tons', earnings: '₹4,10,000', orders: 45 },
  { id: 4, name: 'Suresh Reddy', village: 'Keesara', district: 'Medchal', state: 'Telangana', size: '15 Acres', soil: 'Red Soil', water: 'Borewell', crops: 'Paddy, Maize', capacity: '55 Tons', earnings: '₹9,80,000', orders: 156 },
];

const cropProductionData = [
  { name: 'Wheat', production: 400 },
  { name: 'Rice', production: 300 },
  { name: 'Sugarcane', production: 500 },
  { name: 'Cotton', production: 200 },
  { name: 'Maize', production: 278 },
];

const revenueData = [
  { month: 'Jan', revenue: 4000 },
  { month: 'Feb', revenue: 3000 },
  { month: 'Mar', revenue: 2000 },
  { month: 'Apr', revenue: 2780 },
  { month: 'May', revenue: 1890 },
  { month: 'Jun', revenue: 2390 },
];

const soilFertilityData = [
  { name: 'High Nitrogen', value: 40 },
  { name: 'Medium Nitrogen', value: 35 },
  { name: 'Low Nitrogen', value: 25 },
];

const COLORS = ['#1E8E3E', '#F57C00', '#FCD34D', '#3B82F6', '#8B5CF6'];

const ZonalFarmers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { t } = useLang();

  return (
    <div className="zonal-page-container">
      <div className="page-header">
        <div>
          <h2>{t.farmerManagement}</h2>
          <p className="text-muted">{t.manageFarmers}</p>
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
          <button className="primary-btn flex-center">{t.addFarmer}</button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card className="search-card">
        <div className="search-grid">
          <div className="search-input-group">
            <Search className="input-icon" size={18} />
            <input type="text" placeholder={t.searchFarmer} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="search-input-group">
            <MapPin className="input-icon text-green" size={18} />
            <input type="text" placeholder="Village..." />
          </div>
          <div className="search-input-group">
            <MapPin className="input-icon text-orange" size={18} />
            <input type="text" placeholder="District..." />
          </div>
          <div className="search-input-group">
            <MapPin className="input-icon text-blue" size={18} />
            <select>
              <option value="">Select State...</option>
              <option value="Punjab">Punjab</option>
              <option value="Gujarat">Gujarat</option>
              <option value="UP">Uttar Pradesh</option>
              <option value="Telangana">Telangana</option>
            </select>
          </div>
        </div>
      </Card>

      <div className="main-grid">
        {/* Left Column: Map Placeholder */}
        <div className="map-column">
          <Card title="Farmer Locations" className="map-card h-full">
            <div className="map-placeholder">
              <MapPin size={48} className="text-muted mb-4" opacity={0.5} />
              <h3>Map Integration Will Be Added With Backend</h3>
              <p className="text-muted text-center mt-2">Geospatial plotting of all registered farmers, farm boundaries, and distribution networks.</p>
            </div>
          </Card>
        </div>

        {/* Right Column: Analytics */}
        <div className="analytics-column">
          <div className="analytics-grid">
            <Card title="Crop Production (Tons)" className="chart-card">
              <div className="chart-container">
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

            <Card title="Revenue Trends" className="chart-card">
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                    <Line type="monotone" dataKey="revenue" stroke="var(--orange-accent)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Farmer Data Table */}
      <Card title="Farmer Directory" className="table-card mt-6">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Farmer Profile</th>
                <th>Location</th>
                <th>Farm Details</th>
                <th>Resources</th>
                <th>Performance</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_FARMERS.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase())).map(farmer => (
                <tr key={farmer.id}>
                  <td>
                    <Link to={`/farmer/${farmer.id}`} className="user-cell" style={{ textDecoration: 'none', color: 'inherit' }}>
                      <div className="avatar">{farmer.name.split(' ').map(n => n[0]).join('')}</div>
                      <div>
                        <span className="block font-medium">{farmer.name}</span>
                        <span className="text-xs text-muted">ID: #FRM{farmer.id}00{farmer.id}</span>
                      </div>
                    </Link>
                  </td>
                  <td>
                    <span className="block">{farmer.village}, {farmer.district}</span>
                    <span className="text-xs text-muted">{farmer.state}</span>
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
  );
};

export default ZonalFarmers;
