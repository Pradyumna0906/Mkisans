import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';
import './Login.css';

/* ─── Intro Splash ─────────────────────────────────────────── */
const Intro = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const messages = ['Nurturing the Anndevta...', 'Connecting Farmers & Markets...', 'Loading your Zone...'];
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    // Cycle messages
    const msgTimer = setInterval(() => {
      setMsgIdx(prev => (prev + 1) % messages.length);
    }, 900);

    // Animate progress bar
    let val = 0;
    const bar = setInterval(() => {
      val += 1.4;
      setProgress(Math.min(val, 100));
      if (val >= 100) {
        clearInterval(bar);
        clearInterval(msgTimer);
        setTimeout(() => setFadeOut(true), 300);
        setTimeout(() => onDone(), 750);
      }
    }, 30);

    return () => { clearInterval(bar); clearInterval(msgTimer); };
  }, []);

  return (
    <div className={`intro-root ${fadeOut ? 'intro-fade-out' : ''}`}>
      <div className="intro-content">
        <div className="intro-logo-wrap">
          <img src={logo} alt="MKisans" className="intro-logo" />
        </div>
        <div className="intro-bar-track">
          <div className="intro-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="intro-msg">{messages[msgIdx]}</p>
      </div>
    </div>
  );
};

/* ─── Login Form ────────────────────────────────────────────── */
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showIntro, setShowIntro] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(username, password);
      if (result.success) navigate('/', { replace: true });
      else setError(result.error);
      setLoading(false);
    }, 600);
  };

  if (showIntro) return <Intro onDone={() => setShowIntro(false)} />;

  return (
    <div className="login-root">
      {/* Subtle background pattern */}
      <div className="login-bg-pattern" />

      <div className="login-split">
        {/* Left panel — brand */}
        <div className="login-brand-panel">
          <div className="login-brand-inner">
            <img src={logo} alt="MKisans" className="login-brand-logo" />
            <h2 className="login-brand-title">MKisans</h2>
            <p className="login-brand-sub">Zonal Management Portal</p>
            <div className="login-brand-divider" />
            <p className="login-brand-quote">"Empowering Zonal Officers to Nurture the Anndevta"</p>
            <div className="login-brand-chips">
              <span className="chip chip-green">Farmers</span>
              <span className="chip chip-orange">Delivery</span>
              <span className="chip chip-blue">Analytics</span>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="login-form-panel">
          <div className="login-card">
            <div className="login-card-header">
              <img src={logo} alt="MKisans" className="login-card-logo" />
              <h1 className="login-card-title">Welcome Back</h1>
              <p className="login-card-sub">Sign in to access your zone's dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              <div className="lf-group">
                <label className="lf-label">Officer Username</label>
                <div className="lf-input-wrap">
                  <svg className="lf-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                  </svg>
                  <input
                    type="text" className="lf-input" placeholder="e.g. north_officer"
                    value={username} onChange={e => setUsername(e.target.value)} required autoComplete="username"
                  />
                </div>
              </div>

              <div className="lf-group">
                <label className="lf-label">Password</label>
                <div className="lf-input-wrap">
                  <svg className="lf-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <input
                    type={showPassword ? 'text' : 'password'} className="lf-input" placeholder="Enter your password"
                    value={password} onChange={e => setPassword(e.target.value)} required autoComplete="current-password"
                  />
                  <button type="button" className="lf-eye" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    }
                  </button>
                </div>
              </div>

              {error && (
                <div className="lf-error">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                  {error}
                </div>
              )}

              <button type="submit" className="lf-btn" disabled={loading}>
                {loading ? <span className="lf-spinner" /> : 'Sign In →'}
              </button>
            </form>

            {/* Demo hint */}
            <div className="lf-hint">
              <p className="lf-hint-title">🔑 Demo Credentials</p>
              <div className="lf-hint-grid">
                {[
                  ['north_officer', 'zone@1', 'North'],
                  ['south_officer', 'zone@2', 'South'],
                  ['east_officer',  'zone@3', 'East'],
                  ['west_officer',  'zone@4', 'West'],
                ].map(([u, p, z]) => (
                  <button key={u} type="button" className="lf-hint-row"
                    onClick={() => { setUsername(u); setPassword(p); }}>
                    <span className="lf-hint-zone">{z}</span>
                    <span className="lf-hint-user">{u}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
