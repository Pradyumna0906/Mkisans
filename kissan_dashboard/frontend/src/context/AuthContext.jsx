import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);
const API_URL = 'http://localhost:5000/api/auth';

const MOCK_OFFICERS = [
  { username: 'north_officer', password: 'zone@1', name: 'Rajesh Sharma',  zone: 'North Zone', zoneId: 1 },
  { username: 'south_officer', password: 'zone@2', name: 'Priya Nair',     zone: 'South Zone', zoneId: 2 },
  { username: 'east_officer',  password: 'zone@3', name: 'Vikash Yadav',   zone: 'East Zone',  zoneId: 3 },
  { username: 'west_officer',  password: 'zone@4', name: 'Meena Patel',    zone: 'West Zone',  zoneId: 4 },
];

export const AuthProvider = ({ children }) => {
  // ── Officer auth (unchanged) ──
  const [officer, setOfficer] = useState(() => {
    const saved = localStorage.getItem('mkishan_officer');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (username, password) => {
    const found = MOCK_OFFICERS.find(
      o => o.username === username && o.password === password
    );
    if (found) {
      const { password: _, ...safe } = found;
      setOfficer(safe);
      localStorage.setItem('mkishan_officer', JSON.stringify(safe));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Please try again.' };
  };

  const logout = () => {
    setOfficer(null);
    localStorage.removeItem('mkishan_officer');
  };

  // ── Customer auth (new — isolated from officer) ──
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('mkishan_user');
    return saved ? JSON.parse(saved) : null;
  });

  const customerLogin = async (identifier, password) => {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.kisan);
        localStorage.setItem('mkishan_user', JSON.stringify(data.kisan));
        return { success: true };
      }
      return { success: false, error: data.error || 'Login failed' };
    } catch (err) {
      return { success: false, error: 'Connection failed' };
    }
  };

  const customerLogout = () => {
    setUser(null);
    localStorage.removeItem('mkishan_user');
  };

  return (
    <AuthContext.Provider value={{ officer, user, login, logout, customerLogin, customerLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
