import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCheck, ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import './MonitoringPage.css';

const APPLICATIONS = [
  { id: 1, name: 'Deepak Sharma',  vehicle: 'Tata Ace',           plate: 'UP-32-CD-4521', license: 'DL-0120112345', applied: '2026-05-07', status: 'pending' },
  { id: 2, name: 'Ravi Gupta',     vehicle: 'Mahindra Pickup',    plate: 'MH-14-EF-8823', license: 'DL-1120119876', applied: '2026-05-06', status: 'pending' },
  { id: 3, name: 'Sunil Yadav',    vehicle: 'Maruti Carry',       plate: 'RJ-01-AB-3312', license: 'DL-0220110001', applied: '2026-05-05', status: 'approved' },
  { id: 4, name: 'Harpreet Singh', vehicle: 'Ashok Leyland Dost', plate: 'PB-10-GH-7761', license: 'DL-0320118888', applied: '2026-05-04', status: 'pending' },
  { id: 5, name: 'Manish Patel',   vehicle: 'Tata 407',           plate: 'GJ-01-IJ-5543', license: 'DL-0420113333', applied: '2026-05-03', status: 'rejected' },
];

const PartnerVerification = () => {
  const navigate = useNavigate();
  const [apps, setApps] = useState(APPLICATIONS);

  const updateStatus = (id, status) => setApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));

  const exportCSV = () => {
    const header = 'Name,Vehicle,Plate,License,Applied,Status\n';
    const rows = apps.map(r => `${r.name},${r.vehicle},${r.plate},${r.license},${r.applied},${r.status}`).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'partner_verifications.csv'; a.click();
  };

  const pending = apps.filter(a => a.status === 'pending').length;

  return (
    <div className="dashboard-container">
      <div className="monitoring-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={20}/></button>
        <div>
          <h2><UserCheck size={22} style={{ marginRight: 8, verticalAlign: 'middle', color: '#0284c7' }}/>Delivery Partner Verification</h2>
          <p className="text-muted">{pending} applications pending review.</p>
        </div>
        <button className="primary-btn" onClick={exportCSV}>⬇ Export CSV</button>
      </div>

      <Card title="Pending Applications">
        <div className="table-responsive">
          <table className="data-table">
            <thead><tr><th>Partner Name</th><th>Vehicle</th><th>Plate No.</th><th>License</th><th>Applied</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {apps.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.name}</strong></td>
                  <td>{a.vehicle}</td>
                  <td>{a.plate}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{a.license}</td>
                  <td>{a.applied}</td>
                  <td><span className={`status-badge ${a.status === 'approved' ? 'delivered' : a.status === 'rejected' ? 'processing' : ''}`} style={a.status === 'pending' ? { background:'#f3f4f6', color:'#6b7280' } : {}}>{a.status}</span></td>
                  <td>
                    {a.status === 'pending' && (
                      <div style={{ display:'flex', gap:8 }}>
                        <button onClick={() => updateStatus(a.id, 'approved')} style={{ background:'var(--primary-green-light)', color:'var(--primary-green)', border:'none', borderRadius:6, padding:'4px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontSize:'0.8rem', fontWeight:600 }}><CheckCircle size={14}/>Approve</button>
                        <button onClick={() => updateStatus(a.id, 'rejected')} style={{ background:'#fee2e2', color:'#ef4444', border:'none', borderRadius:6, padding:'4px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:4, fontSize:'0.8rem', fontWeight:600 }}><XCircle size={14}/>Reject</button>
                      </div>
                    )}
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
export default PartnerVerification;
