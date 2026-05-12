import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
import MyCropsScreen from './src/screens/MyCropsScreen';
import OrdersScreen from './src/screens/OrdersScreen';
import MandiRatesScreen from './src/screens/MandiRatesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import SocialFeedScreen from './src/screens/SocialFeedScreen';
import SocialUploadScreen from './src/screens/SocialUploadScreen';
import MandiIntelligenceScreen from './src/screens/MandiIntelligenceScreen';
import DiscoverUsersScreen from './src/screens/DiscoverUsersScreen';
import LogisticsMapScreen from './src/screens/LogisticsMapScreen';
import AIPricingScreen from './src/screens/AIPricingScreen';
import JarvisAssistant from './src/components/JarvisAssistant';

// Theme
import { COLORS, FONTS, SHADOWS } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const tabConfig = {
  Home: { label: 'Home', icon: 'home' },
  MyCrops: { label: 'Crops', icon: 'leaf' },
  AIPricing: { label: 'AI Check', icon: 'sparkles' },
  Orders: { label: 'Orders', icon: 'cube' },
  MandiRates: { label: 'Rates', icon: 'bar-chart' },
  Profile: { label: 'Profile', icon: 'person' },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const config = tabConfig[route.name];
          const iconName = focused ? config.icon : config.icon + '-outline';
          
          if (route.name === 'Social') {
             return (
               <View style={styles.cartCircle}>
                  <Ionicons name="camera" size={26} color={COLORS.white} />
               </View>
             );
          }

          return (
            <Ionicons
              name={iconName}
              size={24}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginBottom: 8,
        },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: COLORS.white,
          borderTopWidth: 0,
          height: 85,
          paddingBottom: 10,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          ...SHADOWS.large,
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: tabConfig.Home.label }} />
      <Tab.Screen name="MyCrops" component={MyCropsScreen} options={{ tabBarLabel: tabConfig.MyCrops.label }} />
      <Tab.Screen name="AIPricing" component={AIPricingScreen} options={{ 
        tabBarLabel: '',
        tabBarIcon: ({ focused }) => (
          <View style={styles.cartCircle}>
             <Ionicons name="sparkles" size={26} color={COLORS.white} />
          </View>
        )
      }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ tabBarLabel: tabConfig.Orders.label }} />
      <Tab.Screen name="MandiRates" component={MandiRatesScreen} options={{ tabBarLabel: tabConfig.MandiRates.label }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: tabConfig.Profile.label }} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  cartCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -30,
    borderWidth: 5,
    borderColor: COLORS.white,
    ...SHADOWS.medium,
  },
  cartBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: COLORS.error,
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  cartBadgeText: {
    color: COLORS.white,
    fontSize: 9,
    fontWeight: 'bold',
  }
});

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
        setInitialRoute('MainApp');
      }
    } catch (e) {
      console.error('Failed to check session:', e);
    } finally {
      setIsCheckingSession(false);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUserSession(userData);
  };

  if (!isSplashFinished) {
    return (
      <SplashScreen 
        onFinish={() => {
          checkSession();
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
          <Stack.Screen name="Login">
            {(props) => <LoginScreen {...props} onLoginSuccess={handleLoginSuccess} />}
          </Stack.Screen>
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen 
            name="MainApp" 
            component={MainTabs} 
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
