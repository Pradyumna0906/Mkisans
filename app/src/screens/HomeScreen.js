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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');
const API_URL = 'http://localhost:5000/api/mandi-prices?state=Madhya%20Pradesh&market=Bhopal&limit=50';

const QuickAction = ({ icon, label, color, onPress }) => (
  <TouchableOpacity style={styles.quickAction} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
      <Ionicons name={icon} size={36} color={color} />
    </View>
    <Text style={styles.quickActionLabel}>{label}</Text>
  </TouchableOpacity>
);

export default function HomeScreen({ navigation }) {
  const [mandiRates, setMandiRates] = useState([]);
  const [loadingRates, setLoadingRates] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchMandiRates();
  }, []);

  const fetchMandiRates = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      if (json.success && json.data) {
        setMandiRates(json.data);
      }
    } catch (err) {
      console.log('Failed to fetch real mandi rates:', err.message);
    } finally {
      setLoadingRates(false);
    }
  };

  const HINGLISH_MAP = {
    'gehu': 'wheat',
    'gehun': 'wheat',
    'pyaz': 'onion',
    'piyaj': 'onion',
    'pyaaz': 'onion',
    'alu': 'potato',
    'aaloo': 'potato',
    'tamatar': 'tomato',
    'makka': 'maize',
    'bhindi': 'ladies finger',
    'mirch': 'chilli',
    'chana': 'gram',
    'sarso': 'mustard',
    'lahsun': 'garlic',
    'soyabean': 'soyabean'
  };

  const EXCLUDED_CROPS = ['cotton', 'apple', 'pomegranate', 'mango', 'banana', 'papaya', 'grapes', 'orange', 'milk', 'ghee', 'butter', 'paneer', 'mawa'];

  const filteredRates = mandiRates.filter(item => {
    const itemName = (item.commodity || '').toLowerCase();
    
    // Explicitly exclude non-agricultural crops (fruits, dairy, cotton)
    if (EXCLUDED_CROPS.some(excluded => itemName.includes(excluded))) {
      return false;
    }

    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase().trim();
    const mappedQuery = HINGLISH_MAP[query] || query;
    
    return (
      (item.commodityHindi && item.commodityHindi.toLowerCase().includes(query)) ||
      (item.commodity && item.commodity.toLowerCase().includes(query)) ||
      (item.commodity && item.commodity.toLowerCase().includes(mappedQuery)) ||
      (item.market && item.market.toLowerCase().includes(query))
    );
  });

  // Sort by modalPrice descending to prioritize crops giving the highest price
  const sortedFilteredRates = [...filteredRates].sort((a, b) => b.modalPrice - a.modalPrice);

  // If no search, show top 5. If searching, show all matches.
  const displayRates = searchQuery ? sortedFilteredRates : sortedFilteredRates.slice(0, 5);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require('../../assets/logo.jpg')}
            style={styles.headerLogo}
          />
          <View>
            <Text style={styles.greeting}>नमस्ते! 🙏</Text>
            <Text style={styles.farmerName}>किसान भाई</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationBtn}>
          <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      {/* Earnings Card */}
      <TouchableOpacity style={styles.earningsCard} activeOpacity={0.85}>
        <View style={styles.earningsTop}>
          <Text style={styles.earningsLabel}>कुल कमाई (Total Earnings)</Text>
          <Ionicons name="chevron-forward" size={20} color={COLORS.textOnPrimary} />
        </View>
        <Text style={styles.earningsAmount}>₹ 0.00</Text>
        <View style={styles.earningsStats}>
          <View style={styles.earningsStat}>
            <Ionicons name="checkmark-circle" size={16} color="#A7F3D0" />
            <Text style={styles.earningsStatText}>0 पूरे</Text>
          </View>
          <View style={styles.earningsStat}>
            <Ionicons name="time" size={16} color="#FDE68A" />
            <Text style={styles.earningsStatText}>0 पेंडिंग</Text>
          </View>
          <View style={styles.earningsStat}>
            <Ionicons name="cash" size={16} color="#A7F3D0" />
            <Text style={styles.earningsStatText}>₹0 एडवांस</Text>
          </View>
        </View>
      </TouchableOpacity>

      {/* 4-Icon Quick Actions — The Core */}
      <Text style={styles.sectionTitle}>क्या करना है? (What to do?)</Text>
      <View style={styles.quickActionsGrid}>
        <QuickAction
          icon="leaf"
          label="मेरी फसल"
          color={COLORS.indiaGreen}
          onPress={() => navigation.navigate('MyCrops')}
        />
        <QuickAction
          icon="cube"
          label="मेरे ऑर्डर"
          color={COLORS.saffron}
          onPress={() => navigation.navigate('Orders')}
        />
        <QuickAction
          icon="bar-chart"
          label="मंडी भाव"
          color={COLORS.info}
          onPress={() => navigation.navigate('MandiRates')}
        />
        <QuickAction
          icon="mic"
          label="मदद (Help)"
          color={COLORS.terracotta}
          onPress={() => {}}
        />
      </View>

      {/* Live Mandi Ticker */}
      <View style={styles.mandiCard}>
        <View style={styles.mandiHeader}>
          <View style={styles.liveDot} />
          <Text style={styles.mandiTitle}>लाइव मंडी भाव (मध्य प्रदेश)</Text>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="अपनी फसल या मंडी खोजें... (उदा. गेहूं)"
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
        
        {loadingRates ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <ActivityIndicator color={COLORS.indiaGreen} />
            <Text style={{ marginTop: 8, color: COLORS.textMuted }}>भाव लोड हो रहे हैं...</Text>
          </View>
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
            <Ionicons name="search-outline" size={32} color={COLORS.textMuted} />
            <Text style={{ marginTop: 8, color: COLORS.textSecondary }}>कोई भाव नहीं मिला।</Text>
          </View>
        )}
      </View>

      {/* Market Demand Preview */}
      <View style={styles.demandCard}>
        <Text style={styles.sectionTitle}>📢 ज्यादा माँग (High Demand)</Text>
        <View style={styles.demandChips}>
          <View style={[styles.chip, { backgroundColor: COLORS.lightGreen }]}>
            <Text style={styles.chipText}>🧅 प्याज</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: COLORS.lightSaffron }]}>
            <Text style={styles.chipText}>🥔 आलू</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: COLORS.lightGreen }]}>
            <Text style={styles.chipText}>🍅 टमाटर</Text>
          </View>
          <View style={[styles.chip, { backgroundColor: COLORS.lightSaffron }]}>
            <Text style={styles.chipText}>🌶️ मिर्च</Text>
          </View>
        </View>
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: 50,
    paddingBottom: SPACING.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerLogo: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.indiaGreen,
  },
  greeting: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  farmerName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  notificationBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  notifBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  earningsCard: {
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.indiaGreen,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    ...SHADOWS.large,
  },
  earningsTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earningsLabel: {
    fontSize: FONTS.sizes.md,
    color: 'rgba(255,255,255,0.8)',
  },
  earningsAmount: {
    fontSize: FONTS.sizes.hero,
    fontWeight: '800',
    color: COLORS.textOnPrimary,
    marginTop: SPACING.sm,
  },
  earningsStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  earningsStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  earningsStatText: {
    fontSize: FONTS.sizes.sm,
    color: 'rgba(255,255,255,0.9)',
  },
  sectionTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
    marginBottom: SPACING.lg,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    gap: SPACING.md,
  },
  quickAction: {
    width: (width - SPACING.xl * 2 - SPACING.md) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  quickActionIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  quickActionLabel: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  mandiCard: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    ...SHADOWS.medium,
  },
  mandiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
  },
  mandiTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  mandiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  cropName: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  cropPrice: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.indiaGreen,
  },
  demandCard: {
    marginHorizontal: SPACING.xl,
  },
  demandChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  chip: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
  },
  chipText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
});
