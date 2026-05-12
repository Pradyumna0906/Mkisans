import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, Phone, AlertTriangle, ShieldAlert, Car, Wrench,
  MapPin, Send, CheckCircle
} from 'lucide-react';

export default function Emergency() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const emergencyTypes = [
    {
      id: 'sos', title: 'SOS Emergency', desc: 'Immediate help needed',
      icon: ShieldAlert, color: 'var(--red)', bg: 'var(--red-light)',
      action: 'call',
    },
    {
      id: 'accident', title: 'Accident Report', desc: 'Report a road accident',
      icon: AlertTriangle, color: '#F59E0B', bg: 'var(--amber-light)',
    },
    {
      id: 'breakdown', title: 'Vehicle Breakdown', desc: 'Vehicle needs repair',
      icon: Wrench, color: 'var(--blue)', bg: 'var(--blue-light)',
    },
    {
      id: 'emergency_call', title: 'Emergency Call', desc: 'Call helpline directly',
      icon: Phone, color: 'var(--green)', bg: 'var(--green-light)',
      action: 'call',
    },
  ];

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedType(null);
      setDescription('');
    }, 3000);
  };

  if (submitted) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: 32,
        textAlign: 'center', background: 'var(--white)',
      }}>
        <div className="animate-bounceIn" style={{
          width: 100, height: 100, borderRadius: '50%',
          background: 'var(--green-light)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', marginBottom: 24,
        }}>
          <CheckCircle size={48} color="var(--green)" />
        </div>
        <h2 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, marginBottom: 8 }}>Report Submitted</h2>
        <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', maxWidth: 280 }}>
          Our team has been notified. Help is on the way. Stay safe!
        </p>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ background: 'var(--white)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #DC2626, #991B1B)',
        padding: '20px 20px 24px', color: 'white',
        borderRadius: '0 0 28px 28px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <button onClick={() => navigate('/app')} style={{
            width: 36, height: 36, borderRadius: 'var(--radius-sm)',
            background: 'rgba(255,255,255,0.15)', display: 'flex',
            alignItems: 'center', justifyContent: 'center', color: 'white',
          }}>
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>Emergency</h1>
            <p style={{ fontSize: 'var(--font-xs)', opacity: 0.8 }}>We're here to help 24/7</p>
          </div>
        </div>

        {/* SOS Button */}
        <button style={{
          width: '100%', padding: 16, borderRadius: 'var(--radius-lg)',
          background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.3)',
          display: 'flex', alignItems: 'center', gap: 14, color: 'white',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(255,255,255,0.25)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            animation: 'pulse 2s infinite',
          }}>
            <Phone size={24} />
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontWeight: 700 }}>Emergency Helpline</div>
            <div style={{ fontSize: 'var(--font-xs)', opacity: 0.8 }}>Tap to call 1800-XXX-XXXX</div>
          </div>
        </button>
      </div>

      <div style={{ padding: '20px 16px' }}>
        {/* Emergency Type Selection */}
        {!selectedType ? (
          <>
            <div className="section-title">What happened?</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {emergencyTypes.map((type, idx) => (
                <button
                  key={type.id}
                  onClick={() => type.action === 'call' ? null : setSelectedType(type.id)}
                  className="card animate-fadeInUp"
                  style={{
                    padding: 16, display: 'flex', alignItems: 'center', gap: 14,
                    textAlign: 'left',
                    animationDelay: `${idx * 0.08}s`, animationFillMode: 'both',
                  }}
                >
                  <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-md)',
                    background: type.bg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: type.color,
                    flexShrink: 0,
                  }}>
                    <type.icon size={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-base)' }}>{type.title}</div>
                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>{type.desc}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Insurance Info */}
            <div style={{
              marginTop: 20, padding: 16,
              background: 'linear-gradient(135deg, var(--blue-light), #DBEAFE)',
              borderRadius: 'var(--radius-lg)',
            }}>
              <div style={{ fontWeight: 700, fontSize: 'var(--font-sm)', color: 'var(--blue)', marginBottom: 8 }}>
                🛡️ You're Covered
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
                <div>✓ Product damage insurance up to ₹10,000</div>
                <div>✓ Personal accident coverage</div>
                <div>✓ Vehicle breakdown assistance</div>
              </div>
            </div>
          </>
        ) : (
          /* Report Form */
          <div className="animate-fadeInUp">
            <button onClick={() => setSelectedType(null)} style={{
              display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)',
              fontSize: 'var(--font-sm)', marginBottom: 16,
            }}>
              <ChevronLeft size={16} /> Back
            </button>

            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, marginBottom: 16 }}>
              {selectedType === 'accident' ? '🚨 Accident Report' : '🔧 Breakdown Report'}
            </h3>

            <div className="input-group" style={{ marginBottom: 16 }}>
              <label className="input-label">
                <MapPin size={14} style={{ display: 'inline', marginRight: 4 }} />
                Current Location
              </label>
              <input className="input-field" value="Detecting location..." readOnly
                style={{ opacity: 0.7 }} />
            </div>

            <div className="input-group" style={{ marginBottom: 16 }}>
              <label className="input-label">Describe the situation</label>
              <textarea
                className="input-field"
                rows={4}
                placeholder="Tell us what happened..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>

            <button style={{
              width: '100%', padding: 14, border: '2px dashed var(--border-default)',
              borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, color: 'var(--text-secondary)', marginBottom: 20,
            }}>
              📷 Upload Photos (Optional)
            </button>

            <button onClick={handleSubmit} className="btn btn-danger btn-lg btn-block">
              <Send size={18} /> Submit Report
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
