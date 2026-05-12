import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const dummyCrops = [
  { id: '1', name: '🌾 गेहूं (Wheat)', qty: '50 क्विंटल', status: 'listed', price: '₹2,450/क्विंटल' },
  { id: '2', name: '🍅 टमाटर (Tomato)', qty: '200 किलो', status: 'pre-harvest', price: '₹35/किलो' },
];

const CropCard = ({ item }) => (
  <View style={styles.cropCard}>
    <View style={styles.cropInfo}>
      <Text style={styles.cropName}>{item.name}</Text>
      <Text style={styles.cropQty}>{item.qty}</Text>
    </View>
    <View style={styles.cropRight}>
      <Text style={styles.cropPrice}>{item.price}</Text>
      <View style={[styles.statusBadge, item.status === 'listed' ? styles.listedBadge : styles.preHarvestBadge]}>
        <Text style={styles.statusText}>
          {item.status === 'listed' ? '✅ सूचीबद्ध' : '🌱 प्री-हार्वेस्ट'}
        </Text>
      </View>
    </View>
  </View>
);

export default function MyCropsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌱 मेरी फसल (My Crops)</Text>

      <FlatList
        data={dummyCrops}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CropCard item={item} />}
        contentContainerStyle={{ paddingBottom: 120 }}
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
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
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
  listedBadge: { backgroundColor: COLORS.lightGreen },
  preHarvestBadge: { backgroundColor: COLORS.lightSaffron },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: '600' },
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
