import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { Sprout, Droplets, MapPin, IndianRupee, ShoppingCart, Leaf } from 'lucide-react';
import Card from '../components/ui/Card';
import './FarmerDashboard.css';

const earningsData = [
  { name: 'Jan', earnings: 4000, expenses: 2400 },
  { name: 'Feb', earnings: 3000, expenses: 1398 },
  { name: 'Mar', earnings: 2000, expenses: 9800 },
  { name: 'Apr', earnings: 2780, expenses: 3908 },
  { name: 'May', earnings: 1890, expenses: 4800 },
  { name: 'Jun', earnings: 2390, expenses: 3800 },
  { name: 'Jul', earnings: 3490, expenses: 4300 },
];

const cropData = [
  { name: 'Wheat', value: 400 },
  { name: 'Rice', value: 300 },
  { name: 'Sugarcane', value: 300 },
  { name: 'Cotton', value: 200 },
];

const FarmerDashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Farmer Dashboard</h2>
          <p className="text-muted">Welcome back, Ramesh. Here is your farm's overview.</p>
        </div>
        <button className="primary-btn">
          + Add New Crop
        </button>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-green-light">
            <MapPin className="text-green" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Total Land Area</p>
            <h3 className="kpi-value">12.5 Acres</h3>
            <p className="kpi-trend positive">+0.5 Acres this year</p>
          </div>
        </Card>
        
        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-orange-light">
            <Leaf className="text-orange" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Soil Quality Score</p>
            <h3 className="kpi-value">84/100</h3>
            <p className="kpi-trend positive">Optimum for Wheat</p>
          </div>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-blue-light">
            <Droplets className="text-blue" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Water Level</p>
            <h3 className="kpi-value">Adequate</h3>
            <p className="kpi-trend neutral">Canal & Borewell</p>
          </div>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-green-light">
            <IndianRupee className="text-green" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Monthly Revenue</p>
            <h3 className="kpi-value">₹45,200</h3>
            <p className="kpi-trend positive">+12.5% from last month</p>
          </div>
        </Card>
      </div>

      <div className="charts-grid">
        {/* Earnings Chart */}
        <Card title="Revenue & Expenses" className="chart-card">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-green)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary-green)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--orange-accent)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--orange-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Area type="monotone" dataKey="earnings" stroke="var(--primary-green)" fillOpacity={1} fill="url(#colorEarnings)" />
                <Area type="monotone" dataKey="expenses" stroke="var(--orange-accent)" fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Crop Distribution */}
        <Card title="Production Estimation (Quintals)" className="chart-card">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'var(--bg-light-gray)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="value" fill="var(--primary-green)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="bottom-grid">
        {/* Recent Orders */}
        <Card title="Recent Marketplace Orders" action={<button className="text-btn">View All</button>} className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#ORD-001</td>
                  <td>Urea Fertilizer (50kg)</td>
                  <td>12 May 2026</td>
                  <td><span className="status-badge delivered">Delivered</span></td>
                  <td>₹1,250</td>
                </tr>
                <tr>
                  <td>#ORD-002</td>
                  <td>Premium Wheat Seeds</td>
                  <td>10 May 2026</td>
                  <td><span className="status-badge processing">Processing</span></td>
                  <td>₹3,400</td>
                </tr>
                <tr>
                  <td>#ORD-003</td>
                  <td>Pesticide Spray</td>
                  <td>05 May 2026</td>
                  <td><span className="status-badge delivered">Delivered</span></td>
                  <td>₹850</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>

        {/* Action Panel */}
        <Card title="Quick Actions" className="actions-card">
          <div className="actions-list">
            <button className="action-item">
              <div className="action-icon bg-green-light">
                <ShoppingCart className="text-green" size={20} />
              </div>
              <div className="action-text">
                <h4>Buy Fertilizers</h4>
                <p>View current market prices</p>
              </div>
            </button>
            <button className="action-item">
              <div className="action-icon bg-orange-light">
                <Sprout className="text-orange" size={20} />
              </div>
              <div className="action-text">
                <h4>Request Soil Test</h4>
                <p>Schedule a sample collection</p>
              </div>
            </button>
            <button className="action-item">
              <div className="action-icon bg-blue-light">
                <MapPin className="text-blue" size={20} />
              </div>
              <div className="action-text">
                <h4>Update Farm Info</h4>
                <p>Edit boundaries and water source</p>
              </div>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default FarmerDashboard;
