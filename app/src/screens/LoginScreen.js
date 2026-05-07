import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';
import NewsTicker from '../components/NewsTicker';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [role, setRole] = useState('farmer'); // 'farmer' or 'consumer'

  const handleSendOTP = () => {
    if (phoneNumber.length >= 10) {
      setStep('otp');
    }
  };

  const handleLogin = () => {
    if (otp.length === 4) {
      // Navigate to MainApp (Tabs)
      navigation.replace('MainApp');
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Top Decorative Graphic */}
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
          </View>

          {/* Phone Number Input Step */}
          {step === 'phone' && (
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>मोबाइल नंबर दर्ज करें</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.prefix}>+91</Text>
                <TextInput
                  style={styles.input}
                  placeholder="अपना 10 अंकों का नंबर डालें"
                  placeholderTextColor={COLORS.textMuted}
                  keyboardType="phone-pad"
                  maxLength={10}
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                />
              </View>
              <TouchableOpacity 
                style={[styles.primaryBtn, phoneNumber.length < 10 && styles.disabledBtn]} 
                onPress={handleSendOTP}
                disabled={phoneNumber.length < 10}
              >
                <Text style={styles.primaryBtnText}>OTP प्राप्त करें (Get OTP)</Text>
                <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          )}

          {/* OTP Input Step */}
          {step === 'otp' && (
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>OTP दर्ज करें</Text>
              <Text style={styles.otpSubtext}>+91 {phoneNumber} पर भेजा गया</Text>
              
              <View style={styles.otpContainer}>
                {/* Simulated OTP boxes */}
                {[0, 1, 2, 3].map((_, idx) => (
                  <View key={idx} style={styles.otpBox}>
                    <Text style={styles.otpDigit}>{otp[idx] || ''}</Text>
                  </View>
                ))}
                {/* Hidden input taking actual value */}
                <TextInput
                  style={styles.hiddenInput}
                  keyboardType="number-pad"
                  maxLength={4}
                  value={otp}
                  onChangeText={setOtp}
                  autoFocus
                />
              </View>

              <TouchableOpacity 
                style={[styles.primaryBtn, otp.length < 4 && styles.disabledBtn]} 
                onPress={handleLogin}
                disabled={otp.length < 4}
              >
                <Text style={styles.primaryBtnText}>लॉगिन करें (Login)</Text>
                <Ionicons name="checkmark-circle" size={20} color={COLORS.white} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.resendBtn} onPress={() => setOtp('')}>
                <Text style={styles.resendText}>OTP दोबारा भेजें</Text>
              </TouchableOpacity>
            </View>
          )}

        </View>

        {/* Government Schemes News Ticker */}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: SPACING.xxl,
  },
  headerGraphic: {
    height: 300,
    backgroundColor: COLORS.saffron,
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 40,
    overflow: 'hidden',
    position: 'relative',
    ...SHADOWS.large,
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255,255,255,0.1)',
    top: -50,
    left: -100,
  },
  circle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.1)',
    bottom: -50,
    right: -50,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: COLORS.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl,
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(19, 136, 8, 0.1)',
    color: COLORS.indiaGreen,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    fontSize: FONTS.sizes.sm,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    borderWidth: 1,
    borderColor: 'rgba(19, 136, 8, 0.2)',
    marginBottom: SPACING.sm,
    alignSelf: 'center',
  },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: '800',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xxl,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.sm,
    marginBottom: SPACING.xxxl,
    width: '100%',
    ...SHADOWS.medium,
  },
  roleBtn: {
    flex: 1,
    paddingVertical: SPACING.lg,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.xs,
  },
  roleBtnActive: {
    backgroundColor: COLORS.indiaGreen,
    ...SHADOWS.small,
  },
  roleText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  roleTextActive: {
    color: COLORS.white,
  },
  inputSection: {
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xxxl,
    width: '100%',
    ...SHADOWS.large,
  },
  inputLabel: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  otpSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    marginTop: -8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.lg,
    height: 56,
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  prefix: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginRight: SPACING.sm,
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
    paddingRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.lg,
    color: COLORS.textPrimary,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    position: 'relative',
  },
  otpBox: {
    width: (width - SPACING.xl*2 - SPACING.xxl*2 - SPACING.md*3) / 4,
    height: 60,
    borderWidth: 2,
    borderColor: COLORS.indiaGreen,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  otpDigit: {
    fontSize: FONTS.sizes.xxl,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  primaryBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.saffron,
    borderRadius: RADIUS.full,
    paddingVertical: SPACING.lg,
    gap: SPACING.sm,
    ...SHADOWS.small,
  },
  disabledBtn: {
    backgroundColor: COLORS.border,
    elevation: 0,
    shadowOpacity: 0,
  },
  primaryBtnText: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.white,
  },
  resendBtn: {
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  resendText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.indiaGreen,
  },
  footer: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xxl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
  },
  link: {
    color: COLORS.indiaGreen,
    fontWeight: '600',
  },
});
