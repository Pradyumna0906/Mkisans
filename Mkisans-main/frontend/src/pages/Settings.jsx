import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLang, SUPPORTED_LANGUAGES } from '../context/LanguageContext';
import { ArrowLeft, LogOut, CheckCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import './MonitoringPage.css';

const Settings = () => {
  const navigate = useNavigate();
  const { officer, logout } = useAuth();
  const { lang, setLanguage, t } = useLang();

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('mkishan_notif');
    return saved ? JSON.parse(saved) : { email: true, sms: false, push: true };
  });
  const [selectedLang, setSelectedLang] = useState(lang);
  const [saved, setSaved] = useState(false);

  const save = () => {
    // Apply language globally
    setLanguage(selectedLang);
    // Persist notifications
    localStorage.setItem('mkishan_notif', JSON.stringify(notifications));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => { logout(); navigate('/login', { replace: true }); };

  return (
    <div className="dashboard-container">
      <div className="monitoring-header">
        <button className="back-btn" onClick={() => navigate(-1)}><ArrowLeft size={20}/></button>
        <div>
          <h2>⚙️ {t.settings}</h2>
          <p className="text-muted">Manage your account, language and preferences.</p>
        </div>
        {saved && (
          <div style={{ display:'flex', alignItems:'center', gap:6, color:'var(--primary-green)', fontWeight:600, background:'var(--primary-green-light)', padding:'6px 14px', borderRadius:8 }}>
            <CheckCircle size={16}/> {t.saved}
          </div>
        )}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Profile */}
        <Card title={t.profileInfo}>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'flex', alignItems:'center', gap:14, padding:'12px', background:'var(--primary-green-light)', borderRadius:10 }}>
              <div style={{ width:52, height:52, borderRadius:'50%', background:'var(--primary-green)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:'1.1rem' }}>
                {officer?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
              </div>
              <div>
                <p style={{ fontWeight:700, margin:0 }}>{officer?.name}</p>
                <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', margin:0 }}>{officer?.zone}</p>
              </div>
            </div>
            {[
              [t.fullName, officer?.name],
              [t.zone,     officer?.zone],
              [t.username, officer?.username || '—'],
              [t.role,     'Zonal Officer'],
            ].map(([label, value]) => (
              <div key={label}>
                <label style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--text-muted)', display:'block', marginBottom:4 }}>{label}</label>
                <input readOnly value={value || ''} style={{ width:'100%', padding:'9px 12px', border:'1px solid var(--border-color)', borderRadius:8, background:'#f9f9f9', fontSize:'0.9rem', color:'var(--text-dark)', outline:'none' }}/>
              </div>
            ))}
          </div>
        </Card>

        {/* Preferences */}
        <Card title={t.notifications}>
          <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
            {Object.entries(notifications).map(([key, val]) => (
              <label key={key} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', cursor:'pointer', padding:'10px 0', borderBottom:'1px solid var(--border-color)' }}>
                <div>
                  <p style={{ margin:0, fontWeight:600, fontSize:'0.9rem' }}>
                    {key === 'email' ? t.emailAlerts : key === 'sms' ? t.smsAlerts : t.pushNotifications}
                  </p>
                  <p style={{ margin:0, fontSize:'0.78rem', color:'var(--text-muted)' }}>
                    {key === 'email' ? 'Email par zone updates pao' : key === 'sms' ? 'SMS alerts phone par' : 'Browser push notifications'}
                  </p>
                </div>
                <div
                  onClick={() => setNotifications(n => ({ ...n, [key]: !val }))}
                  style={{ width:44, height:24, borderRadius:12, background: val ? 'var(--primary-green)' : '#d1d5db', position:'relative', transition:'background 0.2s', cursor:'pointer', flexShrink:0 }}
                >
                  <div style={{ position:'absolute', top:3, left: val ? 22 : 3, width:18, height:18, borderRadius:'50%', background:'white', transition:'left 0.2s', boxShadow:'0 1px 3px rgba(0,0,0,0.2)' }}/>
                </div>
              </label>
            ))}

            {/* Language */}
            <div>
              <label style={{ fontSize:'0.75rem', fontWeight:600, color:'var(--text-muted)', display:'block', marginBottom:8 }}>🌐 {t.language}</label>
              <div style={{ display:'flex', gap:8 }}>
                {SUPPORTED_LANGUAGES.map(l => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setSelectedLang(l)}
                    style={{
                      flex:1, padding:'10px 8px', border: selectedLang === l ? '2px solid var(--primary-green)' : '1.5px solid var(--border-color)',
                      borderRadius:10, background: selectedLang === l ? 'var(--primary-green-light)' : '#fff',
                      color: selectedLang === l ? 'var(--primary-green)' : 'var(--text-dark)',
                      fontWeight: selectedLang === l ? 700 : 500, fontSize:'0.85rem', cursor:'pointer',
                      transition:'all 0.15s', position:'relative'
                    }}
                  >
                    {l === 'English' ? '🇬🇧 English' : l === 'Hindi' ? '🇮🇳 हिंदी' : '🤝 Hinglish'}
                    {selectedLang === l && (
                      <span style={{ position:'absolute', top:-6, right:-6, width:16, height:16, background:'var(--primary-green)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center' }}>
                        <CheckCircle size={10} color="white"/>
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {selectedLang !== lang && (
                <p style={{ fontSize:'0.75rem', color:'var(--orange-accent)', marginTop:8, fontWeight:500 }}>
                  ⚠️ Click "{t.savePreferences}" to apply language change.
                </p>
              )}
            </div>

            <button
              className="primary-btn"
              onClick={save}
              style={{ marginTop:4, display:'flex', alignItems:'center', justifyContent:'center', gap:8 }}
            >
              {saved ? <><CheckCircle size={16}/> {t.saved}</> : t.savePreferences}
            </button>
          </div>
        </Card>
      </div>

      {/* Logout */}
      <Card style={{ marginTop: 20 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:16 }}>
          <div>
            <p style={{ fontWeight:700, margin:'0 0 4px', fontSize:'1rem' }}>{t.signOut}</p>
            <p className="text-muted" style={{ margin:0 }}>{t.signOutMsg(officer?.name, officer?.zone)}</p>
          </div>
          <button onClick={handleLogout} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 20px', background:'#fee2e2', color:'#dc2626', border:'1px solid #fecaca', borderRadius:10, fontWeight:700, fontSize:'0.9rem', cursor:'pointer' }}>
            <LogOut size={18}/> {t.logout}
          </button>
        </div>
      </Card>
    </div>
  );
};
export default Settings;

