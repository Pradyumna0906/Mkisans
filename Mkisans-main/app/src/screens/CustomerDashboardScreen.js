import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity, ScrollView,
  Dimensions, TextInput, Platform, Animated, FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

// DUMMY DATA
const BANNERS = [
  { id: 1, title: 'Fresh Summer Harvest', sub: 'Up to 30% Off', bg: '#4ade80' },
  { id: 2, title: 'Organic Farmers Market', sub: 'Direct from field', bg: '#facc15' },
];

const CATEGORIES = [
  { id: 1, name: 'Vegetables', icon: 'leaf' },
  { id: 2, name: 'Fruits', icon: 'nutrition' },
  { id: 3, name: 'Grains', icon: 'water' },
  { id: 4, name: 'Organic', icon: 'flower' },
  { id: 5, name: 'Dairy', icon: 'water' },
  { id: 6, name: 'Spices', icon: 'flame' },
];

const RECOMMENDED = [
  { id: 1, name: 'Organic Tomatoes', price: '₹40/kg', oldPrice: '₹55', rating: '4.8', image: '🍅', organic: true },
  { id: 2, name: 'Fresh Onions', price: '₹30/kg', oldPrice: '₹40', rating: '4.5', image: '🧅', organic: false },
  { id: 3, name: 'Farm Potatoes', price: '₹25/kg', oldPrice: '₹35', rating: '4.7', image: '🥔', organic: true },
];

const FARMERS = [
  { id: 1, name: 'Ramesh Patel', distance: '2.5 km', rating: '4.9', verified: true },
  { id: 2, name: 'Suresh Kumar', distance: '5.1 km', rating: '4.7', verified: true },
];

export default function CustomerDashboardScreen({ navigation, route }) {
  const kisan = route?.params?.kisan || {};
  const customerName = kisan.full_name || 'Customer';
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image source={require('../../assets/logo.jpg')} style={styles.logo} />
          <View>
            <Text style={styles.deliverToText}>Delivering to <Ionicons name="location" size={12} color={COLORS.indiaGreen} /></Text>
            <Text style={styles.locationText}>Bhopal, MP 462001</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="wallet-outline" size={22} color={COLORS.textPrimary} /></TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}><Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} /><View style={styles.badge}/></TouchableOpacity>
          <TouchableOpacity style={styles.profileBtn}><Ionicons name="person" size={20} color={COLORS.white} /></TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* SMART SEARCH */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color={COLORS.textMuted} style={styles.searchIcon} />
            <TextInput 
              placeholder="Search vegetables, fruits, farmers..." 
              style={styles.searchInput}
              placeholderTextColor={COLORS.textMuted}
            />
            <TouchableOpacity><Ionicons name="mic" size={20} color={COLORS.indiaGreen} /></TouchableOpacity>
          </View>
          <View style={styles.filterChips}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['Organic', 'Nearby', 'Price: Low to High', 'Delivery Today'].map((f, i) => (
                <TouchableOpacity key={i} style={styles.chip}><Text style={styles.chipText}>{f}</Text></TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* HERO BANNER SLIDER */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.bannerContainer}>
          {BANNERS.map((b) => (
            <View key={b.id} style={[styles.banner, { backgroundColor: b.bg }]}>
              <View style={styles.bannerContent}>
                <Text style={styles.bannerTitle}>{b.title}</Text>
                <Text style={styles.bannerSub}>{b.sub}</Text>
                <TouchableOpacity style={styles.bannerBtn}>
                  <Text style={styles.bannerBtnText}>Shop Now</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* WALLET & REWARDS */}
        <View style={styles.walletCard}>
          <View>
            <Text style={styles.walletLabel}>Wallet Balance</Text>
            <Text style={styles.walletAmount}>₹1,250.00</Text>
          </View>
          <View style={styles.rewardSection}>
            <Text style={styles.rewardText}>🌟 450 Points</Text>
            <TouchableOpacity style={styles.addMoneyBtn}>
              <Text style={styles.addMoneyText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* CATEGORY GRID */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map(c => (
              <TouchableOpacity key={c.id} style={styles.categoryItem}>
                <View style={styles.categoryIconWrap}>
                  <Ionicons name={c.icon} size={28} color={COLORS.indiaGreen} />
                </View>
                <Text style={styles.categoryName}>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI RECOMMENDED PRODUCTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended for You ✨</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {RECOMMENDED.map(p => (
              <View key={p.id} style={styles.productCard}>
                {p.organic && <View style={styles.organicBadge}><Text style={styles.organicText}>Organic</Text></View>}
                <View style={styles.productImagePlaceholder}><Text style={styles.productEmoji}>{p.image}</Text></View>
                <Text style={styles.productName}>{p.name}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>{p.price}</Text>
                  <Text style={styles.oldPrice}>{p.oldPrice}</Text>
                </View>
                <TouchableOpacity style={styles.addToCartBtn}>
                  <Text style={styles.addToCartText}>Add</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* FLASH DEALS */}
        <View style={[styles.section, styles.flashSection]}>
          <View style={styles.flashHeader}>
            <Text style={[styles.sectionTitle, {color: COLORS.white, marginHorizontal:0}]}>⚡ Flash Deals</Text>
            <Text style={styles.timer}>Ends in 02:15:44</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2].map(i => (
              <View key={i} style={styles.flashCard}>
                <Text style={styles.flashDiscount}>50% OFF</Text>
                <Text style={styles.flashProduct}>Fresh Cabbage</Text>
                <Text style={styles.flashPrice}>₹15/kg <Text style={styles.flashOldPrice}>₹30</Text></Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* NEARBY FARMERS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Nearby Verified Farmers</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {FARMERS.map(f => (
              <View key={f.id} style={styles.farmerCard}>
                <View style={styles.farmerHeader}>
                  <View style={styles.farmerAvatar}><Ionicons name="person" size={24} color={COLORS.white}/></View>
                  <View>
                    <Text style={styles.farmerName}>{f.name} {f.verified && '✅'}</Text>
                    <Text style={styles.farmerDistance}>📍 {f.distance}</Text>
                  </View>
                </View>
                <View style={styles.farmerActions}>
                  <TouchableOpacity style={styles.btnOutline}><Text style={styles.btnOutlineText}>View Farm</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.btnSolid}><Text style={styles.btnSolidText}>Chat</Text></TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* LIVE FRESH HARVEST */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Live Fresh Harvest 🌾</Text>
          <View style={styles.harvestCard}>
            <View style={styles.liveIndicator}><View style={styles.liveDot}/><Text style={styles.liveText}>LIVE</Text></View>
            <Text style={styles.harvestTitle}>Premium Sharbati Wheat</Text>
            <Text style={styles.harvestDetails}>Harvested 2 hours ago • Sehore Farm</Text>
            <View style={styles.freshnessBar}>
              <View style={[styles.freshnessFill, {width: '95%'}]} />
            </View>
            <Text style={styles.freshnessText}>95% Freshness Score</Text>
          </View>
        </View>

        {/* CROP PRE-BOOKING */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pre-Book Upcoming Harvest</Text>
          <View style={styles.preBookCard}>
            <Text style={styles.preBookTitle}>Kesar Mangoes (Box of 10kg)</Text>
            <Text style={styles.preBookDate}>Expected: 15th April</Text>
            <Text style={styles.preBookPrice}>₹800 <Text style={styles.strikePrice}>₹1200</Text></Text>
            <TouchableOpacity style={styles.preBookBtn}>
              <Text style={styles.preBookBtnText}>Pre-Book Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* SUBSCRIPTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Smart Subscriptions 📦</Text>
          <View style={styles.subCard}>
            <View style={styles.subLeft}>
              <Text style={styles.subTitle}>Weekly Veggie Box</Text>
              <Text style={styles.subDesc}>Assorted organic vegetables delivered every Sunday</Text>
            </View>
            <TouchableOpacity style={styles.subBtn}>
              <Text style={styles.subBtnText}>Subscribe</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI PRICE PREDICTION & MANDI */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>AI Price Trends 📈</Text>
          <View style={styles.trendCard}>
            <Text style={styles.trendTitle}>Onion Prices expected to drop by 15% next week.</Text>
            <Text style={styles.trendAdvice}>Recommendation: Buy only for 1 week.</Text>
          </View>
        </View>

        {/* ORDER TRACKING */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Orders</Text>
          <View style={styles.trackingCard}>
            <View style={styles.trackHeader}>
              <Text style={styles.trackTitle}>Order #1042</Text>
              <Text style={styles.trackEta}>Arriving in 15 mins</Text>
            </View>
            <View style={styles.trackProgress}>
              <View style={[styles.trackDot, styles.trackDone]}/>
              <View style={[styles.trackLine, styles.trackDone]}/>
              <View style={[styles.trackDot, styles.trackDone]}/>
              <View style={[styles.trackLine, styles.trackDone]}/>
              <View style={[styles.trackDot, styles.trackActive]}/>
              <View style={styles.trackLine}/>
              <View style={styles.trackDot}/>
            </View>
            <Text style={styles.trackStatus}>Out for delivery</Text>
          </View>
        </View>

        {/* COMMUNITY & VIDEOS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farm Stories & Shorts 🎬</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map(i => (
              <View key={i} style={styles.videoCard}>
                <Ionicons name="play-circle" size={40} color={COLORS.white} />
                <Text style={styles.videoText}>Organic Farm Tour</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={{height: 100}} />
      </ScrollView>

      {/* FLOATING ACTION BUTTONS */}
      <View style={styles.fabContainer}>
        <TouchableOpacity style={styles.fabCart}>
          <Ionicons name="cart" size={24} color={COLORS.white} />
          <View style={styles.fabBadge}><Text style={styles.fabBadgeText}>2</Text></View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.fabAI}>
          <Ionicons name="sparkles" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: SPACING.xl, paddingTop: 50, paddingBottom: 15,
    backgroundColor: COLORS.white, ...SHADOWS.small, zIndex: 10
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: COLORS.indiaGreen },
  deliverToText: { fontSize: 11, color: COLORS.textMuted },
  locationText: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconBtn: { padding: 4 },
  badge: { position: 'absolute', top: 2, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.error },
  profileBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.indiaGreen, justifyContent: 'center', alignItems: 'center' },
  
  scrollContent: { paddingBottom: SPACING.xxl },
  
  searchSection: { padding: SPACING.xl, backgroundColor: COLORS.white, borderBottomLeftRadius: RADIUS.xl, borderBottomRightRadius: RADIUS.xl, ...SHADOWS.small },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: RADIUS.lg, paddingHorizontal: 15, height: 48 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  filterChips: { flexDirection: 'row', marginTop: 15 },
  chip: { paddingHorizontal: 15, paddingVertical: 8, backgroundColor: '#E0F2FE', borderRadius: RADIUS.full, marginRight: 10 },
  chipText: { fontSize: 12, fontWeight: '600', color: '#0369A1' },

  bannerContainer: { marginTop: SPACING.lg, paddingLeft: SPACING.xl },
  banner: { width: width * 0.8, height: 160, borderRadius: RADIUS.xl, marginRight: SPACING.md, padding: SPACING.lg, justifyContent: 'center' },
  bannerTitle: { fontSize: 24, fontWeight: '800', color: COLORS.white, width: '70%' },
  bannerSub: { fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 5, marginBottom: 15 },
  bannerBtn: { backgroundColor: COLORS.white, paddingHorizontal: 20, paddingVertical: 8, borderRadius: RADIUS.full, alignSelf: 'flex-start' },
  bannerBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.indiaGreen },

  walletCard: { margin: SPACING.xl, padding: SPACING.lg, backgroundColor: COLORS.indiaGreen, borderRadius: RADIUS.xl, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', ...SHADOWS.medium },
  walletLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  walletAmount: { fontSize: 24, fontWeight: '800', color: COLORS.white },
  rewardSection: { alignItems: 'flex-end' },
  rewardText: { fontSize: 12, fontWeight: '700', color: '#FDE047', marginBottom: 5 },
  addMoneyBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADIUS.full },
  addMoneyText: { fontSize: 12, fontWeight: '600', color: COLORS.white },

  section: { marginTop: SPACING.xl, paddingHorizontal: SPACING.xl },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 15 },
  
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: SPACING.lg },
  categoryItem: { width: '30%', alignItems: 'center' },
  categoryIconWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ECFDF5', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  categoryName: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },

  productCard: { width: 140, backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.md, marginRight: SPACING.md, ...SHADOWS.small },
  organicBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#22C55E', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, zIndex: 1 },
  organicText: { fontSize: 9, fontWeight: '700', color: COLORS.white },
  productImagePlaceholder: { height: 80, backgroundColor: '#F3F4F6', borderRadius: RADIUS.md, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  productEmoji: { fontSize: 40 },
  productName: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 4 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  price: { fontSize: 14, fontWeight: '700', color: COLORS.indiaGreen },
  oldPrice: { fontSize: 12, color: COLORS.textMuted, textDecorationLine: 'line-through' },
  addToCartBtn: { backgroundColor: '#F3F4F6', paddingVertical: 8, borderRadius: RADIUS.md, alignItems: 'center' },
  addToCartText: { fontSize: 13, fontWeight: '700', color: COLORS.indiaGreen },

  flashSection: { backgroundColor: '#FEF2F2', paddingVertical: SPACING.xl, borderRadius: RADIUS.xl, marginHorizontal: SPACING.xl },
  flashHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, marginBottom: 15 },
  timer: { backgroundColor: '#EF4444', color: COLORS.white, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4, fontSize: 12, fontWeight: '700' },
  flashCard: { width: 180, backgroundColor: COLORS.white, padding: SPACING.lg, borderRadius: RADIUS.lg, marginLeft: SPACING.lg, ...SHADOWS.small },
  flashDiscount: { fontSize: 18, fontWeight: '800', color: '#EF4444', marginBottom: 4 },
  flashProduct: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  flashPrice: { fontSize: 14, fontWeight: '700', color: COLORS.indiaGreen, marginTop: 4 },
  flashOldPrice: { fontSize: 12, color: COLORS.textMuted, textDecorationLine: 'line-through' },

  farmerCard: { width: 260, backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, marginRight: SPACING.md, ...SHADOWS.small, borderWidth: 1, borderColor: '#F3F4F6' },
  farmerHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 15 },
  farmerAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.saffron, justifyContent: 'center', alignItems: 'center' },
  farmerName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  farmerDistance: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  farmerActions: { flexDirection: 'row', gap: 10 },
  btnOutline: { flex: 1, borderWidth: 1, borderColor: COLORS.indiaGreen, paddingVertical: 8, borderRadius: RADIUS.md, alignItems: 'center' },
  btnOutlineText: { fontSize: 13, fontWeight: '600', color: COLORS.indiaGreen },
  btnSolid: { flex: 1, backgroundColor: COLORS.indiaGreen, paddingVertical: 8, borderRadius: RADIUS.md, alignItems: 'center' },
  btnSolidText: { fontSize: 13, fontWeight: '600', color: COLORS.white },

  harvestCard: { backgroundColor: '#F0FDF4', padding: SPACING.lg, borderRadius: RADIUS.lg, borderWidth: 1, borderColor: '#BBF7D0' },
  liveIndicator: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444' },
  liveText: { fontSize: 12, fontWeight: '700', color: '#EF4444' },
  harvestTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  harvestDetails: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4, marginBottom: 12 },
  freshnessBar: { height: 6, backgroundColor: '#D1FAE5', borderRadius: 3, overflow: 'hidden' },
  freshnessFill: { height: '100%', backgroundColor: COLORS.indiaGreen },
  freshnessText: { fontSize: 11, fontWeight: '600', color: COLORS.indiaGreen, marginTop: 6, textAlign: 'right' },

  preBookCard: { backgroundColor: COLORS.white, padding: SPACING.lg, borderRadius: RADIUS.lg, ...SHADOWS.medium },
  preBookTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  preBookDate: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  preBookPrice: { fontSize: 18, fontWeight: '800', color: COLORS.indiaGreen, marginVertical: 10 },
  strikePrice: { fontSize: 14, color: COLORS.textMuted, textDecorationLine: 'line-through', fontWeight: '400' },
  preBookBtn: { backgroundColor: COLORS.saffron, paddingVertical: 12, borderRadius: RADIUS.md, alignItems: 'center' },
  preBookBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.white },

  subCard: { flexDirection: 'row', backgroundColor: '#EEF2FF', padding: SPACING.lg, borderRadius: RADIUS.lg, alignItems: 'center' },
  subLeft: { flex: 1, marginRight: 15 },
  subTitle: { fontSize: 15, fontWeight: '700', color: '#3730A3' },
  subDesc: { fontSize: 12, color: '#4F46E5', marginTop: 4 },
  subBtn: { backgroundColor: '#4338CA', paddingHorizontal: 15, paddingVertical: 8, borderRadius: RADIUS.full },
  subBtnText: { fontSize: 12, fontWeight: '700', color: COLORS.white },

  trendCard: { backgroundColor: COLORS.white, padding: SPACING.lg, borderRadius: RADIUS.lg, borderLeftWidth: 4, borderLeftColor: '#3B82F6', ...SHADOWS.small },
  trendTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  trendAdvice: { fontSize: 13, fontWeight: '700', color: '#3B82F6', marginTop: 8 },

  trackingCard: { backgroundColor: COLORS.white, padding: SPACING.lg, borderRadius: RADIUS.lg, ...SHADOWS.small },
  trackHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  trackTitle: { fontSize: 15, fontWeight: '700', color: COLORS.textPrimary },
  trackEta: { fontSize: 13, fontWeight: '600', color: COLORS.indiaGreen },
  trackProgress: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  trackDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#E5E7EB' },
  trackActive: { backgroundColor: COLORS.saffron, borderWidth: 3, borderColor: '#FEF08A' },
  trackDone: { backgroundColor: COLORS.indiaGreen },
  trackLine: { flex: 1, height: 2, backgroundColor: '#E5E7EB' },
  trackStatus: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginTop: 15, textAlign: 'center' },

  videoCard: { width: 120, height: 180, backgroundColor: '#475569', borderRadius: RADIUS.lg, marginRight: SPACING.md, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  videoText: { position: 'absolute', bottom: 10, left: 10, right: 10, color: COLORS.white, fontSize: 12, fontWeight: '600', textShadowColor: 'rgba(0,0,0,0.5)', textShadowOffset: {width: 0, height: 1}, textShadowRadius: 3 },

  fabContainer: { position: 'absolute', bottom: 90, right: 20, gap: 15 },
  fabAI: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#8B5CF6', justifyContent: 'center', alignItems: 'center', ...SHADOWS.large },
  fabCart: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.saffron, justifyContent: 'center', alignItems: 'center', ...SHADOWS.large },
  fabBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: COLORS.error, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.white },
  fabBadgeText: { color: COLORS.white, fontSize: 10, fontWeight: '800' }
});
