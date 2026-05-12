import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AppContext = createContext(null);

// Mock data
const MOCK_PARTNER = {
  id: 'DP-2026-0847',
  name: 'Rajesh Kumar',
  phone: '+91 98765 43210',
  avatar: 'RK',
  vehicleType: 'bike',
  vehicleName: 'Hero Splendor Plus',
  vehicleNumber: 'MP 09 AB 1234',
  level: 'gold',
  rating: 4.8,
  totalDeliveries: 1247,
  isOnline: false,
  isVerified: true,
  isRegistered: true,
  joinDate: '2025-03-15',
  address: 'Near Mandi Gate, Bhopal, MP',
  aadhaarVerified: true,
  licenseVerified: true,
  bankVerified: true,
  acceptanceRate: 94,
  onTimeRate: 97,
};

const MOCK_WALLET = {
  totalEarnings: 48750,
  pendingEarnings: 2340,
  withdrawableBalance: 46410,
  todayEarnings: 1850,
  weekEarnings: 12400,
  monthEarnings: 48750,
  transactions: [
    { id: 1, type: 'credit', amount: 320, description: 'Order #MK-4521 Delivery', time: '2 min ago', icon: 'package' },
    { id: 2, type: 'credit', amount: 150, description: 'Peak Hour Bonus', time: '15 min ago', icon: 'zap' },
    { id: 3, type: 'credit', amount: 280, description: 'Order #MK-4519 Delivery', time: '1 hr ago', icon: 'package' },
    { id: 4, type: 'debit', amount: 5000, description: 'Bank Withdrawal - UPI', time: '3 hrs ago', icon: 'banknote' },
    { id: 5, type: 'credit', amount: 500, description: 'Incentive Bonus - 10 Orders', time: '5 hrs ago', icon: 'award' },
    { id: 6, type: 'credit', amount: 190, description: 'Order #MK-4515 Delivery', time: 'Yesterday', icon: 'package' },
    { id: 7, type: 'credit', amount: 410, description: 'Order #MK-4512 - Heavy Load', time: 'Yesterday', icon: 'package' },
  ],
};

const MOCK_ORDERS = {
  active: [
    {
      id: 'MK-4521',
      status: 'in_transit',
      farmerName: 'Ramesh Patel',
      farmerPhone: '+91 94567 12345',
      farmerAvatar: 'RP',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98123 45678',
      customerAvatar: 'PS',
      pickupLocation: 'Green Valley Farm, Sehore Road',
      deliveryLocation: 'Arera Colony, E-5, Bhopal',
      distance: '12.5 km',
      weight: '25 kg',
      items: [
        { name: 'Fresh Tomatoes', qty: '10 kg', icon: '🍅' },
        { name: 'Green Capsicum', qty: '5 kg', icon: '🫑' },
        { name: 'Fresh Coriander', qty: '5 kg', icon: '🌿' },
        { name: 'Onions', qty: '5 kg', icon: '🧅' },
      ],
      deliveryCharge: 320,
      estimatedTime: '35 min',
      pickupTime: '10:30 AM',
      packaging: 'Standard Crate',
      temperatureReq: 'Normal',
      otp: '4827',
    },
  ],
  upcoming: [
    {
      id: 'MK-4523',
      status: 'assigned',
      farmerName: 'Suresh Verma',
      farmerPhone: '+91 94567 55555',
      farmerAvatar: 'SV',
      customerName: 'Rahul Singh',
      customerPhone: '+91 98765 44444',
      customerAvatar: 'AJ',
      pickupLocation: 'Organic Farms, Raisen Road',
      deliveryLocation: 'MP Nagar, Zone-II, Bhopal',
      distance: '8.2 km',
      weight: '15 kg',
      items: [
        { name: 'Organic Spinach', qty: '5 kg', icon: '🥬' },
        { name: 'Fresh Milk', qty: '10 L', icon: '🥛' },
      ],
      deliveryCharge: 220,
      estimatedTime: '25 min',
      pickupTime: '11:30 AM',
      packaging: 'Cold Pack',
      temperatureReq: 'Cold (4°C)',
    },
    {
      id: 'MK-4525',
      status: 'assigned',
      farmerName: 'Kamla Devi',
      farmerPhone: '+91 94567 88888',
      farmerAvatar: 'KD',
      customerName: 'Anjali Gupta',
      customerPhone: '+91 98765 99999',
      customerAvatar: 'AG',
      pickupLocation: 'Hoshangabad Road',
      deliveryLocation: 'Gulmohar Colony',
      distance: '15.7 km',
      weight: '45 kg',
      items: [
        { name: 'Wheat Flour', qty: '40 kg', icon: '🌾' },
        { name: 'Jaggery', qty: '5 kg', icon: '🍯' },
      ],
      deliveryCharge: 450,
      estimatedTime: '45 min',
      pickupTime: '12:15 PM',
    },
  ],
  completed: [
    {
      id: 'MK-4519', status: 'delivered', farmerName: 'Mohan Lal', farmerAvatar: 'ML',
      customerName: 'Neha Gupta', customerAvatar: 'NG', distance: '6.8 km', weight: '12 kg',
      deliveryCharge: 280, deliveredAt: '9:45 AM', rating: 5,
      items: [{ name: 'Mangoes (Alphonso)', qty: '12 kg', icon: '🥭' }],
    },
    {
      id: 'MK-4515', status: 'delivered', farmerName: 'Geeta Bai', farmerAvatar: 'GB',
      customerName: 'Vikram Singh', customerAvatar: 'VS', distance: '4.2 km', weight: '8 kg',
      deliveryCharge: 190, deliveredAt: 'Yesterday', rating: 4,
      items: [{ name: 'Fresh Flowers (Marigold)', qty: '8 kg', icon: '🌼' }],
    },
    {
      id: 'MK-4512', status: 'delivered', farmerName: 'Ram Prasad', farmerAvatar: 'RP',
      customerName: 'Anjali Dubey', customerAvatar: 'AD', distance: '11.3 km', weight: '35 kg',
      deliveryCharge: 410, deliveredAt: 'Yesterday', rating: 5,
      items: [{ name: 'Potatoes', qty: '20 kg', icon: '🥔' }, { name: 'Carrots', qty: '15 kg', icon: '🥕' }],
    },
  ],
  cancelled: [
    {
      id: 'MK-4510', status: 'cancelled', farmerName: 'Shyam Sunder', farmerAvatar: 'SS',
      customerName: 'Pooja Yadav', customerAvatar: 'PY', distance: '18 km', weight: '5 kg',
      deliveryCharge: 180, reason: 'Customer not available',
      items: [{ name: 'Strawberries', qty: '5 kg', icon: '🍓' }],
    },
  ],
};

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'order', title: 'New Order Assigned', message: 'Order #MK-4523 from Organic Farms, Raisen Road', time: '2 min ago', read: false },
  { id: 2, type: 'payment', title: 'Payment Received', message: '₹320 credited for Order #MK-4521', time: '15 min ago', read: false },
  { id: 3, type: 'bonus', title: 'Bonus Achieved! 🎉', message: 'You earned ₹150 Peak Hour Bonus', time: '30 min ago', read: false },
  { id: 4, type: 'alert', title: 'Route Change Alert', message: 'Traffic detected on Hoshangabad Rd. Alternative route suggested.', time: '1 hr ago', read: true },
  { id: 5, type: 'system', title: 'Level Upgraded!', message: 'Congratulations! You are now a Gold Partner 🥇', time: '2 hrs ago', read: true },
  { id: 6, type: 'alert', title: 'Low Battery Alert', message: 'Your device battery is below 20%. Please charge.', time: '3 hrs ago', read: true },
  { id: 7, type: 'payment', title: 'Weekly Payout Processed', message: '₹12,400 transferred to your bank account', time: 'Yesterday', read: true },
  { id: 8, type: 'order', title: 'Order Completed', message: 'Order #MK-4519 delivered successfully', time: 'Yesterday', read: true },
];

const MOCK_STATS = {
  todayOrders: 8,
  todayEarnings: 1850,
  onlineHours: 6.5,
  acceptanceRate: 94,
  rating: 4.8,
  weeklyChart: [
    { day: 'Mon', earnings: 1500, orders: 6 },
    { day: 'Tue', earnings: 2200, orders: 9 },
    { day: 'Wed', earnings: 1800, orders: 7 },
    { day: 'Thu', earnings: 2500, orders: 10 },
    { day: 'Fri', earnings: 1900, orders: 8 },
    { day: 'Sat', earnings: 2800, orders: 12 },
    { day: 'Sun', earnings: 1850, orders: 8 },
  ],
};

const MOCK_INCOMING_ORDER = {
  id: 'MK-4527',
  farmerName: 'Bhagwan Das',
  farmerAvatar: 'BD',
  customerName: 'Sanjay Tiwari',
  customerAvatar: 'ST',
  pickupLocation: 'Krishi Mandi, Berasia Road',
  deliveryLocation: 'Shahpura, Bhopal',
  distance: '9.6 km',
  weight: '18 kg',
  items: [
    { name: 'Fresh Guava', qty: '8 kg', icon: '🍐' },
    { name: 'Pomegranate', qty: '10 kg', icon: '🫐' },
  ],
  deliveryCharge: 290,
  estimatedTime: '30 min',
  packaging: 'Fruit Crate',
  temperatureReq: 'Normal',
  expiresIn: 30,
};

export function AppProvider({ children }) {
  const [partner, setPartner] = useState(MOCK_PARTNER);
  const [wallet, setWallet] = useState(MOCK_WALLET);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [stats, setStats] = useState(MOCK_STATS);
  const [incomingOrder, setIncomingOrder] = useState(null);
  const [currentScreen, setCurrentScreen] = useState('splash');
  const [deliveryStep, setDeliveryStep] = useState(0); 

  const API_BASE = 'http://localhost:5001/api';

  const [language, setLanguage] = useState('en');

  // Initial Data Fetch
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('mkisans_token') || 'demo_token';
      try {
        const pRes = await fetch(`${API_BASE}/partner/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (pRes.ok) {
          const data = await pRes.json();
          if (data) {
            setPartner(prev => ({ 
              ...prev, 
              ...data, 
              isOnline: data.is_online === 1,
              vehicleType: data.vehicle_type,
              vehicleName: data.vehicle_name,
              vehicleNumber: data.vehicle_number
            }));
          }
        }

        const oRes = await fetch(`${API_BASE}/orders/available`);
        if (oRes.ok) {
          const availableOrders = await oRes.json();
          if (Array.isArray(availableOrders)) {
            // Update upcoming orders from backend
            setOrders(prev => ({
              ...prev,
              upcoming: availableOrders.map(o => ({
                id: o.id,
                farmerName: o.farmer_name,
                farmerAvatar: o.farmer_avatar,
                pickupLocation: o.pickup_location,
                deliveryLocation: o.delivery_location,
                distance: o.distance,
                deliveryCharge: o.delivery_charge,
                weight: o.weight,
                status: o.status,
                items: typeof o.items === 'string' ? JSON.parse(o.items || '[]') : (o.items || [])
              }))
            }));
          }
        }
      } catch (err) {
        console.warn('Backend offline, using mock data:', err.message);
      }
    };
    fetchData();
  }, []);

  const toggleOnline = useCallback(() => {
    setPartner(prev => {
      const newOnline = !prev.isOnline;
      if (newOnline) {
        // Simulate incoming order after going online
        setTimeout(() => setIncomingOrder(MOCK_INCOMING_ORDER), 5000);
      }
      return { ...prev, isOnline: newOnline };
    });
  }, []);

  const acceptOrder = useCallback(() => {
    if (incomingOrder) {
      setOrders(prev => ({
        ...prev,
        active: [...prev.active, { ...incomingOrder, status: 'navigating_to_pickup' }],
      }));
      setIncomingOrder(null);
      setDeliveryStep(1);
    }
  }, [incomingOrder]);

  const rejectOrder = useCallback(() => {
    setIncomingOrder(null);
  }, []);

  const advanceDelivery = useCallback(() => {
    setDeliveryStep(prev => Math.min(prev + 1, 5));
  }, []);

  const completeDelivery = useCallback((orderId) => {
    setOrders(prev => {
      const order = prev.active.find(o => o.id === orderId);
      return {
        ...prev,
        active: prev.active.filter(o => o.id !== orderId),
        completed: order ? [{ ...order, status: 'delivered', deliveredAt: 'Just now', rating: null }, ...prev.completed] : prev.completed,
      };
    });
    setDeliveryStep(0);
  }, []);

  const markNotificationRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value = {
    partner, setPartner,
    wallet, setWallet,
    orders, setOrders,
    notifications, setNotifications, markNotificationRead, unreadCount,
    stats,
    incomingOrder, setIncomingOrder,
    currentScreen, setCurrentScreen,
    deliveryStep, setDeliveryStep,
    toggleOnline,
    acceptOrder, rejectOrder,
    advanceDelivery, completeDelivery,
    withdrawFunds: useCallback((amount) => {
      setWallet(prev => ({
        ...prev,
        withdrawableBalance: prev.withdrawableBalance - parseFloat(amount),
        transactions: [
          { 
            id: Date.now(), 
            type: 'debit', 
            amount: parseFloat(amount), 
            description: 'Bank Withdrawal - UPI', 
            time: 'Just now', 
            icon: 'banknote' 
          }, 
          ...prev.transactions
        ]
      }));
    }, []),
    startBatch: useCallback(() => {
      // Simulate starting multiple orders
      setOrders(prev => ({
        ...prev,
        active: [
          ...prev.active,
          { id: 'MK-4523', status: 'navigating_to_pickup', farmerName: 'Suresh Verma', pickupLocation: 'Raisen Road', deliveryCharge: 220, distance: '8.2 km' },
          { id: 'MK-4525', status: 'navigating_to_pickup', farmerName: 'Kamla Devi', pickupLocation: 'Hoshangabad Road', deliveryCharge: 450, distance: '15.7 km' }
        ],
        upcoming: prev.upcoming.filter(o => o.id !== 'MK-4523' && o.id !== 'MK-4525')
      }));
      setDeliveryStep(1);
    }, []),
    language,
    setLanguage,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
