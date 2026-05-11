import React, { useState } from 'react';
import { 
  Search, Mic, MapPin, Bell, Wallet, ShoppingCart, User, 
  TrendingUp, Award, Zap, PlayCircle, Star, ShieldCheck, 
  Leaf, Calendar, ShoppingBag, CreditCard, Plus, Video, MessageCircle, Home, Grid
} from 'lucide-react';
import Card from '../components/ui/Card';
import './CustomerDashboard.css';

const categories = [
  { id: 1, name: 'Vegetables', icon: '🥦', color: 'bg-green-light' },
  { id: 2, name: 'Fruits', icon: '🍎', color: 'bg-orange-light' },
  { id: 3, name: 'Grains', icon: '🌾', color: 'bg-blue-light' },
  { id: 4, name: 'Pulses', icon: '🫘', color: 'bg-green-light' },
  { id: 5, name: 'Organic', icon: '🌱', color: 'bg-orange-light' },
  { id: 6, name: 'Dry Fruits', icon: '🥜', color: 'bg-blue-light' },
];

const products = [
  { id: 1, name: 'Fresh Spinach', farmer: 'Ram Singh', price: '₹20', unit: '250g', image: '🥬', tag: 'Organic', rating: 4.8 },
  { id: 2, name: 'Organic Apples', farmer: 'Himachal Farms', price: '₹120', unit: '1kg', image: '🍎', tag: 'Best Seller', rating: 4.9 },
  { id: 3, name: 'Red Carrots', farmer: 'Patel Organic', price: '₹40', unit: '500g', image: '🥕', tag: 'Fresh', rating: 4.7 },
  { id: 4, name: 'Natural Honey', farmer: 'Pure Hive', price: '₹250', unit: '500ml', image: '🍯', tag: 'Pure', rating: 5.0 },
];

const farmers = [
  { id: 1, name: 'Kisan Ram', distance: '2.5 km', rating: 4.9, image: '👨‍🌾', certified: true },
  { id: 2, name: 'Green Valley', distance: '5.0 km', rating: 4.7, image: '🚜', certified: true },
  { id: 3, name: 'Organic Roots', distance: '8.2 km', rating: 4.8, image: '🧑‍🌾', certified: false },
];

function Sparkles({ size, className }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="dashboard-container customer-dashboard">
      {/* Top Header Section */}
      <div className="customer-header glass-header">
        <div className="logo-section">
           <img src="/logo.jpg" alt="MKisans" className="header-logo" onError={(e)=>{e.target.style.display='none'}} />
           <div className="location-pill">
             <MapPin size={14} className="text-green" />
             <span>Noida, Sector 62</span>
           </div>
        </div>
        <div className="header-actions">
          <button className="icon-btn"><Bell size={20} /><span className="badge">2</span></button>
          <button className="icon-btn"><Wallet size={20} /></button>
          <button className="icon-btn"><ShoppingCart size={20} /><span className="badge">3</span></button>
          <button className="icon-btn user-btn"><User size={20} /></button>
        </div>
      </div>

      {/* Smart Search Section */}
      <div className="search-section">
        <div className="smart-search-bar">
          <Search size={20} className="text-muted search-icon" />
          <input type="text" placeholder="Search vegetables, fruits, farmers..." className="search-input" />
          <button className="voice-search-btn"><Mic size={20} className="text-green" /></button>
        </div>
        <div className="search-filters">
           <span className="filter-chip active">All</span>
           <span className="filter-chip">Nearby Farmers</span>
           <span className="filter-chip">Organic</span>
           <span className="filter-chip">Price: Low to High</span>
           <span className="filter-chip">Delivery: Today</span>
        </div>
      </div>

      {/* Hero Banner Slider */}
      <div className="hero-banner-slider">
        <div className="hero-banner premium-gradient">
           <div className="banner-content">
             <span className="banner-tag">Festival Offer</span>
             <h2>Fresh Organic Harvest</h2>
             <p>Direct from farmers to your kitchen.</p>
             <div className="banner-actions">
               <button className="primary-btn">Shop Now</button>
               <button className="outline-btn-white">Pre-Book</button>
             </div>
           </div>
           <div className="banner-visual">
             <div className="floating-element">🥦</div>
             <div className="floating-element delay">🍎</div>
           </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="section-container">
        <div className="section-header">
          <h3>Shop by Category</h3>
          <button className="text-btn">View All</button>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <div key={cat.id} className={`category-card ${cat.color}`}>
              <div className="category-icon-3d">{cat.icon}</div>
              <span className="category-name">{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* AI Recommended Products */}
      <div className="section-container bg-subtle-pattern p-4 rounded-xl">
        <div className="section-header">
          <h3 className="flex items-center gap-2"><Zap className="text-orange" size={20} /> AI Recommended for You</h3>
        </div>
        <div className="product-scroller">
          {products.map(prod => (
            <Card key={prod.id} className="product-card">
              <div className="product-badge">{prod.tag}</div>
              <div className="product-image-large">{prod.image}</div>
              <div className="product-info">
                <h4>{prod.name}</h4>
                <p className="farmer-name">By {prod.farmer}</p>
                <div className="rating-row">
                  <Star size={14} className="text-orange fill-orange" />
                  <span>{prod.rating}</span>
                </div>
                <div className="product-footer">
                  <div className="price-box">
                    <span className="price">{prod.price}</span>
                    <span className="unit">/ {prod.unit}</span>
                  </div>
                  <button className="add-btn"><Plus size={18} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Seasonal Recommendations */}
      <div className="section-container">
        <div className="section-header">
          <h3 className="flex items-center gap-2"><Leaf className="text-green" size={20} /> Seasonal Favorites</h3>
        </div>
        <div className="product-scroller">
          {products.slice(0, 2).map(prod => (
            <Card key={`seasonal-${prod.id}`} className="product-card">
              <div className="product-badge bg-green">Summer Special</div>
              <div className="product-image-large">{prod.image}</div>
              <div className="product-info">
                <h4>{prod.name}</h4>
                <div className="product-footer mt-2">
                  <div className="price-box">
                    <span className="price">{prod.price}</span>
                  </div>
                  <button className="add-btn"><Plus size={18} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Nearby Farmers */}
      <div className="section-container">
         <div className="section-header">
          <h3 className="flex items-center gap-2"><MapPin className="text-green" size={20} /> Nearby Farmers</h3>
          <button className="text-btn">Explore Map</button>
        </div>
        <div className="farmers-scroller">
          {farmers.map(farmer => (
             <Card key={farmer.id} className="farmer-premium-card">
               <div className="farmer-header">
                 <div className="farmer-avatar bg-green-light">{farmer.image}</div>
                 <div className="farmer-details">
                   <h4>{farmer.name} {farmer.certified && <ShieldCheck size={14} className="text-green" />}</h4>
                   <p>{farmer.distance} away</p>
                 </div>
               </div>
               <div className="farmer-stats">
                  <div className="stat"><Star size={14} className="text-orange"/> {farmer.rating}</div>
                  <div className="stat"><Leaf size={14} className="text-green"/> Organic</div>
               </div>
               <div className="farmer-actions">
                 <button className="primary-btn-sm">View Farm</button>
                 <button className="outline-btn-sm"><MessageCircle size={14} /> Chat</button>
               </div>
             </Card>
          ))}
        </div>
      </div>

      {/* Live Fresh Harvest Section */}
      <div className="section-container">
        <Card className="harvest-card live-pulse">
           <div className="harvest-content">
             <span className="live-badge"><span className="dot"></span> LIVE HARVEST</span>
             <h3>Fresh Tomatoes</h3>
             <p>Harvested 2 hours ago from Green Valley Farms.</p>
             <div className="progress-container">
               <div className="progress-bar-wrap"><div className="progress-bar w-75"></div></div>
               <span className="progress-text">75kg remaining</span>
             </div>
             <button className="primary-btn mt-3">Buy Fresh Now</button>
           </div>
           <div className="harvest-visual">🍅</div>
        </Card>
      </div>

      {/* Crop Pre-Booking */}
      <div className="section-container">
         <div className="section-header">
          <h3 className="flex items-center gap-2"><Calendar className="text-blue" size={20} /> Crop Pre-Booking</h3>
        </div>
        <div className="prebook-grid">
           <Card className="prebook-card">
             <div className="prebook-tag">Expected in 20 days</div>
             <div className="prebook-img">🥭</div>
             <h4>Alphonso Mangoes</h4>
             <p className="prebook-price">Est. ₹150/kg</p>
             <button className="outline-btn w-100 mt-2">Pre-Book</button>
           </Card>
           <Card className="prebook-card">
             <div className="prebook-tag">Expected in 15 days</div>
             <div className="prebook-img">🍉</div>
             <h4>Watermelons</h4>
             <p className="prebook-price">Est. ₹30/kg</p>
             <button className="outline-btn w-100 mt-2">Pre-Book</button>
           </Card>
        </div>
      </div>

      {/* Subscriptions */}
      <div className="section-container">
        <Card className="subscription-banner bg-blue-light">
          <div className="sub-content">
            <h3>Weekly Grocery Box</h3>
            <p>Get fresh veggies delivered every Sunday. Pause anytime.</p>
            <button className="primary-btn">Subscribe for ₹499/wk</button>
          </div>
          <div className="sub-icon">📦</div>
        </Card>
      </div>

      {/* AI Price Prediction */}
      <div className="section-container">
        <div className="section-header">
          <h3 className="flex items-center gap-2"><TrendingUp className="text-orange" size={20} /> AI Price Prediction</h3>
        </div>
        <div className="prediction-grid">
          <Card className="prediction-card">
             <div className="pred-header">
               <span>Onion</span>
               <TrendingUp size={16} className="text-orange" />
             </div>
             <h4>₹40/kg</h4>
             <p className="pred-insight text-orange">Expected to rise by 10% next week. Best time to buy is now.</p>
          </Card>
          <Card className="prediction-card">
             <div className="pred-header">
               <span>Potato</span>
               <TrendingUp size={16} className="text-green" style={{transform: 'scaleY(-1)'}} />
             </div>
             <h4>₹20/kg</h4>
             <p className="pred-insight text-green">Expected to drop by 5% next week. Stable supply.</p>
          </Card>
        </div>
      </div>

      {/* Flash Deals */}
      <div className="section-container">
        <div className="section-header">
          <h3 className="flex items-center gap-2"><Zap className="text-orange" size={20} /> Flash Deals</h3>
          <div className="text-orange" style={{ fontWeight: '700', fontSize: '0.85rem' }}>Ends in 02:45:10</div>
        </div>
        <div className="product-scroller">
          <Card className="product-card" style={{ border: '2px solid var(--orange-accent)' }}>
            <div className="product-badge bg-orange">50% OFF</div>
            <div className="product-image-large">🧅</div>
            <div className="product-info">
              <h4>Nashik Onions (5kg)</h4>
              <p className="farmer-name">Bulk Discount</p>
              <div className="product-footer mt-2">
                <div className="price-box">
                  <span className="price">₹100</span>
                  <span className="unit" style={{ textDecoration: 'line-through', fontSize: '0.8rem', marginLeft: '4px' }}>₹200</span>
                </div>
                <button className="add-btn"><Plus size={18} /></button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Live Mandi Price */}
      <div className="section-container">
         <div className="section-header">
          <h3 className="flex items-center gap-2"><TrendingUp className="text-blue" size={20} /> Live Mandi Prices</h3>
        </div>
        <Card className="p-4 rounded-xl">
          <div className="flex items-center justify-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontWeight: '600' }}>Wheat (Lokwan)</span>
            <span className="text-green flex items-center gap-2" style={{ fontWeight: '700' }}>₹2,800/Q <TrendingUp size={14}/></span>
          </div>
          <div className="flex items-center justify-between" style={{ padding: '8px 0', borderBottom: '1px solid var(--border-color)' }}>
            <span style={{ fontWeight: '600' }}>Soya Bean</span>
            <span className="text-orange flex items-center gap-2" style={{ fontWeight: '700' }}>₹4,200/Q <TrendingUp size={14} style={{transform: 'scaleY(-1)'}}/></span>
          </div>
        </Card>
      </div>

      {/* Wallet & Cashback */}
      <div className="section-container">
        <Card className="bg-green-light p-4 rounded-xl flex items-center justify-between">
          <div>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '4px' }}>Wallet Balance</p>
            <h3 className="text-green" style={{ fontSize: '1.5rem', fontWeight: '800' }}>₹1,250</h3>
            <p style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-dark)', marginTop: '4px' }}>+ ₹50 Cashback pending</p>
          </div>
          <button className="primary-btn-sm" style={{ padding: '10px 16px' }}>+ Add Money</button>
        </Card>
      </div>

      {/* Order Tracking */}
      <div className="section-container">
        <Card className="tracking-card">
          <div className="track-header">
            <h4>Arriving Today</h4>
            <span className="track-time">By 4:00 PM</span>
          </div>
          <p className="track-status">Out for delivery with Raj Kumar</p>
          <div className="track-stepper">
            <div className="step completed"></div>
            <div className="step completed"></div>
            <div className="step active"></div>
            <div className="step"></div>
          </div>
          <button className="outline-btn w-100 mt-3">Track on Map</button>
        </Card>
      </div>

      {/* Community & Videos */}
      <div className="section-container">
         <div className="section-header">
          <h3 className="flex items-center gap-2"><Video className="text-blue" size={20} /> Farm Stories</h3>
        </div>
        <div className="stories-scroller">
           <div className="story-card">
             <div className="story-video-ph bg-green-light"><PlayCircle size={32} className="text-green"/></div>
             <p>Organic Farm Tour</p>
           </div>
           <div className="story-card">
             <div className="story-video-ph bg-orange-light"><PlayCircle size={32} className="text-orange"/></div>
             <p>Harvesting Wheat</p>
           </div>
           <div className="story-card">
             <div className="story-video-ph bg-blue-light"><PlayCircle size={32} className="text-blue"/></div>
             <p>Fresh Plucked</p>
           </div>
        </div>
      </div>

      {/* Loyalty & Rewards */}
      <div className="section-container mb-10">
        <Card className="loyalty-card premium-gradient-dark">
          <div className="loyalty-content">
            <Award size={32} className="text-orange" />
            <div className="loyalty-text">
              <h3>Gold Member</h3>
              <p>2,450 points available</p>
            </div>
          </div>
          <button className="white-btn">Redeem</button>
        </Card>
      </div>

      {/* Floating Action Button (AI Assistant) */}
      <button className="fab-assistant">
        <Sparkles size={24} />
      </button>

      {/* Bottom Navigation */}
      <nav className="bottom-nav-glass">
        <div className={`nav-item ${activeTab === 'home' ? 'active' : ''}`} onClick={() => setActiveTab('home')}>
          <Home size={22} /><span>Home</span>
        </div>
        <div className={`nav-item ${activeTab === 'categories' ? 'active' : ''}`} onClick={() => setActiveTab('categories')}>
          <Grid size={22} /><span>Categories</span>
        </div>
        <div className="nav-item cart-float-btn" onClick={() => setActiveTab('cart')}>
          <div className="cart-icon-wrap">
            <ShoppingBag size={24} color="#fff" />
            <span className="cart-badge-float">3</span>
          </div>
        </div>
        <div className={`nav-item ${activeTab === 'wallet' ? 'active' : ''}`} onClick={() => setActiveTab('wallet')}>
          <CreditCard size={22} /><span>Wallet</span>
        </div>
        <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          <User size={22} /><span>Profile</span>
        </div>
      </nav>
    </div>
  );
}
