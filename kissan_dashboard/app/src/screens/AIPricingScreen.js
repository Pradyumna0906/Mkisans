import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

export default function AIPricingScreen() {
  const [commodity, setCommodity] = useState('Wheat');
  const [market, setMarket] = useState('Bhopal');
  const [farmerPrice, setFarmerPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));

  const checkPrice = async () => {
    if (!farmerPrice) return;
    
    setLoading(true);
    setResult(null);
    fadeAnim.setValue(0);

    try {
      const ML_BASE = Platform.OS === 'web' ? 'http://localhost:8000' : 'http://10.0.2.2:8000';
      const fPrice = parseFloat(farmerPrice);
      
      // 1. Get Fair Price Recommendation (sends farmer_price, NOT derived Min/Max)
      const recRes = await fetch(`${ML_BASE}/recommend-price`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commodity: commodity.trim(),
          market: market.trim(),
          farmer_price: fPrice,
        })
      });
      const recJson = await recRes.json();

      // 2. Get Future Price Forecast
      const forecastRes = await fetch(`${ML_BASE}/predict-demand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commodity: commodity.trim(),
          market: market.trim(),
          modal_price: fPrice,
        })
      });
      const forecastJson = await forecastRes.json();

      const recommended = recJson.recommended_price;
      const minMarket = recJson.min_market_price || recommended * 0.9;
      const maxMarket = recJson.max_market_price || recommended * 1.1;
      const msp = recJson.msp;
      const dataSource = recJson.data_source || 'AI Model';
      const dataDate = recJson.data_date || '';
      const forecast = forecastJson.predicted_future_price;
      const trendDir = forecastJson.trend_direction || (forecast > recommended ? 'up' : 'down');
      const trendPct = forecastJson.trend_percent || 0;
      
      // Determine price fairness based on actual market comparison
      const diffPercent = ((fPrice - recommended) / recommended * 100);
      
      let status = 'FAIR';
      let statusColor = COLORS.indiaGreen || '#16A34A';
      let statusIcon = 'checkmark-circle';
      let message = 'Your price aligns with current market trends.';

      if (fPrice > recommended * 1.15) {
        status = 'HIGH';
        statusColor = COLORS.error || '#DC2626';
        statusIcon = 'arrow-up-circle';
        message = `Your asking price is ${diffPercent.toFixed(1)}% above the market average of ₹${recommended.toFixed(0)}/qtl. You may struggle to find buyers at this rate.`;
      } else if (fPrice < recommended * 0.85) {
        status = 'LOW';
        statusColor = '#F59E0B';
        statusIcon = 'arrow-down-circle';
        message = `You are pricing ${Math.abs(diffPercent).toFixed(1)}% below market average! The mandi rate is around ₹${recommended.toFixed(0)}/qtl. Consider raising your price.`;
      } else if (diffPercent > 5) {
        status = 'FAIR';
        statusColor = COLORS.indiaGreen || '#16A34A';
        statusIcon = 'checkmark-circle';
        message = `Your price is slightly above market average (₹${recommended.toFixed(0)}/qtl) — competitive and reasonable.`;
      } else if (diffPercent < -5) {
        status = 'FAIR';
        statusColor = '#F59E0B';
        statusIcon = 'alert-circle';
        message = `Your price is slightly below market average (₹${recommended.toFixed(0)}/qtl). You could ask a bit more.`;
      } else {
        message = `Your price matches the market rate of ₹${recommended.toFixed(0)}/qtl perfectly. Good to sell!`;
      }

      setResult({
        recommended,
        minMarket,
        maxMarket,
        msp,
        forecast,
        status,
        statusColor,
        statusIcon,
        message,
        diff: diffPercent.toFixed(1),
        dataSource,
        dataDate,
        trendDir,
        trendPct,
      });

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();

    } catch (err) {
      console.error('API Error:', err);
      // Show a meaningful offline fallback
      setResult({
        recommended: 0,
        forecast: 0,
        status: 'OFFLINE',
        statusColor: '#64748B',
        statusIcon: 'cloud-offline',
        message: 'Cannot connect to the AI Service. Please ensure the ML server is running on port 8000.',
        diff: '0',
        dataSource: 'Offline',
      });
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>🤖 AI Price Checker</Text>
          <Text style={styles.subtitle}>Verify your selling price with MKisans Intelligence</Text>
        </View>

        {/* Input Card */}
        <View style={styles.inputCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Crop Name</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome5 name="leaf" size={16} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                value={commodity}
                onChangeText={setCommodity}
                placeholder="e.g. Wheat, Soyabean"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mandi / Market</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location" size={18} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                value={market}
                onChangeText={setMarket}
                placeholder="e.g. Bhopal, Indore"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Your Asking Price (₹/qtl)</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome5 name="money-bill-wave" size={16} color={COLORS.primary} style={styles.inputIcon} />
              <TextInput 
                style={styles.input}
                value={farmerPrice}
                onChangeText={setFarmerPrice}
                placeholder="e.g. 2500"
                keyboardType="numeric"
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.checkBtn, !farmerPrice && styles.disabledBtn]} 
            onPress={checkPrice}
            disabled={loading || !farmerPrice}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <>
                <Text style={styles.checkBtnText}>Analyze My Price</Text>
                <Ionicons name="sparkles" size={18} color={COLORS.white} style={{marginLeft: 8}} />
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Result Area */}
        {result && (
          <Animated.View style={[styles.resultCard, { opacity: fadeAnim, transform: [{ translateY: fadeAnim.interpolate({inputRange: [0, 1], outputRange: [20, 0]}) }] }]}>
            <View style={[styles.statusHeader, { backgroundColor: result.statusColor + '15' }]}>
               <Ionicons name={result.statusIcon} size={32} color={result.statusColor} />
               <View style={{ marginLeft: 15, flex: 1 }}>
                  <Text style={[styles.statusTitle, { color: result.statusColor }]}>PRICE IS {result.status}</Text>
                  <Text style={styles.statusDiff}>{result.diff > 0 ? '+' : ''}{result.diff}% vs Market Avg</Text>
               </View>
            </View>

            <Text style={styles.message}>{result.message}</Text>

            {/* Data Source Badge */}
            {result.dataSource && result.dataSource !== 'Offline' && (
              <View style={styles.sourceBadge}>
                <Ionicons name="cloud-done" size={14} color="#0284C7" />
                <Text style={styles.sourceText}>
                  Data: {result.dataSource}{result.dataDate ? ` (${result.dataDate})` : ''}
                </Text>
              </View>
            )}

            {result.recommended > 0 && (
              <>
                <View style={styles.statsRow}>
                   <View style={styles.statBox}>
                      <Text style={styles.statLabel}>AI Recommended</Text>
                      <Text style={styles.statValue}>₹{result.recommended.toFixed(0)}</Text>
                      <Text style={styles.statUnit}>per quintal</Text>
                   </View>
                   <View style={styles.divider} />
                   <View style={styles.statBox}>
                      <Text style={styles.statLabel}>Next Week Forecast</Text>
                      <Text style={[styles.statValue, { color: result.forecast > result.recommended ? (COLORS.indiaGreen || '#16A34A') : (COLORS.error || '#DC2626') }]}>
                        ₹{result.forecast > 0 ? result.forecast.toFixed(0) : '—'}
                      </Text>
                      <Text style={styles.statUnit}>
                        {result.trendDir === 'up' ? '📈 Trending Up' : '📉 Trending Down'}
                      </Text>
                   </View>
                </View>

                {/* Market Price Range */}
                {result.minMarket && result.maxMarket && (
                  <View style={styles.rangeCard}>
                    <Text style={styles.rangeTitle}>Market Price Range</Text>
                    <View style={styles.rangeRow}>
                      <View style={styles.rangeItem}>
                        <Text style={styles.rangeLabel}>Min</Text>
                        <Text style={styles.rangeValue}>₹{result.minMarket.toFixed(0)}</Text>
                      </View>
                      <View style={[styles.rangeItem, styles.rangeItemCenter]}>
                        <Text style={styles.rangeLabel}>Avg</Text>
                        <Text style={[styles.rangeValue, {color: COLORS.primary}]}>₹{result.recommended.toFixed(0)}</Text>
                      </View>
                      <View style={styles.rangeItem}>
                        <Text style={styles.rangeLabel}>Max</Text>
                        <Text style={styles.rangeValue}>₹{result.maxMarket.toFixed(0)}</Text>
                      </View>
                    </View>
                    {/* MSP Badge */}
                    {result.msp > 0 && (
                      <View style={styles.mspBadge}>
                        <MaterialCommunityIcons name="shield-check" size={16} color="#065F46" />
                        <Text style={styles.mspText}>MSP (Govt): ₹{result.msp.toFixed(0)}/qtl</Text>
                      </View>
                    )}
                  </View>
                )}

                <View style={styles.aiTip}>
                   <MaterialCommunityIcons name="lightbulb-on" size={20} color="#856404" />
                   <Text style={styles.tipText}>
                     {result.trendDir === 'up'
                       ? `Tip: Prices for ${commodity} in ${market} are expected to rise by ~${Math.abs(result.trendPct || 2)}%. Consider holding if possible.`
                       : `Tip: Market arrivals in ${market} are expected to increase, which may push prices down. Consider selling soon.`}
                   </Text>
                </View>
              </>
            )}
          </Animated.View>
        )}

        {/* Info Section */}
        {!result && !loading && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Why check your price?</Text>
            <View style={styles.infoItem}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>Compare with real-time AGMARKNET Mandi data.</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="trending-up" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>Get AI-powered next-week price forecasts.</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="flash" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>Know MSP & market range before you sell.</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="analytics" size={20} color={COLORS.primary} />
              <Text style={styles.infoText}>Trained on 2.3M+ Madhya Pradesh crop records.</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 100 },
  header: { marginBottom: 25 },
  title: { fontSize: 28, fontWeight: '900', color: COLORS.textPrimary },
  subtitle: { fontSize: 14, color: COLORS.textMuted, marginTop: 4 },

  inputCard: { backgroundColor: COLORS.white, borderRadius: 24, padding: 20, ...SHADOWS.medium },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 12, fontWeight: '800', color: COLORS.textSecondary, marginBottom: 8, textTransform: 'uppercase' },
  inputWrapper: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F1F5F9', 
    borderRadius: 15, 
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0'
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 50, fontSize: 16, fontWeight: '600', color: COLORS.textPrimary },
  
  checkBtn: { 
    backgroundColor: COLORS.primary, 
    height: 60, 
    borderRadius: 18, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 10,
    ...SHADOWS.small 
  },
  disabledBtn: { backgroundColor: '#CBD5E1' },
  checkBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '800' },

  resultCard: { backgroundColor: COLORS.white, borderRadius: 24, padding: 20, marginTop: 20, ...SHADOWS.large },
  statusHeader: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 20, marginBottom: 15 },
  statusTitle: { fontSize: 18, fontWeight: '900' },
  statusDiff: { fontSize: 12, color: COLORS.textSecondary, fontWeight: '600' },
  message: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22, marginBottom: 15 },

  sourceBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#E0F2FE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginBottom: 15, alignSelf: 'flex-start' },
  sourceText: { fontSize: 11, color: '#0284C7', fontWeight: '600' },
  
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#F1F5F9' },
  statBox: { flex: 1, alignItems: 'center' },
  statLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '700', marginBottom: 5 },
  statValue: { fontSize: 24, fontWeight: '900', color: COLORS.textPrimary },
  statUnit: { fontSize: 10, color: COLORS.textMuted, marginTop: 2 },
  divider: { width: 1, height: 40, backgroundColor: '#F1F5F9' },

  rangeCard: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 15, marginTop: 15 },
  rangeTitle: { fontSize: 11, fontWeight: '800', color: COLORS.textMuted, textTransform: 'uppercase', marginBottom: 10, textAlign: 'center' },
  rangeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rangeItem: { flex: 1, alignItems: 'center' },
  rangeItemCenter: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#E2E8F0' },
  rangeLabel: { fontSize: 10, color: COLORS.textMuted, fontWeight: '600' },
  rangeValue: { fontSize: 16, fontWeight: '800', color: COLORS.textPrimary, marginTop: 2 },
  
  mspBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#D1FAE5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, marginTop: 12, alignSelf: 'center' },
  mspText: { fontSize: 12, color: '#065F46', fontWeight: '700' },

  aiTip: { backgroundColor: '#FFFBEB', padding: 15, borderRadius: 18, marginTop: 20, flexDirection: 'row', gap: 10, alignItems: 'center' },
  tipText: { flex: 1, fontSize: 12, color: '#92400E', fontWeight: '500', lineHeight: 18 },

  infoCard: { marginTop: 30, padding: 20, backgroundColor: '#EFF6FF', borderRadius: 24 },
  infoTitle: { fontSize: 16, fontWeight: '800', color: '#1E40AF', marginBottom: 15 },
  infoItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  infoText: { fontSize: 13, color: '#374151', fontWeight: '500' }
});
