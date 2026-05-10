import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, ActivityIndicator,
  Dimensions, TouchableOpacity, Platform, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');
const BASE_URL = Platform.OS === 'web' ? 'http://localhost:5000' : 'http://10.0.2.2:5000';

export default function MandiIntelligenceScreen({ navigation, route }) {
  const { commodity, market, state, currentPrice } = route.params;
  const [loading, setLoading] = useState(true);
  const [intelligence, setIntelligence] = useState(null);
  const [history, setHistory] = useState([]);
  const [nearby, setNearby] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [intelRes, histRes, nearRes] = await Promise.all([
        fetch(`${BASE_URL}/api/mandi-prices/intelligence?commodity=${commodity}&market=${market}`),
        fetch(`${BASE_URL}/api/mandi-prices/historical?commodity=${commodity}&market=${market}&days=7`),
        fetch(`${BASE_URL}/api/mandi-prices/nearby?commodity=${commodity}&state=${state}`)
      ]);

      const intelJson = await intelRes.json();
      const histJson = await histRes.json();
      const nearJson = await nearRes.json();

      if (intelJson.success) setIntelligence(intelJson.data);
      if (histJson.success) setHistory(histJson.data);
      if (nearJson.success) setNearby(nearJson.data);

    } catch (err) {
      console.error('Failed to fetch intelligence data:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderChart = () => {
    if (history.length < 2) return (
      <View style={styles.chartEmpty}>
        <Text style={styles.emptyText}>Insufficient data for graph</Text>
      </View>
    );

    const labels = history.map(h => {
      const date = new Date(h.price_date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });
    const data = history.map(h => h.modal_price);

    return (
      <LineChart
        data={{
          labels,
          datasets: [{ data }]
        }}
        width={width - 40}
        height={180}
        chartConfig={{
          backgroundColor: COLORS.white,
          backgroundGradientFrom: COLORS.white,
          backgroundGradientTo: COLORS.white,
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(19, 136, 8, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
          style: { borderRadius: 16 },
          propsForDots: { r: "4", strokeWidth: "2", stroke: COLORS.indiaGreen }
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.indiaGreen} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 15 }}>
          <Text style={styles.headerTitle}>{commodity}</Text>
          <Text style={styles.headerSub}>{market}, {state}</Text>
        </View>
        <TouchableOpacity onPress={() => Alert.alert('Price Alert', `Alert set for ${commodity}!`)}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.indiaGreen} />
        </TouchableOpacity>
      </View>

      {/* Main Intelligence Card */}
      <View style={styles.intelCard}>
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>Current Price</Text>
            <Text style={styles.bigPrice}>₹{currentPrice}<Text style={{ fontSize: 16 }}>/q</Text></Text>
          </View>
          <View style={styles.trendBadge}>
            <Ionicons 
              name={intelligence?.trend === 'UP' ? "trending-up" : "trending-down"} 
              size={20} 
              color={intelligence?.trend === 'UP' ? COLORS.success : COLORS.error} 
            />
            <Text style={[styles.trendText, { color: intelligence?.trend === 'UP' ? COLORS.success : COLORS.error }]}>
              {intelligence?.trend}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Suggested Selling Price</Text>
            <Text style={styles.suggestedPrice}>₹{intelligence?.suggestedSellingPrice}</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <Text style={styles.label}>AI Recommendation</Text>
            <Text style={[styles.recommendation, { color: intelligence?.trend === 'UP' ? COLORS.indiaGreen : COLORS.ochre }]}>
              {intelligence?.trend === 'UP' ? '🚀 HOLD' : '💰 SELL'}
            </Text>
          </View>
        </View>

        <View style={styles.aiBox}>
          <Ionicons name="sparkles" size={18} color={COLORS.ochre} />
          <Text style={styles.aiText}>{intelligence?.recommendation}</Text>
        </View>
      </View>

      {/* Chart Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Price History (7 Days)</Text>
        {renderChart()}
      </View>

      {/* Comparison Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📍 Nearby Mandi Comparison</Text>
        <View style={styles.comparisonList}>
          {nearby.map((item, idx) => (
            <View key={idx} style={styles.compareRow}>
              <Text style={styles.marketName}>{item.market}</Text>
              <View style={styles.comparePriceRow}>
                <Text style={styles.comparePrice}>₹{item.modal_price}</Text>
                {item.modal_price > currentPrice ? (
                  <Text style={{ color: COLORS.success, fontSize: 12 }}> (+{item.modal_price - currentPrice})</Text>
                ) : (
                  <Text style={{ color: COLORS.error, fontSize: 12 }}> ({item.modal_price - currentPrice})</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsGrid}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>State Avg</Text>
          <Text style={styles.statVal}>₹{intelligence?.marketStats.stateAvg}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>State Max</Text>
          <Text style={styles.statVal}>₹{intelligence?.marketStats.stateMax}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Confidence</Text>
          <Text style={styles.statVal}>{Math.round((intelligence?.prediction?.confidence || 0.85) * 100)}%</Text>
        </View>
      </View>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: COLORS.white,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  headerSub: { fontSize: 14, color: COLORS.textSecondary },
  intelCard: {
    margin: 20,
    padding: 20,
    backgroundColor: COLORS.white,
    borderRadius: 24,
    ...SHADOWS.large,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 12, color: COLORS.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 },
  bigPrice: { fontSize: 32, fontWeight: '900', color: COLORS.textPrimary, marginTop: 4 },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  trendText: { fontWeight: '700', fontSize: 14 },
  divider: { height: 1, backgroundColor: COLORS.borderLight, marginVertical: 15 },
  suggestedPrice: { fontSize: 24, fontWeight: '800', color: COLORS.indiaGreen, marginTop: 4 },
  recommendation: { fontSize: 18, fontWeight: '800', marginTop: 4 },
  aiBox: {
    flexDirection: 'row',
    backgroundColor: 'rgba(218,165,32,0.1)',
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
    gap: 10,
    alignItems: 'center',
  },
  aiText: { flex: 1, fontSize: 12, color: '#856404', lineHeight: 18 },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 15 },
  chartEmpty: { height: 150, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 16 },
  emptyText: { color: COLORS.textMuted },
  comparisonList: { backgroundColor: COLORS.white, borderRadius: 16, overflow: 'hidden' },
  compareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  marketName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  comparePriceRow: { flexDirection: 'row', alignItems: 'center' },
  comparePrice: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  statsGrid: { flexDirection: 'row', paddingHorizontal: 20, gap: 10 },
  statBox: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  statLabel: { fontSize: 10, color: COLORS.textMuted, marginBottom: 5 },
  statVal: { fontSize: 14, fontWeight: '800', color: COLORS.textPrimary },
});
