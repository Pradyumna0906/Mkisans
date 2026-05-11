import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, 
  ScrollView, FlatList, Dimensions, ActivityIndicator, Platform,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const getBaseUrl = () => {
  if (Platform.OS === 'web') return `http://${window.location.hostname}:5000`;
  return 'http://10.0.2.2:5000';
};
const BASE_URL = getBaseUrl();

export default function ProfileScreen({ navigation, route }) {
  const [kisan, setKisan] = useState(route.params?.kisan || null);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({ posts_count: 0, followers_count: 0, following_count: 0 });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const fetchProfileData = async () => {
    let currentKisan = kisan;
    if (!currentKisan) {
      const session = await AsyncStorage.getItem('userSession');
      if (session) {
        currentKisan = JSON.parse(session);
        setKisan(currentKisan);
      }
    }

    if (!currentKisan) {
      setLoading(false);
      return;
    }

    try {
      const [postsRes, statsRes] = await Promise.all([
        fetch(`${BASE_URL}/api/social/posts/user/${currentKisan.id}`),
        fetch(`${BASE_URL}/api/social/profile/${currentKisan.id}`)
      ]);
      
      const postsData = await postsRes.json();
      const statsData = await statsRes.json();

      if (postsData.success) setPosts(postsData.posts);
      if (statsData.success) setStats(statsData.stats);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProfileData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userSession');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const renderGridItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.gridItem}
      onPress={() => navigation.navigate('Social', { screen: 'SocialFeed', params: { initialPostId: item.id } })}
    >
      <Image 
        source={{ uri: `${BASE_URL}${item.media_url}` }} 
        style={styles.gridImage} 
      />
      {item.media_type === 'video' && (
        <View style={styles.videoBadge}>
          <Ionicons name="play" size={14} color="#fff" />
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.indiaGreen} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerNav}>
        <Text style={styles.username}>{kisan?.full_name?.toLowerCase().replace(' ', '_') || 'kisan_bhaya'}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => navigation.navigate('SocialUpload', { kisan })}>
            <Ionicons name="add-circle-outline" size={28} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 15 }} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={26} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.indiaGreen]} />
        }
        ListHeaderComponent={
          <View style={styles.profileInfo}>
            <View style={styles.topRow}>
              <View style={styles.avatarContainer}>
                <Image 
                  source={{ uri: kisan?.profile_photo ? `${BASE_URL}${kisan.profile_photo}` : 'https://via.placeholder.com/150' }} 
                  style={styles.avatar} 
                />
                <TouchableOpacity style={styles.editAvatarBtn}>
                  <Ionicons name="add" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statNum}>{stats.posts_count}</Text>
                  <Text style={styles.statLabel}>Posts</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNum}>{stats.followers_count}</Text>
                  <Text style={styles.statLabel}>Followers</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNum}>{stats.following_count}</Text>
                  <Text style={styles.statLabel}>Following</Text>
                </View>
              </View>
            </View>

            <View style={styles.bioContainer}>
              <Text style={styles.realName}>{kisan?.full_name}</Text>
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>🌾 Progressive Farmer</Text>
              </View>
              <Text style={styles.bio}>
                {kisan?.village ? `📍 Based in ${kisan.village}, ${kisan.district}` : 'Proudly serving the community with fresh produce.'}
              </Text>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.editBtn}>
                <Text style={styles.editBtnText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.shareProfileBtn}>
                <Text style={styles.editBtnText}>Share Profile</Text>
              </TouchableOpacity>
            </View>

            {/* View Mode Toggle */}
            <View style={styles.viewToggle}>
              <TouchableOpacity 
                style={[styles.toggleBtn, viewMode === 'grid' && styles.activeToggle]} 
                onPress={() => setViewMode('grid')}
              >
                <Ionicons name="grid-outline" size={24} color={viewMode === 'grid' ? COLORS.indiaGreen : COLORS.textMuted} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleBtn, viewMode === 'list' && styles.activeToggle]} 
                onPress={() => setViewMode('list')}
              >
                <Ionicons name="list-outline" size={26} color={viewMode === 'list' ? COLORS.indiaGreen : COLORS.textMuted} />
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={renderGridItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="camera-outline" size={64} color={COLORS.border} />
            <Text style={styles.emptyTitle}>No Posts Yet</Text>
            <Text style={styles.emptySub}>Share your first crop update with the community!</Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerNav: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 50, paddingBottom: 10, paddingHorizontal: 20,
    backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#dbdbdb'
  },
  username: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  headerActions: { flexDirection: 'row', alignItems: 'center' },
  
  profileInfo: { padding: 20 },
  topRow: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: { position: 'relative' },
  avatar: { width: 86, height: 86, borderRadius: 43, borderWidth: 1, borderColor: '#dbdbdb' },
  editAvatarBtn: { 
    position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.info, 
    width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: '#fff',
    justifyContent: 'center', alignItems: 'center'
  },
  statsContainer: { flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginLeft: 20 },
  statBox: { alignItems: 'center' },
  statNum: { fontSize: 18, fontWeight: '800', color: COLORS.textPrimary },
  statLabel: { fontSize: 13, color: COLORS.textPrimary },
  
  bioContainer: { marginTop: 15 },
  realName: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  tagBadge: { 
    backgroundColor: '#F0FDF4', alignSelf: 'flex-start', 
    paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginTop: 4 
  },
  tagText: { color: COLORS.indiaGreen, fontSize: 11, fontWeight: '700' },
  bio: { fontSize: 14, color: COLORS.textPrimary, marginTop: 4, lineHeight: 18 },
  
  actionButtons: { flexDirection: 'row', gap: 8, marginTop: 20 },
  editBtn: { 
    flex: 1, backgroundColor: '#efefef', paddingVertical: 8, 
    borderRadius: 8, alignItems: 'center' 
  },
  shareProfileBtn: { 
    flex: 1, backgroundColor: '#efefef', paddingVertical: 8, 
    borderRadius: 8, alignItems: 'center' 
  },
  editBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  
  viewToggle: { 
    flexDirection: 'row', marginTop: 25, 
    borderTopWidth: 0.5, borderTopColor: '#dbdbdb' 
  },
  toggleBtn: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  activeToggle: { borderTopWidth: 1.5, borderTopColor: COLORS.textPrimary },
  
  gridItem: { width: width / 3, height: width / 3, padding: 1 },
  gridImage: { width: '100%', height: '100%', backgroundColor: '#f8fafc' },
  videoBadge: { position: 'absolute', top: 5, right: 5 },
  
  emptyContainer: { alignItems: 'center', marginTop: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary, marginTop: 15 },
  emptySub: { fontSize: 14, color: COLORS.textMuted, textAlign: 'center', marginTop: 8 },
});
