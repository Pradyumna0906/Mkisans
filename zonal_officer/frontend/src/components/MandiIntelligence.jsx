import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, MapPin, 
  Sparkles, Bell, BrainCircuit, Info 
} from 'lucide-react';
import './MandiIntelligence.css';

const BASE_URL = 'http://localhost:5000';

const MandiIntelligence = ({ commodity = 'Wheat', market = 'Bhopal', state = 'Madhya Pradesh' }) => {
  const [loading, setLoading] = useState(true);
  const [intel, setIntel] = useState(null);
  const [history, setHistory] = useState([]);
  const [nearby, setNearby] = useState([]);

  useEffect(() => {
    fetchData();
  }, [commodity, market]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [intelRes, histRes, nearRes] = await Promise.all([
        fetch(`${BASE_URL}/api/mandi-prices/intelligence?commodity=${commodity}&market=${market}`),
        fetch(`${BASE_URL}/api/mandi-prices/historical?commodity=${commodity}&market=${market}&days=15`),
        fetch(`${BASE_URL}/api/mandi-prices/nearby?commodity=${commodity}&state=${state}`)
      ]);

      const intelJson = await intelRes.json();
      const histJson = await histRes.json();
      const nearJson = await nearRes.json();

      if (intelJson.success) setIntel(intelJson.data);
      if (histJson.success) setHistory(histJson.data.map(h => ({
        date: new Date(h.price_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        price: h.modal_price
      })));
      if (nearJson.success) setNearby(nearJson.data);

    } catch (err) {
      console.error('Failed to fetch intelligence:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="intel-loading">Analyzing Market Trends...</div>;

  return (
    <div className="mandi-intel-container">
      <div className="intel-header">
        <div className="title-section">
          <h2><BrainCircuit size={28} /> Mandi Price Intelligence</h2>
          <p>Real-time analytics & AI predictions for <strong>{commodity}</strong></p>
        </div>
        <button className="alert-btn">
          <Bell size={18} /> Price Alert
        </button>
      </div>

      <div className="intel-dashboard">
        {/* Main Stats */}
        <div className="stats-row">
          <div className="main-stat-card">
            <span className="stat-label">Current Modal Price</span>
            <div className="stat-value-row">
              <h3>₹{intel?.currentPrice}</h3>
              <span className={`trend-badge ${intel?.trend}`}>
                {intel?.trend === 'UP' ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {intel?.trend}
              </span>
            </div>
            <p className="stat-sub">Updated on {new Date().toLocaleDateString()}</p>
          </div>

          <div className="ai-suggestion-card">
            <span className="stat-label">AI Suggested Selling Price</span>
            <h3>₹{intel?.suggestedSellingPrice}</h3>
            <div className="ai-rec-badge">
              <Sparkles size={14} /> Recommendation: {intel?.trend === 'UP' ? 'HOLD' : 'SELL'}
            </div>
          </div>
        </div>

        {/* Charts & Nearby */}
        <div className="charts-grid">
          <div className="chart-section card-box">
            <h4>📈 Price Trend Analysis (Last 15 Days)</h4>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#138808" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#138808" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#138808" 
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="nearby-section card-box">
            <h4><MapPin size={18} /> Nearby Mandi Comparison</h4>
            <div className="nearby-list">
              {nearby.map((m, i) => (
                <div key={i} className="nearby-item">
                  <span className="mandi-name">{m.market}</span>
                  <div className="mandi-price-row">
                    <span className="mandi-price">₹{m.modal_price}</span>
                    <span className={`mandi-diff ${m.modal_price >= intel?.currentPrice ? 'plus' : 'minus'}`}>
                      {m.modal_price >= intel?.currentPrice ? '+' : ''}{m.modal_price - intel?.currentPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insight Footer */}
        <div className="ai-insight-box">
          <div className="insight-icon"><Info size={20} /></div>
          <div className="insight-text">
            <strong>AI Insight:</strong> {intel?.recommendation} 
            Confidence score: {Math.round((intel?.prediction?.confidence || 0.85) * 100)}%. 
            Based on historical volume and regional demand momentum.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MandiIntelligence;
