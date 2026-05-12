import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import AppShell from './components/AppShell';
import SplashScreen from './pages/SplashScreen';
import LoginScreen from './pages/LoginScreen';
import RegistrationScreen from './pages/RegistrationScreen';
import PendingApproval from './pages/PendingApproval';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Wallet from './pages/Wallet';
import Notifications from './pages/Notifications';
import Profile from './pages/Profile';
import ActiveDelivery from './pages/ActiveDelivery';
import Emergency from './pages/Emergency';
import AdminDashboard from './pages/AdminDashboard';
import Settings from './pages/Settings';
import LogisticsMap from './pages/LogisticsMap';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegistrationScreen />} />
          <Route path="/pending-approval" element={<PendingApproval />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="orders" element={<Orders />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="delivery/:id" element={<ActiveDelivery />} />
            <Route path="emergency" element={<Emergency />} />
            <Route path="settings" element={<Settings />} />
            <Route path="logistics" element={<LogisticsMap />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
