import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView,
  Dimensions, Alert, ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { width } = Dimensions.get('window');
const API = Platform.OS === 'web'
  ? 'http://localhost:5000/api/auth'
  : 'http://10.0.2.2:5000/api/auth';

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(1); // 1: Identifier, 2: OTP, 3: New Password
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSendOTP = async () => {
    setErrorMsg('');
    if (!identifier.trim()) {
      setErrorMsg('Please enter your Mobile or Email.');
      return;
    }
    try {
      setLoading(true);
      // Simulated OTP sending
      const res = await fetch(`${API}/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNumber: identifier.includes('@') ? '1234567890' : identifier }),
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
        Alert.alert('OTP Sent', 'For testing, use OTP: 1234');
      } else {
        setErrorMsg(data.error || 'Failed to send OTP.');
      }
    } catch (e) {
      setErrorMsg('Server error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = () => {
    if (otp === '1234') {
      setStep(3);
    } else {
      setErrorMsg('Invalid OTP. Please enter 1234.');
    }
  };

  const handleResetPassword = async () => {
    setErrorMsg('');
    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: identifier.trim(), newPassword }),
      });
      
      let data;
      try {
        data = await res.json();
      } catch (parseError) {
        throw new Error('Server returned an invalid response.');
      }

      if (data.success) {
        Alert.alert('Success', 'Password has been reset successfully!', [
          { text: 'Login Now', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        setErrorMsg(data.error || 'Reset failed.');
      }
    } catch (e) {
      console.error('Reset Password Error:', e);
      setErrorMsg(e.message === 'Failed to fetch' ? 'Cannot reach server. Is the backend running?' : e.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Reset Password</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.stepIndicator}>
            {[1, 2, 3].map((s) => (
              <View key={s} style={[styles.stepDot, step >= s && styles.stepDotActive]} />
            ))}
          </View>

          <Text style={styles.title}>
            {step === 1 && 'Find Your Account'}
            {step === 2 && 'Verify Identity'}
            {step === 3 && 'Create New Password'}
          </Text>
          <Text style={styles.subtitle}>
            {step === 1 && 'Enter your registered mobile or email to receive an OTP.'}
            {step === 2 && 'Enter the 4-digit code sent to your mobile.'}
            {step === 3 && 'Set a strong password for your Kisan ID.'}
          </Text>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {step === 1 && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile / Email</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 9876543210 or kisan@india.com"
                value={identifier}
                onChangeText={setIdentifier}
              />
              <TouchableOpacity style={styles.primaryBtn} onPress={handleSendOTP} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Send OTP</Text>}
              </TouchableOpacity>
            </View>
          )}

          {step === 2 && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Enter 4-Digit OTP</Text>
              <TextInput
                style={[styles.input, { textAlign: 'center', letterSpacing: 10, fontSize: 24 }]}
                placeholder="0 0 0 0"
                keyboardType="number-pad"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
              />
              <TouchableOpacity style={styles.primaryBtn} onPress={handleVerifyOTP}>
                <Text style={styles.btnText}>Verify OTP</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resendBtn} onPress={() => setStep(1)}>
                <Text style={styles.resendText}>Change Mobile/Email</Text>
              </TouchableOpacity>
            </View>
          )}

          {step === 3 && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="At least 6 characters"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Repeat new password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity style={styles.primaryBtn} onPress={handleResetPassword} disabled={loading}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Reset & Override Password</Text>}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContainer: { flexGrow: 1, padding: SPACING.xl },
  header: { flexDirection: 'row', alignItems: 'center', marginTop: 40, marginBottom: 30 },
  backBtn: { padding: 8, backgroundColor: COLORS.surface, borderRadius: RADIUS.md, marginRight: 15, ...SHADOWS.small },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
  content: { flex: 1, alignItems: 'center' },
  stepIndicator: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  stepDot: { width: 40, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  stepDotActive: { backgroundColor: COLORS.indiaGreen },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 14, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 30, paddingHorizontal: 20 },
  errorBox: { backgroundColor: '#FEE2E2', padding: 12, borderRadius: RADIUS.md, marginBottom: 20, width: '100%' },
  errorText: { color: '#B91C1C', fontSize: 13, textAlign: 'center', fontWeight: '600' },
  inputGroup: { width: '100%' },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary, marginBottom: 8, marginTop: 15 },
  input: {
    backgroundColor: COLORS.surface, borderWidth: 1.5, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, padding: 15, fontSize: 16, color: COLORS.textPrimary,
  },
  primaryBtn: {
    backgroundColor: COLORS.indiaGreen, paddingVertical: 18, borderRadius: RADIUS.full,
    alignItems: 'center', marginTop: 30, ...SHADOWS.medium,
  },
  btnText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  resendBtn: { marginTop: 20, alignItems: 'center' },
  resendText: { color: COLORS.textSecondary, fontWeight: '600' },
});
