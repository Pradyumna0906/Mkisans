import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
  Dimensions, ActivityIndicator, RefreshControl, Platform,
  Modal, TextInput, Alert, ScrollView, Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');
const getBaseUrl = () => {
  if (Platform.OS === 'web') return `http://${window.location.hostname}:5000`;
  return 'http://10.0.2.2:5000';
};
const BASE_URL = getBaseUrl();
const API_URL = `${BASE_URL}/api/social`;

const PostItem = ({ item, currentUserId, onLike, onComment, onFollow }) => {
  const [isLiked, setIsLiked] = useState(item.is_liked === 1);
  const [likesCount, setLikesCount] = useState(item.likes_count || 0);
  const [isFollowing, setIsFollowing] = useState(item.is_following === 1);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    onLike(item.id);
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    onFollow(item.kisan_id);
  };

  const mediaUri = `${BASE_URL}${item.media_url}`;

  return (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.authorBadge}>
          <Image 
            source={{ uri: item.author_photo ? `${BASE_URL}${item.author_photo}` : 'https://via.placeholder.com/150' }} 
            style={styles.avatar} 
          />
        </View>
        <View style={styles.headerInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.authorName}>{item.author_name}</Text>
            {item.is_verified === 1 && <Ionicons name="checkmark-circle" size={14} color={COLORS.indiaGreen} />}
            {item.kisan_id !== currentUserId && (
              <>
                <Text style={styles.dotSeparator}>•</Text>
                <TouchableOpacity onPress={handleFollow}>
                  <Text style={[styles.followBtnText, isFollowing && { color: COLORS.textMuted }]}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          <Text style={styles.postTime}>{new Date(item.created_at).toLocaleDateString()} • Farmer</Text>
        </View>
      </View>

      {/* Post Media */}
      <View style={styles.mediaContainer}>
        {item.media_type === 'video' ? (
          <Video
            source={{ uri: mediaUri }}
            style={styles.postMedia}
            resizeMode="cover"
            useNativeControls
            isLooping
          />
        ) : (
          <View style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
            <Image 
              source={{ uri: mediaUri }} 
              style={styles.postMedia} 
              resizeMode="cover"
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={(e) => {
                console.error('Image load error for:', mediaUri, e.nativeEvent.error);
                setImageError(true);
                setImageLoading(false);
              }}
            />
            {imageLoading && (
              <View style={styles.mediaOverlay}>
                <ActivityIndicator color={COLORS.indiaGreen} />
              </View>
            )}
            {imageError && (
              <View style={styles.mediaOverlay}>
                <Ionicons name="image-outline" size={48} color={COLORS.textMuted} />
                <Text style={{ color: COLORS.textMuted, marginTop: 8 }}>Failed to load image</Text>
              </View>
            )}
          </View>
        )}
      </View>

      {/* Post Actions */}
      <View style={styles.actionsRow}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionBtn}>
            <Ionicons name={isLiked ? "heart" : "heart-outline"} size={28} color={isLiked ? '#FF3040' : COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onComment(item.id)} style={styles.actionBtn}>
            <Ionicons name="chatbubble-outline" size={26} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="paper-plane-outline" size={26} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>
        <Ionicons name="bookmark-outline" size={26} color={COLORS.textPrimary} />
      </View>

      {/* Social Proof & Caption */}
      <View style={styles.postFooter}>
        <Text style={styles.likesText}>{likesCount.toLocaleString()} likes</Text>
        {item.caption && (
          <Text style={styles.captionText}>
            <Text style={styles.authorNameSmall}>{item.author_name.toLowerCase().replace(' ', '_')} </Text>
            {item.caption}
          </Text>
        )}
        <Text style={styles.viewComments}>View all {item.comments_count || 0} comments</Text>
      </View>
    </View>
  );
};

export default function SocialFeedScreen({ navigation, route }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [kisan, setKisan] = useState(route.params?.kisan || null);
  const [activeTab, setActiveTab] = useState('feed'); // 'feed' or 'discover'

  const fetchData = async () => {
    let currentKisan = kisan;
    if (!currentKisan) {
        const session = await AsyncStorage.getItem('userSession');
        if (session) {
            currentKisan = JSON.parse(session);
            setKisan(currentKisan);
        }
    }

    try {
      const res = await fetch(`${API_URL}/feed?kisanId=${currentKisan?.id || 0}`);
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching social data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchData();
  }, []);

  const handleLike = async (postId) => {
    if (!kisan) return;
    try {
      await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ kisanId: kisan.id }),
      });
    } catch (e) {}
  };

  const handleComment = (postId) => {
    // Navigate or show modal
    Alert.alert('Coming Soon', 'Comments are being optimized for farmers.');
  };

  const handleFollow = async (targetId) => {
    if (!kisan) return;
    try {
      await fetch(`${API_URL}/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: kisan.id, followingId: targetId }),
      });
    } catch (e) {}
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.indiaGreen} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Tabs */}
      <View style={styles.header}>
        <Text style={styles.logo}>MKisans</Text>
        <View style={styles.tabsContainer}>
          <TouchableOpacity onPress={() => setActiveTab('feed')} style={[styles.tab, activeTab === 'feed' && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === 'feed' && styles.activeTabText]}>Feed</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('discover')} style={[styles.tab, activeTab === 'discover' && styles.activeTab]}>
            <Text style={[styles.tabText, activeTab === 'discover' && styles.activeTabText]}>Discover</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('SocialUpload', { kisan })}>
          <Ionicons name="add-circle-outline" size={28} color={COLORS.textPrimary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <PostItem 
            item={item} 
            currentUserId={kisan?.id} 
            onLike={handleLike}
            onComment={handleComment}
            onFollow={handleFollow}
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.indiaGreen]} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="images-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyText}>No posts yet. Start the conversation!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 50, paddingBottom: 10, paddingHorizontal: 15,
    borderBottomWidth: 0.5, borderBottomColor: '#dbdbdb'
  },
  logo: { fontSize: 24, fontWeight: '900', color: COLORS.indiaGreen },
  tabsContainer: { flexDirection: 'row', gap: 20 },
  tab: { paddingVertical: 5 },
  activeTab: { borderBottomWidth: 2, borderBottomColor: COLORS.textPrimary },
  tabText: { fontSize: 16, fontWeight: '600', color: COLORS.textMuted },
  activeTabText: { color: COLORS.textPrimary },
  
  postContainer: { marginBottom: 15 },
  postHeader: { flexDirection: 'row', alignItems: 'center', padding: 12 },
  authorBadge: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: COLORS.indiaGreen, padding: 1.5 },
  avatar: { width: '100%', height: '100%', borderRadius: 17 },
  headerInfo: { flex: 1, marginLeft: 10 },
  authorName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  dotSeparator: { fontSize: 12, color: COLORS.textMuted, marginHorizontal: 2 },
  followBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.indiaGreen },
  postTime: { fontSize: 11, color: COLORS.textMuted },
  
  mediaContainer: { width: '100%', aspectRatio: 1, backgroundColor: '#000' },
  postMedia: { width: '100%', height: '100%' },
  mediaOverlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12, paddingVertical: 10 },
  leftActions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  actionBtn: { padding: 2 },
  
  postFooter: { paddingHorizontal: 12 },
  likesText: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 5 },
  captionText: { fontSize: 14, color: COLORS.textPrimary, lineHeight: 18 },
  authorNameSmall: { fontWeight: '700' },
  viewComments: { fontSize: 13, color: COLORS.textMuted, marginTop: 5 },
  
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: COLORS.textMuted, marginTop: 15 }
});
