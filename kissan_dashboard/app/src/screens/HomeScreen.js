import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Platform,
  StatusBar,
  SafeAreaView,
  Animated,
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');
const BASE = Platform.OS === 'web' ? 'http://localhost:5000' : 'http://10.0.2.2:5000';
const API_URL = `${BASE}/api/mandi-prices?state=Madhya%20Pradesh&limit=100`;

const HEADER_MAX_HEIGHT = 280;
const HEADER_MIN_HEIGHT = Platform.OS === 'ios' ? 90 : 70;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

export default function HomeScreen({ navigation, route }) {
  const [kisan, setKisan] = useState(route?.params?.kisan || null);
  const [mandiRates, setMandiRates] = useState([]);
  const [loadingRates, setLoadingRates] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [loadingSession, setLoadingSession] = useState(!kisan);
  
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadSession();
    fetchMandiRates();
    fetchWeatherInsights();
  }, []);

  const loadSession = async () => {
    if (!kisan) {
      try {
        const session = await AsyncStorage.getItem('userSession');
        if (session) {
          setKisan(JSON.parse(session));
        }
      } catch (e) {
        console.error('Failed to load session');
      } finally {
        setLoadingSession(false);
      }
    }
  };

  const fetchWeatherInsights = async () => {
    try {
      const response = await fetch(`${BASE}/api/weather/insights`);
      const json = await response.json();
      if (json.success) setWeatherData(json);
    } catch (err) {
      console.log('Weather Fetch Error');
    } finally {
      setLoadingWeather(false);
    }
  };

  const fetchMandiRates = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      if (json.success && json.data) {
        setMandiRates(json.data);
      } else {
        throw new Error('Cache fallback');
      }
    } catch (err) {
      setMandiRates([
        { id: 1, commodityHindi: '🌾 गेहूं', market: 'Bhopal', modalPrice: 2450 },
        { id: 2, commodityHindi: '🧅 प्याज', market: 'Indore', modalPrice: 1800 },
        { id: 3, commodityHindi: '🥔 आलू', market: 'Indore', modalPrice: 1550 },
      ]);
    } finally {
      setLoadingRates(false);
    }
  };

  const farmerName = kisan?.full_name || 'Kisan';
  const farmerId = kisan?.id ? `MK-${kisan.id}` : (kisan?.mobile_number ? `MK-${kisan.mobile_number}` : 'MK-ID');
  const villageName = kisan?.village || 'Village';
  const locationText = kisan?.district ? `${kisan.district}, ${kisan.state || 'MP'}` : 'Location';

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });

  const backgroundScale = scrollY.interpolate({
    inputRange: [-150, 0],
    outputRange: [2, 1],
    extrapolate: 'clamp',
  });

  const InsightCard = ({ label, value, icon, color, subText }) => (
    <View style={styles.insightCard}>
      <View style={[styles.insightIconCircle, { backgroundColor: color + '15' }]}>
        <MaterialCommunityIcons name={icon} size={22} color={color} />
      </View>
      <View style={styles.insightContent}>
        <Text style={styles.insightLabel}>{label}</Text>
        <Text style={[styles.insightValue, { color: COLORS.textPrimary }]}>{value}</Text>
        {subText && <Text style={styles.insightSub}>{subText}</Text>}
      </View>
    </View>
  );

  const WeatherMetric = ({ label, value, icon, unit, warning }) => (
    <View style={[styles.weatherMetric, warning && styles.weatherWarning]}>
      <MaterialCommunityIcons name={icon} size={20} color={warning ? COLORS.error : COLORS.primary} />
      <View style={{ marginLeft: 8 }}>
        <Text style={styles.metricLabel}>{label}</Text>
        <Text style={styles.metricValue}>{value}<Text style={styles.metricUnit}>{unit}</Text></Text>
      </View>
    </View>
  );

  if (loadingSession) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Dynamic Background */}
      <Animated.View 
        style={[
          styles.topBackground, 
          { 
            height: headerHeight,
            transform: [{ scale: backgroundScale }]
          }
        ]} 
      />

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Header Section */}
        <Animated.View style={[styles.header, { opacity: headerOpacity }]}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Image 
                source={kisan?.profile_photo ? { uri: `${BASE}/${kisan.profile_photo}` } : require('../../assets/user.png')} 
                style={styles.profilePic} 
              />
            </TouchableOpacity>
            <View style={styles.headerInfo}>
               <Text style={styles.farmerName}>{farmerName}</Text>
               <View style={styles.villageRow}>
                 <Ionicons name="location" size={14} color={COLORS.white} opacity={0.8} />
                 <Text style={styles.villageText}>{villageName} • {locationText}</Text>
               </View>
               <Text style={styles.farmerId}>ID: {farmerId}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notifBtn}>
            <Ionicons name="notifications" size={24} color={COLORS.white} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>
        </Animated.View>

        {/* Content starts below the visual header height */}
        <View style={{ marginTop: 10 }}>
          {/* Wallet Balance Card */}
          <View style={styles.walletCard}>
             <View>
                <Text style={styles.walletLabel}>Total Wallet Balance</Text>
                <Text style={styles.walletValue}>₹45,200.00</Text>
             </View>
             <TouchableOpacity style={styles.withdrawBtn}>
                <Text style={styles.withdrawText}>Withdraw</Text>
             </TouchableOpacity>
          </View>

          {/* Weather Dashboard */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🌤️ Weather Dashboard</Text>
              <TouchableOpacity onPress={() => navigation.navigate('LogisticsMap')}><Text style={styles.viewAll}>Advanced Charts ›</Text></TouchableOpacity>
            </View>
            
            <View style={styles.weatherGrid}>
              <WeatherMetric label="Temp" value={weatherData?.weather?.current?.temp ? Math.round(weatherData.weather.current.temp) : '32'} unit="°C" icon="thermometer" />
              <WeatherMetric label="Rain Forecast" value="12" unit="%" icon="weather-pouring" />
              <WeatherMetric label="Humidity" value={weatherData?.weather?.current?.humidity || '65'} unit="%" icon="water-percent" />
              <WeatherMetric label="Wind Speed" value={weatherData?.weather?.current?.wind_speed || '14'} unit="km/h" icon="wind-power" />
              <WeatherMetric label="Storm Alert" value="None" icon="weather-lightning" warning={false} />
              <WeatherMetric label="Irrigation" value="Required" icon="sprinkler-variant" warning={true} />
            </View>
          </View>

          {/* Quick Actions Grid (3x2) */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>🚀 Quick Actions</Text>
            <View style={styles.actionGrid}>
               <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('Orders')}>
                  <View style={[styles.actionIcon, {backgroundColor: '#F0FDF4'}]}><MaterialCommunityIcons name="clipboard-text-clock" size={24} color={COLORS.primary} /></View>
                  <Text style={styles.actionLabel}>View Orders</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('MyCrops')}>
                  <View style={[styles.actionIcon, {backgroundColor: '#FFF7ED'}]}><MaterialCommunityIcons name="plus-circle" size={24} color="#F97316" /></View>
                  <Text style={styles.actionLabel}>Add Crop</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('MyCrops')}>
                  <View style={[styles.actionIcon, {backgroundColor: '#EFF6FF'}]}><MaterialCommunityIcons name="leaf" size={24} color="#3B82F6" /></View>
                  <Text style={styles.actionLabel}>My Crops</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('PreHarvest')}>
                  <View style={[styles.actionIcon, {backgroundColor: '#F5F3FF'}]}><MaterialCommunityIcons name="calendar-clock" size={24} color="#8B5CF6" /></View>
                  <Text style={styles.actionLabel}>Pre-Booking</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('LogisticsMap')}>
                  <View style={[styles.actionIcon, {backgroundColor: '#FEF2F2'}]}><MaterialCommunityIcons name="truck-delivery" size={24} color="#EF4444" /></View>
                  <Text style={styles.actionLabel}>Delivery Status</Text>
               </TouchableOpacity>
               <TouchableOpacity style={styles.actionItem} onPress={() => navigation.navigate('MandiRates')}>
                  <View style={[styles.actionIcon, {backgroundColor: '#ECFDF5'}]}><MaterialCommunityIcons name="chart-line" size={24} color="#10B981" /></View>
                  <Text style={styles.actionLabel}>Mandi Prices</Text>
               </TouchableOpacity>
            </View>
          </View>

          {/* Farm Insights Summary (In My Crop) */}
          <View style={styles.sectionContainer}>
             <Text style={styles.sectionTitle}>📊 Farm Insights (Overview)</Text>
             <View style={styles.insightsGrid}>
                <InsightCard label="Today's Orders" value="12" icon="cart-arrow-down" color="#10B981" subText="3 New" />
                <InsightCard label="Pending Orders" value="08" icon="clock-alert" color="#F59E0B" subText="Needs Action" />
                <InsightCard label="Total Earning" value="₹1.2L" icon="currency-inr" color="#138808" subText="Overall" />
                <InsightCard label="Active Products" value="05" icon="package-variant" color="#3B82F6" subText="In Marketplace" />
                <InsightCard label="Monthly Profit" value="₹28K" icon="trending-up" color="#8B5CF6" subText="+15% from last month" />
                <InsightCard label="Delivery Pending" value="04" icon="truck-fast" color="#EF4444" subText="In Transit" />
                <InsightCard label="Pre-Booking" value="15" icon="hand-coin" color="#F97316" subText="Requests" />
             </View>
          </View>

          {/* Real Mandi Prices (MP) */}
          <View style={[styles.sectionContainer, { marginBottom: 120 }]}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>💰 MP Mandi Live Prices</Text>
              <TouchableOpacity onPress={() => navigation.navigate('MandiRates')}><Text style={styles.viewAll}>View More ›</Text></TouchableOpacity>
            </View>
            {loadingRates ? (
              <ActivityIndicator color={COLORS.primary} />
            ) : (
              mandiRates.slice(0, 5).map((item, idx) => (
                <TouchableOpacity key={idx} style={styles.mandiPriceRow} onPress={() => navigation.navigate('MandiRates', { query: item.commodity })}>
                   <View style={styles.mandiInfo}>
                      <Text style={styles.mandiCommodity}>{item.commodityHindi}</Text>
                      <Text style={styles.mandiMarket}>{item.market} Market</Text>
                   </View>
                   <View style={styles.mandiValueRow}>
                      <Text style={styles.mandiPriceText}>₹{item.modalPrice}/qtl</Text>
                      <MaterialIcons name="trending-up" size={16} color={COLORS.success} />
                   </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </Animated.ScrollView>

      {/* Sticky Small Header */}
      <Animated.View style={[styles.stickyHeader, { height: HEADER_MIN_HEIGHT, opacity: scrollY.interpolate({ inputRange: [HEADER_SCROLL_DISTANCE - 20, HEADER_SCROLL_DISTANCE], outputRange: [0, 1], extrapolate: 'clamp' }) }]}>
        <Text style={styles.stickyTitle}>{farmerName}</Text>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topBackground: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: COLORS.deepGreen, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, zIndex: -1 },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 20, height: 120 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  profilePic: { width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: COLORS.white },
  headerInfo: { gap: 2 },
  farmerName: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
  villageRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  villageText: { color: COLORS.white, fontSize: 12, opacity: 0.9 },
  farmerId: { color: COLORS.white, fontSize: 11, opacity: 0.7, fontWeight: '600' },
  notifBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.15)', justifyContent: 'center', alignItems: 'center' },
  notifBadge: { position: 'absolute', top: 12, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', borderWidth: 1.5, borderColor: COLORS.deepGreen },

  stickyHeader: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: COLORS.deepGreen, justifyContent: 'center', alignItems: 'center', paddingTop: Platform.OS === 'android' ? 20 : 0, zIndex: 10 },
  stickyTitle: { color: COLORS.white, fontWeight: '700', fontSize: 16 },

  walletCard: { marginHorizontal: 20, backgroundColor: COLORS.white, borderRadius: 20, padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...SHADOWS.medium, marginBottom: 25 },
  walletLabel: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },
  walletValue: { fontSize: 24, fontWeight: '800', color: COLORS.deepGreen, marginTop: 4 },
  withdrawBtn: { backgroundColor: COLORS.primary, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  withdrawText: { color: COLORS.white, fontWeight: '700', fontSize: 12 },

  sectionContainer: { paddingHorizontal: 20, marginTop: 25 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary },
  viewAll: { fontSize: 12, color: COLORS.primary, fontWeight: '600' },

  weatherGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  weatherMetric: { width: (width - 50) / 2, backgroundColor: COLORS.white, borderRadius: 15, padding: 12, flexDirection: 'row', alignItems: 'center', ...SHADOWS.small },
  weatherWarning: { borderColor: COLORS.error + '50', borderWidth: 1, backgroundColor: '#FEF2F2' },
  metricLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  metricValue: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  metricUnit: { fontSize: 10, fontWeight: '400', color: COLORS.textMuted },

  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 5 },
  actionItem: { width: (width - 64) / 3, alignItems: 'center', gap: 8 },
  actionIcon: { width: 56, height: 56, borderRadius: 18, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  actionLabel: { fontSize: 11, fontWeight: '700', color: COLORS.textSecondary, textAlign: 'center' },

  insightsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  insightCard: { width: (width - 50) / 2, backgroundColor: COLORS.white, borderRadius: 18, padding: 12, flexDirection: 'row', alignItems: 'flex-start', ...SHADOWS.small },
  insightIconCircle: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  insightContent: { marginLeft: 10, flex: 1 },
  insightLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  insightValue: { fontSize: 18, fontWeight: '800', marginTop: 2 },
  insightSub: { fontSize: 9, color: COLORS.textSecondary, marginTop: 2 },

  mandiPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.white, padding: 15, borderRadius: 15, marginBottom: 10, ...SHADOWS.small },
  mandiInfo: { gap: 2 },
  mandiCommodity: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  mandiMarket: { fontSize: 12, color: COLORS.textMuted },
  mandiValueRow: { alignItems: 'flex-end', gap: 2 },
  mandiPriceText: { fontSize: 16, fontWeight: '800', color: COLORS.deepGreen },
});
