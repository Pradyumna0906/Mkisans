import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft, Navigation, Phone, MapPin, Package, Camera, Check,
  QrCode, KeyRound, Weight, Thermometer, Clock, User, CheckCircle2,
  ArrowRight, AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import MapComponent from '../components/MapComponent';

const STEPS = [
  { id: 1, label: 'Navigate', icon: Navigation },
  { id: 2, label: 'Pickup', icon: Package },
  { id: 3, label: 'In Transit', icon: Navigation },
  { id: 4, label: 'Deliver', icon: CheckCircle2 },
];

export default function ActiveDelivery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders, deliveryStep, advanceDelivery, completeDelivery } = useApp();
  const [otpInput, setOtpInput] = useState('');
  const [photoTaken, setPhotoTaken] = useState(false);
  const [damageChecked, setDamageChecked] = useState(false);
  const [deliveryOtp, setDeliveryOtp] = useState('');

  const order = orders.active.find(o => o.id === id) || orders.active[0];
  if (!order) {
    return (
      <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="empty-state">
          <div className="empty-state-icon"><Package size={32} /></div>
          <div style={{ fontWeight: 700 }}>No Active Delivery</div>
          <button onClick={() => navigate('/app')} className="btn btn-primary">Go Home</button>
        </div>
      </div>
    );
  }

  const currentStep = Math.max(deliveryStep, 1);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--surface-secondary)', paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green), var(--green-dark))',
        padding: '16px 16px 20px', color: 'white',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button onClick={() => navigate('/app')} style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <ChevronLeft size={20} />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700 }}>Order #{order.id}</div>
            <div style={{ fontSize: 'var(--font-xs)', opacity: 0.8 }}>₹{order.deliveryCharge} • {order.distance}</div>
          </div>
          <a href="tel:+919456712345" style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
            <Phone size={18} />
          </a>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{
                height: 4, width: '100%', borderRadius: 2,
                background: i < currentStep ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                transition: 'all 0.3s ease',
              }} />
              <span style={{ fontSize: 10, opacity: i < currentStep ? 1 : 0.5, fontWeight: i + 1 === currentStep ? 700 : 400 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Map View */}
      <div style={{ height: 250, position: 'relative', overflow: 'hidden' }}>
        <MapComponent 
          points={[
            [23.2384, 77.2913], // Green Valley Farm (Sehore Road)
            [23.2166, 77.4266]  // Arera Colony (Bhopal)
          ]} 
          height="100%" 
        />
        
        {/* Farm & Destination Labels */}
        <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ padding: '4px 8px', background: 'var(--green)', color: 'white', borderRadius: 6, fontSize: 10, fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            🌾 {order.farmerName}'s Farm
          </div>
          <div style={{ padding: '4px 8px', background: 'var(--saffron)', color: 'white', borderRadius: 6, fontSize: 10, fontWeight: 700, boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
            📍 Delivery Point
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        {/* Route Info */}
        <div className="card" style={{ padding: 16, marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'stretch' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', border: '2px solid white', boxShadow: '0 0 0 2px var(--green)' }} />
              <div style={{ width: 2, flex: 1, background: 'var(--green)', opacity: 0.3, margin: '4px 0' }} />
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--saffron)', border: '2px solid white', boxShadow: '0 0 0 2px var(--saffron)' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>PICKUP • {order.farmerName}</div>
                  <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{order.pickupLocation}</div>
                </div>
                <a href={`tel:${order.farmerPhone}`} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)', flexShrink: 0 }}>
                  <Phone size={16} />
                </a>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', fontWeight: 600 }}>DROP-OFF • {order.customerName}</div>
                  <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>{order.deliveryLocation}</div>
                </div>
                <a href={`tel:${order.customerPhone}`} style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--saffron-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--saffron-dark)', flexShrink: 0 }}>
                  <Phone size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Step Content */}
        {currentStep === 1 && (
          <div className="animate-fadeInUp">
            <div className="card" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: 12 }}>📍 Navigating to Pickup</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 12 }}>
                {[
                  { label: 'Distance', value: order.distance, icon: MapPin },
                  { label: 'ETA', value: order.estimatedTime, icon: Clock },
                  { label: 'Weight', value: order.weight, icon: Weight },
                ].map(i => (
                  <div key={i.label} style={{ textAlign: 'center', padding: 8, background: 'var(--surface-tertiary)', borderRadius: 'var(--radius-sm)' }}>
                    <i.icon size={16} color="var(--green)" style={{ margin: '0 auto 4px' }} />
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{i.label}</div>
                    <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700 }}>{i.value}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
                Items: {order.items?.map(i => `${i.icon} ${i.name} (${i.qty})`).join(', ')}
              </div>
            </div>
            <button onClick={advanceDelivery} className="btn btn-primary btn-lg btn-block">
              Arrived at Pickup <ArrowRight size={18} />
            </button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="animate-fadeInUp">
            <div className="card" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: 12 }}>🔐 Pickup Verification</div>
              {/* OTP */}
              <div className="input-group" style={{ marginBottom: 12 }}>
                <label className="input-label">Enter Pickup OTP</label>
                <input className="input-field" placeholder="4-digit OTP from farmer"
                  value={otpInput} onChange={e => setOtpInput(e.target.value)} maxLength={4} />
              </div>
              {/* QR Scan */}
              <button style={{ width: '100%', padding: 14, border: '2px dashed var(--border-default)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: 12 }}>
                <QrCode size={20} /> Scan QR Code
              </button>
              {/* Photo Upload */}
              <button onClick={() => setPhotoTaken(true)} style={{
                width: '100%', padding: 14, borderRadius: 'var(--radius-md)',
                background: photoTaken ? 'var(--green-light)' : 'var(--surface-tertiary)',
                border: photoTaken ? '2px solid var(--green)' : '2px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                color: photoTaken ? 'var(--green)' : 'var(--text-secondary)', marginBottom: 12,
              }}>
                {photoTaken ? <Check size={20} /> : <Camera size={20} />}
                {photoTaken ? 'Photo Captured ✓' : 'Take Product Photo'}
              </button>
              {/* Damage Check */}
              <button onClick={() => setDamageChecked(true)} style={{
                width: '100%', padding: 14, borderRadius: 'var(--radius-md)',
                background: damageChecked ? 'var(--green-light)' : 'var(--surface-tertiary)',
                border: damageChecked ? '2px solid var(--green)' : '2px solid transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                color: damageChecked ? 'var(--green)' : 'var(--text-secondary)',
              }}>
                {damageChecked ? <Check size={20} /> : <AlertCircle size={20} />}
                {damageChecked ? 'No Damage Confirmed ✓' : 'Damage Check'}
              </button>
            </div>
            <button onClick={advanceDelivery} className="btn btn-primary btn-lg btn-block">
              <Package size={18} /> Picked Up - Start Delivery
            </button>
          </div>
        )}

        {currentStep === 3 && (
          <div className="animate-fadeInUp">
            <div className="card" style={{ padding: 16, marginBottom: 12, background: 'linear-gradient(135deg, var(--blue-light), #DBEAFE)' }}>
              <div style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: 8, color: 'var(--blue)' }}>🚗 In Transit</div>
              <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 12 }}>
                Delivering to {order.customerName} at {order.deliveryLocation}
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[
                  { label: 'ETA', value: '15 min' },
                  { label: 'Remaining', value: '4.2 km' },
                ].map(i => (
                  <div key={i.label} style={{ flex: 1, padding: 10, background: 'rgba(255,255,255,0.7)', borderRadius: 'var(--radius-sm)', textAlign: 'center' }}>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{i.label}</div>
                    <div style={{ fontWeight: 700 }}>{i.value}</div>
                  </div>
                ))}
              </div>
            </div>
            {order.temperatureReq && order.temperatureReq !== 'Normal' && (
              <div className="card" style={{ padding: 12, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10, background: 'var(--cyan-light)' }}>
                <Thermometer size={20} color="var(--cyan)" />
                <div>
                  <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>Cold Chain Active</div>
                  <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{order.temperatureReq}</div>
                </div>
              </div>
            )}
            <button onClick={advanceDelivery} className="btn btn-primary btn-lg btn-block">
              Arrived at Customer <ArrowRight size={18} />
            </button>
          </div>
        )}

        {currentStep >= 4 && (
          <div className="animate-fadeInUp">
            <div className="card" style={{ padding: 16, marginBottom: 12 }}>
              <div style={{ fontSize: 'var(--font-base)', fontWeight: 700, marginBottom: 12 }}>✅ Delivery Verification</div>
              
              <div className="input-group" style={{ marginBottom: 12 }}>
                <label className="input-label">Customer OTP</label>
                <input className="input-field" placeholder="Enter customer OTP"
                  value={deliveryOtp} onChange={e => setDeliveryOtp(e.target.value)} maxLength={4} />
              </div>

              {/* Digital Signature */}
              <div style={{ marginBottom: 12 }}>
                <label className="input-label" style={{ marginBottom: 8, display: 'block' }}>Digital Signature</label>
                <div style={{
                  height: 120,
                  background: '#f1f5f9',
                  border: '2px dashed var(--border-default)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: 'var(--font-xs)' }}>Sign Here</span>
                  <div style={{ position: 'absolute', bottom: 8, right: 8 }}>
                    <button style={{ fontSize: 10, color: 'var(--blue)', fontWeight: 600 }}>Clear</button>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                <button style={{ width: '100%', padding: 12, border: '1px solid var(--border-default)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
                  <QrCode size={16} /> QR Scan
                </button>
                <button style={{ width: '100%', padding: 12, background: 'var(--surface-tertiary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
                  <Camera size={16} /> Photo Proof
                </button>
              </div>
            </div>

            {/* Cold Chain Status (if applicable) */}
            {order.temperatureReq && order.temperatureReq !== 'Normal' && (
              <div className="card" style={{ padding: 16, marginBottom: 12, background: 'var(--cyan-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Thermometer size={18} color="var(--cyan)" />
                    <span style={{ fontWeight: 700, fontSize: 'var(--font-sm)', color: 'var(--cyan-dark)' }}>Temperature Log</span>
                  </div>
                  <span className="badge" style={{ background: 'white', color: 'var(--cyan-dark)' }}>Stabilized</span>
                </div>
                <div style={{ height: 40, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                  {[4, 5, 4, 4, 6, 5, 4, 5, 4, 3, 4, 5].map((temp, i) => (
                    <div key={i} style={{
                      flex: 1,
                      height: `${temp * 10}%`,
                      background: temp > 5 ? 'var(--red)' : 'var(--cyan)',
                      borderRadius: '2px 2px 0 0',
                      opacity: 0.6
                    }} />
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 10, color: 'var(--text-muted)' }}>
                  <span>Pickup</span>
                  <span>Now: 4.2°C</span>
                </div>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
              <button className="btn btn-lg" style={{ background: 'var(--saffron-light)', color: 'var(--saffron-dark)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-sm)' }}>
                Not Available
              </button>
              <button className="btn btn-lg" style={{ background: 'var(--red-light)', color: 'var(--red)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-sm)' }}>
                Return Order
              </button>
            </div>
            <button onClick={() => { completeDelivery(order.id); navigate('/app'); }} className="btn btn-primary btn-lg btn-block">
              <Check size={20} /> Mark as Delivered
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
