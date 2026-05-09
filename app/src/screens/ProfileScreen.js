import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image source={require('../../assets/logo.jpg')} style={styles.avatar} />
        <Text style={styles.name}>किसान भाई</Text>
        <Text style={styles.location}>📍 मध्य प्रदेश, भारत</Text>
        <View style={styles.verifiedBadge}>
          <Ionicons name="shield-checkmark" size={14} color={COLORS.indiaGreen} />
          <Text style={styles.verifiedText}>सत्यापित किसान (Verified)</Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>फसलें</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>ऑर्डर</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>⭐ 0</Text>
          <Text style={styles.statLabel}>रेटिंग</Text>
        </View>
      </View>

      {/* Menu Items */}
      {[
        { icon: 'person-outline', label: '👤 प्रोफ़ाइल संपादित करें', sub: 'Edit Profile' },
        { icon: 'document-text-outline', label: '🧾 KYC सत्यापन', sub: 'KYC Verification' },
        { icon: 'location-outline', label: '📍 खेत की जानकारी', sub: 'Farm Details' },
        { icon: 'book-outline', label: '📖 ऐप कैसे चलाएं', sub: 'How to Use' },
        { icon: 'call-outline', label: '📞 ज़ोनल ऑफिसर से बात', sub: 'Contact Zonal Officer' },
        { icon: 'settings-outline', label: '⚙️ सेटिंग्स', sub: 'Settings' },
      ].map((item, i) => (
        <TouchableOpacity key={i} style={styles.menuItem} activeOpacity={0.7}>
          <View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Text style={styles.menuSub}>{item.sub}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
        </TouchableOpacity>
      ))}

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
  header: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: COLORS.indiaGreen,
    marginBottom: SPACING.lg,
  },
  name: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  location: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: SPACING.sm,
    backgroundColor: COLORS.lightGreen,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  verifiedText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.indiaGreen,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxl,
    ...SHADOWS.medium,
  },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.indiaGreen },
  statLabel: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 4 },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    ...SHADOWS.small,
  },
  menuLabel: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: COLORS.textPrimary },
  menuSub: { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 2 },
});
