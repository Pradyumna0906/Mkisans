import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const filters = [
  { id: 'demand', label: 'मांग (Demand)', icon: 'trending-up' },
  { id: 'highest_price', label: 'अधिकतम भाव (Highest Price)', icon: 'arrow-up-circle' },
  { id: 'lowest_price', label: 'न्यूनतम भाव (Lowest Price)', icon: 'arrow-down-circle' },
  { id: 'pulses', label: 'दालें (Pulses)', icon: 'nutrition' },
  { id: 'cereals', label: 'अनाज (Cereals)', icon: 'leaf' },
  { id: 'vegetables', label: 'सब्जियां (Vegetables)', icon: 'restaurant' },
  { id: 'trends', label: 'रुझान (Trends)', icon: 'analytics' },
  { id: 'nearest', label: 'नजदीकी मंडी (Nearest)', icon: 'location' },
];

const FilterBar = ({ onFilterChange }) => {
  const [activeFilter, setActiveFilter] = useState(null);

  const handleFilterPress = (filterId) => {
    const newFilter = activeFilter === filterId ? null : filterId;
    setActiveFilter(newFilter);
    if (onFilterChange) onFilterChange(newFilter);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter.id}
            style={[
              styles.filterChip,
              activeFilter === filter.id && styles.activeFilterChip,
            ]}
            onPress={() => handleFilterPress(filter.id)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={filter.icon}
              size={18}
              color={activeFilter === filter.id ? COLORS.white : COLORS.textSecondary}
              style={styles.filterIcon}
            />
            <Text
              style={[
                styles.filterLabel,
                activeFilter === filter.id && styles.activeFilterLabel,
              ]}
            >
              {filter.label}
            </Text>
            {activeFilter === filter.id && (
              <Ionicons name="close-circle" size={14} color={COLORS.white} style={{ marginLeft: 4 }} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.md,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    flexDirection: 'row',
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: SPACING.sm,
    ...SHADOWS.small,
  },
  activeFilterChip: {
    backgroundColor: COLORS.indiaGreen,
    borderColor: COLORS.indiaGreen,
  },
  filterIcon: {
    marginRight: 6,
  },
  filterLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeFilterLabel: {
    color: COLORS.white,
  },
});

export default FilterBar;
