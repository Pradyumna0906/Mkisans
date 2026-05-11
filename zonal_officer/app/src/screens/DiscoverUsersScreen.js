import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, Image, TouchableOpacity,
  ActivityIndicator, Platform, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const BASE_URL = Platform.OS === 'web' ? 'http://localhost:5000' : 'http://10.0.2.2:5000';

export default function DiscoverUsersScreen({ navigation, route }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [kisan, setKisan] = useState(route.params?.kisan || null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/social/discover?kisanId=${kisan?.id || 0}&role=${kisan?.role || 'farmer'}`);
      const json = await res.json();
      if (json.success) {
        setUsers(json.data);
      }
    } catch (error) {
      console.error('Error fetching discovery users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (targetId, isCurrentlyFollowing) => {
    if (!kisan) {
      Alert.alert('Login Required', 'Please login to follow users.');
      return;
    }

    // Optimistic Update
    setUsers(prev => prev.map(u => u.id === targetId ? { ...u, isFollowing: !isCurrentlyFollowing } : u));

    try {
      const res = await fetch(`${BASE_URL}/api/social/follow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ followerId: kisan.id, followingId: targetId }),
      });
      const data = await res.json();
      if (!data.success) {
        // Revert on failure
        setUsers(prev => prev.map(u => u.id === targetId ? { ...u, isFollowing: isCurrentlyFollowing } : u));
        Alert.alert('Action Denied', data.error);
      }
    } catch (error) {
      console.error('Follow error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.indiaGreen} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Discover People</Text>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userRow}>
            <Image 
              source={{ uri: item.profile_photo ? `${BASE_URL}/${item.profile_photo}` : 'https://via.placeholder.com/150' }} 
              style={styles.avatar} 
            />
            <View style={styles.userInfo}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={styles.userName}>{item.full_name}</Text>
                {item.is_verified === 1 && <Ionicons name="checkmark-circle" size={14} color={COLORS.indiaGreen} />}
              </View>
              <Text style={styles.userRole}>{item.role === 'farmer' ? '🌾 Farmer' : '🛍️ Consumer'}</Text>
            </View>
            <TouchableOpacity 
              style={[styles.followBtn, item.isFollowing && styles.followingBtn]}
              onPress={() => handleFollow(item.id, item.isFollowing)}
            >
              <Text style={[styles.followBtnText, item.isFollowing && styles.followingBtnText]}>
                {item.isFollowing ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No new people found to follow.</Text>
          </View>
        }
        contentContainerStyle={{ padding: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    gap: 15,
  },
  headerTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: COLORS.white,
  },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.borderLight },
  userInfo: { flex: 1, marginLeft: 15 },
  userName: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  userRole: { fontSize: 13, color: COLORS.textMuted, marginTop: 2 },
  followBtn: {
    backgroundColor: COLORS.indiaGreen,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
  },
  followingBtn: {
    backgroundColor: COLORS.borderLight,
  },
  followBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  followingBtnText: { color: COLORS.textPrimary },
  empty: { marginTop: 100, alignItems: 'center' },
  emptyText: { color: COLORS.textMuted, fontSize: 16 },
});
