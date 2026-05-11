import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Screens
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import CustomerDashboardScreen from './src/screens/CustomerDashboardScreen';
import MyCropsScreen from './src/screens/MyCropsScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import MandiRatesScreen from './src/screens/MandiRatesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import CustomerProfileScreen from './src/screens/CustomerProfileScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import SocialFeedScreen from './src/screens/SocialFeedScreen';
import SocialUploadScreen from './src/screens/SocialUploadScreen';
import MandiIntelligenceScreen from './src/screens/MandiIntelligenceScreen';
import DiscoverUsersScreen from './src/screens/DiscoverUsersScreen';
import LogisticsMapScreen from './src/screens/LogisticsMapScreen';
import JarvisAssistant from './src/components/JarvisAssistant';

// Theme
import { COLORS, FONTS, SHADOWS } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabConfig = {
  Home: { label: '🏠 होम', icon: 'home' },
  MyCrops: { label: '🌱 फसल', icon: 'leaf' },
  Orders: { label: '📦 ऑर्डर', icon: 'cube' },
  MandiRates: { label: '📊 मंडी', icon: 'bar-chart' },
  Social: { label: '📸 सोशल', icon: 'camera' },
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
      <Tab.Screen name="Social" component={SocialFeedScreen} options={{ tabBarLabel: tabConfig.Social.label }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: tabConfig.Profile.label }} />
    </Tab.Navigator>
  );
}

function CustomerTabs() {
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
      <Tab.Screen name="Home" component={CustomerDashboardScreen} options={{ tabBarLabel: tabConfig.Home.label }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarLabel: tabConfig.Orders.label }} />
      <Tab.Screen name="MandiRates" component={MandiRatesScreen} options={{ tabBarLabel: tabConfig.MandiRates.label }} />
      <Tab.Screen name="Social" component={SocialFeedScreen} options={{ tabBarLabel: tabConfig.Social.label }} />
      <Tab.Screen name="Profile" component={CustomerProfileScreen} options={{ tabBarLabel: tabConfig.Profile.label }} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [isSplashFinished, setIsSplashFinished] = useState(false);
  const [initialRoute, setInitialRoute] = useState('Login');
  const [userSession, setUserSession] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  const checkSession = async () => {
    try {
      const session = await AsyncStorage.getItem('userSession');
      if (session) {
        const userData = JSON.parse(session);
        setUserSession(userData);

        // Route to the correct dashboard based on persisted role
        const userRole = userData.role || 'farmer';
        if (userRole === 'consumer') {
          setInitialRoute('CustomerDashboard');
        } else {
          // farmer, officer, delivery all use MainApp tabs
          setInitialRoute('MainApp');
        }
      }
    } catch (e) {
      console.error('Failed to check session:', e);
    } finally {
      setIsCheckingSession(false);
    }
  };

  if (!isSplashFinished) {
    return (
      <SplashScreen 
        onFinish={async () => {
          await checkSession();
          setIsSplashFinished(true);
        }} 
      />
    );
  }

  if (isCheckingSession) {
    return <SplashScreen onFinish={() => {}} />; // Keep splash visible while checking
  }

  return (
    <>
      <StatusBar style="dark" />
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ headerShown: false }} 
          initialRouteName={initialRoute}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen 
            name="MainApp" 
            component={MainTabs} 
            initialParams={{ kisan: userSession }} 
          />
          <Stack.Screen 
            name="CustomerDashboard" 
            component={CustomerTabs} 
            initialParams={{ kisan: userSession }} 
          />
          <Stack.Screen name="SocialUpload" component={SocialUploadScreen} />
          <Stack.Screen name="MandiIntelligence" component={MandiIntelligenceScreen} />
          <Stack.Screen name="DiscoverUsers" component={DiscoverUsersScreen} />
          <Stack.Screen name="LogisticsMap" component={LogisticsMapScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      {isSplashFinished && <JarvisAssistant userSession={userSession} />}
    </>
  );
}
