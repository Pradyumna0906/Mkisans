import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext(null);

const translations = {
  English: {
    // Sidebar
    dashboard: 'Dashboard', farmers: 'Farmers', deliveryPartners: 'Delivery Partners',
    tradeAnalytics: 'Trade Analytics', alerts: 'Critical Alerts',
    settings: 'Settings', logout: 'Logout', zonalOfficer: 'ZONAL OFFICER',
    // Navbar
    searchPlaceholder: 'Search farmers, delivery partners...', notifications: 'Notifications',
    markAllRead: 'Mark all read', noNotifications: 'No new notifications', viewAll: 'View All',
    // Admin Dashboard
    officerDashboard: (zone) => `${zone} — Officer Dashboard`,
    welcomeMsg: (name) => `Welcome, ${name}. Here's your zone's activity summary.`,
    exportReport: 'Export Report', quickAdd: 'Quick Add',
    registeredFarmers: 'Registered Farmers', activePartners: 'Active Partners',
    tradeVolume: 'Total Trade Volume', criticalAlerts: 'Critical Alerts',
    monthlyPerformance: (zone) => `${zone} — Monthly Performance`,
    cropDistribution: 'Major Crop Distribution', recentFarmers: 'Recent Farmer Registrations',
    recentPartners: 'Recent Delivery Partner Registrations', monitoringActions: 'Monitoring Actions',
    marketPrices: 'Market Price Control', partnerVerification: 'Delivery Partner Verification',
    weatherAdvisories: 'Weather / Pest Advisories', exportCSV: 'Export CSV',
    // Tables
    farmerName: 'Farmer Name', location: 'Location', landSize: 'Land Size',
    status: 'Status', action: 'Action', verified: 'Verified', pendingReview: 'Pending Review',
    viewProfile: 'View Profile', review: 'Review',
    partnerName: 'Partner Name', vehicle: 'Vehicle', plateNo: 'Plate No.',
    capacity: 'Capacity', active: 'Active', pendingVerify: 'Pending Verify',
    // Farmers page
    farmerManagement: 'Farmer Management', manageFarmers: 'Manage and monitor all farmers in your zone.',
    searchFarmer: 'Search farmer name...', addFarmer: '+ Add Farmer',
    activeFarmers: 'Active Farmers', pendingVerification: 'Pending Verification',
    // Delivery page
    deliveryManagement: 'Delivery Partner Management', managePartners: 'Manage and monitor all delivery partners.',
    searchPartner: 'Search partner name...', vehicleNumber: 'Vehicle number...',
    addPartner: '+ Add Partner', liveTracking: 'Live Delivery Tracking',
    totalDeliveries: 'Total Deliveries', onTimeRate: 'On-Time Rate',
    avgTime: 'Avg. Delivery Time', deliveryPerformance: 'Delivery Performance',
    // Farmer Dashboard
    farmerDashboard: 'Farmer Dashboard', cropOverview: 'Crop Overview',
    // Delivery Dashboard
    deliveryDashboard: 'Delivery Partner Dashboard', welcomeDriver: (name) => `Welcome back, ${name}. Drive safe!`,
    completedToday: 'Completed Today', pendingDeliveries: 'Pending Deliveries',
    totalOrders: 'Total Orders Completed', futureOrders: 'Future Orders',
    todayEarnings: "Today's Earnings", activeDelivery: 'Active Delivery',
    liveRoute: 'Live Route Optimization', weeklyDeliveries: 'Weekly Deliveries',
    partnerProfile: 'Partner & Vehicle Profile', markDelivered: 'Mark as Delivered',
    // Settings
    savePreferences: 'Save Preferences', signOut: 'Sign Out',
    signOutMsg: (name, zone) => `You are logged in as ${name} (${zone}).`,
    language: 'Language', notificationPrefs: 'Notification Preferences',
    emailAlerts: '📧 Email Alerts', smsAlerts: '📱 SMS Alerts', pushNotifications: '🔔 Push Notifications',
    saved: '✓ Saved!', profileInfo: 'Profile Information',
    fullName: 'Full Name', zone: 'Zone', username: 'Username', role: 'Role',
    // Monitoring
    backBtn: 'Back', broadcastAdvisory: 'Broadcast New Advisory', advisoryHistory: 'Advisory History',
    broadcastBtn: 'Broadcast to Farmers', pendingApplications: 'Pending Applications',
    approve: 'Approve', reject: 'Reject', currentPrices: 'Current Crop Prices',
  },

  Hindi: {
    dashboard: 'डैशबोर्ड', farmers: 'किसान', deliveryPartners: 'डिलीवरी पार्टनर',
    tradeAnalytics: 'व्यापार विश्लेषण', alerts: 'गंभीर अलर्ट',
    settings: 'सेटिंग्स', logout: 'लॉग आउट', zonalOfficer: 'क्षेत्रीय अधिकारी',
    searchPlaceholder: 'किसान, डिलीवरी पार्टनर खोजें...', notifications: 'सूचनाएं',
    markAllRead: 'सभी पढ़ा चिह्नित करें', noNotifications: 'कोई नई सूचना नहीं', viewAll: 'सभी देखें',
    officerDashboard: (zone) => `${zone} — अधिकारी डैशबोर्ड`,
    welcomeMsg: (name) => `स्वागत है, ${name}। आपके क्षेत्र का सारांश।`,
    exportReport: 'रिपोर्ट डाउनलोड', quickAdd: 'जल्दी जोड़ें',
    registeredFarmers: 'पंजीकृत किसान', activePartners: 'सक्रिय पार्टनर',
    tradeVolume: 'कुल व्यापार मूल्य', criticalAlerts: 'गंभीर अलर्ट',
    monthlyPerformance: (zone) => `${zone} — मासिक प्रदर्शन`,
    cropDistribution: 'प्रमुख फसल वितरण', recentFarmers: 'हाल के किसान पंजीकरण',
    recentPartners: 'हाल के डिलीवरी पार्टनर', monitoringActions: 'निगरानी क्रियाएं',
    marketPrices: 'बाजार मूल्य नियंत्रण', partnerVerification: 'पार्टनर सत्यापन',
    weatherAdvisories: 'मौसम / कीट सलाह', exportCSV: 'CSV डाउनलोड',
    farmerName: 'किसान का नाम', location: 'स्थान', landSize: 'भूमि आकार',
    status: 'स्थिति', action: 'कार्रवाई', verified: 'सत्यापित', pendingReview: 'समीक्षा लंबित',
    viewProfile: 'प्रोफ़ाइल देखें', review: 'समीक्षा',
    partnerName: 'पार्टनर नाम', vehicle: 'वाहन', plateNo: 'नंबर प्लेट',
    capacity: 'क्षमता', active: 'सक्रिय', pendingVerify: 'सत्यापन लंबित',
    farmerManagement: 'किसान प्रबंधन', manageFarmers: 'अपने क्षेत्र के सभी किसानों को प्रबंधित करें।',
    searchFarmer: 'किसान का नाम खोजें...', addFarmer: '+ किसान जोड़ें',
    activeFarmers: 'सक्रिय किसान', pendingVerification: 'सत्यापन लंबित',
    deliveryManagement: 'डिलीवरी पार्टनर प्रबंधन', managePartners: 'सभी डिलीवरी पार्टनर प्रबंधित करें।',
    searchPartner: 'पार्टनर नाम खोजें...', vehicleNumber: 'वाहन नंबर...',
    addPartner: '+ पार्टनर जोड़ें', liveTracking: 'लाइव डिलीवरी ट्रैकिंग',
    totalDeliveries: 'कुल डिलीवरी', onTimeRate: 'समय पर दर',
    avgTime: 'औसत डिलीवरी समय', deliveryPerformance: 'डिलीवरी प्रदर्शन',
    farmerDashboard: 'किसान डैशबोर्ड', cropOverview: 'फसल अवलोकन',
    deliveryDashboard: 'डिलीवरी पार्टनर डैशबोर्ड', welcomeDriver: (name) => `वापसी पर स्वागत, ${name}। सुरक्षित चलाएं!`,
    completedToday: 'आज पूर्ण', pendingDeliveries: 'लंबित डिलीवरी',
    totalOrders: 'कुल आदेश पूर्ण', futureOrders: 'भविष्य के आदेश',
    todayEarnings: 'आज की कमाई', activeDelivery: 'सक्रिय डिलीवरी',
    liveRoute: 'लाइव मार्ग अनुकूलन', weeklyDeliveries: 'साप्ताहिक डिलीवरी',
    partnerProfile: 'पार्टनर और वाहन प्रोफ़ाइल', markDelivered: 'डिलीवर किया हुआ चिह्नित करें',
    savePreferences: 'प्राथमिकताएं सहेजें', signOut: 'साइन आउट',
    signOutMsg: (name, zone) => `आप ${name} (${zone}) के रूप में लॉग इन हैं।`,
    language: 'भाषा', notificationPrefs: 'अधिसूचना प्राथमिकताएं',
    emailAlerts: '📧 ईमेल अलर्ट', smsAlerts: '📱 SMS अलर्ट', pushNotifications: '🔔 पुश सूचनाएं',
    saved: '✓ सहेजा गया!', profileInfo: 'प्रोफ़ाइल जानकारी',
    fullName: 'पूरा नाम', zone: 'क्षेत्र', username: 'उपयोगकर्ता नाम', role: 'भूमिका',
    backBtn: 'वापस', broadcastAdvisory: 'नई सलाह प्रसारित करें', advisoryHistory: 'सलाह इतिहास',
    broadcastBtn: 'किसानों को प्रसारित करें', pendingApplications: 'लंबित आवेदन',
    approve: 'स्वीकृत', reject: 'अस्वीकृत', currentPrices: 'वर्तमान फसल मूल्य',
  },

  Hinglish: {
    dashboard: 'Dashboard', farmers: 'Kisaan', deliveryPartners: 'Delivery Partner',
    tradeAnalytics: 'Trade Analytics', alerts: 'Critical Alerts',
    settings: 'Settings', logout: 'Log Out Karo', zonalOfficer: 'ZONAL OFFICER',
    searchPlaceholder: 'Kisaan, delivery partner dhundho...', notifications: 'Notifications',
    markAllRead: 'Sab padha mark karo', noNotifications: 'Koi nayi notification nahi', viewAll: 'Sab dekho',
    officerDashboard: (zone) => `${zone} — Officer Dashboard`,
    welcomeMsg: (name) => `Namaste, ${name}! Aapke zone ki activity summary.`,
    exportReport: 'Report Download Karo', quickAdd: 'Jaldi Jodo',
    registeredFarmers: 'Registered Kisaan', activePartners: 'Active Partner',
    tradeVolume: 'Total Trade Amount', criticalAlerts: 'Critical Alerts',
    monthlyPerformance: (zone) => `${zone} — Monthly Performance`,
    cropDistribution: 'Fasal Distribution', recentFarmers: 'Naaye Kisaan Registrations',
    recentPartners: 'Naaye Delivery Partners', monitoringActions: 'Monitoring Actions',
    marketPrices: 'Market Price Control', partnerVerification: 'Partner Verification',
    weatherAdvisories: 'Mausam / Keeda Salah', exportCSV: 'CSV Download Karo',
    farmerName: 'Kisaan Ka Naam', location: 'Jagah', landSize: 'Zameen Ka Size',
    status: 'Sthiti', action: 'Karo', verified: 'Verified', pendingReview: 'Review Pending',
    viewProfile: 'Profile Dekho', review: 'Review Karo',
    partnerName: 'Partner Ka Naam', vehicle: 'Gaadi', plateNo: 'Number Plate',
    capacity: 'Capacity', active: 'Active', pendingVerify: 'Verification Pending',
    farmerManagement: 'Kisaan Management', manageFarmers: 'Apne zone ke kisaanon ko manage karo.',
    searchFarmer: 'Kisaan ka naam dhundho...', addFarmer: '+ Kisaan Jodo',
    activeFarmers: 'Active Kisaan', pendingVerification: 'Verification Pending',
    deliveryManagement: 'Delivery Partner Management', managePartners: 'Sab delivery partners manage karo.',
    searchPartner: 'Partner ka naam dhundho...', vehicleNumber: 'Gaadi number...',
    addPartner: '+ Partner Jodo', liveTracking: 'Live Delivery Tracking',
    totalDeliveries: 'Total Deliveries', onTimeRate: 'On-Time Rate',
    avgTime: 'Average Delivery Time', deliveryPerformance: 'Delivery Performance',
    farmerDashboard: 'Kisaan Dashboard', cropOverview: 'Fasal Overview',
    deliveryDashboard: 'Delivery Partner Dashboard', welcomeDriver: (name) => `Wapas aao, ${name}. Gaadi chalao dhyan se!`,
    completedToday: 'Aaj Complete', pendingDeliveries: 'Pending Deliveries',
    totalOrders: 'Total Orders Complete', futureOrders: 'Future Orders',
    todayEarnings: 'Aaj Ki Kamaai', activeDelivery: 'Active Delivery',
    liveRoute: 'Live Route Optimization', weeklyDeliveries: 'Weekly Deliveries',
    partnerProfile: 'Partner & Gaadi Profile', markDelivered: 'Delivered Mark Karo',
    savePreferences: 'Preferences Save Karo', signOut: 'Sign Out',
    signOutMsg: (name, zone) => `Aap ${name} (${zone}) ke roop mein logged in hain.`,
    language: 'Bhasha', notificationPrefs: 'Notification Preferences',
    emailAlerts: '📧 Email Alerts', smsAlerts: '📱 SMS Alerts', pushNotifications: '🔔 Push Notifications',
    saved: '✓ Save ho gaya!', profileInfo: 'Profile Info',
    fullName: 'Poora Naam', zone: 'Zone', username: 'Username', role: 'Role',
    backBtn: 'Wapas Jao', broadcastAdvisory: 'Nayi Advisory Broadcast Karo', advisoryHistory: 'Advisory History',
    broadcastBtn: 'Kisaanon ko Broadcast Karo', pendingApplications: 'Pending Applications',
    approve: 'Approve Karo', reject: 'Reject Karo', currentPrices: 'Abhi Ki Fasal Ki Keemat',
  },
};

export const SUPPORTED_LANGUAGES = ['English', 'Hindi', 'Hinglish'];

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('mkishan_lang') || 'English');

  const setLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('mkishan_lang', newLang);
  };

  const t = translations[lang] || translations.English;

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLang = () => useContext(LanguageContext);
