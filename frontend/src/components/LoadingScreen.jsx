import React, { useEffect, useState } from 'react';
import './LoadingScreen.css';
import logo from '../assets/logo.jpg';

const LoadingScreen = ({ isLoading }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 1;
        });
      }, 25); // Approximately 2.5s for full bar
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  return (
    <div className={`loading-container ${!isLoading ? 'hidden' : ''}`}>
      <div className="bg-particles">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="particle" 
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 5 + 5}s`
            }}
          />
        ))}
      </div>
      
      <div className="logo-wrapper">
        <div className="logo-glow"></div>
        <img src={logo} alt="Mkisans Logo" className="loading-logo" />
      </div>

      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="loading-text">Nurturing the Anndevta...</div>
    </div>
  );
};

export default LoadingScreen;
