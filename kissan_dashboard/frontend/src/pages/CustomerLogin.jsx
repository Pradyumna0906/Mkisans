import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import './CustomerLogin.css';

const API_URL = 'http://localhost:5000/api/auth';

export default function CustomerLogin() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!identifier.trim() || !password) {
      setError('Please enter your User ID and Password.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('mkishan_user', JSON.stringify(data.kisan));
        navigate('/customer-dashboard', { replace: true });
      } else {
        setError(data.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Cannot connect to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cl-root">
      <div className="cl-bg-pattern" />

      <div className="cl-split">
        {/* Left brand panel */}
        <div className="cl-brand-panel">
          <div className="cl-brand-inner">
            <div className="cl-brand-icon-wrap">
              <ShoppingCart size={48} strokeWidth={1.5} />
            </div>
            <h2 className="cl-brand-title">MKisans</h2>
            <p className="cl-brand-sub">Customer Portal</p>
            <div className="cl-brand-divider" />
            <p className="cl-brand-quote">"Fresh from Farm to Your Doorstep — Direct, Digital, Delightful"</p>
            <div className="cl-brand-chips">
              <span className="cl-chip cl-chip-green">Fresh Produce</span>
              <span className="cl-chip cl-chip-orange">Best Prices</span>
              <span className="cl-chip cl-chip-blue">Fast Delivery</span>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="cl-form-panel">
          <div className="cl-card">
            <div className="cl-card-header">
              <div className="cl-card-icon">🛒</div>
              <h1 className="cl-card-title">Welcome, Grahak!</h1>
              <p className="cl-card-sub">Sign in to explore fresh farm produce</p>
            </div>

            <form onSubmit={handleSubmit} className="cl-form">
              <div className="cl-group">
                <label className="cl-label">User ID / Email / Mobile</label>
                <div className="cl-input-wrap">
                  <User size={18} className="cl-icon" />
                  <input
                    type="text" className="cl-input" placeholder="Enter your ID, email or mobile"
                    value={identifier} onChange={e => setIdentifier(e.target.value)} required autoComplete="username"
                  />
                </div>
              </div>

              <div className="cl-group">
                <label className="cl-label">Password</label>
                <div className="cl-input-wrap">
                  <Lock size={18} className="cl-icon" />
                  <input
                    type={showPassword ? 'text' : 'password'} className="cl-input" placeholder="Enter your password"
                    value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                  />
                  <button type="button" className="cl-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="cl-error">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <button type="submit" className="cl-btn" disabled={loading}>
                {loading ? <span className="cl-spinner" /> : <>Login as Customer <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="cl-register-link">
              <p>New to MKisans?</p>
              <Link to="/customer-register" className="cl-register-btn">
                <ShoppingCart size={16} />
                Create Customer ID
              </Link>
            </div>

            <div className="cl-back-link">
              <a href="http://localhost:8081">← Back to Main Login</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
