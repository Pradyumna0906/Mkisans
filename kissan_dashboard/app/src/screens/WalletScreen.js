import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
  Dimensions,
  Platform,
  TextInput,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { COLORS, SHADOWS, RADIUS } from '../theme';

const { width } = Dimensions.get('window');

const getBaseUrl = () => {
  if (Platform.OS === 'web') return `http://${window.location.hostname}:5000`;
  return 'http://10.0.2.2:5000';
};
const BASE_URL = getBaseUrl();

export default function WalletScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [wallet, setWallet] = useState(null);
  const [history, setHistory] = useState([]);
  const [user, setUser] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const [upiId, setUpiId] = useState('');
  const [updatingUpi, setUpdatingUpi] = useState(false);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      const session = await AsyncStorage.getItem('userSession');
      if (!session) return;
      const userData = JSON.parse(session);
      setUser(userData);

      const [walletRes, historyRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/wallet/${userData.id}`),
        axios.get(`${BASE_URL}/api/wallet/${userData.id}/history`)
      ]);

      if (walletRes.data.success) {
        setWallet(walletRes.data.wallet);
        setUpiId(walletRes.data.wallet.upi_id || '');
      }
      if (historyRes.data.success) {
        setHistory(historyRes.data.history);
      }
    } catch (error) {
      console.error('Wallet fetch error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWalletData();
  };

  const handleUpdateUpi = async () => {
    if (!upiId.includes('@')) {
      Alert.alert('Invalid UPI', 'Please enter a valid UPI ID (e.g., name@okaxis)');
      return;
    }

    setUpdatingUpi(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/wallet/update-upi`, {
        kisanId: user.id,
        upiId: upiId
      });
      if (res.data.success) {
        Alert.alert('Success', 'UPI ID updated successfully');
        fetchWalletData();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update UPI ID');
    } finally {
      setUpdatingUpi(false);
    }
  };

  const getQRData = () => {
    if (!wallet?.upi_id) return null;
    // UPI Deep Link Format: upi://pay?pa=UPI_ID&pn=NAME&am=AMOUNT&cu=CURRENCY
    const upiLink = `upi://pay?pa=${wallet.upi_id}&pn=${user.full_name}&cu=INR`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiLink)}`;
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kisan Wallet</Text>
        <TouchableOpacity onPress={() => setShowQR(!showQR)}>
          <Ionicons name="qr-code-outline" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Balance Card */}
        <View style={styles.balanceCard}>
          <Image 
            source={{ uri: 'https://img.freepik.com/free-vector/abstract-green-background-with-golden-lines_1017-32247.jpg' }} 
            style={styles.cardBg} 
          />
          <View style={styles.cardOverlay}>
            <View style={styles.cardTop}>
              <Text style={styles.cardLabel}>Available Balance</Text>
              <MaterialCommunityIcons name="wallet-outline" size={24} color="#fff" />
            </View>
            <Text style={styles.balanceText}>₹{wallet?.balance?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</Text>
            <View style={styles.cardBottom}>
              <Text style={styles.cardHolder}>{user?.full_name?.toUpperCase()}</Text>
              <View style={styles.verifyBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#fff" />
                <Text style={styles.verifyText}>VERIFIED</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionItem} onPress={() => Alert.alert('Coming Soon', 'Withdrawal to bank will be active after verification.')}>
            <View style={[styles.actionIcon, { backgroundColor: '#eff6ff' }]}>
              <MaterialCommunityIcons name="bank-transfer-out" size={24} color="#3b82f6" />
            </View>
            <Text style={styles.actionLabel}>Withdraw</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={() => setShowQR(true)}>
            <View style={[styles.actionIcon, { backgroundColor: '#ecfdf5' }]}>
              <MaterialCommunityIcons name="qrcode-scan" size={24} color="#10b981" />
            </View>
            <Text style={styles.actionLabel}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionItem} onPress={onRefresh}>
            <View style={[styles.actionIcon, { backgroundColor: '#fff7ed' }]}>
              <MaterialCommunityIcons name="history" size={24} color="#f59e0b" />
            </View>
            <Text style={styles.actionLabel}>History</Text>
          </TouchableOpacity>
        </View>

        {/* UPI & QR Section */}
        {showQR && (
          <View style={styles.qrCard}>
            <Text style={styles.qrTitle}>Receive Payments</Text>
            {wallet?.upi_id ? (
              <View style={styles.qrContainer}>
                <Image source={{ uri: getQRData() }} style={styles.qrImage} />
                <Text style={styles.upiDisplay}>{wallet.upi_id}</Text>
                <Text style={styles.qrHint}>Scan this QR to pay directly into your Kisan Wallet</Text>
              </View>
            ) : (
              <View style={styles.upiSetup}>
                <Text style={styles.setupText}>Setup your UPI ID to generate a QR Code</Text>
                <TextInput 
                  style={styles.upiInput}
                  placeholder="e.g. mobile@okaxis"
                  value={upiId}
                  onChangeText={setUpiId}
                  autoCapitalize="none"
                />
                <TouchableOpacity 
                  style={styles.setupBtn} 
                  onPress={handleUpdateUpi}
                  disabled={updatingUpi}
                >
                  {updatingUpi ? <ActivityIndicator color="#fff" /> : <Text style={styles.setupBtnText}>Generate QR Code</Text>}
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={styles.closeQR} onPress={() => setShowQR(false)}>
              <Text style={styles.closeQRText}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Transaction History */}
        <View style={styles.historyHeader}>
          <Text style={styles.historyTitle}>Recent Transactions</Text>
          <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
        </View>

        {history.length > 0 ? history.map((item, index) => (
          <View key={item.id || index} style={styles.transItem}>
            <View style={[styles.transIcon, { backgroundColor: item.type === 'credit' ? '#ecfdf5' : '#fef2f2' }]}>
              <MaterialCommunityIcons 
                name={item.type === 'credit' ? "arrow-bottom-left" : "arrow-top-right"} 
                size={20} 
                color={item.type === 'credit' ? "#10b981" : "#ef4444"} 
              />
            </View>
            <View style={styles.transDetails}>
              <Text style={styles.transDesc}>{item.description}</Text>
              <Text style={styles.transDate}>{new Date(item.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
            </View>
            <Text style={[styles.transAmount, { color: item.type === 'credit' ? "#10b981" : "#ef4444" }]}>
              {item.type === 'credit' ? '+' : '-'}₹{item.amount}
            </Text>
          </View>
        )) : (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="text-box-search-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyText}>No transactions yet</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 60, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: '#fff', ...SHADOWS.small },
  headerTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b' },
  scroll: { padding: 20, paddingBottom: 100 },

  balanceCard: { height: 180, borderRadius: 20, overflow: 'hidden', ...SHADOWS.medium, marginBottom: 25 },
  cardBg: { width: '100%', height: '100%', position: 'absolute' },
  cardOverlay: { flex: 1, backgroundColor: 'rgba(19, 136, 8, 0.7)', padding: 20, justifyContent: 'space-between' },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
  balanceText: { color: '#fff', fontSize: 32, fontWeight: '800', marginTop: 10 },
  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardHolder: { color: '#fff', fontSize: 14, fontWeight: '700', letterSpacing: 1 },
  verifyBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  verifyText: { color: '#fff', fontSize: 10, fontWeight: '800', marginLeft: 4 },

  actionsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 25 },
  actionItem: { alignItems: 'center' },
  actionIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 8, ...SHADOWS.small },
  actionLabel: { fontSize: 12, fontWeight: '700', color: '#64748b' },

  qrCard: { backgroundColor: '#fff', padding: 25, borderRadius: 24, marginBottom: 25, alignItems: 'center', ...SHADOWS.large },
  qrTitle: { fontSize: 18, fontWeight: '800', color: '#1e293b', marginBottom: 20 },
  qrContainer: { alignItems: 'center' },
  qrImage: { width: 200, height: 200, marginBottom: 15 },
  upiDisplay: { fontSize: 16, fontWeight: '700', color: COLORS.primary, marginBottom: 10 },
  qrHint: { fontSize: 12, color: '#64748b', textAlign: 'center' },
  upiSetup: { width: '100%', alignItems: 'center' },
  setupText: { fontSize: 14, color: '#64748b', marginBottom: 15 },
  upiInput: { width: '100%', height: 50, backgroundColor: '#f1f5f9', borderRadius: 12, paddingHorizontal: 15, fontSize: 16, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  setupBtn: { width: '100%', height: 50, backgroundColor: COLORS.primary, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  setupBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  closeQR: { marginTop: 20, padding: 10 },
  closeQRText: { color: '#ef4444', fontWeight: '700' },

  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  historyTitle: { fontSize: 16, fontWeight: '800', color: '#1e293b' },
  seeAll: { fontSize: 14, color: COLORS.primary, fontWeight: '700' },
  transItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 16, marginBottom: 12, ...SHADOWS.small },
  transIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  transDetails: { flex: 1 },
  transDesc: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
  transDate: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  transAmount: { fontSize: 16, fontWeight: '800' },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyText: { color: '#94a3b8', marginTop: 10, fontSize: 14, fontWeight: '600' }
});
