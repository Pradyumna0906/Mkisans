import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const MOCK_OFFICERS = [
  { username: 'north_officer', password: 'zone@1', name: 'Rajesh Sharma',  zone: 'North Zone', zoneId: 1 },
  { username: 'south_officer', password: 'zone@2', name: 'Priya Nair',     zone: 'South Zone', zoneId: 2 },
  { username: 'east_officer',  password: 'zone@3', name: 'Vikash Yadav',   zone: 'East Zone',  zoneId: 3 },
  { username: 'west_officer',  password: 'zone@4', name: 'Meena Patel',    zone: 'West Zone',  zoneId: 4 },
];

export const AuthProvider = ({ children }) => {
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

  return (
    <AuthContext.Provider value={{ officer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
