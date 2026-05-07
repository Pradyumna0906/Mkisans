import { useState, useEffect } from 'react'
import './App.css'
import LoadingScreen from './components/LoadingScreen'

function App() {
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for 3 seconds to show off the animation
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 3500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className={`app-container ${isLoading ? 'blur-content' : ''}`}>
        <div className="glass-card">
          <span className="badge">Jai Jawan • Jai Kisan</span>
          <h1 className="hero-title">Honoring the Anndevta</h1>
          <p className="hero-subtitle">
            Celebrating India's agricultural legacy. Bridging the gap between 
            traditional wisdom and modern innovation for farmers worldwide.
          </p>
          
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-value">150M+</span>
              <span className="stat-label">Indian Farmers</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">60%</span>
              <span className="stat-label">Global Spices Lead</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">№ 1</span>
              <span className="stat-label">In Milk Production</span>
            </div>
          </div>

          <div className="cultural-tag">
            "Agriculture is the backbone of the Indian Economy"
          </div>

          <div style={{ marginTop: '2rem' }}>
            <button onClick={() => setCount((count) => count + 1)}>
              Enter the Digital Krishi {count > 0 && `(${count})`}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
