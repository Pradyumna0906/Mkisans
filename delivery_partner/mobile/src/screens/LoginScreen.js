import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  Image, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  Alert
} from 'react-native';
import { Phone, ArrowRight, Shield, ChevronLeft } from 'lucide-react-native';

export default function LoginScreen({ navigation }) {
  const [step, setStep] = useState('phone'); // phone | otp
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handlePhoneSubmit = () => {
    if (phone.length === 10) setStep('otp');
    else Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto focus next logic would go here with refs
  };

  const handleLogin = async () => {
    const code = otp.join('');
    if (code.length === 6) {
      try {
        // Backend URL - Adjust if needed for mobile testing (localhost might not work on physical devices)
        const response = await fetch('http://localhost:5001/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: phone,
            password: 'password123'
          })
        });

        const data = await response.json();
        if (data.success) {
          // navigation.replace('Main');
          Alert.alert('Success', 'Logged in successfully!');
        } else {
          Alert.alert('Error', data.message || 'Login failed');
        }
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'Could not connect to server.');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerCircle} />
            
            {step === 'otp' && (
              <TouchableOpacity 
                style={styles.backButton}
                onPress={() => setStep('phone')}
              >
                <ChevronLeft size={16} color="white" />
                <Text style={styles.backText}>Back</Text>
              </TouchableOpacity>
            )}

            <View style={styles.logoBox}>
              <Image 
                source={require('../../assets/logo.png')} 
                style={styles.logo}
                defaultSource={{ uri: 'https://cdn-icons-png.flaticon.com/512/3061/3061323.png' }}
              />
            </View>

            <Text style={styles.headerTitle}>
              {step === 'phone' ? 'Welcome, Partner!' : 'Verify OTP'}
            </Text>
            <Text style={styles.headerSubtitle}>
              {step === 'phone'
                ? 'Sign in with your mobile number to start delivering'
                : `Enter the 6-digit code sent to +91 ${phone}`}
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {step === 'phone' ? (
              <View>
                <Text style={styles.inputLabel}>Mobile Number</Text>
                <View style={styles.phoneInputContainer}>
                  <View style={styles.countryCode}>
                    <Text style={styles.countryCodeText}>🇮🇳 +91</Text>
                  </View>
                  <TextInput
                    style={styles.phoneInput}
                    placeholder="Enter mobile number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={(val) => setPhone(val.replace(/\D/g, ''))}
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.primaryButton, phone.length < 10 && styles.disabledButton]}
                  onPress={handlePhoneSubmit}
                  disabled={phone.length < 10}
                >
                  <Text style={styles.primaryButtonText}>Continue</Text>
                  <ArrowRight size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={styles.inputLabel}>Enter Verification Code</Text>
                <View style={styles.otpContainer}>
                  {otp.map((digit, i) => (
                    <TextInput
                      key={i}
                      style={[styles.otpInput, digit ? styles.otpInputActive : null]}
                      keyboardType="number-pad"
                      maxLength={1}
                      value={digit}
                      onChangeText={(val) => handleOtpChange(i, val)}
                    />
                  ))}
                </View>
                
                <TouchableOpacity 
                  style={[styles.primaryButton, otp.join('').length < 6 && styles.disabledButton]}
                  onPress={handleLogin}
                  disabled={otp.join('').length < 6}
                >
                  <Text style={styles.primaryButtonText}>Verify & Login</Text>
                  <Shield size={18} color="white" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.resendContainer}>
                  <Text style={styles.resendText}>
                    Didn't receive code? <Text style={styles.resendLink}>Resend</Text>
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 'phone' && (
              <View style={styles.registerLinkContainer}>
                <Text style={styles.registerText}>
                  New to MKisans?{' '}
                  <Text style={styles.registerLink} onPress={() => {}}>
                    Register as Partner
                  </Text>
                </Text>
              </View>
            )}
          </View>

          {/* Footer Badges */}
          <View style={styles.footer}>
            <View style={styles.badge}><Text>🔒</Text><Text style={styles.badgeText}>Secure</Text></View>
            <View style={styles.badge}><Text>⚡</Text><Text style={styles.badgeText}>Instant</Text></View>
            <View style={styles.badge}><Text>🛡️</Text><Text style={styles.badgeText}>Verified</Text></View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#138808',
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 40,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    position: 'relative',
    overflow: 'hidden',
  },
  headerCircle: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -60,
    right: -40,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  backText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginLeft: 4,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  logo: {
    width: 48,
    height: 48,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.75)',
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    marginBottom: 24,
  },
  countryCode: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#EDF2F7',
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  countryCodeText: {
    fontWeight: '600',
    color: '#4A5568',
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: '600',
    color: '#2D3748',
  },
  primaryButton: {
    backgroundColor: '#138808',
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  otpInput: {
    width: 48,
    height: 56,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '700',
    color: '#2D3748',
  },
  otpInputActive: {
    borderColor: '#138808',
    backgroundColor: '#F0FFF4',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 16,
  },
  resendText: {
    color: '#718096',
    fontSize: 14,
  },
  resendLink: {
    color: '#138808',
    fontWeight: '700',
  },
  registerLinkContainer: {
    alignItems: 'center',
    marginTop: 32,
  },
  registerText: {
    color: '#718096',
    fontSize: 14,
  },
  registerLink: {
    color: '#138808',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  badgeText: {
    fontSize: 12,
    color: '#718096',
    fontWeight: '500',
  },
});
