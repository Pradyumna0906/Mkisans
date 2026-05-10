import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
  Dimensions, Animated, ScrollView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');

// --- DUMMY DATA FOR HIGH END UI ---
const STORIES = [
  { id: 1, name: 'Your Story', avatar: 'https://i.pravatar.cc/150?img=11', isAdd: true },
  { id: 2, name: 'Ramesh Farm', avatar: 'https://i.pravatar.cc/150?img=12', hasStory: true },
  { id: 3, name: 'Organic Valley', avatar: 'https://i.pravatar.cc/150?img=13', hasStory: true },
  { id: 4, name: 'Green Acres', avatar: 'https://i.pravatar.cc/150?img=14', hasStory: true },
  { id: 5, name: 'Suresh P.', avatar: 'https://i.pravatar.cc/150?img=15', hasStory: true },
  { id: 6, name: 'Mango King', avatar: 'https://i.pravatar.cc/150?img=16', hasStory: false },
];

const POSTS = [
  {
    id: 1,
    author: 'Ramesh Patel',
    avatar: 'https://i.pravatar.cc/150?img=12',
    isVerified: true,
    location: 'Sehore, MP',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?auto=format&fit=crop&w=800&q=80',
    likes: 1245,
    comments: 89,
    caption: 'My wheat crop is almost ready for harvest! The weather has been perfect this season. 🌾🚜 #farming #wheat #harvest',
    timeAgo: '2 hours ago',
    isFollowing: false,
    followers: '12.4K',
  },
  {
    id: 2,
    author: 'Organic Valley',
    avatar: 'https://i.pravatar.cc/150?img=13',
    isVerified: true,
    location: 'Nashik, MH',
    type: 'video', // Simulated with a placeholder image for demo since we don't have a reliable video URL
    mediaUrl: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80',
    likes: 8540,
    comments: 320,
    caption: 'Secret to 100% organic tomatoes! Watch till the end to see the natural compost trick. 🍅🌱 #organicfarming #tips',
    timeAgo: '5 hours ago',
    isFollowing: true,
    followers: '45.1K',
  },
  {
    id: 3,
    author: 'Green Acres',
    avatar: 'https://i.pravatar.cc/150?img=14',
    isVerified: false,
    location: 'Ludhiana, PB',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    likes: 532,
    comments: 12,
    caption: 'Sunrise over the fields today. Good morning everyone! 🌅',
    timeAgo: '1 day ago',
    isFollowing: false,
    followers: '2.1K',
  }
];

const TABS = ['Following Feed', 'Trending Farmers', 'Popular Harvests', 'Live Farm Updates'];

const PostItem = ({ item, isCustomer }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isFollowing, setIsFollowing] = useState(item.isFollowing);
  const [likesCount, setLikesCount] = useState(item.likes);
  
  // Double Tap Animation State
  const scaleValue = useRef(new Animated.Value(0)).current;
  const opacityValue = useRef(new Animated.Value(0)).current;
  let lastTap = null;

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
      if (!isLiked) {
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
      // Trigger Animation
      Animated.sequence([
        Animated.parallel([
          Animated.timing(scaleValue, { toValue: 1, duration: 200, useNativeDriver: true }),
          Animated.timing(opacityValue, { toValue: 1, duration: 200, useNativeDriver: true })
        ]),
        Animated.delay(400),
        Animated.parallel([
          Animated.timing(scaleValue, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(opacityValue, { toValue: 0, duration: 200, useNativeDriver: true })
        ])
      ]).start();
    } else {
      lastTap = now;
    }
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  return (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.authorBadge}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        </View>
        <View style={styles.headerInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.authorName}>{item.author}</Text>
            {item.isVerified && <Ionicons name="checkmark-circle" size={14} color={COLORS.indiaGreen} />}
            {!isFollowing && (
              <>
                <Text style={styles.dotSeparator}>•</Text>
                <TouchableOpacity onPress={() => setIsFollowing(true)}>
                  <Text style={styles.followBtnText}>Follow</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Post Media */}
      <TouchableOpacity activeOpacity={1} onPress={handleDoubleTap}>
        <View style={styles.mediaContainer}>
          <Image source={{ uri: item.mediaUrl }} style={styles.postMedia} />
          {item.type === 'video' && (
            <View style={styles.videoOverlay}>
              <Ionicons name="play-circle" size={50} color="rgba(255,255,255,0.8)" />
            </View>
          )}
          {/* Double Tap Heart Animation */}
          <Animated.View style={[styles.bigHeartContainer, { opacity: opacityValue, transform: [{ scale: scaleValue }] }]}>
            <Ionicons name="heart" size={100} color="#fff" />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {/* Post Actions */}
      <View style={styles.actionsRow}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={toggleLike} style={styles.actionBtn}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={28} color={isLiked ? '#FF3040' : COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={26} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="paper-plane-outline" size={26} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setIsSaved(!isSaved)} style={styles.actionBtn}>
          <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={26} color={isSaved ? COLORS.textPrimary : COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Post Footer & Caption */}
      <View style={styles.postFooter}>
        <Text style={styles.likesText}>{likesCount.toLocaleString()} likes</Text>
        <Text style={styles.captionText}>
          <Text style={styles.authorNameSmall}>{item.author.replace(' ', '')} </Text>
          {item.caption}
        </Text>
        <TouchableOpacity>
          <Text style={styles.viewComments}>View all {item.comments} comments</Text>
        </TouchableOpacity>
        <Text style={styles.timeAgoText}>{item.timeAgo}</Text>
      </View>
    </View>
  );
};

export default function SocialFeedScreen({ navigation, route }) {
  const kisan = route?.params?.kisan || {};
  const isCustomer = kisan.role === 'consumer' || kisan.role === 'customer'; // Logic to detect customer
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.logo}>MKisans Social</Text>
        <View style={styles.headerRight}>
          {!isCustomer && (
            <TouchableOpacity style={styles.headerIconBtn}>
              <Ionicons name="add-circle-outline" size={26} color={COLORS.textPrimary} />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="heart-outline" size={26} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="paper-plane-outline" size={26} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={POSTS}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <>
            {/* SUB TABS */}
            <View style={styles.subTabsContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.xl }}>
                {TABS.map((tab, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    style={[styles.subTab, activeTab === tab && styles.subTabActive]}
                    onPress={() => setActiveTab(tab)}
                  >
                    <Text style={[styles.subTabText, activeTab === tab && styles.subTabTextActive]}>{tab}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* STORIES SECTION */}
            <View style={styles.storiesSection}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: SPACING.xl }}>
                {STORIES.map(story => (
                  <View key={story.id} style={styles.storyWrapper}>
                    <TouchableOpacity style={[styles.storyRing, story.hasStory ? styles.storyRingActive : styles.storyRingInactive]}>
                      <Image source={{ uri: story.avatar }} style={styles.storyAvatar} />
                      {story.isAdd && !isCustomer && (
                        <View style={styles.storyAddBadge}>
                          <Ionicons name="add" size={12} color="#fff" />
                        </View>
                      )}
                    </TouchableOpacity>
                    <Text style={styles.storyName} numberOfLines={1}>{story.name}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
            <View style={styles.divider} />
          </>
        }
        renderItem={({ item }) => <PostItem item={item} isCustomer={isCustomer} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    paddingHorizontal: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 50 : 30, paddingBottom: 10,
    backgroundColor: COLORS.white,
  },
  logo: { fontSize: 22, fontWeight: '800', color: COLORS.indiaGreen, fontFamily: Platform.OS === 'ios' ? 'System' : 'sans-serif' },
  headerRight: { flexDirection: 'row', gap: 15 },
  headerIconBtn: { padding: 2 },
  
  subTabsContainer: { marginVertical: 5 },
  subTab: { paddingHorizontal: 16, paddingVertical: 8, marginRight: 10, borderRadius: RADIUS.full, backgroundColor: '#F3F4F6' },
  subTabActive: { backgroundColor: COLORS.indiaGreen },
  subTabText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  subTabTextActive: { color: COLORS.white },

  storiesSection: { paddingVertical: 10 },
  storyWrapper: { alignItems: 'center', marginRight: 15, width: 72 },
  storyRing: { width: 72, height: 72, borderRadius: 36, padding: 3, justifyContent: 'center', alignItems: 'center' },
  storyRingActive: { borderWidth: 2, borderColor: COLORS.saffron },
  storyRingInactive: { borderWidth: 1, borderColor: COLORS.border },
  storyAvatar: { width: '100%', height: '100%', borderRadius: 36, borderWidth: 2, borderColor: COLORS.white },
  storyAddBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.indiaGreen, width: 20, height: 20, borderRadius: 10, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.white },
  storyName: { fontSize: 11, color: COLORS.textPrimary, marginTop: 5, textAlign: 'center' },

  divider: { height: 0.5, backgroundColor: COLORS.border, width: '100%' },

  postContainer: { marginBottom: 15 },
  postHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10 },
  authorBadge: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  avatar: { width: '100%', height: '100%', borderRadius: 18 },
  headerInfo: { flex: 1 },
  authorName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  dotSeparator: { fontSize: 12, color: COLORS.textMuted, marginHorizontal: 4 },
  followBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.indiaGreen },
  locationText: { fontSize: 11, color: COLORS.textSecondary, marginTop: 1 },
  
  mediaContainer: { width: width, height: width, backgroundColor: '#FAFAFA', justifyContent: 'center', alignItems: 'center' },
  postMedia: { width: '100%', height: '100%', resizeMode: 'cover' },
  videoOverlay: { position: 'absolute', top: '50%', left: '50%', marginTop: -25, marginLeft: -25, ...SHADOWS.small },
  
  bigHeartContainer: { position: 'absolute', top: '50%', left: '50%', marginTop: -50, marginLeft: -50, zIndex: 10, ...SHADOWS.large },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 12 },
  leftActions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  actionBtn: { padding: 2 },
  
  postFooter: { paddingHorizontal: 15 },
  likesText: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 5 },
  captionText: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 18 },
  authorNameSmall: { fontWeight: '700' },
  viewComments: { fontSize: 13, color: COLORS.textMuted, marginTop: 5 },
  timeAgoText: { fontSize: 11, color: COLORS.textMuted, marginTop: 5 }
});
