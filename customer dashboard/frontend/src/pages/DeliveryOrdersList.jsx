import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Card from '../components/ui/Card';

const DeliveryOrdersList = () => {
  const { id, status } = useParams();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getStatusTitle = () => {
    switch (status) {
      case 'completed_today': return 'Orders Completed Today';
      case 'pending': return 'Pending Deliveries';
      case 'total': return 'Total Orders Completed';
      case 'future': return 'Future / Scheduled Orders';
      default: return 'Orders';
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/delivery/${id}/orders?status=${status}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [id, status]);

  return (
    <div className="dashboard-container" style={{ padding: '24px' }}>
      <div className="dashboard-header" style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate(-1)} style={{ padding: '8px', borderRadius: '50%', backgroundColor: 'var(--bg-white)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2>{getStatusTitle()}</h2>
          <p className="text-muted">Detailed view of all specific orders for this metric.</p>
        </div>
      </div>

      <Card>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading orders...</div>
        ) : error ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--orange-accent)' }}>Error: {error}</div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>No orders found for this category.</div>
        ) : (
          <div className="table-responsive">
            <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light-gray)', color: 'var(--text-muted)' }}>Order ID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light-gray)', color: 'var(--text-muted)' }}>Customer</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light-gray)', color: 'var(--text-muted)' }}>Address</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light-gray)', color: 'var(--text-muted)' }}>Date</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-light-gray)', color: 'var(--text-muted)' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: '600' }}>{order.order_id}</td>
                    <td style={{ padding: '12px 16px' }}>{order.customer_name} <br/><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customer_type}</span></td>
                    <td style={{ padding: '12px 16px' }}>{order.address}</td>
                    <td style={{ padding: '12px 16px' }}>{new Date(order.scheduled_date).toLocaleDateString()}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--primary-green)', fontWeight: '600' }}>₹{order.amount}</td>
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

export default DeliveryOrdersList;
