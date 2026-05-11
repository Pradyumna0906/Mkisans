import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Send, CloudRain, Bug, Thermometer } from 'lucide-react';
import Card from '../components/ui/Card';
import './MonitoringPage.css';

const ADVISORIES = [
  { id: 1, type: 'Weather', icon: '🌧️', title: 'Heavy Rainfall Alert', msg: 'Heavy rainfall expected in northern districts. Delay harvesting operations.', date: '2026-05-09', sent: true },
  { id: 2, type: 'Pest',    icon: '🐛', title: 'Locust Warning',        msg: 'Locust swarms detected near eastern borders. Apply recommended pesticides.', date: '2026-05-08', sent: true },
  { id: 3, type: 'Weather', icon: '🌡️', title: 'Heat Wave Advisory',   msg: 'Temperature may exceed 44°C. Irrigate crops early morning or late evening.', date: '2026-05-07', sent: false },
];

const TYPES = ['Weather', 'Pest', 'Heat', 'Other'];

const WeatherAdvisories = () => {
  const navigate = useNavigate();
  const [advisories, setAdvisories] = useState(ADVISORIES);
  const [form, setForm] = useState({ type: 'Weather', title: '', msg: '' });
  const [sent, setSent] = useState(false);

  const broadcast = (e) => {
    e.preventDefault();
    if (!form.title || !form.msg) return;
    setAdvisories(prev => [{ id: Date.now(), type: form.type, icon: form.type === 'Weather' ? '🌧️' : form.type === 'Pest' ? '🐛' : '🌡️', title: form.title, msg: form.msg, date: new Date().toISOString().split('T')[0], sent: true }, ...prev]);
    setForm({ type: 'Weather', title: '', msg: '' });
    setSent(true); setTimeout(() => setSent(false), 3000);
  };

  const exportCSV = () => {
    const header = 'Type,Title,Message,Date,Broadcast\n';
    const rows = advisories.map(r => `${r.type},"${r.title}","${r.msg}",${r.date},${r.sent}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'advisories.csv'; a.click();
  };

  return (
    <div className="dashboard-container">
      <div className="monitoring-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={20}/></button>
        <div>
          <h2><ShieldAlert size={22} style={{ marginRight: 8, verticalAlign: 'middle', color: 'var(--orange-accent)' }}/>Weather / Pest Advisories</h2>
          <p className="text-muted">Broadcast alerts directly to all registered farmers in your zone.</p>
        </div>
        <button className="primary-btn" onClick={exportCSV}>⬇ Export CSV</button>
      </div>

      {/* Compose form */}
      <Card title="Broadcast New Advisory">
        <form onSubmit={broadcast} style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:12 }}>
            <div>
              <label style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-muted)', display:'block', marginBottom:6 }}>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))} style={{ width:'100%', padding:'10px 12px', border:'1.5px solid var(--border-color)', borderRadius:8, fontSize:'0.9rem', outline:'none' }}>
                {TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-muted)', display:'block', marginBottom:6 }}>Advisory Title</label>
              <input value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} placeholder="e.g. Heavy Rainfall Warning" required style={{ width:'100%', padding:'10px 12px', border:'1.5px solid var(--border-color)', borderRadius:8, fontSize:'0.9rem', outline:'none' }}/>
            </div>
          </div>
          <div>
            <label style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-muted)', display:'block', marginBottom:6 }}>Message</label>
            <textarea value={form.msg} onChange={e => setForm(f => ({...f, msg: e.target.value}))} placeholder="Write the advisory message for farmers..." required rows={3} style={{ width:'100%', padding:'10px 12px', border:'1.5px solid var(--border-color)', borderRadius:8, fontSize:'0.9rem', outline:'none', resize:'vertical', fontFamily:'inherit' }}/>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <button type="submit" className="primary-btn" style={{ display:'flex', alignItems:'center', gap:8 }}><Send size={16}/>Broadcast to Farmers</button>
            {sent && <span style={{ color:'var(--primary-green)', fontWeight:600, fontSize:'0.9rem' }}>✓ Advisory sent successfully!</span>}
          </div>
        </form>
      </Card>

      {/* History */}
      <Card title="Advisory History" style={{ marginTop: 20 }}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {advisories.map(a => (
            <div key={a.id} style={{ display:'flex', gap:14, padding:'14px 16px', border:'1px solid var(--border-color)', borderRadius:10, alignItems:'flex-start' }}>
              <span style={{ fontSize:'1.5rem' }}>{a.icon}</span>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4 }}>
                  <strong style={{ fontSize:'0.95rem' }}>{a.title}</strong>
                  <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{a.date}</span>
                </div>
                <p style={{ fontSize:'0.85rem', color:'var(--text-muted)', margin:0 }}>{a.msg}</p>
              </div>
              <span className={`status-badge ${a.sent ? 'delivered' : 'processing'}`}>{a.sent ? 'Sent' : 'Draft'}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
export default WeatherAdvisories;
