import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ZonalFarmers from './pages/ZonalFarmers';
import ZonalDelivery from './pages/ZonalDelivery';
import FarmerDashboard from './pages/FarmerDashboard';
import DeliveryDashboard from './pages/DeliveryDashboard';
import DeliveryOrdersList from './pages/DeliveryOrdersList';
import DeliveryEarningsList from './pages/DeliveryEarningsList';
import MarketPriceControl from './pages/MarketPriceControl';
import PartnerVerification from './pages/PartnerVerification';
import WeatherAdvisories from './pages/WeatherAdvisories';
import Settings from './pages/Settings';
import TradeAnalytics from './pages/TradeAnalytics';
import CriticalAlerts from './pages/CriticalAlerts';

// New components from conflict
import FarmerSocial from './components/FarmerSocial';
import MandiIntelligence from './components/MandiIntelligence';
import GISMap from './components/SmartLogistics/GISMap';

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <NotificationProvider>
          <Router>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<AdminDashboard />} />
                <Route path="farmers" element={<ZonalFarmers />} />
                <Route path="delivery-partners" element={<ZonalDelivery />} />
                <Route path="farmer/:id" element={<FarmerDashboard />} />
                <Route path="delivery/:id" element={<DeliveryDashboard />} />
                <Route path="delivery/:id/orders/:status" element={<DeliveryOrdersList />} />
                <Route path="delivery/:id/earnings" element={<DeliveryEarningsList />} />
                <Route path="market-prices" element={<MarketPriceControl />} />
                <Route path="partner-verification" element={<PartnerVerification />} />
                <Route path="weather-advisories" element={<WeatherAdvisories />} />
                <Route path="trade-analytics" element={<TradeAnalytics />} />
                <Route path="alerts" element={<CriticalAlerts />} />
                <Route path="social" element={<div className="p-4"><FarmerSocial /></div>} />
                <Route path="mandi-intelligence" element={<div className="p-4"><MandiIntelligence commodity="Wheat" market="Bhopal" /></div>} />
                <Route path="logistics-map" element={<div className="p-4"><GISMap /></div>} />
                <Route path="settings" element={<Settings />} />
                {/* Catch all */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </Router>
        </NotificationProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;


