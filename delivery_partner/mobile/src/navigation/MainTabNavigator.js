import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, ClipboardList, Wallet, User } from 'lucide-react-native';

// Placeholder Screens
import DashboardScreen from '../screens/DashboardScreen';
// import OrdersScreen from '../screens/OrdersScreen';
// import WalletScreen from '../screens/WalletScreen';
// import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#138808',
        tabBarInactiveTintColor: '#718096',
        tabBarStyle: {
          paddingBottom: 10,
          paddingTop: 10,
          height: 70,
        },
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') return <Home size={size} color={color} />;
          if (route.name === 'Orders') return <ClipboardList size={size} color={color} />;
          if (route.name === 'Wallet') return <Wallet size={size} color={color} />;
          if (route.name === 'Profile') return <User size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Orders" component={DashboardScreen} />
      <Tab.Screen name="Wallet" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={DashboardScreen} />
    </Tab.Navigator>
  );
}
