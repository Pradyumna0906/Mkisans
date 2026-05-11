import { useNavigate } from 'react-router-dom';
import { Building2, IndianRupee, TrendingUp, AlertTriangle, ChevronRight, ArrowLeft } from 'lucide-react';
import Card from '../components/ui/Card';
import './MonitoringPage.css';

const PRICES = [
  { crop: 'Wheat',     msp: 2275, market: 2410, change: '+5.9%', trend: 'up' },
  { crop: 'Rice',      msp: 2183, market: 2050, change: '-6.1%', trend: 'down' },
  { crop: 'Sugarcane', msp: 315,  market: 330,  change: '+4.8%', trend: 'up' },
  { crop: 'Cotton',    msp: 6620, market: 6800, change: '+2.7%', trend: 'up' },
  { crop: 'Maize',     msp: 1962, market: 1890, change: '-3.7%', trend: 'down' },
  { crop: 'Soybean',   msp: 4600, market: 4750, change: '+3.3%', trend: 'up' },
];

const MarketPriceControl = () => {
  const navigate = useNavigate();

  const exportCSV = () => {
    const header = 'Crop,MSP (₹/Quintal),Market Price (₹/Quintal),Change\n';
    const rows = PRICES.map(r => `${r.crop},${r.msp},${r.market},${r.change}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'market_prices.csv'; a.click();
  };

  return (
    <div className="dashboard-container">
      <div className="monitoring-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={20}/></button>
        <div>
          <h2><Building2 size={22} style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--primary-green)' }}/>Market Price Control</h2>
          <p className="text-muted">View and manage Minimum Support Prices for your zone.</p>
        </div>
        <button className="primary-btn" onClick={exportCSV}>⬇ Export CSV</button>
      </div>

      <div className="kpi-grid" style={{ marginBottom: 24 }}>
        <Card className="kpi-card"><div className="kpi-icon-wrapper bg-green-light"><IndianRupee className="text-green" size={22}/></div><div className="kpi-info"><p className="kpi-label">Avg MSP</p><h3 className="kpi-value">₹2,826</h3><p className="kpi-trend positive">Gov. Assured</p></div></Card>
        <Card className="kpi-card"><div className="kpi-icon-wrapper bg-orange-light"><TrendingUp className="text-orange" size={22}/></div><div className="kpi-info"><p className="kpi-label">Crops Above MSP</p><h3 className="kpi-value">4 / 6</h3><p className="kpi-trend positive">Good market</p></div></Card>
        <Card className="kpi-card"><div className="kpi-icon-wrapper" style={{backgroundColor:'#fee2e2'}}><AlertTriangle style={{color:'#ef4444'}} size={22}/></div><div className="kpi-info"><p className="kpi-label">Below MSP</p><h3 className="kpi-value">2</h3><p className="kpi-trend negative">Needs attention</p></div></Card>
      </div>

      <Card title="Current Crop Prices">
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th>Crop</th><th>MSP (₹/Qtl)</th><th>Market Price (₹/Qtl)</th><th>Change</th><th>Status</th></tr></thead>
            <tbody>
              {PRICES.map(r => (
                <tr key={r.crop}>
                  <td><strong>{r.crop}</strong></td>
                  <td>₹{r.msp.toLocaleString()}</td>
                  <td>₹{r.market.toLocaleString()}</td>
                  <td style={{ color: r.trend === 'up' ? 'var(--primary-green)' : '#ef4444', fontWeight: 600 }}>{r.change}</td>
                  <td><span className={`status-badge ${r.market >= r.msp ? 'delivered' : 'processing'}`}>{r.market >= r.msp ? 'Above MSP' : 'Below MSP'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
export default MarketPriceControl;
