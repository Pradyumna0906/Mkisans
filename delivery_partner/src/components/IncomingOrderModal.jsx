import { useState, useEffect } from 'react';
import { MapPin, Navigation, Package, Clock, Weight, IndianRupee, User, Phone, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function IncomingOrderModal() {
  const { incomingOrder, acceptOrder, rejectOrder } = useApp();
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (!incomingOrder) return;
    setTimeLeft(30);
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          rejectOrder();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [incomingOrder, rejectOrder]);

  if (!incomingOrder) return null;

  const progress = (timeLeft / 30) * 100;

  return (
    <div className="overlay">
      <div className="modal-sheet" style={{ paddingBottom: 32 }}>
        <div className="modal-handle" />

        {/* Timer */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-secondary)' }}>
              New Delivery Request
            </span>
            <span style={{
              fontSize: 'var(--font-sm)',
              fontWeight: 700,
              color: timeLeft <= 10 ? 'var(--red)' : 'var(--saffron)',
              animation: timeLeft <= 10 ? 'pulse 1s infinite' : 'none',
            }}>
              {timeLeft}s remaining
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill progress-saffron"
              style={{
                width: `${progress}%`,
                background: timeLeft <= 10
                  ? 'linear-gradient(90deg, var(--red), #F87171)'
                  : 'linear-gradient(90deg, var(--saffron), #FBBF24)',
              }}
            />
          </div>
        </div>

        {/* Order Details */}
        <div style={{
          background: 'linear-gradient(135deg, var(--green-light) 0%, #F0FDF4 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: 16,
          marginBottom: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div className="avatar" style={{ background: 'linear-gradient(135deg, var(--green), var(--green-dark))' }}>
              {incomingOrder.farmerAvatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-lg)' }}>{incomingOrder.farmerName}</div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>Farmer • Pickup Point</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: 'var(--font-xl)', color: 'var(--green)' }}>
                ₹{incomingOrder.deliveryCharge}
              </div>
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Delivery Fee</div>
            </div>
          </div>

          {/* Route */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, paddingTop: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', border: '2px solid white', boxShadow: '0 0 0 2px var(--green)' }} />
              <div style={{ width: 2, flex: 1, background: 'var(--green)', opacity: 0.3, margin: '4px 0' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--saffron)', border: '2px solid white', boxShadow: '0 0 0 2px var(--saffron)' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>PICKUP</div>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{incomingOrder.pickupLocation}</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>DROP-OFF</div>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{incomingOrder.deliveryLocation}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
          {[
            { icon: Navigation, label: 'Distance', value: incomingOrder.distance, color: 'var(--blue)' },
            { icon: Weight, label: 'Weight', value: incomingOrder.weight, color: 'var(--saffron)' },
            { icon: Clock, label: 'ETA', value: incomingOrder.estimatedTime, color: 'var(--green)' },
          ].map(item => (
            <div key={item.label} style={{
              background: 'var(--surface-tertiary)',
              borderRadius: 'var(--radius-md)',
              padding: 12,
              textAlign: 'center',
            }}>
              <item.icon size={18} color={item.color} style={{ margin: '0 auto 4px' }} />
              <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{item.label}</div>
              <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700 }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Items */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Items</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {incomingOrder.items.map((item, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--surface-tertiary)',
                borderRadius: 'var(--radius-full)',
                padding: '6px 12px',
                fontSize: 'var(--font-sm)',
              }}>
                <span>{item.icon}</span>
                <span style={{ fontWeight: 500 }}>{item.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)' }}>({item.qty})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
          <button
            onClick={rejectOrder}
            className="btn btn-lg"
            style={{
              background: 'var(--red-light)',
              color: 'var(--red)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <X size={20} />
            Reject
          </button>
          <button
            onClick={acceptOrder}
            className="btn btn-primary btn-lg"
            style={{ borderRadius: 'var(--radius-lg)' }}
          >
            <Check size={20} />
            Accept Order
          </button>
        </div>
      </div>
    </div>
  );
}
