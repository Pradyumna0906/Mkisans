import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '../components/ui/Card';

const DeliveryEarningsList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/delivery/${id}/earnings`);
        if (!response.ok) throw new Error('Failed to fetch earnings');
        const data = await response.json();
        setEarnings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [id]);

  const totalEarnings = earnings.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <div className="dashboard-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2>Earnings Dashboard</h2>
          <p className="text-muted">Detailed view of your recent transactions and bonuses.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        <Card className="kpi-card">
          <div className="kpi-info" style={{ padding: '20px' }}>
            <p className="kpi-label">Total Earnings Captured</p>
            <h3 className="kpi-value text-green">₹{totalEarnings}</h3>
          </div>
        </Card>
      </div>

      <Card title="Transaction History">
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading earnings...</div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--orange-accent)' }}>Error: {error}</div>
        ) : earnings.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions found.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light-gray)', color: 'var(--text-muted)' }}>Transaction ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light-gray)', color: 'var(--text-muted)' }}>Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light-gray)', color: 'var(--text-muted)' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light-gray)', color: 'var(--text-muted)' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {earnings.map(earning => (
                  <tr key={earning.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{earning.transaction_id}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.75rem', 
                        fontWeight: '600',
                        backgroundColor: earning.type === 'bonus' ? 'var(--orange-accent-light)' : 'var(--primary-green-light)',
                        color: earning.type === 'bonus' ? 'var(--orange-accent)' : 'var(--primary-green)'
                      }}>
                        {earning.type.toUpperCase()}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>{new Date(earning.date).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--primary-green)', fontWeight: '600' }}>₹{earning.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default DeliveryEarningsList;
