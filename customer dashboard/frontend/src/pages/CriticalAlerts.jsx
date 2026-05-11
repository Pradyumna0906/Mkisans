import { useState } from 'react';
import { ShieldAlert, Clock, MapPin, ArrowRight, CheckCircle2, AlertTriangle, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import { useLang } from '../context/LanguageContext';
import './AdminDashboard.css';

const INITIAL_ALERTS = [
  { 
    id: 1, 
    type: 'critical', 
    title: 'Extreme Weather Warning', 
    desc: 'Severe hailstorm predicted in Ludhiana district. Broadcast alert to 1,200 farmers.',
    time: '15 mins ago',
    category: 'Weather',
    resolved: false
  },
  { 
    id: 2, 
    type: 'warning', 
    title: 'High Pending Verifications', 
    desc: '12 new delivery partner applications pending review for more than 48 hours.',
    time: '2 hours ago',
    category: 'Operational',
    resolved: false
  },
  { 
    id: 3, 
    type: 'critical', 
    title: 'Logistics Bottleneck', 
    desc: 'Route blockage detected on NH-44 affecting 4 active deliveries from West Zone.',
    time: '4 hours ago',
    category: 'Logistics',
    resolved: false
  },
  { 
    id: 4, 
    type: 'info', 
    title: 'Seed Distribution Cycle', 
    desc: 'Subsidized wheat seeds available for Punjab region. Update portal news.',
    time: 'Yesterday',
    category: 'Scheme',
    resolved: false
  }
];

const CriticalAlerts = () => {
  const { t } = useLang();
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  const handleTakeAction = (id) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? { ...alert, resolved: true } : alert
    ));
  };

  const handleClearResolved = () => {
    setAlerts(prev => prev.filter(alert => !alert.resolved));
  };

  const unresolvedCritical = alerts.filter(a => a.type === 'critical' && !a.resolved).length;
  const activeWarnings = alerts.filter(a => a.type === 'warning' && !a.resolved).length;
  const hasResolved = alerts.some(a => a.resolved);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>{t.alerts}</h2>
          <p className="text-muted">Real-time operational alerts and critical system notifications.</p>
        </div>
      </div>

      <div className="alerts-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '24px' }}>
        <div className="alerts-list-column">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {alerts.length === 0 ? (
              <Card className="flex-center" style={{ padding: '60px', flexDirection: 'column' }}>
                <CheckCircle size={48} className="text-green mb-4" opacity={0.5} />
                <h3>All Clear!</h3>
                <p className="text-muted">No active alerts requiring attention.</p>
              </Card>
            ) : (
              alerts.map(alert => (
                <Card key={alert.id} className={`alert-item-card ${alert.type} ${alert.resolved ? 'resolved-opacity' : ''}`}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <div className={`alert-icon-wrapper ${alert.resolved ? 'bg-gray-light' : alert.type === 'critical' ? 'bg-red-light' : alert.type === 'warning' ? 'bg-orange-light' : 'bg-blue-light'}`}>
                      {alert.resolved ? <CheckCircle className="text-green" size={24} /> :
                       alert.type === 'critical' ? <ShieldAlert className="text-danger" size={24} /> : 
                       alert.type === 'warning' ? <AlertTriangle className="text-orange" size={24} /> : 
                       <Clock className="text-blue" size={24} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: alert.resolved ? 'var(--text-muted)' : 'inherit' }}>
                          {alert.title} {alert.resolved && <span style={{ fontSize: '0.8rem', fontWeight: 400 }}>(Resolved)</span>}
                        </h4>
                        <span className="text-muted text-xs">{alert.time}</span>
                      </div>
                      <p style={{ margin: '0 0 12px 0', color: alert.resolved ? 'var(--text-muted)' : 'var(--text-dark)', fontSize: '0.95rem', lineHeight: 1.5 }}>
                        {alert.desc}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="status-badge" style={{ fontSize: '0.75rem', opacity: alert.resolved ? 0.6 : 1 }}>{alert.category}</span>
                        {alert.resolved ? (
                          <span className="flex-center text-green font-bold text-sm">
                            <CheckCircle2 size={16} className="mr-1" /> Done
                          </span>
                        ) : (
                          <button className="text-btn flex-center" style={{ fontWeight: 600 }} onClick={() => handleTakeAction(alert.id)}>
                            Take Action <ArrowRight size={14} style={{ marginLeft: '4px' }} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="alerts-stats-column">
          <Card title="Alert Statistics">
            <div style={{ padding: '8px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="text-muted">Unresolved Critical</span>
                <span className="font-bold text-danger">{unresolvedCritical}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="text-muted">Active Warnings</span>
                <span className="font-bold text-orange">{activeWarnings}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span className="text-muted">Avg. Response Time</span>
                <span className="font-bold text-blue">14 mins</span>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '16px 0' }} />
              <button 
                className={`secondary-btn w-full flex-center ${!hasResolved ? 'disabled-btn' : ''}`}
                onClick={handleClearResolved}
                disabled={!hasResolved}
              >
                <CheckCircle2 size={16} style={{ marginRight: '8px' }} />
                Clear All Resolved
              </button>
            </div>
          </Card>

          <Card title="Regional Impact" className="mt-6">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="flex-between">
                <span className="flex-center text-sm"><MapPin size={14} className="mr-2 text-green" /> Punjab</span>
                <span className={`status-badge ${unresolvedCritical > 1 ? 'negative' : 'processing'}`}>
                  {unresolvedCritical > 1 ? 'High' : 'Medium'}
                </span>
              </div>
              <div className="flex-between">
                <span className="flex-center text-sm"><MapPin size={14} className="mr-2 text-green" /> Haryana</span>
                <span className="status-badge processing">Medium</span>
              </div>
              <div className="flex-between">
                <span className="flex-center text-sm"><MapPin size={14} className="mr-2 text-green" /> UP</span>
                <span className="status-badge delivered">Low</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CriticalAlerts;
