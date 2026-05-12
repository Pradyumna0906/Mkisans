import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, User, Mail, Lock, Phone, MapPin, ArrowRight } from 'lucide-react';
import './CustomerRegister.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    // Simulate API Call
    setTimeout(() => {
      console.log('Registering customer:', formData);
      setLoading(false);
      navigate('/customer-dashboard', { replace: true });
    }, 1500);
  };

  return (
    <div className="register-root">
      <div className="register-bg-overlay"></div>
      
      <div className="register-card-container">
        <div className="register-info-panel">
          <div className="brand-header">
            <img src="/logo.jpg" alt="MKisans" className="brand-logo" />
            <h2>MKisans</h2>
          </div>
          <div className="info-content">
            <h1>Join the Digital Revolution in Farming</h1>
            <p>Direct access to fresh harvests, real-time market prices, and certified organic farmers.</p>
            
            <div className="benefit-list">
              <div className="benefit-item">
                <ShieldCheck className="benefit-icon" />
                <div>
                  <h4>Certified Quality</h4>
                  <p>Every farmer on our platform is verified and certified.</p>
                </div>
              </div>
              <div className="benefit-item">
                <MapPin className="benefit-icon" />
                <div>
                  <h4>Hyper-Local</h4>
                  <p>Get produce from farmers within a 10km radius.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="register-form-panel">
          <div className="form-header">
            <h3>Create Customer ID</h3>
            <p>Start your journey as a Grahak (Buyer)</p>
          </div>

          <form onSubmit={handleSubmit} className="register-form">
            {error && <div className="form-error">{error}</div>}
            
            <div className="form-grid">
              <div className="input-group">
                <label><User size={16} /> Full Name</label>
                <input 
                  type="text" name="name" placeholder="John Doe" 
                  value={formData.name} onChange={handleChange} required 
                />
              </div>

              <div className="input-group">
                <label><Mail size={16} /> Email Address</label>
                <input 
                  type="email" name="email" placeholder="john@example.com" 
                  value={formData.email} onChange={handleChange} required 
                />
              </div>

              <div className="input-group">
                <label><Phone size={16} /> Mobile Number</label>
                <input 
                  type="tel" name="phone" placeholder="+91 98765 43210" 
                  value={formData.phone} onChange={handleChange} required 
                />
              </div>

              <div className="input-group">
                <label><MapPin size={16} /> Address / City</label>
                <input 
                  type="text" name="address" placeholder="Bhopal, MP" 
                  value={formData.address} onChange={handleChange} required 
                />
              </div>

              <div className="input-group">
                <label><Lock size={16} /> Password</label>
                <input 
                  type="password" name="password" placeholder="••••••••" 
                  value={formData.password} onChange={handleChange} required 
                />
              </div>

              <div className="input-group">
                <label><Lock size={16} /> Confirm Password</label>
                <input 
                  type="password" name="confirmPassword" placeholder="••••••••" 
                  value={formData.confirmPassword} onChange={handleChange} required 
                />
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? <span className="spinner"></span> : <>Create Account <ArrowRight size={18} /></>}
            </button>

            <p className="login-link">
              Already have an account? <Link to="/customer-login">Login here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
