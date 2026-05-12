import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, Phone, Mail, Shield, ChevronRight, 
  Check, AlertCircle, Lock, Bell, Moon, Globe,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Settings() {
  const navigate = useNavigate();
  const { partner, language, setLanguage } = useApp();
  const [activeModal, setActiveModal] = useState(null); // 'phone' | 'email' | 'password'
  const [phone, setPhone] = useState(partner.phone);
  const [email, setEmail] = useState(partner.email || 'partner@mkisans.com');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1: Input, 2: OTP

  const handleVerify = (type) => {
    alert(`OTP sent to your new ${type}`);
    setStep(2);
  };

  const confirmChange = () => {
    if (otp === '1234') {
      alert('Updated successfully!');
      setActiveModal(null);
      setStep(1);
      setOtp('');
    } else {
      alert('Invalid OTP. Use 1234 for testing.');
    }
  };

  return (
    <div className="page-container" style={{ background: 'var(--white)' }}>
      {/* Header */}
      <div style={{
        background: 'var(--white)',
        padding: '20px',
        borderBottom: '1px solid var(--border-light)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <button onClick={() => navigate(-1)} className="btn-icon">
          <ChevronLeft size={24} color="var(--text-primary)" />
        </button>
        <h1 style={{ fontSize: 'var(--font-xl)', fontWeight: 800 }}>Settings</h1>
      </div>

      <div style={{ padding: 20 }}>
        {/* Account Section */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 }}>Account Security</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <button onClick={() => setActiveModal('phone')} style={{ width: '100%', padding: 16, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)' }}>
                <Phone size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>Phone Number</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{partner.phone}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--green)' }}>VERIFIED</span>
                <ChevronRight size={16} color="var(--text-muted)" />
              </div>
            </button>

            <button onClick={() => setActiveModal('email')} style={{ width: '100%', padding: 16, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--blue-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--blue)' }}>
                <Mail size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>Email Address</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{email}</div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </button>

            <button onClick={() => setActiveModal('password')} style={{ width: '100%', padding: 16, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--red-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)' }}>
                <Lock size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>Change Password</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Update your security credentials</div>
              </div>
              <ChevronRight size={16} color="var(--text-muted)" />
            </button>
          </div>
        </div>

        {/* App Settings */}
        <div style={{ marginBottom: 24 }}>
          <h2 style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 0.5 }}>App Preferences</h2>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--surface-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <Bell size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>Push Notifications</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Order alerts, payout updates</div>
              </div>
              <div className="toggle-track active"><div className="toggle-thumb" /></div>
            </div>

            <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--surface-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <Globe size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>Language / भाषा</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>{language === 'en' ? 'English (India)' : 'हिन्दी (भारत)'}</div>
              </div>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)}
                style={{ border: 'none', background: 'var(--surface-secondary)', padding: '4px 8px', borderRadius: 8, fontSize: 12, fontWeight: 700 }}
              >
                <option value="en">EN</option>
                <option value="hi">HI</option>
              </select>
            </div>

            <div style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'var(--surface-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
                <Moon size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600 }}>Dark Mode</div>
                <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Follow system settings</div>
              </div>
              <div className="toggle-track"><div className="toggle-thumb" /></div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      {activeModal && (
        <div className="overlay" onClick={() => { setActiveModal(null); setStep(1); }}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 800, marginBottom: 8 }}>
              {activeModal === 'phone' ? 'Update Phone' : activeModal === 'email' ? 'Update Email' : 'Change Password'}
            </h3>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginBottom: 24 }}>
              {step === 1 
                ? `Enter your new ${activeModal} detail to continue.`
                : `Enter the 4-digit OTP sent to your new ${activeModal}.`
              }
            </p>

            {step === 1 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="input-group">
                  <label className="input-label">New {activeModal === 'phone' ? 'Phone Number' : activeModal === 'email' ? 'Email ID' : 'Password'}</label>
                  <input 
                    className="input-field" 
                    type={activeModal === 'password' ? 'password' : 'text'}
                    placeholder={`Enter new ${activeModal}`}
                    value={activeModal === 'phone' ? phone : email}
                    onChange={e => activeModal === 'phone' ? setPhone(e.target.value) : setEmail(e.target.value)}
                  />
                </div>
                <button 
                  onClick={() => handleVerify(activeModal)}
                  className="btn btn-primary btn-lg btn-block"
                >
                  Send Verification Code <ArrowRight size={18} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="input-group">
                  <label className="input-label">Enter OTP</label>
                  <input 
                    className="input-field" 
                    placeholder="X X X X"
                    maxLength={4}
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8 }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button onClick={() => setStep(1)} style={{ fontSize: 'var(--font-sm)', color: 'var(--green)', fontWeight: 600 }}>Resend Code</button>
                </div>
                <button 
                  onClick={confirmChange}
                  className="btn btn-primary btn-lg btn-block"
                >
                  Verify & Update
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
