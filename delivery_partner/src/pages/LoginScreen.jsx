import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ArrowRight, Shield, Truck, ChevronLeft } from 'lucide-react';

export default function LoginScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState('phone'); // phone | otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phone.length >= 10) setStep('otp');
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    // Auto focus next
    if (value && index < 5) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length === 6) {
      try {
        const response = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phone,
            password: 'password123' // Default for demo
          })
        });

        const data = await response.json();
        if (data.success) {
          localStorage.setItem('mkisans_token', data.token);
          window.location.href = '/app';
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('Could not connect to server.');
      }
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--white)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(165deg, #0A5E04 0%, #138808 50%, #1A9E0A 100%)',
        padding: '48px 24px 40px',
        borderRadius: '0 0 32px 32px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute',
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)',
          top: -60,
          right: -40,
        }} />

        {step === 'otp' && (
          <button
            onClick={() => setStep('phone')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: 'rgba(255,255,255,0.8)',
              fontSize: 'var(--font-sm)',
              marginBottom: 16,
              background: 'rgba(255,255,255,0.1)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>
        )}

        <div style={{
          width: 64,
          height: 64,
          borderRadius: 18,
          background: 'rgba(255,255,255,0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 16,
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)',
          overflow: 'hidden'
        }}>
          <img 
            src="/logo.png" 
            alt="MKisans" 
            style={{ width: '75%', height: '75%', objectFit: 'contain' }}
            onError={(e) => {
              e.target.src = 'https://cdn-icons-png.flaticon.com/512/3061/3061323.png';
            }}
          />
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 800, color: 'white', marginBottom: 4 }}>
          {step === 'phone' ? 'Welcome, Partner!' : 'Verify OTP'}
        </h1>
        <p style={{ fontSize: 'var(--font-base)', color: 'rgba(255,255,255,0.75)' }}>
          {step === 'phone'
            ? 'Sign in with your mobile number to start delivering'
            : `Enter the 6-digit code sent to +91 ${phone}`}
        </p>
      </div>

      {/* Form */}
      <div style={{ flex: 1, padding: '32px 24px' }}>
        {step === 'phone' ? (
          <form onSubmit={handlePhoneSubmit}>
            <div className="input-group" style={{ marginBottom: 24 }}>
              <label className="input-label">Mobile Number</label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'var(--surface-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '2px solid transparent',
                overflow: 'hidden',
                transition: 'all 0.2s ease',
              }}>
                <div style={{
                  padding: '12px 14px',
                  background: 'var(--surface-secondary)',
                  borderRight: '1px solid var(--border-default)',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  fontSize: 'var(--font-base)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}>
                  🇮🇳 +91
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter mobile number"
                  style={{
                    flex: 1,
                    padding: '14px 16px',
                    background: 'transparent',
                    fontSize: 'var(--font-lg)',
                    fontWeight: 600,
                    letterSpacing: '1px',
                  }}
                  autoFocus
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={phone.length < 10}
              style={{
                opacity: phone.length < 10 ? 0.5 : 1,
                pointerEvents: phone.length < 10 ? 'none' : 'auto',
              }}
            >
              Continue <ArrowRight size={18} />
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit}>
            <div style={{ marginBottom: 32 }}>
              <label className="input-label" style={{ marginBottom: 16, display: 'block' }}>
                Enter Verification Code
              </label>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !digit && i > 0) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }
                    }}
                    style={{
                      width: 48,
                      height: 56,
                      textAlign: 'center',
                      fontSize: 'var(--font-xl)',
                      fontWeight: 700,
                      background: digit ? 'var(--green-light)' : 'var(--surface-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      border: digit ? '2px solid var(--green)' : '2px solid transparent',
                      color: 'var(--text-primary)',
                      transition: 'all 0.2s ease',
                    }}
                    autoFocus={i === 0}
                  />
                ))}
              </div>
              <div style={{
                textAlign: 'center',
                marginTop: 16,
                fontSize: 'var(--font-sm)',
                color: 'var(--text-muted)',
              }}>
                Didn't receive code?{' '}
                <button style={{ color: 'var(--green)', fontWeight: 600 }}>Resend</button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-block"
              disabled={otp.join('').length < 6}
              style={{
                opacity: otp.join('').length < 6 ? 0.5 : 1,
                pointerEvents: otp.join('').length < 6 ? 'none' : 'auto',
              }}
            >
              Verify & Login <Shield size={18} />
            </button>
          </form>
        )}

        {/* Register Link */}
        {step === 'phone' && (
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>
              New to MKisans?{' '}
              <button
                onClick={() => navigate('/register')}
                style={{ color: 'var(--green)', fontWeight: 700 }}
              >
                Register as Partner
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div style={{
        padding: '16px 24px 32px',
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
      }}>
        {[
          { icon: '🔒', label: 'Secure' },
          { icon: '⚡', label: 'Instant' },
          { icon: '🛡️', label: 'Verified' },
        ].map(b => (
          <div key={b.label} style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 'var(--font-xs)',
            color: 'var(--text-muted)',
          }}>
            <span>{b.icon}</span>
            <span style={{ fontWeight: 500 }}>{b.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
