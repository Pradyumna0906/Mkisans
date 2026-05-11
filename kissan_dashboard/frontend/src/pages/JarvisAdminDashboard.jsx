import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './JarvisAdmin.css';

const API_BASE = 'http://localhost:5000/api/jarvis/admin';

export default function JarvisAdminDashboard() {
  const [config, setConfig] = useState(null);
  const [logs, setLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('settings');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchConfig();
    fetchLogs();
  }, []);

  const fetchConfig = async () => {
    const res = await axios.get(`${API_BASE}/config`);
    setConfig(res.data);
  };

  const fetchLogs = async () => {
    const res = await axios.get(`${API_BASE}/logs`);
    setLogs(res.data);
  };

  const handleSave = async () => {
    setSaving(true);
    await axios.post(`${API_BASE}/config`, config);
    setSaving(false);
    alert('JARVIS Configuration Saved!');
  };

  const triggerRetrain = async () => {
    if (window.confirm('Trigger Auto-Index of all app features?')) {
      await axios.post(`${API_BASE}/retrain`);
      alert('Knowledge base re-indexed successfully.');
    }
  };

  if (!config) return <div className="loading">Initializing Control Panel...</div>;

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="logo-group">
          <div className="pulse-dot"></div>
          <h1>JARVIS ADMIN HUB <span>v2.1</span></h1>
        </div>
        <button className="retrain-btn" onClick={triggerRetrain}>RETRAIN BRAIN</button>
      </header>

      <nav className="admin-nav">
        <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>Control Settings</button>
        <button className={activeTab === 'faq' ? 'active' : ''} onClick={() => setActiveTab('faq')}>FAQs & Scripts</button>
        <button className={activeTab === 'logs' ? 'active' : ''} onClick={() => setActiveTab('logs')}>Conversation Monitor</button>
      </nav>

      <main className="admin-main">
        {activeTab === 'settings' && (
          <div className="settings-pane">
            <section className="config-section">
              <h3>SYSTEM STATUS</h3>
              <div className="toggle-group">
                <label>JARVIS ACTIVE</label>
                <input type="checkbox" checked={config.status.enabled} onChange={(e) => setConfig({...config, status: {...config.status, enabled: e.target.checked}})} />
              </div>
            </section>

            <section className="config-section">
              <h3>OPERATIONAL PERMISSIONS</h3>
              {Object.entries(config.permissions).map(([key, val]) => (
                <div className="toggle-group" key={key}>
                  <label>{key.replace(/_/g, ' ').toUpperCase()}</label>
                  <input type="checkbox" checked={val} onChange={(e) => setConfig({...config, permissions: {...config.permissions, [key]: e.target.checked}})} />
                </div>
              ))}
            </section>
            
            <button className="save-btn" onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'COMMIT CHANGES'}</button>
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="faq-pane">
             <h3>CUSTOM VOICE SCRIPTS</h3>
             <textarea value={config.custom_scripts.welcome_message} onChange={(e) => setConfig({...config, custom_scripts: {...config.custom_scripts, welcome_message: e.target.value}})} />
             
             <h3>KNOWLEDGE BASE (FAQs)</h3>
             {config.faqs.map((f, i) => (
               <div key={i} className="faq-item">
                  <input value={f.q} onChange={(e) => {
                    const newFaqs = [...config.faqs];
                    newFaqs[i].q = e.target.value;
                    setConfig({...config, faqs: newFaqs});
                  }} />
                  <textarea value={f.a} onChange={(e) => {
                    const newFaqs = [...config.faqs];
                    newFaqs[i].a = e.target.value;
                    setConfig({...config, faqs: newFaqs});
                  }} />
               </div>
             ))}
             <button className="save-btn" onClick={handleSave}>UPDATE SCRIPTS</button>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="logs-pane">
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>User</th>
                  <th>Query</th>
                  <th>Intent</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id}>
                    <td>{new Date(log.time).toLocaleTimeString()}</td>
                    <td>{log.user}</td>
                    <td>{log.query}</td>
                    <td className="intent-tag">{log.intent}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
