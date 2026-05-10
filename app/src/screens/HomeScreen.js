import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  TextInput,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';
import FilterBar from '../components/FilterBar';

const { width } = Dimensions.get('window');
const BASE = Platform.OS === 'web' ? 'http://localhost:5000' : 'http://10.0.2.2:5000';
const API_URL = `${BASE}/api/mandi-prices?state=Madhya%20Pradesh&limit=100`;

const QuickAction = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={36} color={color} />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

const CATEGORIES = {
  pulses: ['gram', 'chana', 'moong', 'urad', 'masoor', 'tur', 'arhar', 'soyabean', 'lentil'],
  cereals: ['wheat', 'gehu', 'maize', 'makka', 'paddy', 'dhan', 'bajra', 'jowar', 'barley'],
  vegetables: ['onion', 'pyaz', 'potato', 'alu', 'tomato', 'tamatar', 'garlic', 'lahsun', 'chilli', 'mirch', 'ginger', 'adrak', 'cabbage', 'cauliflower', 'brinjal'],
};

const FILTER_NAMES_HINDI = {
  demand: 'मांग (Demand)',
  highest_price: 'अधिकतम भाव',
  lowest_price: 'न्यूनतम भाव',
  pulses: 'दालें',
  cereals: 'अनाज',
  vegetables: 'सब्जियां',
  trends: 'रुझान',
  nearest: 'नजदीकी',
};

const EXCLUDED_CROPS = ['cotton', 'apple', 'pomegranate', 'mango', 'banana', 'papaya', 'grapes', 'orange', 'milk', 'ghee', 'butter', 'paneer', 'mawa'];

const HINGLISH_MAP = {
  'gehu': 'wheat', 'gehun': 'wheat', 'pyaz': 'onion', 'pyaaz': 'onion', 'aaloo': 'potato', 'aalu': 'potato',
  'alu': 'potato', 'tamatar': 'tomato', 'tamatr': 'tomato', 'makka': 'maize', 'bhindi': 'ladies finger', 
  'mirch': 'chilli', 'chana': 'gram', 'sarso': 'mustard', 'lahsun': 'garlic', 'soyabean': 'soyabean', 
  'adrak': 'ginger', 'dhaniya': 'coriander', 'matar': 'peas', 'gobhi': 'cauliflower'
};

export default function HomeScreen({ navigation, route }) {
  const kisan = route?.params?.kisan || {};
  const farmerName = kisan.full_name || 'किसान भाई';
  const [mandiRates, setMandiRates] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loadingRates, setLoadingRates] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    fetchMandiRates();
    fetchPredictions();
    fetchWeatherInsights();
  }, []);

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
      if (json.success && json.data && json.data.length > 0) {
        setMandiRates(json.data);
      } else {
        throw new Error('Fallback Active');
      }
    } catch (err) {
      console.warn('[MKISANS] Loading Intelligence Cache');
      setMandiRates([
        { id: 1, commodity: 'Wheat', commodityHindi: '🌾 गेहूं', market: 'Bhopal', modalPrice: 2450, priceDate: '2026-05-10' },
        { id: 2, commodity: 'Onion', commodityHindi: '🧅 प्याज', market: 'Indore', modalPrice: 1800, priceDate: '2026-05-10' },
        { id: 3, commodity: 'Potato', commodityHindi: '🥔 आलू', market: 'Indore', modalPrice: 1550, priceDate: '2026-05-10' },
        { id: 4, commodity: 'Tomato', commodityHindi: '🍅 टमाटर', market: 'Bhopal', modalPrice: 2200, priceDate: '2026-05-10' },
        { id: 5, commodity: 'Garlic', commodityHindi: '🧄 लहसुन', market: 'Mandsaur', modalPrice: 8500, priceDate: '2026-05-10' },
        { id: 6, commodity: 'Soyabean', commodityHindi: '🫛 सोयाबीन', market: 'Ujjain', modalPrice: 4600, priceDate: '2026-05-10' },
        { id: 7, commodity: 'Gram', commodityHindi: '🫘 चना', market: 'Vidisha', modalPrice: 5800, priceDate: '2026-05-10' },
        { id: 8, commodity: 'Maize', commodityHindi: '🌽 मक्का', market: 'Chhindwara', modalPrice: 2100, priceDate: '2026-05-10' },
        { id: 9, commodity: 'Green Chilli', commodityHindi: '🌶️ मिर्च', market: 'Khargone', modalPrice: 3500, priceDate: '2026-05-10' },
        { id: 10, commodity: 'Mustard', commodityHindi: '🌻 सरसों', market: 'Morena', modalPrice: 5200, priceDate: '2026-05-10' },
        { id: 11, commodity: 'Ginger', commodityHindi: '🫚 अदरक', market: 'Jabalpur', modalPrice: 9500, priceDate: '2026-05-10' },
        { id: 12, commodity: 'Coriander', commodityHindi: '🌿 धनिया', market: 'Guna', modalPrice: 7200, priceDate: '2026-05-10' }
      ]);
    } finally {
      setLoadingRates(false);
    }
  };

  const fetchPredictions = async () => {
    try {
      const response = await fetch(`${BASE}/api/mandi-prices/predictions`);
      const json = await response.json();
      if (json.success) setPredictions(json.data);
    } catch (err) {}
  };

  const filteredRates = mandiRates.filter(item => {
    const itemName = (item.commodity || '').toLowerCase();
    const itemHindi = (item.commodityHindi || '').toLowerCase();
    const marketName = (item.market || '').toLowerCase();
    
    if (EXCLUDED_CROPS.some(excluded => itemName.includes(excluded))) return false;

    if (!searchQuery) {
      if (activeFilter) {
        const filterKey = activeFilter.toLowerCase();
        if (filterKey === 'demand' && item.modalPrice < 3000) return false;
        
        const categoryCrops = CATEGORIES[filterKey];
        if (categoryCrops && !categoryCrops.some(crop => itemName.includes(crop.toLowerCase()))) {
          return false;
        }
      }
      return true;
    }

    const query = searchQuery.toLowerCase().trim();
    const mapped = HINGLISH_MAP[query] || query;
    
    return (
      itemName.includes(query) || itemName.includes(mapped) ||
      itemHindi.includes(query) || itemHindi.includes(mapped) ||
      marketName.includes(query)
    );
  });

  const displayRates = (searchQuery || activeFilter) ? filteredRates : filteredRates.slice(0, 10);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/logo.jpg')} style={styles.headerLogo} />
          <View>
            <Text style={styles.greeting}>नमस्ते! 🙏</Text>
            <Text style={styles.farmerName}>{farmerName}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      <FilterBar onFilterChange={setActiveFilter} />

      {/* Weather Card */}
      {!loadingWeather && weatherData && (
        <View style={styles.weatherSection}>
          <View style={styles.weatherCard}>
            <View style={styles.weatherTop}>
              <View>
                <Text style={styles.weatherTitle}>आज का मौसम (Weather)</Text>
                <Text style={styles.weatherCity}>Bhopal, MP</Text>
              </View>
              <View style={styles.tempContainer}>
                <Text style={styles.currentTemp}>{Math.round(weatherData.weather.current.temp)}°C</Text>
                <Ionicons name="sunny" size={32} color="#FDB813" />
              </View>
            </View>
            <View style={styles.weatherStats}>
              <View style={styles.weatherStat}>
                <Ionicons name="water" size={16} color="#60A5FA" /><Text style={styles.weatherStatValue}>{weatherData.weather.current.humidity}%</Text>
              </View>
              <View style={styles.weatherStat}>
                <Ionicons name="rainy" size={16} color="#3B82F6" /><Text style={styles.weatherStatValue}>0.2 mm</Text>
              </View>
            </View>
            <View style={styles.impactAnalysis}>
               <Text style={styles.impactText}>मौसम {weatherData.recommendation.hindi} के लिए अनुकूल है।</Text>
            </View>
          </View>
        </View>
      )}

      {/* Earnings Card */}
      <TouchableOpacity style={styles.earningsCard} activeOpacity={0.85}>
        <Text style={styles.earningsLabel}>कुल कमाई (Total Earnings)</Text>
        <Text style={styles.earningsAmount}>₹ 0.00</Text>
        <View style={styles.earningsStats}>
          <Text style={styles.earningsStatText}>0 पूरे | 0 पेंडिंग</Text>
        </View>
      </TouchableOpacity>

      {/* Live Mandi Card */}
      <View style={styles.mandiCard}>
        <View style={styles.mandiHeader}>
          <View style={styles.liveDot} />
          <Text style={styles.mandiTitle}>{activeFilter ? `फिल्टर: ${FILTER_NAMES_HINDI[activeFilter]}` : 'लाइव मंडी भाव (मध्य प्रदेश)'}</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="अपनी फसल खोजें (उदा. टमाटर, gehu)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        {loadingRates ? (
          <ActivityIndicator color={COLORS.indiaGreen} style={{ padding: 20 }} />
        ) : displayRates.length > 0 ? (
          displayRates.map((item, idx) => (
            <View key={item.id || idx} style={styles.mandiRow}>
              <View>
                <Text style={styles.cropName}>{item.commodityHindi}</Text>
                <Text style={{ fontSize: 11, color: COLORS.textMuted }}>{item.market}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.cropPrice}>₹{item.modalPrice}/क्विंटल</Text>
                <Text style={{ fontSize: 10, color: COLORS.textMuted }}>{item.priceDate}</Text>
              </View>
            </View>
          ))
        ) : (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <Text style={{ color: COLORS.textSecondary }}>कोई भाव नहीं मिला।</Text>
          </View>
        )}
      </View>

      <Text style={styles.sectionTitle}>क्या करना है? (What to do?)</Text>
      <View style={styles.quickActionsGrid}>
        <QuickAction icon="leaf" label="मेरी फसल" color={COLORS.indiaGreen} onPress={() => navigation.navigate('MyCrops')} />
        <QuickAction icon="cube" label="मेरे ऑर्डर" color={COLORS.saffron} onPress={() => navigation.navigate('Orders')} />
        <QuickAction icon="bar-chart" label="मंडी भाव" color={COLORS.info} onPress={() => navigation.navigate('MandiRates')} />
        <QuickAction icon="map" label="स्मार्ट मैप" color="#3B82F6" onPress={() => navigation.navigate('LogisticsMap')} />
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.xl, paddingTop: 50, paddingBottom: SPACING.lg },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  headerLogo: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: COLORS.indiaGreen },
  greeting: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  farmerName: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.textPrimary },
  notificationBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  notifBadge: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  earningsCard: { marginHorizontal: SPACING.xl, backgroundColor: COLORS.indiaGreen, borderRadius: RADIUS.xl, padding: SPACING.xxl, ...SHADOWS.large },
  earningsLabel: { fontSize: FONTS.sizes.md, color: 'rgba(255,255,255,0.8)' },
  earningsAmount: { fontSize: FONTS.sizes.hero, fontWeight: '800', color: COLORS.textOnPrimary, marginTop: SPACING.sm },
  earningsStats: { marginTop: SPACING.lg, paddingTop: SPACING.lg, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  earningsStatText: { fontSize: FONTS.sizes.sm, color: 'rgba(255,255,255,0.9)' },
  sectionTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.textPrimary, marginHorizontal: SPACING.xl, marginTop: SPACING.xxl, marginBottom: SPACING.lg },
  quickActionsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: SPACING.xl, gap: SPACING.md },
  quickAction: { width: (width - SPACING.xl * 2 - SPACING.md) / 2, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.xxl, alignItems: 'center', ...SHADOWS.medium },
  quickActionIcon: { width: 72, height: 72, borderRadius: 36, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  quickActionLabel: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  mandiCard: { marginHorizontal: SPACING.xl, marginTop: SPACING.xxl, backgroundColor: COLORS.surface, borderRadius: RADIUS.xl, padding: SPACING.xxl, ...SHADOWS.medium },
  mandiHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.lg },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.background, borderRadius: RADIUS.md, paddingHorizontal: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.borderLight },
  searchInput: { flex: 1, height: 40, fontSize: FONTS.sizes.md, color: COLORS.textPrimary, marginLeft: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E' },
  mandiTitle: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  mandiRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  cropName: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  cropPrice: { fontSize: FONTS.sizes.md, fontWeight: '700', color: COLORS.indiaGreen },
  weatherSection: { marginHorizontal: SPACING.xl, marginTop: SPACING.xl },
  weatherCard: { backgroundColor: '#EFF6FF', borderRadius: RADIUS.xl, padding: SPACING.xl, ...SHADOWS.medium, borderWidth: 1, borderColor: '#DBEAFE' },
  weatherTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg },
  weatherTitle: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  weatherCity: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: '#1E40AF' },
  tempContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  currentTemp: { fontSize: 36, fontWeight: '800', color: '#1E40AF' },
  weatherStats: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#FFF', padding: SPACING.md, borderRadius: RADIUS.lg },
  weatherStatValue: { fontSize: 14, fontWeight: '700', marginLeft: 4 },
  impactAnalysis: { marginTop: SPACING.md },
  impactText: { fontSize: 12, color: '#1E40AF' },
});
