import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const dummyOrders = [
  { id: '1', crop: '🌾 गेहूं', buyer: 'राम कुमार', qty: '10 क्विंटल', amount: '₹24,500', status: 'pending' },
  { id: '2', crop: '🍅 टमाटर', buyer: 'होटल शिवम', qty: '50 किलो', amount: '₹1,750', status: 'confirmed' },
];

const statusConfig = {
  pending: { icon: 'time', color: COLORS.saffron, label: '⏳ पेंडिंग' },
  confirmed: { icon: 'checkmark-circle', color: COLORS.indiaGreen, label: '✅ कन्फर्म' },
  dispatched: { icon: 'car', color: COLORS.info, label: '🚚 भेज दिया' },
};

export default function OrdersScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 मेरे ऑर्डर (My Orders)</Text>

      <FlatList
        data={dummyOrders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 120 }}
        renderItem={({ item }) => {
          const config = statusConfig[item.status] || statusConfig.pending;
          return (
            <View style={styles.orderCard}>
              <View style={styles.orderTop}>
                <Text style={styles.orderCrop}>{item.crop}</Text>
                <View style={[styles.badge, { backgroundColor: config.color + '20' }]}>
                  <Text style={[styles.badgeText, { color: config.color }]}>{config.label}</Text>
                </View>
              </View>
              <View style={styles.orderDetails}>
                <Text style={styles.detailText}>👤 {item.buyer}</Text>
                <Text style={styles.detailText}>📦 {item.qty}</Text>
              </View>
              <View style={styles.orderBottom}>
                <Text style={styles.orderAmount}>{item.amount}</Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <Text style={styles.empty}>कोई ऑर्डर नहीं है</Text>
        }
      />
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
  orderCard: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.small,
  },
  orderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderCrop: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.textPrimary },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  badgeText: { fontSize: FONTS.sizes.sm, fontWeight: '700' },
  orderDetails: {
    flexDirection: 'row',
    gap: SPACING.xl,
    marginTop: SPACING.md,
  },
  detailText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  orderBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  orderAmount: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.indiaGreen },
  empty: { textAlign: 'center', marginTop: 60, fontSize: FONTS.sizes.lg, color: COLORS.textMuted },
});
