import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  RefreshControl
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const PreHarvestCard = ({ item }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cropIconContainer}>
        <MaterialCommunityIcons name="seed-outline" size={24} color={COLORS.primary} />
      </View>
      <View style={styles.headerText}>
        <Text style={styles.cropName}>{item.name}</Text>
        <Text style={styles.villageText}>{item.village || 'Bhopal, MP'}</Text>
      </View>
      <View style={styles.statusBadge}>
        <Text style={styles.statusText}>🌱 Live</Text>
      </View>
    </View>

    <View style={styles.cardStats}>
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Expected Yield</Text>
        <Text style={styles.statValue}>{item.qty}</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={styles.statLabel}>Harvest Date</Text>
        <Text style={styles.statValue}>{item.details?.harvestDate || 'Oct 2024'}</Text>
      </View>
    </View>

    {/* Booking Progress */}
    <View style={styles.progressContainer}>
       <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Booking Progress</Text>
          <Text style={styles.progressPercent}>30% Booked</Text>
       </View>
       <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: '30%' }]} />
       </View>
    </View>

    <View style={styles.cardFooter}>
      <View style={styles.priceContainer}>
        <Text style={styles.priceLabel}>Pre-Booking Price</Text>
        <Text style={styles.priceValue}>₹2,100<Text style={styles.priceUnit}>/qtl</Text></Text>
      </View>
      <TouchableOpacity style={styles.viewDetailsBtn}>
        <Text style={styles.viewDetailsText}>View Analytics</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export default function PreHarvestScreen({ navigation }) {
  const [preHarvestCrops, setPreHarvestCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [marketInsight, setMarketInsight] = useState({ title: 'Market Intelligence', desc: 'Analyzing latest mandi trends for your crops...' });
  const isFocused = useIsFocused();

  const loadPreHarvestData = async () => {
    try {
      const storedCrops = await AsyncStorage.getItem('user_crops');
      if (storedCrops) {
        const crops = JSON.parse(storedCrops);
        const filtered = crops.filter(c => c.status === 'pre-harvest');
        setPreHarvestCrops(filtered);
        
        // Fetch real market insight for the first crop if available
        if (filtered.length > 0) {
           fetchMarketInsight(filtered[0].name);
        }
      }
    } catch (error) {
      console.error('Error loading pre-harvest data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketInsight = async (cropName) => {
    try {
      const BASE_ML = Platform.OS === 'web' ? 'http://localhost:8000' : 'http://10.0.2.2:8000';
      const response = await fetch(`${BASE_ML}/predict-demand`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commodity: cropName, market: 'Bhopal', modal_price: 2400 })
      });
      const json = await response.json();
      if (json.status === 'Success (ML Model)' || json.status.includes('Heuristic')) {
        setMarketInsight({
          title: `${cropName} Market Update`,
          desc: `Price trend is ${json.trend_direction} by ${Math.abs(json.trend_percent)}%. Predicted future price: ₹${json.predicted_future_price}/qtl.`
        });
      }
    } catch (err) {
      console.log('Insight fetch failed, using general trend');
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadPreHarvestData();
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPreHarvestData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pre-Harvesting Portal</Text>
        <TouchableOpacity style={styles.infoBtn}>
          <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
        }
      >
        
        {/* Market Insights Banner */}
        <View style={styles.insightBanner}>
          <View style={styles.insightInfo}>
            <Text style={styles.insightTitle}>{marketInsight.title}</Text>
            <Text style={styles.insightDesc}>{marketInsight.desc}</Text>
            <TouchableOpacity style={styles.insightBtn}>
              <Text style={styles.insightBtnText}>View Analytics</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.insightIcon}>
             <MaterialCommunityIcons name="trending-up" size={50} color={COLORS.white} opacity={0.3} />
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.categoryRow}>
            <TouchableOpacity style={[styles.categoryCard, { backgroundColor: '#F0FDF4' }]} onPress={() => navigation.navigate('AddCrop')}>
              <MaterialCommunityIcons name="plus-circle-outline" size={24} color="#15803D" />
              <Text style={styles.categoryLabel}>List Crop</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryCard, { backgroundColor: '#EFF6FF' }]}>
              <MaterialCommunityIcons name="file-document-outline" size={24} color="#1D4ED8" />
              <Text style={styles.categoryLabel}>Contracts</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.categoryCard, { backgroundColor: '#FFF7ED' }]}>
              <MaterialCommunityIcons name="handshake-outline" size={24} color="#C2410C" />
              <Text style={styles.categoryLabel}>Offers</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* My Pre-Harvest Listings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Pre-Harvest Listings</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MyCrops')}>
              <Text style={styles.viewAll}>View All ›</Text>
            </TouchableOpacity>
          </View>

          {preHarvestCrops.length > 0 ? (
            preHarvestCrops.map((item) => (
              <PreHarvestCard key={item.id} item={item} />
            ))
          ) : (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconContainer}>
                 <MaterialCommunityIcons name="seed" size={40} color={COLORS.primary} opacity={0.5} />
              </View>
              <Text style={styles.emptyText}>No pre-harvest crops listed yet.</Text>
              <TouchableOpacity 
                style={styles.addBtn}
                onPress={() => navigation.navigate('AddCrop')}
              >
                <Text style={styles.addBtnText}>List Your First Crop</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Incoming Requests Section */}
        <View style={styles.section}>
           <Text style={styles.sectionTitle}>Incoming Requests</Text>
           <View style={styles.emptyRequests}>
              <MaterialCommunityIcons name="magnify" size={30} color={COLORS.textMuted} />
              <Text style={styles.emptyRequestsText}>Searching for interested buyers...</Text>
              <Text style={styles.emptyRequestsSub}>Requests from verified buyers like Reliance Retail or BigBasket will appear here once they express interest in your crop.</Text>
           </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  infoBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  insightBanner: {
    margin: SPACING.xl,
    backgroundColor: COLORS.indiaGreen,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  insightInfo: {
    flex: 1,
  },
  insightTitle: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 4,
  },
  insightDesc: {
    color: COLORS.white,
    fontSize: 12,
    opacity: 0.9,
    marginBottom: 12,
    lineHeight: 18,
  },
  insightBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    alignSelf: 'flex-start',
  },
  insightBtnText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },
  insightIcon: {
    marginLeft: 10,
  },
  section: {
    paddingHorizontal: SPACING.xl,
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  viewAll: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  categoryCard: {
    width: (width - 64) / 3,
    paddingVertical: 15,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    gap: 8,
    ...SHADOWS.small,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: 15,
    ...SHADOWS.small,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cropIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  villageText: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  cardStats: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: RADIUS.lg,
    padding: 12,
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 10,
  },
  statLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  progressContainer: {
    marginBottom: 15,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: '700',
  },
  progressBarBg: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
  },
  priceValue: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.indiaGreen,
  },
  priceUnit: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  viewDetailsBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  viewDetailsText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
  },
  requestCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.small,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  buyerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  buyerLogo: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#004AAD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 18,
  },
  buyerName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  buyerRating: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  requestTime: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  requestBody: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
    marginBottom: 15,
  },
  requestActions: {
    flexDirection: 'row',
    gap: 10,
  },
  rejectBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },
  rejectText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: COLORS.indiaGreen,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  acceptText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.white,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    ...SHADOWS.small,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 15,
    color: COLORS.textMuted,
    marginBottom: 20,
    fontWeight: '500',
  },
  addBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: RADIUS.full,
    ...SHADOWS.small,
  },
  addBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  emptyRequests: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  emptyRequestsText: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginTop: 10,
  },
  emptyRequestsSub: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  }
});
