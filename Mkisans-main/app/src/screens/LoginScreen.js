import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Image, KeyboardAvoidingView, Platform, ScrollView,
  Dimensions, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';
import NewsTicker from '../components/NewsTicker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const API = Platform.OS === 'web'
  ? 'http://localhost:5000/api/auth'
  : 'http://10.0.2.2:5000/api/auth';

export default function LoginScreen({ navigation }) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState('farmer');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async () => {
    setErrorMsg('');
    if (!identifier.trim() || !password) {
      setErrorMsg('Please enter your User ID/Mobile and Password.');
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      const data = await res.json();

      if (data.success) {
        // Save session for auto-login
        try {
          await AsyncStorage.setItem('userSession', JSON.stringify(data.kisan));
        } catch (e) {
          console.error('Failed to save session:', e);
        }

        if (Platform.OS === 'web') {
          console.log('Login success, navigating...');
        }
        
        if (role === 'consumer') {
          navigation.replace('CustomerDashboard', { kisan: data.kisan });
        } else {
          navigation.replace('MainApp', { kisan: data.kisan });
        }
      } else {
        setErrorMsg(data.error || 'Login failed. Please check your credentials.');
      }
    } catch (e) {
      console.error('Login error:', e);
      setErrorMsg('Cannot reach server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>

        {/* Top Header Graphic */}
        <View style={styles.headerGraphic}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />
          <Image
            source={require('../../assets/logo.jpg')}
            style={styles.logo}
            resizeMode="cover"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.badge}>Jai Jawan • Jai Kisan</Text>
          <Text style={styles.title}>Honoring the Anndevta</Text>
          <Text style={styles.subtitle}>भारत के किसानों का अपना डिजिटल प्लेटफॉर्म</Text>

          {/* Role Selection */}
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'farmer' && styles.roleBtnActive]}
              onPress={() => setRole('farmer')}
            >
              <Text style={[styles.roleText, role === 'farmer' && styles.roleTextActive]}>🌾 किसान</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'consumer' && styles.roleBtnActive]}
              onPress={() => setRole('consumer')}
            >
              <Text style={[styles.roleText, role === 'consumer' && styles.roleTextActive]}>🛒 ग्राहक</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'officer' && styles.roleBtnActive]}
              onPress={() => setRole('officer')}
            >
              <Text style={[styles.roleText, role === 'officer' && styles.roleTextActive]}>👨‍💼 ऑफिसर</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleBtn, role === 'delivery' && styles.roleBtnActive]}
              onPress={() => setRole('delivery')}
            >
              <Text style={[styles.roleText, role === 'delivery' && styles.roleTextActive]}>🚚 डिलीवरी</Text>
            </TouchableOpacity>
          </View>
          
          {/* Login Card */}
          <View style={styles.loginCard}>
            <Text style={styles.loginTitle}>
              {role === 'farmer' ? '🔐 Farmer Login' : 
               role === 'consumer' ? '🛍️ Customer Login' : 
               role === 'delivery' ? '🚚 Delivery Partner Login' :
               '👮 Officer Login'}
            </Text>

            {errorMsg ? (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color="#fff" />
                <Text style={styles.errorText}>{errorMsg}</Text>
              </View>
            ) : null}

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>User ID / Email / Mobile</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="person" size={20} color={COLORS.textMuted} style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter User ID, email or mobile"
                  placeholderTextColor={COLORS.textMuted}
                  value={identifier}
                  onChangeText={setIdentifier}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed" size={20} color={COLORS.textMuted} style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.textMuted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={COLORS.textMuted} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity 
                style={styles.forgotBtn} 
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={styles.forgotText}>Forgot Password? (पासवर्ड भूल गए?)</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.primaryBtn, (!identifier || !password) && styles.disabledBtn]}
              onPress={handleLogin}
              disabled={!identifier || !password || loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>लॉगिन करें (Login)</Text>
                  <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
                </>
              )}
            </TouchableOpacity>
          </View>

          {/* Register Link */}
          <View style={styles.registerSection}>
            <Text style={styles.registerText}>New to MKisans?</Text>
            <TouchableOpacity
              style={styles.registerBtn}
              onPress={() => navigation.navigate('Register', { role })}
            >
              <Ionicons name="person-add" size={18} color={COLORS.indiaGreen} />
              <Text style={styles.registerBtnText}>
                {role === 'farmer' ? 'Create Farmer ID' :
                 role === 'consumer' ? 'Create Customer ID' :
                 role === 'delivery' ? 'Create Delivery Partner ID' :
                 'Create Officer ID'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* News Ticker */}
        <NewsTicker />

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            लॉगिन करके आप हमारी <Text style={styles.link}>शर्तों</Text> और <Text style={styles.link}>गोपनीयता नीति</Text> से सहमत होते हैं।
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: { flexGrow: 1, paddingBottom: SPACING.xxl },
  headerGraphic: {
    height: 280, backgroundColor: COLORS.saffron,
    borderBottomLeftRadius: 60, borderBottomRightRadius: 60,
    alignItems: 'center', justifyContent: 'flex-end',
    paddingBottom: 40, overflow: 'hidden', position: 'relative',
    ...SHADOWS.large,
  },
  circle1: {
    position: 'absolute', width: 300, height: 300, borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.1)', top: -50, left: -100,
  },
  circle2: {
    position: 'absolute', width: 200, height: 200, borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)', bottom: -50, right: -50,
  },
  logo: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 4, borderColor: COLORS.white,
  },
  content: {
    flex: 1, paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl, alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(19, 136, 8, 0.1)', color: COLORS.indiaGreen,
    paddingHorizontal: SPACING.lg, paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full, fontSize: FONTS.sizes.sm, fontWeight: '700',
    letterSpacing: 1, textTransform: 'uppercase',
    borderWidth: 1, borderColor: 'rgba(19, 136, 8, 0.2)',
    marginBottom: SPACING.sm, alignSelf: 'center',
  },
  title: { fontSize: FONTS.sizes.title, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
  subtitle: {
    fontSize: FONTS.sizes.md, color: COLORS.textSecondary,
    textAlign: 'center', marginTop: SPACING.sm, marginBottom: SPACING.xxl,
  },
  roleContainer: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.sm, marginBottom: SPACING.xl, width: '100%',
    ...SHADOWS.medium,
  },
  roleBtn: {
    flex: 1, paddingVertical: SPACING.md, borderRadius: RADIUS.lg,
    alignItems: 'center', justifyContent: 'center', marginHorizontal: 2,
  },
  roleBtnActive: { backgroundColor: COLORS.indiaGreen, ...SHADOWS.small },
  roleText: { fontSize: 13, fontWeight: '700', color: COLORS.textSecondary },
  roleTextActive: { color: COLORS.white },

  // Login card
  loginCard: {
    backgroundColor: COLORS.surface, borderRadius: RADIUS.xl,
    padding: SPACING.xxl, width: '100%', ...SHADOWS.large,
  },
  loginTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: RADIUS.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
    ...SHADOWS.small,
  },
  errorText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  fieldGroup: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 6 },
  forgotBtn: { alignSelf: 'flex-end', marginTop: 8 },
  forgotText: { fontSize: 13, fontWeight: '600', color: COLORS.indiaGreen },
  inputWrapper: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, paddingHorizontal: 14, height: 52,
    backgroundColor: COLORS.background,
  },
  input: { flex: 1, fontSize: 15, color: COLORS.textPrimary },
  primaryBtn: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    backgroundColor: COLORS.saffron, borderRadius: RADIUS.full,
    paddingVertical: SPACING.lg, gap: SPACING.sm, marginTop: 8,
    ...SHADOWS.small,
  },
  disabledBtn: { backgroundColor: COLORS.border, elevation: 0, shadowOpacity: 0 },
  primaryBtnText: { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.white },
  
  // Delivery specific
  deliveryCardContent: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  deliveryIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(19, 136, 8, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  deliveryDesc: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.md,
  },
  secondaryBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(19, 136, 8, 0.08)',
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
    marginTop: 16,
    width: '100%',
    borderWidth: 2,
    borderColor: COLORS.indiaGreen,
  },
  secondaryBtnText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.indiaGreen,
  },

  // Register section
  registerSection: {
    marginTop: 24, alignItems: 'center', width: '100%',
  },
  registerText: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 10 },
  registerBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(19,136,8,0.08)', paddingHorizontal: 24,
    paddingVertical: 14, borderRadius: RADIUS.full,
    borderWidth: 2, borderColor: COLORS.indiaGreen,
  },
  registerBtnText: { fontSize: 15, fontWeight: '700', color: COLORS.indiaGreen },

  footer: { paddingHorizontal: SPACING.xl, marginTop: SPACING.xxl, alignItems: 'center' },
  footerText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, textAlign: 'center', lineHeight: 18 },
  link: { color: COLORS.indiaGreen, fontWeight: '600' },
});
