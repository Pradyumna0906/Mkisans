import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, User, MapPin, Bike, CreditCard, Camera, FileText,
  Upload, Check, Truck, Tractor, Car
} from 'lucide-react';

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Vehicle', icon: Bike },
  { id: 3, title: 'Documents', icon: FileText },
  { id: 4, title: 'Bank', icon: CreditCard },
  { id: 5, title: 'Selfie', icon: Camera },
];

const VEHICLE_TYPES = [
  { id: 'bike', name: 'Bike', icon: '🏍️', desc: 'Two-wheeler delivery', capacity: 'Up to 20 kg' },
  { id: 'mini_pickup', name: 'Mini Pickup', icon: '🚛', desc: 'Small goods transport', capacity: 'Up to 500 kg' },
  { id: 'tractor_trolley', name: 'Tractor Trolley', icon: '🚜', desc: 'Heavy farm produce', capacity: 'Up to 2 ton' },
  { id: 'tempo', name: 'Tempo', icon: '🚚', desc: 'Large deliveries', capacity: 'Up to 1 ton' },
];

export default function RegistrationScreen() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', city: '', state: 'Madhya Pradesh', pincode: '',
    phoneVerified: false, emailVerified: false,
    vehicleType: '', vehicleMake: '', vehicleNumber: '',
    aadhaar: null, license: null,
    bankName: '', accountNumber: '', ifsc: '', upiId: '',
    selfie: null,
  });

  const updateForm = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const nextStep = async () => {
    if (currentStep === 1 && (!form.phoneVerified || !form.emailVerified)) {
      alert('Please verify your phone and email before continuing');
      return;
    }
    
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Final Step: Submit to Backend
      try {
        const response = await fetch('http://localhost:5001/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email,
            password: 'password123', // Default for demo
            vehicleType: form.vehicleType,
            vehicleName: form.vehicleMake,
            vehicleNumber: form.vehicleNumber
          })
        });

        const data = await response.json();
        if (data.success) {
          localStorage.setItem('mkisans_token', data.token);
          window.location.href = '/app'; // Force reload to trigger AppContext fetch
        } else {
          alert(data.message || 'Registration failed');
        }
      } catch (err) {
        console.error('Registration error:', err);
        alert('Could not connect to server. Ensure backend is running on port 5001.');
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(prev => prev - 1);
    else navigate('/login');
  };

  const progress = (currentStep / 5) * 100;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--white)' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(165deg, #0A5E04 0%, #138808 100%)',
        padding: '20px 20px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <button
            onClick={prevStep}
            style={{
              width: 36,
              height: 36,
              borderRadius: 'var(--radius-sm)',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}
          >
            <ChevronLeft size={20} />
          </button>
          
          <div style={{ 
            width: 40, 
            height: 40, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            overflow: 'hidden',
            borderRadius: 'var(--radius-sm)'
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

          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, color: 'white' }}>
              Partner Registration
            </h2>
            <p style={{ fontSize: 'var(--font-xs)', color: 'rgba(255,255,255,0.7)' }}>
              Step {currentStep} of 5 • {STEPS[currentStep - 1].title}
            </p>
          </div>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 4 }}>
          {STEPS.map((s, i) => (
            <div key={s.id} style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              background: i < currentStep ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div style={{ padding: 24 }} className="animate-fadeInUp">
        {currentStep === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 4 }}>Personal Details</h3>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 8 }}>
              Fill in your basic information and verify your contact details
            </p>
            
            <div className="input-group">
              <label className="input-label">Full Name *</label>
              <input className="input-field" placeholder="Enter your full name"
                value={form.name} onChange={e => updateForm('name', e.target.value)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
              <div className="input-group">
                <label className="input-label">Phone Number *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="input-field" placeholder="Mobile number"
                    value={form.phone} onChange={e => {
                      updateForm('phone', e.target.value);
                      updateForm('phoneVerified', false);
                    }} />
                  <button 
                    onClick={() => {
                      alert('OTP sent to ' + form.phone);
                      const otp = prompt('Enter 4-digit OTP (1234)');
                      if(otp === '1234') {
                        updateForm('phoneVerified', true);
                        alert('Phone verified successfully!');
                      }
                    }}
                    className={`btn btn-sm ${form.phoneVerified ? 'badge-green' : 'btn-primary'}`}
                    style={{ whiteSpace: 'nowrap', minWidth: 80 }}
                    disabled={!form.phone || form.phoneVerified}
                  >
                    {form.phoneVerified ? 'Verified' : 'Verify'}
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label className="input-label">Email Address *</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input className="input-field" placeholder="Email ID"
                    value={form.email} onChange={e => {
                      updateForm('email', e.target.value);
                      updateForm('emailVerified', false);
                    }} />
                  <button 
                    onClick={() => {
                      alert('Verification link sent to ' + form.email);
                      const otp = prompt('Enter 4-digit Code (5678)');
                      if(otp === '5678') {
                        updateForm('emailVerified', true);
                        alert('Email verified successfully!');
                      }
                    }}
                    className={`btn btn-sm ${form.emailVerified ? 'badge-green' : 'btn-primary'}`}
                    style={{ whiteSpace: 'nowrap', minWidth: 80 }}
                    disabled={!form.email || form.emailVerified}
                  >
                    {form.emailVerified ? 'Verified' : 'Verify'}
                  </button>
                </div>
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Full Address *</label>
              <input className="input-field" placeholder="Street address, locality"
                value={form.address} onChange={e => updateForm('address', e.target.value)} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="input-group">
                <label className="input-label">City *</label>
                <input className="input-field" placeholder="City"
                  value={form.city} onChange={e => updateForm('city', e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Pincode *</label>
                <input className="input-field" placeholder="PIN Code"
                  value={form.pincode} onChange={e => updateForm('pincode', e.target.value)} />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">State</label>
              <input className="input-field" value={form.state} readOnly
                style={{ background: 'var(--surface-tertiary)', opacity: 0.7 }} />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 4 }}>Select Vehicle Type</h3>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 20 }}>
              Choose the vehicle you'll use for deliveries
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: 12 
            }}>
              {VEHICLE_TYPES.map(v => (
                <button
                  key={v.id}
                  onClick={() => updateForm('vehicleType', v.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 16,
                    padding: 16,
                    borderRadius: 'var(--radius-lg)',
                    border: form.vehicleType === v.id
                      ? '2px solid var(--green)'
                      : '2px solid var(--border-light)',
                    background: form.vehicleType === v.id ? 'var(--green-light)' : 'var(--white)',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                  }}
                >
                  <div style={{
                    width: 56,
                    height: 56,
                    borderRadius: 'var(--radius-md)',
                    background: form.vehicleType === v.id ? 'var(--green)' : 'var(--surface-tertiary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 28,
                    transition: 'all 0.2s ease',
                  }}>
                    {v.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 'var(--font-base)' }}>{v.name}</div>
                    <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>{v.desc}</div>
                    <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                      Capacity: {v.capacity}
                    </div>
                  </div>
                  {form.vehicleType === v.id && (
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'var(--green)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <Check size={16} color="white" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            {form.vehicleType && (
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 12 }}
                className="animate-fadeInUp">
                <div className="input-group">
                  <label className="input-label">Vehicle Make & Model</label>
                  <input className="input-field" placeholder="e.g., Hero Splendor Plus"
                    value={form.vehicleMake} onChange={e => updateForm('vehicleMake', e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Vehicle Number</label>
                  <input className="input-field" placeholder="e.g., MP 09 AB 1234"
                    value={form.vehicleNumber} onChange={e => updateForm('vehicleNumber', e.target.value)} />
                </div>
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 4 }}>Upload Documents</h3>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 20 }}>
              Required for identity verification
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: 16 
            }}>
              {[
                { key: 'aadhaar', title: 'Aadhaar Card', desc: 'Front & back photo of your Aadhaar card' },
                { key: 'license', title: 'Driving License', desc: 'Valid driving license for your vehicle type' },
              ].map(doc => (
                <div key={doc.key} style={{
                  border: form[doc.key]
                    ? '2px solid var(--green)'
                    : '2px dashed var(--border-default)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 24,
                  textAlign: 'center',
                  background: form[doc.key] ? 'var(--green-light)' : 'var(--surface-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  height: '100%',
                }}
                  onClick={() => updateForm(doc.key, doc.key + '_uploaded')}
                >
                  {form[doc.key] ? (
                    <div className="animate-bounceIn">
                      <div style={{
                        width: 52,
                        height: 52,
                        borderRadius: '50%',
                        background: 'var(--green)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                      }}>
                        <Check size={26} color="white" />
                      </div>
                      <div style={{ fontWeight: 700, color: 'var(--green)' }}>{doc.title} Uploaded</div>
                      <div style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', marginTop: 4 }}>
                        Tap to re-upload
                      </div>
                    </div>
                  ) : (
                    <>
                      <Upload size={32} color="var(--text-muted)" style={{ marginBottom: 8 }} />
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{doc.title}</div>
                      <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)' }}>{doc.desc}</div>
                      <div style={{
                        marginTop: 12,
                        fontSize: 'var(--font-xs)',
                        color: 'var(--green)',
                        fontWeight: 600,
                      }}>
                        Tap to upload • JPG, PNG
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 4 }}>Bank Account Details</h3>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 8 }}>
              For receiving your delivery earnings
            </p>
            <div className="input-group">
              <label className="input-label">Bank Name</label>
              <input className="input-field" placeholder="e.g., State Bank of India"
                value={form.bankName} onChange={e => updateForm('bankName', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">Account Number</label>
              <input className="input-field" placeholder="Enter account number"
                type="password"
                value={form.accountNumber} onChange={e => updateForm('accountNumber', e.target.value)} />
            </div>
            <div className="input-group">
              <label className="input-label">IFSC Code</label>
              <input className="input-field" placeholder="e.g., SBIN0001234"
                value={form.ifsc} onChange={e => updateForm('ifsc', e.target.value)} />
            </div>
            <div className="divider" />
            <div className="input-group">
              <label className="input-label">UPI ID (Optional)</label>
              <input className="input-field" placeholder="e.g., yourname@upi"
                value={form.upiId} onChange={e => updateForm('upiId', e.target.value)} />
            </div>
            <div style={{
              padding: 12,
              background: 'var(--blue-light)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              gap: 8,
              alignItems: 'flex-start',
            }}>
              <span>🔒</span>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--blue)' }}>
                Your bank details are encrypted and securely stored. We follow RBI guidelines.
              </span>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, marginBottom: 4 }}>Live Selfie Verification</h3>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 24 }}>
              Take a clear selfie for identity verification
            </p>
            <div
              onClick={() => updateForm('selfie', 'selfie_uploaded')}
              style={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                border: form.selfie
                  ? '4px solid var(--green)'
                  : '4px dashed var(--border-default)',
                margin: '0 auto 24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: form.selfie
                  ? 'linear-gradient(135deg, var(--green-light), #D1FAE5)'
                  : 'var(--surface-tertiary)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            >
              {form.selfie ? (
                <div className="animate-bounceIn">
                  <Check size={48} color="var(--green)" />
                  <div style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--green)', marginTop: 8 }}>
                    Photo Captured
                  </div>
                </div>
              ) : (
                <>
                  <Camera size={40} color="var(--text-muted)" />
                  <div style={{ fontSize: 'var(--font-sm)', color: 'var(--text-muted)', marginTop: 8, fontWeight: 500 }}>
                    Tap to capture
                  </div>
                </>
              )}
            </div>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              textAlign: 'left',
              padding: '16px 20px',
              background: 'var(--saffron-light)',
              borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ fontSize: 'var(--font-sm)', fontWeight: 700, color: 'var(--saffron-dark)' }}>
                📋 Guidelines:
              </div>
              {[
                'Face should be clearly visible',
                'Good lighting, no shadows',
                'No sunglasses or masks',
                'Look straight at the camera',
              ].map(tip => (
                <div key={tip} style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', display: 'flex', gap: 6, alignItems: 'center' }}>
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--saffron)' }} />
                  {tip}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Continue Button */}
      <div style={{ padding: '16px 24px 32px', position: 'sticky', bottom: 0, background: 'var(--white)' }}>
        <button onClick={nextStep} className="btn btn-primary btn-lg btn-block">
          {currentStep === 5 ? 'Submit Registration' : 'Continue'}
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
