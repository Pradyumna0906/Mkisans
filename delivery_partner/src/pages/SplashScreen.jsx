import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck } from 'lucide-react';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate('/login'), 2500);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(165deg, #0A5E04 0%, #138808 35%, #1A9E0A 65%, #FF9933 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 40,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background Circles */}
      <div style={{
        position: 'absolute',
        width: 300,
        height: 300,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.05)',
        top: -100,
        right: -100,
      }} />
      <div style={{
        position: 'absolute',
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.03)',
        bottom: -150,
        left: -150,
      }} />

      {/* Logo */}
      <div className="animate-bounceIn" style={{
        width: 110,
        height: 110,
        borderRadius: 28,
        background: 'rgba(255,255,255,0.15)',
        backdropFilter: 'blur(20px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        border: '1px solid rgba(255,255,255,0.2)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
        overflow: 'hidden'
      }}>
        <img 
          src="/logo.png" 
          alt="MKisans Logo" 
          style={{ width: '75%', height: '75%', objectFit: 'contain' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://cdn-icons-png.flaticon.com/512/713/713311.png';
          }}
        />
      </div>

      {/* Title */}
      <div className="animate-fadeInUp" style={{ textAlign: 'center' }}>
        <h1 style={{
          fontSize: 32,
          fontWeight: 800,
          color: 'white',
          letterSpacing: '-0.5px',
          marginBottom: 4,
        }}>
          MKisans
        </h1>
        <p style={{
          fontSize: 16,
          fontWeight: 500,
          color: 'rgba(255,255,255,0.8)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>
          Delivery Partner
        </p>
      </div>

      {/* Loading */}
      <div className="animate-fadeIn" style={{
        marginTop: 60,
        display: 'flex',
        gap: 8,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.7)',
            animation: `pulse 1.5s ease-in-out ${i * 0.3}s infinite`,
          }} />
        ))}
      </div>

      {/* Bottom Tag */}
      <div style={{
        position: 'absolute',
        bottom: 40,
        textAlign: 'center',
      }}>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}>
          Farm to Fork • Vibrant Bharat
        </p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 4 }}>
          v2.1.0
        </p>
      </div>
    </div>
  );
}
