import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, Dimensions,
  Alert, ActivityIndicator, Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');
const API = Platform.OS === 'web'
  ? 'http://localhost:5000/api/auth'
  : 'http://10.0.2.2:5000/api/auth';

const STATES_LIST = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
  'Telangana','Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
];

// ── Stable InputField component (defined outside to prevent remount on re-render) ──
const InputField = ({ icon, label, value, onChangeText, placeholder, keyboardType, maxLength, secure, showToggle, toggleShow, editable = true }) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={[styles.inputWrapper, !editable && styles.inputDisabled]}>
      <Ionicons name={icon} size={20} color={COLORS.textMuted} style={{ marginRight: 10 }} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType || 'default'}
        maxLength={maxLength}
        secureTextEntry={secure}
        editable={editable}
      />
      {toggleShow !== undefined && (
        <TouchableOpacity onPress={toggleShow}>
          <Ionicons name={showToggle ? 'eye-off' : 'eye'} size={20} color={COLORS.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

export default function RegisterScreen({ route, navigation }) {
  const role = route?.params?.role || 'farmer';
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // ── Step 1 Fields (Mandatory) ──
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ── Step 2 Fields (Optional) ──
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [address, setAddress] = useState('');
  const [geoLat, setGeoLat] = useState('');
  const [geoLng, setGeoLng] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const handleGetLocation = async () => {
    try {
      setGeoLoading(true);
      setGeoError('');

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGeoError('Location permission denied');
        Alert.alert('Permission Denied', 'Please allow location access to auto-detect your farm coordinates.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      setGeoLat(latitude.toFixed(6));
      setGeoLng(longitude.toFixed(6));

      // Try to reverse geocode to auto-fill address fields
      try {
        const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
        if (place) {
          if (place.region && !state) setState(place.region);
          if (place.city && !district) setDistrict(place.city);
          if (place.subregion && !village) setVillage(place.subregion);
          if (place.postalCode && !pinCode) setPinCode(place.postalCode);
          if (!address) {
            const parts = [place.street, place.streetNumber, place.district, place.city].filter(Boolean);
            if (parts.length) setAddress(parts.join(', '));
          }
        }
      } catch (geoErr) {
        // Reverse geocoding failed — lat/lng still captured, ignore
      }

      Alert.alert('📍 Location Detected!', `Lat: ${latitude.toFixed(6)}\nLng: ${longitude.toFixed(6)}`);
    } catch (err) {
      setGeoError('Could not get location');
      Alert.alert('Error', 'Failed to get location. Please check GPS settings.');
    } finally {
      setGeoLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (mobileNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSent(true);
        Alert.alert('OTP Sent', `OTP sent to +91 ${mobileNumber}\n(Dev OTP: 1234)`);
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpVerified(true);
        Alert.alert('✅ Verified', 'Mobile number verified successfully!');
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (e) {
      Alert.alert('Error', 'Network error.');
    } finally {
      setLoading(false);
    }
  };

  const validateStep1 = () => {
    if (!fullName.trim()) return 'Full Name is required';
    if (!mobileNumber || mobileNumber.length < 10) return 'Valid mobile number is required';
    if (!otpVerified) return 'Please verify your mobile number with OTP';
    if (!email.trim()) return 'User ID / Email is required';
    if (!password || password.length < 6) return 'Password must be at least 6 characters';
    if (password !== confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleNext = () => {
    const error = validateStep1();
    if (error) {
      Alert.alert('Incomplete', error);
      return;
    }
    
    if (role === 'consumer') {
      handleRegister();
    } else {
      setStep(2);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('fullName', fullName.trim());
      formData.append('mobileNumber', mobileNumber);
      formData.append('email', email.trim());
      formData.append('password', password);
      formData.append('confirmPassword', confirmPassword);

      if (aadhaarNumber) formData.append('aadhaarNumber', aadhaarNumber);
      if (panNumber) formData.append('panNumber', panNumber);
      if (state) formData.append('state', state);
      if (district) formData.append('district', district);
      if (village) formData.append('village', village);
      if (pinCode) formData.append('pinCode', pinCode);
      if (address) formData.append('address', address);
      if (geoLat) formData.append('geoLat', geoLat);
      if (geoLng) formData.append('geoLng', geoLng);

      const res = await fetch(`${API}/register`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        // Auto-login after registration — go straight to dashboard
        const loginRes = await fetch(`${API}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: email.trim(), password }),
        });
        const loginData = await loginRes.json();

        // Navigate directly to bypass alert blocking issues on web
        const kisanData = loginData.success ? loginData.kisan : { full_name: fullName.trim(), id: data.kisanId };
        
        // Save session for auto-login persistence with role
        try {
          const sessionData = { ...kisanData, role: role };
          await AsyncStorage.setItem('userSession', JSON.stringify(sessionData));
        } catch (e) {
          console.error('Failed to save session after registration:', e);
        }

        if (role === 'consumer') {
          navigation.replace('CustomerDashboard', { kisan: kisanData });
        } else {
          navigation.replace('MainApp', { kisan: kisanData });
        }
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (e) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ── STEP 1 RENDER ──
  const renderStep1 = () => (
    <View style={styles.card}>
      {role !== 'consumer' && (
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>Step 1 of 2</Text>
        </View>
      )}
      <Text style={styles.cardTitle}>
        {role === 'farmer' ? '🌾 Create Farmer ID' :
         role === 'consumer' ? '🛍️ Create Customer ID' :
         role === 'delivery' ? '🚚 Create Delivery Partner ID' :
         '👮 Create Officer ID'}
      </Text>
      <Text style={styles.cardSubtitle}>Primary Details (Required)</Text>

      <InputField
        icon="person" label="Full Name *" value={fullName}
        onChangeText={setFullName} placeholder="Enter your full name"
      />

      {/* Mobile + OTP */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Mobile Number * {otpVerified && '✅'}</Text>
        <View style={styles.rowInput}>
          <View style={[styles.inputWrapper, { flex: 1 }]}>
            <Text style={styles.prefix}>+91</Text>
            <TextInput
              style={styles.input}
              placeholder="10-digit number"
              placeholderTextColor={COLORS.textMuted}
              keyboardType="phone-pad"
              maxLength={10}
              value={mobileNumber}
              onChangeText={setMobileNumber}
              editable={!otpVerified}
            />
          </View>
          {!otpVerified && (
            <TouchableOpacity
              style={[styles.otpBtn, mobileNumber.length < 10 && styles.disabledBtn]}
              onPress={otpSent ? null : handleSendOTP}
              disabled={mobileNumber.length < 10 || loading}
            >
              <Text style={styles.otpBtnText}>{otpSent ? 'Sent' : 'OTP'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {otpSent && !otpVerified && (
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Enter OTP</Text>
          <View style={styles.rowInput}>
            <View style={[styles.inputWrapper, { flex: 1 }]}>
              <Ionicons name="key" size={20} color={COLORS.textMuted} style={{ marginRight: 10 }} />
              <TextInput
                style={styles.input}
                placeholder="Enter 4-digit OTP"
                placeholderTextColor={COLORS.textMuted}
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
              />
            </View>
            <TouchableOpacity
              style={[styles.otpBtn, styles.verifyBtn, otp.length < 4 && styles.disabledBtn]}
              onPress={handleVerifyOTP}
              disabled={otp.length < 4 || loading}
            >
              <Text style={styles.otpBtnText}>Verify</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <InputField
        icon="mail" label="User ID / Email ID *" value={email}
        onChangeText={setEmail} placeholder="Enter User ID or Email"
        keyboardType="email-address"
      />

      <InputField
        icon="lock-closed" label="Password *" value={password}
        onChangeText={setPassword} placeholder="Min 6 characters"
        secure={!showPass} showToggle={showPass}
        toggleShow={() => setShowPass(!showPass)}
      />

      <InputField
        icon="lock-closed" label="Confirm Password *" value={confirmPassword}
        onChangeText={setConfirmPassword} placeholder="Re-enter password"
        secure={!showConfirm} showToggle={showConfirm}
        toggleShow={() => setShowConfirm(!showConfirm)}
      />

      <View style={styles.photoSection}>
        <Ionicons name="camera" size={22} color={COLORS.textMuted} />
        <Text style={styles.photoLabel}>Profile Photo (Optional)</Text>
        <TouchableOpacity style={styles.photoBtn}>
          <Text style={styles.photoBtnText}>Choose Photo</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.primaryBtn} onPress={handleNext} disabled={loading}>
        {loading && role === 'consumer' ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.primaryBtnText}>
            {role === 'consumer' ? 'Complete Registration →' : 'Next Step →'}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );

  // ── STEP 2 RENDER ──
  const renderStep2 = () => (
    <View style={styles.card}>
      <View style={[styles.stepBadge, { backgroundColor: 'rgba(255,153,51,0.15)' }]}>
        <Text style={[styles.stepBadgeText, { color: COLORS.saffron }]}>Step 2 of 2</Text>
      </View>
      <Text style={styles.cardTitle}>📋 Additional Details</Text>
      <Text style={styles.cardSubtitle}>Optional — Can be added later from Profile</Text>

      {/* KYC Section */}
      <View style={styles.sectionDivider}>
        <Ionicons name="shield-checkmark" size={18} color={COLORS.indiaGreen} />
        <Text style={styles.sectionTitle}>KYC Verification</Text>
      </View>

      <InputField
        icon="card" label="Aadhaar Number" value={aadhaarNumber}
        onChangeText={setAadhaarNumber} placeholder="12-digit Aadhaar"
        keyboardType="number-pad" maxLength={12}
      />

      <View style={styles.uploadRow}>
        <Ionicons name="cloud-upload" size={20} color={COLORS.indiaGreen} />
        <Text style={styles.uploadLabel}>Upload Aadhaar Photo</Text>
        <TouchableOpacity style={styles.uploadBtn}>
          <Text style={styles.uploadBtnText}>Choose File</Text>
        </TouchableOpacity>
      </View>

      <InputField
        icon="card" label="PAN Card Number (Optional)" value={panNumber}
        onChangeText={setPanNumber} placeholder="ABCDE1234F"
        maxLength={10}
      />

      <View style={styles.uploadRow}>
        <Ionicons name="cloud-upload" size={20} color={COLORS.saffron} />
        <Text style={styles.uploadLabel}>Upload PAN Photo (Optional)</Text>
        <TouchableOpacity style={styles.uploadBtn}>
          <Text style={styles.uploadBtnText}>Choose File</Text>
        </TouchableOpacity>
      </View>

      {/* Land Proof */}
      <View style={styles.sectionDivider}>
        <Ionicons name="earth" size={18} color={COLORS.indiaGreen} />
        <Text style={styles.sectionTitle}>Land & Address Proof</Text>
      </View>

      <View style={styles.uploadRow}>
        <Ionicons name="document-attach" size={20} color={COLORS.indiaGreen} />
        <Text style={styles.uploadLabel}>Land Ownership Proof</Text>
        <TouchableOpacity style={styles.uploadBtn}>
          <Text style={styles.uploadBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.uploadRow}>
        <Ionicons name="home" size={20} color={COLORS.terracotta} />
        <Text style={styles.uploadLabel}>Address Verification</Text>
        <TouchableOpacity style={styles.uploadBtn}>
          <Text style={styles.uploadBtnText}>Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Location Section */}
      <View style={styles.sectionDivider}>
        <Ionicons name="location" size={18} color={COLORS.saffron} />
        <Text style={styles.sectionTitle}>Location Details</Text>
      </View>

      <InputField
        icon="map" label="State" value={state}
        onChangeText={setState} placeholder="e.g. Madhya Pradesh"
      />
      <InputField
        icon="business" label="District" value={district}
        onChangeText={setDistrict} placeholder="e.g. Indore"
      />
      <InputField
        icon="home" label="Village / Town" value={village}
        onChangeText={setVillage} placeholder="e.g. Mhow"
      />
      <InputField
        icon="navigate" label="Pin Code" value={pinCode}
        onChangeText={setPinCode} placeholder="6-digit PIN"
        keyboardType="number-pad" maxLength={6}
      />
      <InputField
        icon="reader" label="Full Address" value={address}
        onChangeText={setAddress} placeholder="House No, Street, Area..."
      />

      {/* GPS Auto-Detect Section */}
      <View style={styles.gpsSection}>
        <View style={styles.gpsTitleRow}>
          <Ionicons name="navigate-circle" size={24} color={COLORS.indiaGreen} />
          <Text style={styles.gpsSectionTitle}>Farm GPS Location</Text>
        </View>
        <Text style={styles.gpsDescription}>
          Tap the button below to automatically detect your current location using GPS.
        </Text>

        <TouchableOpacity
          style={[styles.gpsBtn, geoLoading && { opacity: 0.7 }]}
          onPress={handleGetLocation}
          disabled={geoLoading}
        >
          {geoLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name="location" size={22} color="#fff" />
          )}
          <Text style={styles.gpsBtnText}>
            {geoLoading ? 'Detecting Location...' : geoLat ? '📍 Re-detect Location' : '📍 Get My Location'}
          </Text>
        </TouchableOpacity>

        {geoError ? (
          <Text style={styles.gpsError}>⚠️ {geoError}</Text>
        ) : null}

        {geoLat && geoLng ? (
          <View style={styles.gpsResult}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.indiaGreen} />
            <Text style={styles.gpsResultText}>Location captured successfully!</Text>
          </View>
        ) : null}

        <View style={styles.geoRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <InputField
              icon="compass" label="Latitude" value={geoLat}
              onChangeText={setGeoLat} placeholder="Auto-detected"
              keyboardType="decimal-pad" editable={!geoLat}
            />
          </View>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <InputField
              icon="compass" label="Longitude" value={geoLng}
              onChangeText={setGeoLng} placeholder="Auto-detected"
              keyboardType="decimal-pad" editable={!geoLng}
            />
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.backBtn} onPress={() => { setStep(1); scrollRef.current?.scrollTo({ y: 0 }); }}>
          <Text style={styles.backBtnText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.primaryBtn, { flex: 1, marginLeft: 12 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryBtnText}>
              {role === 'farmer' ? '🌾 Register Farmer ID' :
               role === 'consumer' ? '🛍️ Register Customer ID' :
               role === 'delivery' ? '🚚 Register Delivery Partner ID' :
               '👮 Register Officer ID'}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.skipBtn} onPress={handleRegister}>
        <Text style={styles.skipBtnText}>Skip & Register with basic details →</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <TouchableOpacity style={styles.backArrow} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {role === 'farmer' ? 'किसान पंजीकरण' :
             role === 'consumer' ? 'ग्राहक पंजीकरण' :
             role === 'delivery' ? 'डिलीवरी पार्टनर' :
             'अधिकारी पंजीकरण'}
          </Text>
          <Text style={styles.headerSub}>
            {role === 'farmer' ? 'Farmer Registration' :
             role === 'consumer' ? 'Customer Registration' :
             role === 'delivery' ? 'Delivery Partner Registration' :
             'Officer Registration'}
          </Text>
          {/* Progress */}
          {role !== 'consumer' && (
            <View style={styles.progressRow}>
              <View style={[styles.progressDot, styles.progressActive]} />
              <View style={[styles.progressLine, step >= 2 && styles.progressLineActive]} />
              <View style={[styles.progressDot, step >= 2 && styles.progressActive]} />
            </View>
          )}
        </View>

        {step === 1 ? renderStep1() : renderStep2()}

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Already have an account?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Login</Text>
          </Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: { flexGrow: 1 },
  header: {
    backgroundColor: COLORS.indiaGreen,
    paddingTop: 50, paddingBottom: 30,
    borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
    alignItems: 'center', overflow: 'hidden', position: 'relative',
    ...SHADOWS.large,
  },
  circle1: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)', top: -40, left: -60,
  },
  circle2: {
    position: 'absolute', width: 150, height: 150, borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.06)', bottom: -30, right: -30,
  },
  backArrow: {
    position: 'absolute', top: 50, left: 20,
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#fff', marginTop: 10 },
  headerSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  progressRow: { flexDirection: 'row', alignItems: 'center', marginTop: 20 },
  progressDot: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.3)', borderWidth: 2, borderColor: '#fff',
  },
  progressActive: { backgroundColor: COLORS.saffron, borderColor: COLORS.saffron },
  progressLine: { width: 60, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', marginHorizontal: 6 },
  progressLineActive: { backgroundColor: COLORS.saffron },
  card: {
    margin: SPACING.xl, backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl, padding: SPACING.xxl,
    ...SHADOWS.large,
  },
  stepBadge: {
    alignSelf: 'flex-start', backgroundColor: 'rgba(19,136,8,0.1)',
    paddingHorizontal: 14, paddingVertical: 6, borderRadius: RADIUS.full, marginBottom: 12,
  },
  stepBadgeText: { fontSize: 12, fontWeight: '700', color: COLORS.indiaGreen },
  cardTitle: { fontSize: 22, fontWeight: '800', color: COLORS.textPrimary, marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 20 },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 6 },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, paddingHorizontal: 14, height: 50,
    backgroundColor: COLORS.background,
  },
  inputDisabled: { backgroundColor: '#f0f0f0' },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  prefix: {
    fontSize: 15, fontWeight: '600', color: COLORS.textPrimary,
    marginRight: 8, borderRightWidth: 1, borderRightColor: COLORS.border, paddingRight: 8,
  },
  rowInput: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  otpBtn: {
    backgroundColor: COLORS.saffron, paddingHorizontal: 18, height: 50,
    borderRadius: RADIUS.lg, justifyContent: 'center', alignItems: 'center',
  },
  verifyBtn: { backgroundColor: COLORS.indiaGreen },
  otpBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  disabledBtn: { backgroundColor: COLORS.border },
  photoSection: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, backgroundColor: COLORS.background, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', marginBottom: 20,
  },
  photoLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary },
  photoBtn: {
    backgroundColor: 'rgba(19,136,8,0.1)', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  photoBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.indiaGreen },
  sectionDivider: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginTop: 10, marginBottom: 16,
    paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: COLORS.borderLight,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  uploadRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    padding: 14, backgroundColor: COLORS.background, borderRadius: RADIUS.lg,
    borderWidth: 1, borderColor: COLORS.border, borderStyle: 'dashed', marginBottom: 14,
  },
  uploadLabel: { flex: 1, fontSize: 13, color: COLORS.textSecondary },
  uploadBtn: {
    backgroundColor: 'rgba(255,153,51,0.15)', paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  uploadBtnText: { fontSize: 12, fontWeight: '600', color: COLORS.saffron },
  geoRow: { flexDirection: 'row', marginTop: 12 },
  gpsSection: {
    backgroundColor: 'rgba(19,136,8,0.04)', borderRadius: RADIUS.xl,
    padding: 18, marginTop: 8, marginBottom: 8,
    borderWidth: 1.5, borderColor: 'rgba(19,136,8,0.15)',
  },
  gpsTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  gpsSectionTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  gpsDescription: { fontSize: 12, color: COLORS.textSecondary, marginBottom: 14, lineHeight: 18 },
  gpsBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: COLORS.indiaGreen, borderRadius: RADIUS.full,
    paddingVertical: 14, ...SHADOWS.medium,
  },
  gpsBtnText: { fontSize: 15, fontWeight: '700', color: '#fff' },
  gpsError: { fontSize: 12, color: COLORS.error, marginTop: 10, textAlign: 'center' },
  gpsResult: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    marginTop: 12, backgroundColor: 'rgba(19,136,8,0.1)',
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: RADIUS.full, alignSelf: 'center',
  },
  gpsResultText: { fontSize: 13, fontWeight: '600', color: COLORS.indiaGreen },
  primaryBtn: {
    backgroundColor: COLORS.indiaGreen, borderRadius: RADIUS.full,
    paddingVertical: 16, alignItems: 'center', justifyContent: 'center',
    ...SHADOWS.medium,
  },
  primaryBtnText: { fontSize: 16, fontWeight: '700', color: '#fff' },
  buttonRow: { flexDirection: 'row', marginTop: 10 },
  backBtn: {
    borderWidth: 2, borderColor: COLORS.indiaGreen, borderRadius: RADIUS.full,
    paddingVertical: 14, paddingHorizontal: 20, justifyContent: 'center',
  },
  backBtnText: { fontSize: 14, fontWeight: '700', color: COLORS.indiaGreen },
  skipBtn: { alignItems: 'center', marginTop: 16 },
  skipBtnText: { fontSize: 13, fontWeight: '600', color: COLORS.saffron },
  footer: { alignItems: 'center', marginTop: 20, paddingHorizontal: SPACING.xl },
  footerText: { fontSize: 14, color: COLORS.textSecondary },
  link: { color: COLORS.indiaGreen, fontWeight: '700' },
});
