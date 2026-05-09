import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import MyCropsScreen from './src/screens/MyCropsScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import MandiRatesScreen from './src/screens/MandiRatesScreen';
import ProfileScreen from './src/screens/ProfileScreen';

// Theme
import { COLORS, FONTS, SHADOWS } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabConfig = {
  Home: { label: '🏠 होम', icon: 'home' },
  MyCrops: { label: '🌱 फसल', icon: 'leaf' },
  Orders: { label: '📦 ऑर्डर', icon: 'cube' },
  MandiRates: { label: '📊 मंडी', icon: 'bar-chart' },
  Profile: { label: '👤 प्रोफ़ाइल', icon: 'person' },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const config = tabConfig[route.name];
          return (
            <Ionicons
              name={focused ? config.icon : config.icon + '-outline'}
              size={24}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: COLORS.indiaGreen,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: FONTS.sizes.xs,
          fontWeight: '600',
          marginBottom: 4,
        },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          height: 70,
          paddingTop: 8,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          ...SHADOWS.large,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: tabConfig.Home.label }} />
      <Tab.Screen name="MyCrops" component={MyCropsScreen} options={{ tabBarLabel: tabConfig.MyCrops.label }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarLabel: tabConfig.Orders.label }} />
      <Tab.Screen name="MandiRates" component={MandiRatesScreen} options={{ tabBarLabel: tabConfig.MandiRates.label }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: tabConfig.Profile.label }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isSplashFinished, setIsSplashFinished] = useState(false);

  if (!isSplashFinished) {
    return <SplashScreen onFinish={() => setIsSplashFinished(true)} />;
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="MainApp" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
