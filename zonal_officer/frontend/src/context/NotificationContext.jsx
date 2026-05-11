import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

const INITIAL_NOTIFICATIONS = [
  { id: 1,  type: 'farmer',  title: 'New Farmer Registration',          msg: 'Deepak Verma from UP, Agra has applied.',            time: '2 min ago',  read: false },
  { id: 2,  type: 'partner', title: 'New Delivery Partner Application',  msg: 'Harpreet Singh applied with Tata Ace (PB-10-GH-7761).', time: '15 min ago', read: false },
  { id: 3,  type: 'farmer',  title: 'New Farmer Registration',          msg: 'Sunil Yadav from MP, Bhopal has registered.',        time: '1 hr ago',   read: false },
  { id: 4,  type: 'alert',   title: 'Critical Alert',                    msg: 'Rainfall warning issued for northern districts.',    time: '2 hr ago',   read: true  },
  { id: 5,  type: 'partner', title: 'Partner Verification Pending',      msg: 'Manish Patel application awaiting review.',         time: '3 hr ago',   read: true  },
  { id: 6,  type: 'farmer',  title: 'Farmer Profile Updated',            msg: 'Ramesh Singh updated his land records.',            time: '5 hr ago',   read: true  },
];

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const markRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const addNotification = (notification) => {
    setNotifications(prev => [
      { id: Date.now(), read: false, time: 'Just now', ...notification },
      ...prev,
    ]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllRead, markRead, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
