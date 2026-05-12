import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const getBaseUrl = () => {
  if (Platform.OS === 'web') return `http://${window.location.hostname}:5000`;
  return 'http://10.0.2.2:5000';
};
const BASE_URL = getBaseUrl();

const CropCard = ({ item, onSell }) => {
  const isSold = item.status === 'sold';
  
  return (
    <View style={[styles.cropCard, isSold && { opacity: 0.7 }]}>
      <View style={styles.cropInfo}>
        <Text style={styles.cropName}>{item.name}</Text>
        <Text style={styles.cropQty}>{item.qty}</Text>
      </View>
      <View style={styles.cropRight}>
        <Text style={[styles.cropPrice, isSold && { color: '#94a3b8' }]}>{item.price}</Text>
        <View style={[styles.statusBadge, isSold ? styles.soldBadge : (item.status === 'listed' ? styles.listedBadge : styles.preHarvestBadge)]}>
          <Text style={styles.statusText}>
            {isSold ? '💰 बिकी हुई (Sold)' : (item.status === 'listed' ? '✅ सूचीबद्ध' : '🌱 प्री-हार्वेस्ट')}
          </Text>
        </View>
        {!isSold && (
          <TouchableOpacity style={styles.sellBtn} onPress={() => onSell(item)}>
            <Text style={styles.sellBtnText}>बेचें (SELL)</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function MyCropsScreen({ navigation }) {
  const [crops, setCrops] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const isFocused = useIsFocused();

  const loadCrops = async () => {
    try {
      const storedCrops = await AsyncStorage.getItem('user_crops');
      if (storedCrops) {
        setCrops(JSON.parse(storedCrops));
      } else {
        setCrops([]);
      }
    } catch (error) {
      console.error('Error loading crops:', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadCrops();
    }
  }, [isFocused]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCrops();
    setRefreshing(false);
  };

  const handleSell = async (crop) => {
    // 1. Get Price per Quintal
    const priceMatch = crop.price.match(/\d+/);
    const pricePerQ = priceMatch ? parseInt(priceMatch[0]) : 2400; // Default or parsed price

    // 2. Get Qty
    const qtyMatch = crop.qty.match(/\d+/);
    const totalQty = qtyMatch ? parseInt(qtyMatch[0]) : 1;

    const totalAmount = pricePerQ * totalQty;

    const confirmAction = () => {
      Alert.alert(
        'Confirm Sale',
        `Sell ${crop.name} (${totalQty} Qty) for ₹${totalAmount}? Funds will be added to your Kisan Wallet.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'SELL & CREDIT WALLET', onPress: () => processSale(crop, totalAmount) }
        ]
      );
    };

    if (Platform.OS === 'web') {
      if (window.confirm(`Sell ${crop.name} for ₹${totalAmount}?`)) {
        processSale(crop, totalAmount);
      }
    } else {
      confirmAction();
    }
  };

  const processSale = async (crop, amount) => {
    try {
      const session = await AsyncStorage.getItem('userSession');
      const user = JSON.parse(session);

      // 1. Credit Wallet API
      await axios.post(`${BASE_URL}/api/wallet/credit`, {
        kisanId: user.id,
        amount: amount,
        description: `${crop.name} Sale (${crop.qty})`,
        category: 'mandi_sale',
        referenceId: crop.id
      });

      // 2. Update Local Crops
      const updatedCrops = crops.map(c => 
        c.id === crop.id ? { ...c, status: 'sold', price: `Sold for ₹${amount}` } : c
      );
      setCrops(updatedCrops);
      await AsyncStorage.setItem('user_crops', JSON.stringify(updatedCrops));

      if (Platform.OS === 'web') {
        window.alert(`Success! ₹${amount} credited to your Kisan Wallet.`);
      } else {
        Alert.alert('Sale Successful', `₹${amount} has been credited to your Kisan Wallet.`);
      }
    } catch (error) {
      console.error('Sale error:', error);
      Alert.alert('Error', 'Failed to process sale. Try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🌱 मेरी फसल (My Crops)</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Wallet')}>
           <MaterialCommunityIcons name="wallet-membership" size={28} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={crops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CropCard item={item} onSell={handleSell} />}
        contentContainerStyle={{ paddingBottom: 120, paddingHorizontal: SPACING.xl }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.indiaGreen]} />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>कोई फसल नहीं जोड़ी गई</Text>
        }
      />

      <TouchableOpacity 
        style={styles.addBtn}
        onPress={() => navigation.navigate('AddCrop')}
      >
        <Ionicons name="add" size={28} color={COLORS.white} />
        <Text style={styles.addBtnText}>फसल जोड़ें</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 20 },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: '800',
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  cropCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.small,
  },
  cropInfo: { flex: 1 },
  cropName: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  cropQty: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginTop: 4 },
  cropRight: { alignItems: 'flex-end' },
  cropPrice: { fontSize: FONTS.sizes.lg, fontWeight: '800', color: COLORS.indiaGreen },
  statusBadge: { marginTop: 6, paddingHorizontal: 10, paddingVertical: 3, borderRadius: RADIUS.full },
  listedBadge: { backgroundColor: '#dcfce7' },
  preHarvestBadge: { backgroundColor: '#ffedd5' },
  soldBadge: { backgroundColor: '#f1f5f9' },
  statusText: { fontSize: 10, fontWeight: '700', color: '#475569' },
  sellBtn: { backgroundColor: COLORS.primary, marginTop: 8, paddingHorizontal: 15, paddingVertical: 6, borderRadius: 8 },
  sellBtnText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  empty: { textAlign: 'center', marginTop: 60, fontSize: FONTS.sizes.lg, color: COLORS.textMuted },
  addBtn: {
    position: 'absolute',
    bottom: 100,
    right: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.indiaGreen,
    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.full,
    ...SHADOWS.large,
  },
  addBtnText: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.white },
});
