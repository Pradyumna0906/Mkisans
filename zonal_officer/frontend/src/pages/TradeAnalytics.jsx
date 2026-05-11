import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, PieChart, Pie, Cell
} from 'recharts';
import { TrendingUp, DollarSign, Package, Activity, Download } from 'lucide-react';
import Card from '../components/ui/Card';
import { useLang } from '../context/LanguageContext';
import './AdminDashboard.css'; // Reusing some dashboard styles

const revenueData = [
  { month: 'Jan', revenue: 4000, production: 2400 },
  { month: 'Feb', revenue: 3000, production: 1398 },
  { month: 'Mar', revenue: 2000, production: 9800 },
  { month: 'Apr', revenue: 2780, production: 3908 },
  { month: 'May', revenue: 1890, production: 4800 },
  { month: 'Jun', revenue: 2390, production: 3800 },
  { month: 'Jul', revenue: 3490, production: 4300 },
];

const cropRevenueData = [
  { name: 'Wheat', value: 4500000 },
  { name: 'Rice', value: 3800000 },
  { name: 'Sugarcane', value: 5200000 },
  { name: 'Cotton', value: 2100000 },
];

const COLORS = ['#138808', '#FF9933', '#0284c7', '#8b5cf6'];

const TradeAnalytics = () => {
  const { t } = useLang();

  const exportData = () => {
    alert('Exporting trade data...');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>{t.tradeAnalytics}</h2>
          <p className="text-muted">Detailed analysis of production and revenue trends across the zone.</p>
        </div>
        <div className="header-actions">
          <button className="secondary-btn flex-center" onClick={exportData}>
            <Download size={16} className="mr-2" />
            {t.exportReport}
          </button>
        </div>
      </div>

      <div className="kpi-grid">
        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-green-light">
            <DollarSign className="text-green" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Total Revenue</p>
            <h3 className="kpi-value">₹4.2 Cr</h3>
            <p className="kpi-trend positive">+12.5% YoY</p>
          </div>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-blue-light">
            <Package className="text-blue" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Total Production</p>
            <h3 className="kpi-value">12.8K Tons</h3>
            <p className="kpi-trend positive">+8.2% vs target</p>
          </div>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-orange-light">
            <TrendingUp className="text-orange" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Avg. Price/Ton</p>
            <h3 className="kpi-value">₹32,400</h3>
            <p className="kpi-trend positive">+3% from last month</p>
          </div>
        </Card>

        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-blue-light">
            <Activity className="text-blue" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Market Efficiency</p>
            <h3 className="kpi-value">94%</h3>
            <p className="kpi-trend positive">Optimized logistics</p>
          </div>
        </Card>
      </div>

      <div className="charts-grid-admin">
        <Card title="Revenue vs Production Trends" className="chart-card">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="revenue" stackId="1" stroke="var(--primary-green)" fill="var(--primary-green)" fillOpacity={0.1} />
                <Area type="monotone" dataKey="production" stackId="1" stroke="var(--orange-accent)" fill="var(--orange-accent)" fillOpacity={0.1} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Revenue by Crop Type" className="chart-card">
          <div className="chart-container flex-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={cropRevenueData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cropRevenueData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${(value / 100000).toFixed(1)} Lakh`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card title="Monthly Trade Summary" className="table-card mt-6">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Volume (Tons)</th>
                <th>Revenue</th>
                <th>Growth</th>
                <th>Top Crop</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>December 2025</td><td>1,240</td><td>₹48.5 Lakh</td><td><span className="text-green">+5.2%</span></td><td>Wheat</td></tr>
              <tr><td>November 2025</td><td>1,180</td><td>₹46.2 Lakh</td><td><span className="text-green">+3.8%</span></td><td>Rice</td></tr>
              <tr><td>October 2025</td><td>1,150</td><td>₹44.8 Lakh</td><td><span className="text-green">+4.1%</span></td><td>Cotton</td></tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default TradeAnalytics;
