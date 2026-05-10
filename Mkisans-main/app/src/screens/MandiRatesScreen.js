import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, ActivityIndicator, 
  TouchableOpacity, Animated, Dimensions, Modal, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

// Generate real dates for the last 15 days
const generateDates = () => {
  const dates = [];
  for (let i = 14; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    dates.push(d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }));
  }
  return dates;
};

const DATES = generateDates();

const TOP_MOVERS = [
  { name: 'Garlic (लहसुन)', trend: '+12.4%', up: true, price: '₹8,500' },
  { name: 'Tomato (टमाटर)', trend: '+8.2%', up: true, price: '₹2,200' },
  { name: 'Onion (प्याज)', trend: '-4.1%', up: false, price: '₹1,800' },
];

const LIVE_TICKER = [
  "🔥 50kg Tomatoes sold in Bhopal Market",
  "📉 Potato prices dropped by 3% in Indore",
  "📈 High demand for Garlic reported in Mandsaur",
  "✅ New organic farmer listed from Sehore"
];

export default function MandiRatesScreen({ navigation }) {
  const [mandiRates, setMandiRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [historyVisible, setHistoryVisible] = useState(false);
  const [activeHistoryIndex, setActiveHistoryIndex] = useState(14);
  const [tickerIndex, setTickerIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const listAnims = useRef([]).current;

  useEffect(() => {
    fetchMandiRates();

    // Pulse animation for live indicators
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.5, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true })
      ])
    ).start();

    // Live Ticker Interval
    const tickerInt = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % LIVE_TICKER.length);
    }, 3000);

    return () => clearInterval(tickerInt);
  }, []);

  const fetchMandiRates = async () => {
    let data = [];
    try {
      const response = await fetch('http://localhost:5000/api/mandi-prices?state=Madhya%20Pradesh&limit=50');
      const json = await response.json();
      
      if (json.success && json.data && json.data.length > 0) {
        data = json.data.map(item => ({
          ...item,
          trendUp: item.modalPrice > 2000,
          trendChange: Math.round(item.modalPrice * 0.03),
          history: Array.from({ length: 15 }, () => Math.round(item.modalPrice * (0.9 + Math.random() * 0.2)))
        }));
      } else {
        throw new Error('API Sync Delay');
      }
    } catch (err) {
      data = [
        { id: 1, commodity: 'Wheat', commodityHindi: '🌾 गेहूं', market: 'Bhopal', modalPrice: 2450, trendUp: true, trendChange: 50, history: [2300, 2350, 2400, 2380, 2420, 2450, 2480, 2460, 2440, 2450, 2470, 2490, 2500, 2480, 2450] },
        { id: 2, commodity: 'Onion', commodityHindi: '🧅 प्याज', market: 'Indore', modalPrice: 1800, trendUp: false, trendChange: 20, history: [1900, 1850, 1820, 1840, 1810, 1800, 1780, 1790, 1810, 1800, 1780, 1770, 1760, 1780, 1800] },
        { id: 3, commodity: 'Garlic', commodityHindi: '🧄 लहसुन', market: 'Mandsaur', modalPrice: 8500, trendUp: true, trendChange: 300, history: [7800, 8000, 8200, 8100, 8300, 8500, 8700, 8900, 9100, 9300, 9200, 9400, 9500, 9300, 9500] }
      ];
    } finally {
      setMandiRates(data);
      data.forEach((_, i) => { if (!listAnims[i]) listAnims[i] = new Animated.Value(0); });
      setLoading(false);
      startAnimations(data.length);
    }
  };

  const startAnimations = (count) => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    const staggers = listAnims.slice(0, count).map((anim, i) => 
      Animated.spring(anim, { toValue: 1, delay: i * 50, tension: 40, friction: 8, useNativeDriver: true })
    );
    Animated.parallel(staggers).start();
  };

  const openHistory = (crop) => {
    setSelectedCrop(crop);
    setActiveHistoryIndex(14);
    setHistoryVisible(true);
  };

  const renderLineGraph = () => {
    if (!selectedCrop?.history) return null;
    const max = Math.max(...selectedCrop.history);
    const min = Math.min(...selectedCrop.history);
    const range = max - min || 1;
    const chartHeight = 150;
    const chartWidth = width - 100;
    const stepX = chartWidth / 14;

    return selectedCrop.history.map((val, i) => {
      if (i === 0) return null;
      const x1 = (i - 1) * stepX;
      const y1 = chartHeight - ((selectedCrop.history[i-1] - min) / range) * chartHeight;
      const x2 = i * stepX;
      const y2 = chartHeight - ((val - min) / range) * chartHeight;
      
      return (
        <View key={i} style={[styles.lineSegment, {
          width: Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2)),
          left: x1,
          top: y1 + (y2-y1)/2,
          transform: [{ rotate: Math.atan2(y2-y1, x2-x1) + 'rad' }],
          backgroundColor: selectedCrop.trendUp ? COLORS.indiaGreen : COLORS.error
        }]} />
      );
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>📊 मंडी इंटेलिजेंस</Text>
            <Text style={styles.subtitle}>Market Intelligence • Live Analytics</Text>
          </View>
          <View style={styles.liveBadge}>
             <Animated.View style={[styles.dot, { transform: [{ scale: pulseAnim }] }]} />
             <Text style={styles.liveText}>LIVE</Text>
          </View>
        </View>

        {/* --- ENHANCED MARKET MOMENTUM SECTION --- */}
        <View style={styles.analyticsWrapper}>
          <Text style={styles.sectionHeader}>बाज़ार की रफ़्तार (Market Momentum)</Text>

          {/* 1. Market Momentum Score (Gauge Meter) */}
          <View style={styles.scoreCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View>
                <Text style={styles.cardLabel}>Overall Market Trend</Text>
                <Text style={styles.scoreText}>High Demand</Text>
                <Text style={{fontSize: 12, color: COLORS.indiaGreen, fontWeight: '700'}}>+12% Buying Activity</Text>
              </View>
              <View style={styles.gaugeContainer}>
                <Ionicons name="speedometer" size={48} color={COLORS.indiaGreen} />
                <View style={styles.gaugeGlow} />
              </View>
            </View>
            <View style={styles.gaugeBarContainer}>
              <View style={[styles.gaugeFill, {width: '80%', backgroundColor: COLORS.indiaGreen}]} />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 5}}>
              <Text style={{fontSize: 10, color: COLORS.textMuted}}>Low</Text>
              <Text style={{fontSize: 10, color: COLORS.textMuted}}>Stable</Text>
              <Text style={{fontSize: 10, color: COLORS.indiaGreen, fontWeight: '700'}}>High</Text>
            </View>
          </View>

          {/* Horizontal Analytics Scroll */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: 20, paddingBottom: 15, gap: 15}}>
            
            {/* 2. Trend Insights */}
            <View style={[styles.miniCard, {borderColor: '#DBEAFE', backgroundColor: '#EFF6FF'}]}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8}}>
                <Ionicons name="bulb" size={16} color="#3B82F6" />
                <Text style={{fontSize: 12, fontWeight: '800', color: '#1E3A8A'}}>AI Insight</Text>
              </View>
              <Text style={{fontSize: 13, color: '#1E40AF', fontWeight: '600'}}>Tomato demand increased by 18% this week.</Text>
            </View>

            {/* 4. Buying Recommendation */}
            <View style={[styles.miniCard, {borderColor: '#D1FAE5', backgroundColor: '#ECFDF5'}]}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8}}>
                <Ionicons name="cart" size={16} color="#10B981" />
                <Text style={{fontSize: 12, fontWeight: '800', color: '#065F46'}}>Smart Buy</Text>
              </View>
              <Text style={{fontSize: 13, color: '#047857', fontWeight: '600'}}>Best Time to Buy Tomatoes: Tonight after 8PM</Text>
            </View>

            {/* 5. Demand Heatmap */}
            <View style={[styles.miniCard, {borderColor: '#FEE2E2', backgroundColor: '#FEF2F2'}]}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8}}>
                <Ionicons name="map" size={16} color="#EF4444" />
                <Text style={{fontSize: 12, fontWeight: '800', color: '#991B1B'}}>Hot Zones</Text>
              </View>
              <Text style={{fontSize: 13, color: '#B91C1C', fontWeight: '600'}}>Bhopal (High), Indore (Stable), Sehore (Low)</Text>
            </View>

          </ScrollView>

          {/* 3. Top Moving Crops Leaderboard */}
          <View style={styles.leaderboardCard}>
            <Text style={styles.cardLabel}>Top Movers Leaderboard</Text>
            {TOP_MOVERS.map((mover, idx) => (
              <View key={idx} style={styles.moverRow}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
                  <View style={[styles.moverIconWrap, {backgroundColor: mover.up ? '#DCFCE7' : '#FEE2E2'}]}>
                    <Ionicons name={mover.up ? 'trending-up' : 'trending-down'} size={16} color={mover.up ? '#166534' : '#991B1B'} />
                  </View>
                  <View>
                    <Text style={{fontSize: 14, fontWeight: '700', color: COLORS.textPrimary}}>{mover.name}</Text>
                    <Text style={{fontSize: 12, color: COLORS.textSecondary}}>{mover.price}</Text>
                  </View>
                </View>
                <Text style={{fontSize: 15, fontWeight: '800', color: mover.up ? '#166534' : '#991B1B'}}>{mover.trend}</Text>
              </View>
            ))}
          </View>

          {/* 6. Live Market Activity Ticker */}
          <View style={styles.tickerCard}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
              <Animated.View style={[styles.dot, { transform: [{ scale: pulseAnim }], backgroundColor: '#3B82F6' }]} />
              <Text style={{fontSize: 12, fontWeight: '800', color: '#3B82F6'}}>LIVE ACTIVITY</Text>
            </View>
            <Animated.Text style={styles.tickerText} key={tickerIndex}>
              {LIVE_TICKER[tickerIndex]}
            </Animated.Text>
          </View>

        </View>
        {/* --- END MOMENTUM SECTION --- */}

        <View style={styles.listSection}>
          <Text style={styles.listHeading}>ताज़ा भाव (Current Rates)</Text>
          {loading ? (
            <ActivityIndicator color={COLORS.indiaGreen} size="large" style={{ marginTop: 50 }} />
          ) : (
            mandiRates.map((item, i) => (
              <Animated.View key={item.id || i} style={{ opacity: listAnims[i] || 1, transform: [{ translateY: (listAnims[i] || new Animated.Value(1)).interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
                <TouchableOpacity style={styles.rateCard} activeOpacity={0.8} onPress={() => openHistory(item)}>
                  <View style={styles.cardLeft}>
                    <Text style={styles.cropIcon}>{(item.commodityHindi || '').split(' ')[0] || '🌾'}</Text>
                    <View>
                      <Text style={styles.cropName}>{(item.commodityHindi || '').split(' ')[1] || item.commodity}</Text>
                      <Text style={styles.marketName}>{item.market}</Text>
                    </View>
                  </View>
                  <View style={styles.cardRight}>
                    <Text style={styles.price}>₹{item.modalPrice}</Text>
                    <View style={[styles.trendBadge, { backgroundColor: item.trendUp ? '#DCFCE7' : '#FEE2E2' }]}>
                      <Ionicons name={item.trendUp ? "trending-up" : "trending-down"} size={10} color={item.trendUp ? '#166534' : '#991B1B'} />
                      <Text style={styles.trendText}>₹{item.trendChange}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* LINE CHART MODAL */}
      <Modal visible={historyVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{selectedCrop?.commodityHindi} ट्रेंड लाइन</Text>
                <Text style={styles.historySubtitle}>भाव का रास्ता (Price Path Analytics)</Text>
              </View>
              <TouchableOpacity onPress={() => setHistoryVisible(false)}>
                <Ionicons name="close-circle" size={40} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.mainPriceContainer}>
               <Text style={styles.mainPriceLabel}>{DATES[activeHistoryIndex]} का भाव</Text>
               <Text style={[styles.mainPriceValue, { color: selectedCrop?.trendUp ? COLORS.indiaGreen : COLORS.error }]}>₹{selectedCrop?.history ? selectedCrop.history[activeHistoryIndex] : '---'}</Text>
            </View>

            {/* LINE GRAPH AREA */}
            <View style={styles.lineGraphContainer}>
              <View style={styles.lineChart}>
                {renderLineGraph()}
              </View>
              <View style={styles.nodesContainer}>
                {selectedCrop?.history?.map((val, i) => (
                  <TouchableOpacity 
                    key={i} 
                    style={styles.nodeTouch}
                    onPressIn={() => setActiveHistoryIndex(i)}
                    activeOpacity={1}
                  >
                    <View style={[styles.node, i === activeHistoryIndex && { backgroundColor: selectedCrop.trendUp ? COLORS.indiaGreen : COLORS.error, scale: 1.5, borderWidth: 2, borderColor: '#FFF' }]} />
                    <Text style={[styles.nodeDate, i === activeHistoryIndex && { fontWeight: '900', color: '#111' }]}>{DATES[i].split(' ')[0]}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.confirmBtn} onPress={() => setHistoryVisible(false)}>
              <Text style={styles.confirmBtnText}>समझ गया (Understood)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 25, paddingTop: Platform.OS === 'ios' ? 60 : 40 },
  title: { fontSize: 24, fontWeight: '900', color: '#0F172A' },
  subtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  liveBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#22C55E', marginRight: 6 },
  liveText: { color: '#FFF', fontSize: 10, fontWeight: '900' },
  
  analyticsWrapper: { paddingTop: 10 },
  sectionHeader: { fontSize: 16, fontWeight: '800', color: '#1E293B', paddingHorizontal: 25, marginBottom: 15 },
  
  scoreCard: { marginHorizontal: 20, backgroundColor: '#FFF', borderRadius: 20, padding: 20, ...SHADOWS.medium, marginBottom: 15 },
  cardLabel: { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 5 },
  scoreText: { fontSize: 26, fontWeight: '900', color: '#0F172A', marginBottom: 2 },
  gaugeContainer: { position: 'relative', justifyContent: 'center', alignItems: 'center', width: 60, height: 60 },
  gaugeGlow: { position: 'absolute', width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.indiaGreen, opacity: 0.2, transform: [{ scale: 1.5 }] },
  gaugeBarContainer: { height: 8, backgroundColor: '#F1F5F9', borderRadius: 4, marginTop: 20, overflow: 'hidden' },
  gaugeFill: { height: '100%', borderRadius: 4 },

  miniCard: { width: 220, borderWidth: 1, borderRadius: 16, padding: 15, justifyContent: 'center' },
  
  leaderboardCard: { marginHorizontal: 20, backgroundColor: '#FFF', borderRadius: 20, padding: 20, ...SHADOWS.small, marginBottom: 15 },
  moverRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  moverIconWrap: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },

  tickerCard: { marginHorizontal: 20, backgroundColor: '#EFF6FF', borderRadius: 16, padding: 15, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: '#DBEAFE' },
  tickerText: { fontSize: 13, fontWeight: '700', color: '#1E3A8A', flex: 1 },

  listSection: { paddingHorizontal: 25, marginTop: 20 },
  listHeading: { fontSize: 16, fontWeight: '800', marginBottom: 15, color: '#1E293B' },
  rateCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, padding: 18, marginBottom: 12, alignItems: 'center', ...SHADOWS.small, borderLeftWidth: 6, borderLeftColor: COLORS.indiaGreen },
  cardLeft: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  cropIcon: { fontSize: 24, marginRight: 12 },
  cropName: { fontSize: 16, fontWeight: '800', color: '#1E293B' },
  marketName: { fontSize: 11, color: '#64748B', marginTop: 2 },
  cardRight: { alignItems: 'flex-end' },
  price: { fontSize: 18, fontWeight: '900', color: '#0F172A' },
  trendBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginTop: 4 },
  trendText: { fontSize: 10, fontWeight: '900', marginLeft: 4, color: '#166534' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.85)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 30, height: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  modalTitle: { fontSize: 22, fontWeight: '900', color: '#0F172A' },
  historySubtitle: { fontSize: 13, color: '#64748B', marginTop: 4 },
  mainPriceContainer: { alignItems: 'center', marginVertical: 30, backgroundColor: '#F8FAFC', padding: 20, borderRadius: 24 },
  mainPriceLabel: { fontSize: 13, color: '#64748B', fontWeight: '700' },
  mainPriceValue: { fontSize: 36, fontWeight: '900', marginTop: 5 },
  
  lineGraphContainer: { height: 250, paddingBottom: 50 },
  lineChart: { height: 150, width: width - 100 },
  lineSegment: { position: 'absolute', height: 4, borderRadius: 2 },
  nodesContainer: { flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', width: width - 100, top: 180 },
  nodeTouch: { alignItems: 'center', flex: 1 },
  node: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E2E8F0', marginBottom: 10 },
  nodeDate: { fontSize: 8, color: '#94A3B8' },

  confirmBtn: { backgroundColor: '#0F172A', padding: 20, borderRadius: 24, alignItems: 'center', marginTop: 20 },
  confirmBtnText: { color: '#FFF', fontWeight: '900', fontSize: 15 }
});
