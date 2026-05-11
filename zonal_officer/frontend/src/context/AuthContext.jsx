import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

const MOCK_OFFICERS = [
  { username: 'Pradyumna', password: 'Mk@1', name: 'Pradyumna', zone: 'Pradyumna Zone', zoneId: 1 },
  { username: 'Pramod',    password: 'Mk@2', name: 'Pramod',    zone: 'Pramod Zone',    zoneId: 2 },
  { username: 'Akshat',    password: 'Mk@3', name: 'Akshat',    zone: 'Akshat Zone',    zoneId: 3 },
  { username: 'Aviral',    password: 'Mk@4', name: 'Aviral',    zone: 'Aviral Zone',    zoneId: 4 },
  { username: 'Ankit',     password: 'Mk@5', name: 'Ankit',     zone: 'Ankit Zone',     zoneId: 5 },
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
