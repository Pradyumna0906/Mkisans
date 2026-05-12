import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Image,
  Platform,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, RADIUS, SHADOWS } from '../theme';

const getBaseUrl = () => {
  if (Platform.OS === 'web') return `http://${window.location.hostname}:5000`;
  return 'http://10.0.2.2:5000';
};
const BASE_URL = getBaseUrl();

// ROBUST INPUT COMPONENT - DEFINED OUTSIDE
const ProfileInput = ({ label, value, onChangeText, icon, placeholder, keyboardType = 'default', editable = true }) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputWrapper, !editable && styles.disabledInput]}>
      <MaterialCommunityIcons name={icon} size={20} color={COLORS.primary} style={styles.inputIcon} />
      <TextInput 
        style={styles.input} 
        value={value} 
        onChangeText={onChangeText} 
        placeholder={placeholder}
        keyboardType={keyboardType}
        editable={editable}
        placeholderTextColor="#94a3b8"
      />
    </View>
  </View>
);

export default function EditProfileScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [userData, setUserData] = useState({
    full_name: '', village: '', district: '', phone: '', 
    aadhaar: '', kisan_id: '', land_size: '', primary_crops: '',
    bank_name: '', account_no: '', ifsc_code: '',
    profile_photo: null, latitude: null, longitude: null
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const session = await AsyncStorage.getItem('userSession');
      if (session) {
        const data = JSON.parse(session);
        setUserData({
          ...userData,
          ...data,
          profile_photo: data.profile_photo ? (data.profile_photo.startsWith('http') ? data.profile_photo : `${BASE_URL}/${data.profile_photo}`) : null
        });
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setUserData(prev => ({ ...prev, profile_photo: result.assets[0].uri }));
    }
  };

  const getLocation = async () => {
    setLocLoading(true);
    try {
      if (Platform.OS === 'web' && window.navigator.geolocation) {
        window.navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const { latitude, longitude } = pos.coords;
            setUserData(prev => ({ ...prev, latitude, longitude }));
            try {
              const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
              const data = await response.json();
              if (data && data.address) {
                const addr = data.address;
                const villageName = addr.village || addr.suburb || addr.city_district || addr.neighbourhood || addr.city || '';
                const districtName = addr.state_district || addr.county || addr.city || '';
                setUserData(prev => ({ ...prev, village: villageName, district: districtName }));
                window.alert(`Verified Location: ${villageName}`);
              }
            } catch (e) {}
            setLocLoading(false);
          },
          () => { setLocLoading(false); Alert.alert('Error', 'Enable browser location'); }
        );
        return;
      }

      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') { setLocLoading(false); return; }
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const { latitude, longitude } = location.coords;
      let [address] = await Location.reverseGeocodeAsync({ latitude, longitude });
      setUserData(prev => ({
        ...prev, latitude, longitude,
        village: address ? (address.district || address.city || prev.village) : prev.village,
        district: address ? (address.subregion || address.region || prev.district) : prev.district
      }));
    } catch (error) { Alert.alert('Error', 'GPS Failed'); }
    finally { setLocLoading(false); }
  };

  const handleSave = async () => {
    if (!userData.full_name || !userData.village || !userData.district) {
      Alert.alert('Missing Info', 'Name and Location are mandatory.');
      return;
    }

    setSaving(true);
    try {
      const session = await AsyncStorage.getItem('userSession');
      const updated = { ...JSON.parse(session || '{}'), ...userData };
      await AsyncStorage.setItem('userSession', JSON.stringify(updated));
      
      if (Platform.OS === 'web') {
        window.alert('Profile details submitted for transparency audit!');
        navigation.goBack();
      } else {
        Alert.alert('Success', 'Profile details submitted for transparency audit!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      }
    } catch (e) { Alert.alert('Error', 'Save failed'); }
    finally { setSaving(false); }
  };

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#334155" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Mandatory Verification Portal</Text>
        <MaterialCommunityIcons name="shield-check" size={24} color="#16a34a" />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.photoContainer}>
          <View style={styles.avatarWrapper}>
            <Image 
              source={userData.profile_photo ? { uri: userData.profile_photo } : require('../../assets/user.png')} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={styles.camBtn} onPress={pickImage}>
              <Ionicons name="camera" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.photoHint}>Upload photo for high-quality profile verification</Text>
        </View>

        <TouchableOpacity style={[styles.bigGpsBtn, locLoading && { opacity: 0.7 }]} onPress={getLocation} disabled={locLoading}>
          <MaterialCommunityIcons name="crosshairs-gps" size={24} color="#fff" />
          <Text style={styles.bigGpsText}>{locLoading ? "VERIFYING..." : "AUTO-FILL GPS (MANDATORY)"}</Text>
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Identity & Location</Text>
          <ProfileInput label="Full Name *" value={userData.full_name} onChangeText={t => setUserData({...userData, full_name: t})} icon="account" placeholder="Full Name" />
          <ProfileInput label="Aadhaar Number (Optional)" value={userData.aadhaar} onChangeText={t => setUserData({...userData, aadhaar: t})} icon="card-account-details" keyboardType="numeric" placeholder="12 Digit Aadhaar" />
          
          <View style={styles.row}>
             <View style={{flex: 1, marginRight: 8}}>
                <ProfileInput label="Village *" value={userData.village} onChangeText={t => setUserData({...userData, village: t})} icon="home-city" />
             </View>
             <View style={{flex: 1, marginLeft: 8}}>
                <ProfileInput label="District *" value={userData.district} onChangeText={t => setUserData({...userData, district: t})} icon="map-marker" />
             </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Farm Transparency Details</Text>
          <ProfileInput label="Kisan ID / Farmer ID" value={userData.kisan_id} onChangeText={t => setUserData({...userData, kisan_id: t})} icon="identifier" placeholder="Kisan Reg No" />
          <ProfileInput label="Total Land (Acres)" value={userData.land_size} onChangeText={t => setUserData({...userData, land_size: t})} icon="landscape" keyboardType="numeric" placeholder="e.g. 5.0" />
          <ProfileInput label="Primary Crops" value={userData.primary_crops} onChangeText={t => setUserData({...userData, primary_crops: t})} icon="sprout" placeholder="e.g. Wheat, Soybean" />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Banking Info (For Payouts)</Text>
          <ProfileInput label="Bank Name" value={userData.bank_name} onChangeText={t => setUserData({...userData, bank_name: t})} icon="bank" placeholder="e.g. SBI, HDFC" />
          <ProfileInput label="Account No" value={userData.account_no} onChangeText={t => setUserData({...userData, account_no: t})} icon="numeric" keyboardType="numeric" />
          <ProfileInput label="IFSC Code" value={userData.ifsc_code} onChangeText={t => setUserData({...userData, ifsc_code: t})} icon="shield-check" />
        </View>

        <TouchableOpacity style={styles.finalSave} onPress={handleSave} disabled={saving}>
          {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.finalSaveText}>SUBMIT FOR VERIFICATION</Text>}
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  scroll: { padding: 20, paddingBottom: 100 },
  photoContainer: { alignItems: 'center', marginBottom: 25 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: COLORS.primaryLight },
  camBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, width: 34, height: 34, borderRadius: 17, borderWidth: 3, borderColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  photoHint: { fontSize: 12, color: '#64748b', marginTop: 10, textAlign: 'center' },
  bigGpsBtn: { backgroundColor: COLORS.primary, height: 60, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 20, ...SHADOWS.medium },
  bigGpsText: { color: '#fff', fontSize: 16, fontWeight: '900' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 20, ...SHADOWS.small },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: COLORS.primary, marginBottom: 15, borderLeftWidth: 3, borderLeftColor: COLORS.primary, paddingLeft: 10 },
  inputGroup: { marginBottom: 15 },
  label: { fontSize: 13, fontWeight: '700', color: '#64748b', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f1f5f9', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, paddingHorizontal: 12 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 48, fontSize: 15, color: '#1e293b' },
  disabledInput: { opacity: 0.6 },
  row: { flexDirection: 'row' },
  finalSave: { backgroundColor: '#22c55e', height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', ...SHADOWS.medium },
  finalSaveText: { color: '#fff', fontSize: 16, fontWeight: '900' },
});
