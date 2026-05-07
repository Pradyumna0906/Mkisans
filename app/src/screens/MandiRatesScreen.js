import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const API_URL = 'http://localhost:5000/api/mandi-prices?state=Madhya%20Pradesh&market=Bhopal&limit=50';
const EXCLUDED_CROPS = ['cotton', 'apple', 'pomegranate', 'mango', 'banana', 'papaya', 'grapes', 'orange', 'milk', 'ghee', 'butter', 'paneer', 'mawa'];

export default function MandiRatesScreen() {
  const [mandiRates, setMandiRates] = useState([]);
  const [loadingRates, setLoadingRates] = useState(true);

  useEffect(() => {
    fetchMandiRates();
  }, []);

  const fetchMandiRates = async () => {
    try {
      const [pricesRes, predictionsRes] = await Promise.all([
        fetch(API_URL),
        fetch('http://localhost:5000/api/mandi-prices/predictions').catch(() => ({ json: () => ({ data: [] }) }))
      ]);
      
      const json = await pricesRes.json();
      const predJson = await predictionsRes.json();
      const mlPredictions = predJson.success ? predJson.data : [];

      if (json.success && json.data) {
        // 1. Strict Filter: Remove non-agriculture items
        let validCrops = json.data.filter(item => {
          const itemName = (item.commodity || '').toLowerCase();
          return !EXCLUDED_CROPS.some(excluded => itemName.includes(excluded));
        });

        // 2. Merge ML Predictions or fallback to Statistical Momentum
        validCrops = validCrops.map(item => {
          let isUp = true;
          let changeAmt = 0;

          // Check if the automated ML Trainer has a prediction for this crop
          const mlModel = mlPredictions.find(p => p.commodity === item.commodity);

          if (mlModel) {
            // Using actual trained ML model output
            isUp = mlModel.predicted_trend === 'UP';
            changeAmt = Math.abs(mlModel.predicted_price - item.modalPrice);
          } else if (item.maxPrice > item.minPrice) {
            // Statistical Fallback (Learning Phase)
            const midpoint = (item.maxPrice + item.minPrice) / 2;
            isUp = item.modalPrice >= midpoint;
            changeAmt = Math.round(Math.abs(item.modalPrice - midpoint));
          } else {
            // Flat fallback
            const simulatedVolatility = (item.modalPrice * 0.015);
            isUp = (item.id || 0) % 2 === 0;
            changeAmt = Math.round(simulatedVolatility);
          }

          if (changeAmt === 0) changeAmt = Math.round(item.modalPrice * 0.01);

          return {
            ...item,
            trendUp: isUp,
            trendChange: changeAmt,
            isMLPredicted: !!mlModel // Flag for UI to show AI icon
          };
        });

        // 3. Sort by highest price
        validCrops.sort((a, b) => b.modalPrice - a.modalPrice);

        setMandiRates(validCrops);
      }
    } catch (err) {
      console.log('Failed to fetch real mandi rates:', err.message);
    } finally {
      setLoadingRates(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>📊 मंडी भाव (Mandi Rates)</Text>
      <Text style={styles.subtitle}>आज के ताज़ा भाव • लाइव अपडेट</Text>

      {/* Price Graph Placeholder */}
      <View style={styles.graphCard}>
        <Text style={styles.graphLabel}>📈 बाज़ार का रुझान (Market Trend)</Text>
        <View style={styles.graphPlaceholder}>
          <View style={styles.graphBars}>
            {[65, 70, 68, 75, 72, 78, 82].map((h, i) => (
              <View key={i} style={[styles.bar, { height: h, backgroundColor: i === 6 ? COLORS.indiaGreen : COLORS.indiaGreen + '40' }]} />
            ))}
          </View>
          <View style={styles.graphDays}>
            {['सोम', 'मंगल', 'बुध', 'गुरु', 'शुक्र', 'शनि', 'आज'].map((d, i) => (
              <Text key={i} style={[styles.dayLabel, i === 6 && { color: COLORS.indiaGreen, fontWeight: '700' }]}>{d}</Text>
            ))}
          </View>
        </View>
      </View>

      {/* Price List */}
      <View style={styles.listCard}>
        {loadingRates ? (
          <ActivityIndicator color={COLORS.indiaGreen} size="large" style={{ padding: 40 }} />
        ) : mandiRates.length > 0 ? (
          mandiRates.map((item, i) => (
            <View key={item.id || i} style={[styles.row, i < mandiRates.length - 1 && styles.rowBorder]}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={styles.cropName}>{item.commodityHindi || item.commodity}</Text>
                  {item.isMLPredicted && <Text style={{ fontSize: 10 }}>🤖</Text>}
                </View>
                <Text style={{ fontSize: 11, color: COLORS.textMuted }}>{item.market}</Text>
              </View>
              <View style={styles.priceCol}>
                <Text style={styles.price}>₹{item.modalPrice}/क्विंटल</Text>
                <Text style={[styles.change, { color: item.trendUp ? COLORS.success : COLORS.error }]}>
                  {item.trendUp ? '▲' : '▼'} ₹{item.trendChange}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={{ textAlign: 'center', color: COLORS.textMuted, padding: 20 }}>कोई डेटा उपलब्ध नहीं</Text>
        )}
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: '800',
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.xl,
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  graphCard: {
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    ...SHADOWS.medium,
  },
  graphLabel: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.lg,
  },
  graphPlaceholder: {
    height: 120,
  },
  graphBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 90,
    paddingHorizontal: SPACING.sm,
  },
  bar: {
    width: 28,
    borderRadius: 6,
  },
  graphDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.sm,
  },
  dayLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    width: 28,
    textAlign: 'center',
  },
  listCard: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    ...SHADOWS.medium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  cropName: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
  priceCol: { alignItems: 'flex-end' },
  price: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.textPrimary },
  change: { fontSize: FONTS.sizes.sm, fontWeight: '600', marginTop: 2 },
});
