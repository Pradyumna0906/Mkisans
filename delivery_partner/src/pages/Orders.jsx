import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Check, X, Clock, ChevronRight, MapPin, Weight, Zap, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';
import translations from '../translations.json';

export default function Orders() {
  const [activeTab, setActiveTab] = useState(0);
  const { orders, startBatch, language } = useApp();
  const navigate = useNavigate();
  const t = (translations[language] || translations['en'] || {});

  const tabKeys = ['active', 'upcoming', 'completed', 'cancelled'];
  const currentOrders = orders[tabKeys[activeTab]] || [];

  const statusConfig = {
    in_transit: { label: t.online, color: 'var(--blue)', bg: 'var(--blue-light)' },
    navigating_to_pickup: { label: 'To Pickup', color: 'var(--saffron)', bg: 'var(--saffron-light)' },
    assigned: { label: 'Assigned', color: 'var(--purple)', bg: 'var(--purple-light)' },
    delivered: { label: 'Delivered', color: 'var(--green)', bg: 'var(--green-light)' },
    cancelled: { label: 'Cancelled', color: 'var(--red)', bg: 'var(--red-light)' },
  };

  const TABS = [t.active, t.upcoming, t.completed, t.cancelled || 'Cancelled'];

  return (
    <div className="page-container" style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{ background: 'var(--white)', padding: '20px 20px 0', borderBottom: '1px solid var(--border-light)' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>{t.orders}</h1>
        
        <div className="tabs">
          {tabKeys.map((key, i) => (
            <button 
              key={key} 
              className={`tab ${activeTab === i ? 'active' : ''}`} 
              onClick={() => setActiveTab(i)}
              style={{ flex: 1, fontSize: 13 }}
            >
              {TABS[i]}
              {orders[key]?.length > 0 && (
                <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 800, background: activeTab === i ? 'var(--green)' : 'var(--text-muted)', color: 'white', borderRadius: 6, padding: '1px 6px' }}>
                  {orders[key].length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {activeTab === 0 && (
          <div className="card" style={{ 
            background: 'linear-gradient(135deg, var(--purple-light) 0%, #EDE9FE 100%)', 
            border: '1px solid #DDD6FE', padding: 16, marginBottom: 16 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Zap size={18} color="var(--purple)" />
              <span style={{ fontWeight: 800, fontSize: 13, color: 'var(--purple)' }}>AI BATCH DELIVERY</span>
            </div>
            <div style={{ fontSize: 12, color: '#6D28D9', marginBottom: 16, lineHeight: 1.5 }}>
              Batch delivery detected! Start both orders together to earn extra bonus.
            </div>
            <button 
              onClick={() => {
                startBatch();
                navigate('/app/delivery/MK-4523');
              }}
              className="btn btn-primary" 
              style={{ background: 'var(--purple)', border: 'none', width: '100%', height: 44, borderRadius: 12 }}
            >
              Start Batch Delivery
            </button>
          </div>
        )}

        {currentOrders.length === 0 ? (
          <div className="empty-state" style={{ padding: '60px 20px' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--surface-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: 'var(--text-muted)' }}>
              <Package size={32} />
            </div>
            <div style={{ fontWeight: 700, fontSize: 18, color: 'var(--text-primary)' }}>No Orders Yet</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>Orders in this category will appear here.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            {currentOrders.map((order, idx) => {
              const st = statusConfig[order.status] || statusConfig.assigned;
              return (
                <div key={order.id} className="card animate-fadeInUp" style={{ padding: 0, overflow: 'hidden', animationDelay: `${idx * 0.05}s` }}>
                  <div style={{ height: 4, background: st.color }} />
                  <div style={{ padding: 20 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                      <div>
                        <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>#{order.id}</div>
                        <span className="badge" style={{ background: st.bg, color: st.color, fontSize: 10 }}>{st.label}</span>
                      </div>
                      <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--green)' }}>₹{order.deliveryCharge}</div>
                    </div>

                    {/* Call Actions */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                      <a href={`tel:${order.farmerPhone}`} style={{ textDecoration: 'none' }}>
                        <button className="btn btn-sm" style={{ width: '100%', background: '#f1f5f9', color: 'var(--text-primary)', border: '1px solid var(--border-light)', borderRadius: 12, height: 40 }}>
                          <PhoneCall size={14} style={{ color: 'var(--green)' }} /> {t.call} {t.pickup}
                        </button>
                      </a>
                      <a href={`tel:${order.customerPhone}`} style={{ textDecoration: 'none' }}>
                        <button className="btn btn-sm" style={{ width: '100%', background: '#f1f5f9', color: 'var(--text-primary)', border: '1px solid var(--border-light)', borderRadius: 12, height: 40 }}>
                          <PhoneCall size={14} style={{ color: 'var(--blue)' }} /> {t.call} {t.dropoff}
                        </button>
                      </a>
                    </div>

                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 20 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 6 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', border: '2px solid white', boxShadow: '0 0 0 1px var(--green)' }} />
                        <div style={{ width: 2, height: 32, background: 'var(--border-default)', opacity: 0.5, margin: '4px 0' }} />
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--saffron)', border: '2px solid white', boxShadow: '0 0 0 1px var(--saffron)' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>{t.pickup}</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{order.pickupLocation}</div>
                        </div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 2 }}>{t.dropoff}</div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{order.deliveryLocation}</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 16, borderTop: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>
                        <span>📍 {order.distance}</span>
                        <span>⚖️ {order.weight}</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/app/delivery/${order.id}`)}
                        style={{ border: 'none', background: 'none', color: 'var(--green)', fontWeight: 800, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                      >
                        DETAILS <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
