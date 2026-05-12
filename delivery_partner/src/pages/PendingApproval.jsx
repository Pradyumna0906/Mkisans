import { useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, Shield, Truck } from 'lucide-react';

export default function PendingApproval() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--white)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 32,
      textAlign: 'center',
    }}>
      {/* Animated Icon */}
      <div className="animate-float" style={{
        width: 120,
        height: 120,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--saffron-light), #FEF3C7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        position: 'relative',
      }}>
        <Clock size={48} color="var(--saffron)" />
        <div style={{
          position: 'absolute',
          inset: -4,
          borderRadius: '50%',
          border: '2px dashed var(--saffron)',
          opacity: 0.3,
          animation: 'spin 20s linear infinite',
        }} />
      </div>

      <h1 style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, marginBottom: 8 }}>
        Under Review
      </h1>
      <p style={{
        fontSize: 'var(--font-base)',
        color: 'var(--text-secondary)',
        maxWidth: 300,
        lineHeight: 1.6,
        marginBottom: 32,
      }}>
        Your registration has been submitted successfully. Our team will verify your documents within 24-48 hours.
      </p>

      {/* Status Steps */}
      <div style={{
        width: '100%',
        maxWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        marginBottom: 40,
      }}>
        {[
          { label: 'Registration Submitted', done: true, icon: CheckCircle },
          { label: 'Document Verification', active: true, icon: Shield },
          { label: 'Admin Approval', pending: true, icon: Truck },
        ].map((step, i) => (
          <div key={step.label} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: step.done
                  ? 'var(--green)'
                  : step.active
                    ? 'var(--saffron)'
                    : 'var(--surface-tertiary)',
                color: step.done || step.active ? 'white' : 'var(--text-muted)',
                transition: 'all 0.3s ease',
              }}>
                <step.icon size={18} />
              </div>
              {i < 2 && (
                <div style={{
                  width: 2,
                  height: 32,
                  background: step.done ? 'var(--green)' : 'var(--border-default)',
                  transition: 'all 0.3s ease',
                }} />
              )}
            </div>
            <div style={{ paddingTop: 6, textAlign: 'left' }}>
              <div style={{
                fontWeight: 600,
                fontSize: 'var(--font-base)',
                color: step.pending ? 'var(--text-muted)' : 'var(--text-primary)',
              }}>
                {step.label}
              </div>
              {step.done && (
                <span className="badge badge-green" style={{ marginTop: 4 }}>Completed</span>
              )}
              {step.active && (
                <span className="badge badge-saffron" style={{ marginTop: 4 }}>In Progress</span>
              )}
              {step.pending && (
                <span className="badge" style={{ marginTop: 4, background: 'var(--surface-tertiary)' }}>Pending</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate('/app')}
        className="btn btn-primary btn-lg"
        style={{ minWidth: 200 }}
      >
        Go to Dashboard (Demo)
      </button>

      <p style={{
        fontSize: 'var(--font-xs)',
        color: 'var(--text-muted)',
        marginTop: 16,
      }}>
        We'll notify you once approved ✉️
      </p>
    </div>
  );
}
