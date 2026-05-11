import { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';
import { 
  Sprout, Droplets, MapPin, IndianRupee, Leaf, 
  User, Phone, Mail, ShieldCheck, FileText, Home, Navigation, Hash, Download, CheckCircle,
  Calendar, CreditCard, Clock, Camera, ChevronLeft, ChevronRight, Image as ImageIcon,
  MessageCircle, Send, X
} from 'lucide-react';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import { useNotifications } from '../context/NotificationContext';
import './FarmerDashboard.css';

const earningsData = [
  { name: 'Jan', earnings: 4000, expenses: 2400 },
  { name: 'Feb', earnings: 3000, expenses: 1398 },
  { name: 'Mar', earnings: 2000, expenses: 9800 },
  { name: 'Apr', earnings: 2780, expenses: 3908 },
  { name: 'May', earnings: 1890, expenses: 4800 },
  { name: 'Jun', earnings: 2390, expenses: 3800 },
  { name: 'Jul', earnings: 3490, expenses: 4300 },
];

const cropData = [
  { name: 'Wheat', value: 400 },
  { name: 'Rice', value: 300 },
  { name: 'Sugarcane', value: 300 },
  { name: 'Cotton', value: 200 },
];

const FarmerDashboard = () => {
  const { addNotification } = useNotifications();
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [currentOrder] = useState({
    crop: 'Premium Wheat (Sona Motu)',
    customer: 'Reliance Fresh Retail',
    price: '₹2,450 / Quintal',
    orderDate: '12 April 2026',
    completionDate: '20 June 2026',
    status: 'In Progress'
  });

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [farmImages] = useState([
    { id: 1, label: 'Main Farm Land - North View', date: '10 May 2026' },
    { id: 2, label: 'Wheat Crop Progress (Week 6)', date: '05 May 2026' },
    { id: 3, label: 'Irrigation Setup Check', date: '01 May 2026' },
  ]);

  const nextImage = () => {
    setCurrentImgIndex((prev) => (prev + 1) % farmImages.length);
  };

  const prevImage = () => {
    setCurrentImgIndex((prev) => (prev - 1 + farmImages.length) % farmImages.length);
  };

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, sender: 'zonal', text: 'Hello Ramesh, I checked your latest soil report. The nitrogen levels are looking much better!', time: '10:30 AM' },
    { id: 2, sender: 'farmer', text: 'Thank you Sir. I have started using the organic manure as you suggested.', time: '10:45 AM' },
    { id: 3, sender: 'zonal', text: 'Excellent. Keep monitoring the moisture levels this week due to the heatwave advisory.', time: '11:00 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const msg = {
      id: chatMessages.length + 1,
      sender: 'zonal',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, msg]);
    setNewMessage('');
    
    // Auto-scroll logic could be added here
  };

  const handleDownloadReport = () => {
    // Simulate report generation and download
    const data = "Farmer: Ramesh Singh\nZone: South Punjab\nReport: Annual Yield 2025\nStatus: Verified";
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Ramesh_Singh_Farm_Report_2025.txt';
    a.click();
    
    addNotification({
      type: 'farmer',
      title: 'Report Downloaded',
      msg: 'Annual Farm Report for 2025 has been exported successfully.'
    });
  };

  const handleSoilTestRequest = () => {
    addNotification({
      type: 'farmer',
      title: 'Soil Test Requested',
      msg: 'A request for soil sample collection has been sent to the Zonal Lab.'
    });
  };

  const handleUpdateFarmInfo = () => {
    setIsUpdating(true);
    setTimeout(() => {
      setIsUpdating(false);
      addNotification({
        type: 'farmer',
        title: 'Information Updated',
        msg: 'Farm boundaries and records have been synced with the central repository.'
      });
    }, 1500);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h2>Farmer Dashboard</h2>
          <p className="text-muted">Comprehensive profile and operational overview for Ramesh Singh.</p>
        </div>
      </div>

      {/* Personal & KYC Details Section */}
      <Card title="Farmer Personal & KYC Details" className="personal-details-card mb-6">
        <div className="details-main-grid">
          {/* Basic Info */}
          <div className="details-column">
            <h4 className="detail-sub-title"><User size={18} className="mr-2" /> Basic Information</h4>
            <div className="info-item">
              <label><User size={14} /> Full Name</label>
              <p>Ramesh Singh</p>
            </div>
            <div className="info-item">
              <label><Phone size={14} /> Mobile Number</label>
              <p>+91 98765 43210</p>
            </div>
            <div className="info-item">
              <label><Mail size={14} /> Email ID</label>
              <p>ramesh.s@example.com</p>
            </div>
          </div>

          {/* KYC Verification */}
          <div className="details-column">
            <h4 className="detail-sub-title"><ShieldCheck size={18} className="mr-2" /> KYC Verification</h4>
            <div className="info-item">
              <label><Hash size={14} /> Aadhaar Number</label>
              <p>1234 5678 9012</p>
              <span className="doc-link">View Aadhaar Photo</span>
            </div>
            <div className="info-item">
              <label><FileText size={14} /> PAN Card Number</label>
              <p>ABCDE1234F</p>
              <span className="doc-link">View PAN Photo</span>
            </div>
          </div>

          {/* Land & Address Proof */}
          <div className="details-column">
            <h4 className="detail-sub-title"><FileText size={18} className="mr-2" /> Land & Address Proof</h4>
            <div className="info-item">
              <label><Sprout size={14} /> Land Ownership Proof</label>
              <span className="doc-link">View Document</span>
            </div>
            <div className="info-item">
              <label><Home size={14} /> Address Verification</label>
              <span className="doc-link">View Utility Bill</span>
            </div>
          </div>

          {/* Location Details */}
          <div className="details-column">
            <h4 className="detail-sub-title"><MapPin size={18} className="mr-2" /> Location Details</h4>
            <div className="location-grid-mini">
              <div className="info-item">
                <label>State</label>
                <p>Punjab</p>
              </div>
              <div className="info-item">
                <label>District</label>
                <p>Ludhiana</p>
              </div>
              <div className="info-item">
                <label>Village</label>
                <p>Khurd</p>
              </div>
              <div className="info-item">
                <label>Pin Code</label>
                <p>141001</p>
              </div>
            </div>
            <div className="info-item full-width">
              <label><Navigation size={14} /> Full Address</label>
              <p>House No 45, Near Canal, Village Khurd, Ludhiana, Punjab - 141001</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Active Operations Section */}
      <div className="operations-row mb-6">
        <Card title="Crop Now Growing" className="operation-card">
          <div className="operation-content">
            <div className="op-icon bg-green-light">
              <Leaf className="text-green" size={28} />
            </div>
            <div className="op-info">
              <p className="text-muted">Current Crop</p>
              <h3>{currentOrder.crop}</h3>
            </div>
          </div>
        </Card>

        <Card title="Active Order & Buyer" className="operation-card" action={<button className="text-btn" onClick={() => setIsOrderModalOpen(true)}>View Full Details</button>}>
          <div className="operation-content">
            <div className="op-icon bg-blue-light">
              <User className="text-blue" size={28} />
            </div>
            <div className="op-info">
              <p className="text-muted">Selling To (Customer)</p>
              <h3>{currentOrder.customer}</h3>
            </div>
          </div>
        </Card>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-green-light">
            <MapPin className="text-green" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Total Land Area</p>
            <h3 className="kpi-value">12.5 Acres</h3>
            <p className="kpi-trend positive">+0.5 Acres this year</p>
          </div>
        </Card>
        
        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-orange-light">
            <Leaf className="text-orange" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Soil Quality Score</p>
            <h3 className="kpi-value">84/100</h3>
            <p className="kpi-trend positive">Optimum for Wheat</p>
          </div>
        </Card>
 
        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-blue-light">
            <Droplets className="text-blue" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Water Level</p>
            <h3 className="kpi-value">Adequate</h3>
            <p className="kpi-trend neutral">Canal & Borewell</p>
          </div>
        </Card>
 
        <Card className="kpi-card">
          <div className="kpi-icon-wrapper bg-green-light">
            <IndianRupee className="text-green" size={24} />
          </div>
          <div className="kpi-info">
            <p className="kpi-label">Monthly Revenue</p>
            <h3 className="kpi-value">₹45,200</h3>
            <p className="kpi-trend positive">+12.5% from last month</p>
          </div>
        </Card>
      </div>
 
      <div className="charts-grid">
        {/* Earnings Chart */}
        <Card title="Revenue & Expenses" className="chart-card">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={earningsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary-green)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--primary-green)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--orange-accent)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--orange-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Area type="monotone" dataKey="earnings" stroke="var(--primary-green)" fillOpacity={1} fill="url(#colorEarnings)" />
                <Area type="monotone" dataKey="expenses" stroke="var(--orange-accent)" fillOpacity={1} fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
 
        {/* Crop Distribution */}
        <Card title="Production Estimation (Quintals)" className="chart-card">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={cropData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'var(--bg-light-gray)' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                <Bar dataKey="value" fill="var(--primary-green)" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Farm Gallery Section */}
      <div className="gallery-row mb-6">
        <Card 
          title="Farm & Crop Gallery" 
          className="gallery-card"
        >
          <div className="slider-container">
            <button className="slider-btn prev" onClick={prevImage} aria-label="Previous image">
              <ChevronLeft size={24} />
            </button>
            
            <div className="slider-main">
              <div className="image-frame">
                <div className="placeholder-overlay">
                  <ImageIcon size={48} className="text-muted mb-2" />
                  <p className="text-muted font-medium">{farmImages[currentImgIndex].label}</p>
                  <span className="text-xs text-muted">Ready for backend image stream</span>
                </div>
              </div>
              <div className="image-about-section">
                <div className="about-label">
                  <Calendar size={14} className="mr-2 text-green" />
                  <span>About: </span>
                  <span className="upload-date">Captured on {farmImages[currentImgIndex].date}</span>
                </div>
              </div>
            </div>

            <button className="slider-btn next" onClick={nextImage} aria-label="Next image">
              <ChevronRight size={24} />
            </button>

            <div className="slider-dots">
              {farmImages.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`dot ${idx === currentImgIndex ? 'active' : ''}`}
                  onClick={() => setCurrentImgIndex(idx)}
                />
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="bottom-grid">
        {/* Recent Orders */}
        <Card title="Recent Marketplace Orders" action={<button className="text-btn">View All</button>} className="table-card">
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product</th>
                  <th>Delivery Partner</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#ORD-001</td>
                  <td>Urea Fertilizer (50kg)</td>
                  <td><div className="flex-center" style={{ gap: 8 }}><div className="avatar text-xs" style={{ width: 24, height: 24 }}>SK</div> Suresh Kumar</div></td>
                  <td>12 May 2026</td>
                  <td><span className="status-badge delivered">Delivered</span></td>
                  <td>₹1,250</td>
                </tr>
                <tr>
                  <td>#ORD-002</td>
                  <td>Premium Wheat Seeds</td>
                  <td><div className="flex-center" style={{ gap: 8 }}><div className="avatar text-xs" style={{ width: 24, height: 24 }}>VY</div> Vikram Yadav</div></td>
                  <td>10 May 2026</td>
                  <td><span className="status-badge processing">Processing</span></td>
                  <td>₹3,400</td>
                </tr>
                <tr>
                  <td>#ORD-003</td>
                  <td>Pesticide Spray</td>
                  <td><div className="flex-center" style={{ gap: 8 }}><div className="avatar text-xs" style={{ width: 24, height: 24 }}>RS</div> Ramesh Singh</div></td>
                  <td>05 May 2026</td>
                  <td><span className="status-badge delivered">Delivered</span></td>
                  <td>₹850</td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
 
        {/* Action Panel */}
        <Card title="Quick Actions" className="actions-card">
          <div className="actions-list">
            <button className="action-item" onClick={handleDownloadReport}>
              <div className="action-icon bg-green-light">
                <FileText className="text-green" size={20} />
              </div>
              <div className="action-text">
                <h4>View Previous Reports</h4>
                <p>Export farm history to CSV/PDF</p>
              </div>
              <Download size={16} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
            </button>
            <button className="action-item" onClick={handleSoilTestRequest}>
              <div className="action-icon bg-orange-light">
                <Sprout className="text-orange" size={20} />
              </div>
              <div className="action-text">
                <h4>Request Soil Test</h4>
                <p>Schedule a sample collection</p>
              </div>
              <CheckCircle size={16} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
            </button>
            <button className="action-item" onClick={handleUpdateFarmInfo} disabled={isUpdating}>
              <div className="action-icon bg-blue-light">
                <MapPin className="text-blue" size={20} />
              </div>
              <div className="action-text">
                <h4>{isUpdating ? 'Updating...' : 'Update Farm Info'}</h4>
                <p>Edit boundaries and source</p>
              </div>
              <Navigation size={16} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
            </button>
          </div>
        </Card>
      </div>

      {/* Floating Chat Box UI */}
      <div className={`chat-widget ${isChatOpen ? 'active' : ''}`}>
        {!isChatOpen ? (
          <button className="chat-fab" onClick={() => setIsChatOpen(true)}>
            <MessageCircle size={28} />
            <span className="chat-badge">3</span>
          </button>
        ) : (
          <div className="chat-window">
            <div className="chat-header">
              <div className="chat-user-info">
                <div className="avatar sm">RS</div>
                <div>
                  <h4>Ramesh Singh</h4>
                  <span className="status-online">Online</span>
                </div>
              </div>
              <button className="chat-close" onClick={() => setIsChatOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="chat-body">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`chat-bubble ${msg.sender === 'zonal' ? 'sent' : 'received'}`}>
                  <p>{msg.text}</p>
                  <span className="chat-time">{msg.time}</span>
                </div>
              ))}
            </div>
            
            <form className="chat-footer" onSubmit={handleSendMessage}>
              <input 
                type="text" 
                placeholder="Message Ramesh Singh..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button type="submit" className="chat-send-btn" disabled={!newMessage.trim()}>
                <Send size={18} />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Modal 
        isOpen={isOrderModalOpen} 
        onClose={() => setIsOrderModalOpen(false)} 
        title="Active Crop Order Details"
      >
        <div className="order-details-popup">
          <div className="popup-grid">
            <div className="popup-item">
              <label><IndianRupee size={14} /> Agreed Price</label>
              <p>{currentOrder.price}</p>
            </div>
            <div className="popup-item">
              <label><Calendar size={14} /> Date of Ordering</label>
              <p>{currentOrder.orderDate}</p>
            </div>
            <div className="popup-item">
              <label><Clock size={14} /> Completion Date</label>
              <p>{currentOrder.completionDate}</p>
            </div>
            <div className="popup-item">
              <label><CheckCircle size={14} /> Current Status</label>
              <div>
                <span className="status-badge processing">{currentOrder.status}</span>
              </div>
            </div>
          </div>
          <div className="popup-footer">
            <button className="primary-btn w-full" onClick={() => setIsOrderModalOpen(false)}>Close Details</button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FarmerDashboard;
