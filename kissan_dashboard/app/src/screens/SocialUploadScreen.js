import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image,
  TextInput, ScrollView, ActivityIndicator, Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, RADIUS, SHADOWS } from '../theme';

const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}: ${message}`);
  } else {
    const { Alert } = require('react-native');
    Alert.alert(title, message);
  }
};

const getBaseUrl = () => {
  if (Platform.OS === 'web') {
    return `http://${window.location.hostname}:5000`;
  }
  return 'http://10.0.2.2:5000';
};

const BASE_URL = getBaseUrl();

export default function SocialUploadScreen({ navigation, route }) {
  const isStory = route.params?.isStory || false;
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [kisan, setKisan] = useState(route.params?.kisan || null);

  // CRITICAL FIX: Load session on mount if missing
  useEffect(() => {
    const loadSession = async () => {
        try {
            console.log('🔄 [Session] Checking AsyncStorage...');
            const session = await AsyncStorage.getItem('userSession');
            if (session) {
                const userData = JSON.parse(session);
                console.log('✅ [Session] Found user:', userData.full_name);
                setKisan(userData);
            } else {
                console.warn('⚠️ [Session] No userSession found in storage.');
            }
        } catch (e) {
            console.error('Session load error:', e);
        }
    };
    
    if (!kisan) loadSession();

    axios.get(`${BASE_URL}/api/health`)
      .then(() => setServerStatus('Online ✅'))
      .catch(() => setServerStatus('Offline ❌'));
  }, []);

  const pickMedia = async (type) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return showAlert('Denied', 'Gallery access required');

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: type === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: isStory ? [9, 16] : [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) setMedia(result.assets[0]);
    } catch (e) {
      showAlert('Error', 'Gallery failed to open');
    }
  };

  const handleUpload = async () => {
    // Check session again right before upload
    if (!kisan || !kisan.id) {
        // Last ditch effort to find session
        const session = await AsyncStorage.getItem('userSession');
        if (session) {
            const userData = JSON.parse(session);
            setKisan(userData);
            // Continue with userData.id
            if (userData.role !== 'farmer') return showAlert('Access Denied', 'Only Farmers can post crop updates.');
        } else {
            return showAlert('Login Required', 'You must be logged in as a Farmer to share updates.');
        }
    }

    if (!media) return showAlert('Wait', 'Select a photo first.');

    setLoading(true);
    try {
      const formData = new FormData();
      // Ensure we use the latest kisan data
      const currentKisan = kisan || JSON.parse(await AsyncStorage.getItem('userSession'));
      formData.append('kisanId', String(currentKisan.id));
      if (!isStory) formData.append('caption', caption);

      if (Platform.OS === 'web') {
        const res = await fetch(media.uri);
        const blob = await res.blob();
        formData.append('media', blob, `post_${Date.now()}.jpg`);
      } else {
        const uri = Platform.OS === 'android' ? media.uri : media.uri.replace('file://', '');
        formData.append('media', { uri, name: `up_${Date.now()}.jpg`, type: 'image/jpeg' });
      }

      const res = await axios.post(
        isStory ? `${BASE_URL}/api/social/stories` : `${BASE_URL}/api/social/posts`, 
        formData
      );

      if (res.data.success) {
        showAlert('Shared!', 'Your post is now live.');
        navigation.goBack();
      } else {
        showAlert('Error', res.data.error || 'Upload failed');
      }
    } catch (err) {
      showAlert('Network Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isStory ? 'New Story' : 'New Post'}</Text>
        <TouchableOpacity onPress={handleUpload} disabled={loading} style={[styles.shareBtn, loading && { opacity: 0.5 }]}>
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.shareText}>Post Update</Text>}
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statusRow}>
            <Text style={styles.statusText}>{serverStatus} | Farmer: {kisan?.full_name || 'Checking...'}</Text>
        </View>

        <View style={styles.mediaBox}>
          {media ? (
            <Image source={{ uri: media.uri }} style={styles.preview} />
          ) : (
            <TouchableOpacity style={styles.placeholder} onPress={() => pickMedia('image')}>
              <Ionicons name="camera" size={50} color={COLORS.indiaGreen} />
              <Text style={styles.placeholderText}>Tap to Select Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        {!isStory && (
          <TextInput
            style={styles.input}
            placeholder="What's happening on your farm?"
            multiline
            value={caption}
            onChangeText={setCaption}
          />
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  shareBtn: { backgroundColor: COLORS.indiaGreen, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25 },
  shareText: { color: '#fff', fontWeight: '800' },
  content: { padding: 20 },
  statusRow: { marginBottom: 20, alignItems: 'center' },
  statusText: { fontSize: 12, color: '#64748b', fontWeight: '600' },
  mediaBox: { width: '100%', aspectRatio: 1, borderRadius: 20, backgroundColor: '#f8fafc', overflow: 'hidden', marginBottom: 20, borderWidth: 1, borderColor: '#e2e8f0' },
  preview: { width: '100%', height: '100%' },
  placeholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  placeholderText: { marginTop: 10, color: '#64748b', fontWeight: '700' },
  input: { fontSize: 16, color: '#1e293b', minHeight: 100, textAlignVertical: 'top', padding: 15, backgroundColor: '#f8fafc', borderRadius: 15, borderWidth: 1, borderColor: '#e2e8f0' }
});
