import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';
import { GOV_SCHEMES_NEWS } from '../data/govSchemes';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 64;
const AUTO_SCROLL_INTERVAL = 4000;
const API_URL = 'http://localhost:5000/api/news';

const NewsTicker = () => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [newsData, setNewsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef(null);
  const timerRef = useRef(null);

  // Fetch news from backend API
  useEffect(() => {
    fetchNews();
    // Refresh every 10 minutes
    const refreshInterval = setInterval(fetchNews, 10 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchNews = async () => {
    try {
      const response = await fetch(API_URL);
      const json = await response.json();
      if (json.success && json.data.length > 0) {
        setNewsData(json.data);
      } else {
        // Fallback to static data
        setNewsData(GOV_SCHEMES_NEWS);
      }
    } catch (err) {
      console.log('Backend not available, using static data');
      setNewsData(GOV_SCHEMES_NEWS);
    } finally {
      setLoading(false);
    }
  };

  // Get active data (API or fallback)
  const activeData = newsData || GOV_SCHEMES_NEWS;

  // Auto-scroll
  useEffect(() => {
    if (activeData.length === 0) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        const nextIndex = (prev + 1) % activeData.length;
        flatListRef.current?.scrollToIndex({
          index: nextIndex,
          animated: true,
        });
        return nextIndex;
      });
    }, AUTO_SCROLL_INTERVAL);

    return () => clearInterval(timerRef.current);
  }, [activeData]);

  const openLink = (url) => {
    if (url) Linking.openURL(url).catch(() => {});
  };

  const renderCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => openLink(item.link)}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.categoryBadge, { backgroundColor: (item.color || '#138808') + '18' }]}>
          <Text style={[styles.categoryText, { color: item.color || '#138808' }]}>
            {item.icon} {item.category}
          </Text>
        </View>
        <Text style={styles.sourceText}>{item.source}</Text>
      </View>

      <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.cardDesc} numberOfLines={3}>{item.description}</Text>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>📅 {item.date || item.date_text || 'ताज़ा'}</Text>
        <Text style={[styles.readMore, { color: item.color || '#138808' }]}>विवरण देखें →</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={COLORS.indiaGreen} />
        <Text style={styles.loadingText}>योजनाएँ लोड हो रही हैं...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.liveDot} />
        <Text style={styles.headerTitle}>सरकारी योजनाएँ और समाचार</Text>
        {newsData && (
          <View style={styles.liveBadge}>
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      <Animated.FlatList
        ref={flatListRef}
        data={activeData}
        renderItem={renderCard}
        keyExtractor={(item, index) => item.id?.toString() || String(index)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 16}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 24 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        getItemLayout={(_, index) => ({
          length: CARD_WIDTH + 16,
          offset: (CARD_WIDTH + 16) * index,
          index,
        })}
        onScrollToIndexFailed={() => {}}
      />

      <View style={styles.dots}>
        {activeData.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              currentIndex === i && styles.dotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.xxl,
  },
  loadingText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textMuted,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: 32,
    marginBottom: SPACING.md,
  },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  headerTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textPrimary,
    flex: 1,
  },
  liveBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  card: {
    width: CARD_WIDTH,
    marginRight: 16,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.borderLight,
    ...SHADOWS.medium,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
  },
  categoryText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: '700',
  },
  sourceText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  cardTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '800',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    lineHeight: 24,
  },
  cardDesc: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  dateText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
  },
  readMore: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: SPACING.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 20,
    backgroundColor: COLORS.indiaGreen,
    borderRadius: 3,
  },
});

export default NewsTicker;
