import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  TextInput, Switch, Modal, Dimensions, Platform, Alert, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// --- DUMMY DATA ---
const ACTIVE_ORDERS = [
  { id: '#ORD-1042', status: 'On the way', items: '2 kg Tomatoes, 1 kg Onion...', total: '₹140', date: 'Today, 2:30 PM' },
  { id: '#ORD-1041', status: 'Processing', items: '5 kg Ashirvad Atta', total: '₹220', date: 'Today, 1:00 PM' }
];

const TRANSACTIONS = [
  { id: 1, type: 'Cashback', amount: '+₹50', date: '10 May 2026', success: true },
  { id: 2, type: 'Order', amount: '-₹340', date: '08 May 2026', success: true },
  { id: 3, type: 'Wallet recharge', amount: '+₹500', date: '01 May 2026', success: true },
  { id: 4, type: 'Refunds', amount: '+₹120', date: '25 Apr 2026', success: true }
];

const FAQS = [
  { q: 'How do I track my order?', a: 'You can track your order in the Order Management section.' },
  { q: 'What is the return policy?', a: 'Fresh produce cannot be returned once accepted. Other items have a 2-day return window.' },
  { q: 'How do I use my wallet balance?', a: 'Wallet balance is automatically applied at checkout.' }
];

const SUBSCRIPTIONS = [
  { id: 1, name: 'Weekly Vegetable Plan', status: 'Active', deliveries: 12, saved: '₹450', next: 'Tomorrow, 8 AM' },
  { id: 2, name: 'Monthly Grocery Box', status: 'Paused', deliveries: 4, saved: '₹120', next: 'Paused' }
];

export default function CustomerProfileScreen({ navigation, route }) {
  const kisan = route?.params?.kisan || {};
  const [activeModal, setActiveModal] = useState(null); 
  const [subModal, setSubModal] = useState(null); 
  
  // Settings States
  const [language, setLanguage] = useState('English');
  const [showPass, setShowPass] = useState(false);
  const [toggles, setToggles] = useState({
    profileVis: true, orderPriv: false, locShare: true, notifPerm: true,
    orderNotif: true, offerNotif: true, delNotif: true, commNotif: false, autoGps: true
  });

  // Edit Profile States
  const [editForm, setEditForm] = useState({
    name: kisan.full_name || 'Premium Customer',
    mobile: '+91 9876543210',
    email: 'customer@mkisans.com',
    dob: '15/08/1990',
    gender: 'Male',
    address: '123 Smart City, Bhopal, MP'
  });

  // Wallet States
  const [walletView, setWalletView] = useState('home');
  const [walletAmount, setWalletAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [txnFilter, setTxnFilter] = useState('All');
  const [txnSearch, setTxnSearch] = useState('');
  
  // Subscription States
  const [subView, setSubView] = useState('home');
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  const [isProcessing, setIsProcessing] = useState(false);

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userSession');
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const simulateProcessing = (successMessage, callback) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert('Success', successMessage);
      if (callback) callback();
    }, 1500);
  };

  const toggleSwitch = (key) => setToggles(prev => ({ ...prev, [key]: !prev[key] }));

  // --- REUSABLE COMPONENTS ---
  const ModalHeader = ({ title, onBack, onClose }) => (
    <View style={styles.modalHeader}>
      <View style={{flexDirection:'row', alignItems:'center', gap:15}}>
        {onBack && <TouchableOpacity onPress={onBack}><Ionicons name="arrow-back" size={26} color={COLORS.textPrimary}/></TouchableOpacity>}
        <Text style={styles.modalTitle}>{title}</Text>
      </View>
      <TouchableOpacity onPress={onClose || (() => { setActiveModal(null); setSubModal(null); setWalletView('home'); setSubView('home'); })}>
        <Ionicons name="close-circle" size={30} color={COLORS.textMuted} />
      </TouchableOpacity>
    </View>
  );

  const renderSectionItem = (icon, title, subtitle, onPress, color = COLORS.indiaGreen) => (
    <TouchableOpacity style={styles.sectionItem} onPress={onPress}>
      <View style={[styles.sectionIconWrap, { backgroundColor: `${color}15` }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.sectionItemInfo}>
        <Text style={styles.sectionItemTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionItemSub}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );

  // --- EDIT PROFILE MODAL ---
  const renderEditProfileModal = () => (
    <Modal visible={activeModal === 'edit_profile'} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <ModalHeader title="Edit Profile" />
        <ScrollView style={styles.modalContent}>
          <View style={{alignItems: 'center', marginBottom: 20}}>
            <Image source={{ uri: 'https://i.pravatar.cc/150?img=33' }} style={[styles.avatar, {width: 100, height: 100, borderRadius: 50}]} />
            <TouchableOpacity style={{marginTop: 10}}><Text style={{color: COLORS.indiaGreen, fontWeight: '700'}}>Change Photo</Text></TouchableOpacity>
          </View>
          <View style={styles.card}>
            {[
              { label: 'Full Name', key: 'name' },
              { label: 'Mobile Number', key: 'mobile' },
              { label: 'Email Address', key: 'email' },
              { label: 'Date of Birth', key: 'dob' },
              { label: 'Gender', key: 'gender' },
              { label: 'Address', key: 'address' },
            ].map((field, idx) => (
              <View key={idx} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                <TextInput style={styles.input} value={editForm[field.key]} onChangeText={(txt) => setEditForm({...editForm, [field.key]: txt})} />
              </View>
            ))}
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Auto Update GPS Location</Text>
              <Switch value={toggles.autoGps} onValueChange={() => toggleSwitch('autoGps')} trackColor={{ true: COLORS.indiaGreen }} />
            </View>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.btnAction, {backgroundColor: '#F3F4F6', flex: 1}]} onPress={() => setActiveModal(null)}>
              <Text style={[styles.btnActionText, {color: COLORS.textPrimary}]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.btnAction, {backgroundColor: COLORS.indiaGreen, flex: 1}]} onPress={() => simulateProcessing('Profile Updated!', () => setActiveModal(null))}>
              {isProcessing ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnActionText}>Save</Text>}
            </TouchableOpacity>
          </View>
          <View style={{height:40}}/>
        </ScrollView>
      </View>
    </Modal>
  );

  // --- ORDERS MODAL ---
  const renderOrdersModal = () => (
    <Modal visible={activeModal === 'orders'} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <ModalHeader title="Order Management" />
        <ScrollView style={styles.modalContent}>
          {['Active Orders', 'Delivered Orders', 'Cancelled Orders'].map((tab, i) => (
            <View key={i} style={styles.card}>
              <Text style={styles.cardTitle}>{tab}</Text>
              {i === 0 ? ACTIVE_ORDERS.map((ord, idx) => (
                <View key={idx} style={styles.orderCard}>
                  <View style={styles.orderHeader}>
                    <Text style={styles.orderId}>{ord.id}</Text>
                    <Text style={styles.orderStatus}>{ord.status}</Text>
                  </View>
                  <Text style={styles.orderItems}>{ord.items}</Text>
                  <View style={styles.orderFooter}>
                    <Text style={styles.orderTotal}>{ord.total}</Text>
                    <View style={{flexDirection:'row', gap:8}}>
                      <TouchableOpacity style={[styles.trackBtn, {backgroundColor: '#F3F4F6'}]}><Text style={[styles.trackBtnText, {color:COLORS.textPrimary}]}>Invoice</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.trackBtn}><Text style={styles.trackBtnText}>Track</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>
              )) : <Text style={styles.emptyText}>No {tab.toLowerCase()} found.</Text>}
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );

  // --- SETTINGS & SUPPORT ---
  const renderSettingsModal = () => (
    <Modal visible={activeModal === 'settings'} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <ModalHeader title="App Settings" />
        <ScrollView style={styles.modalContent}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingLink} onPress={() => setSubModal('language')}>
              <View>
                <Text style={styles.settingLinkLabel}>Language Preferences</Text>
                <Text style={{fontSize: 12, color: COLORS.textMuted}}>{language}</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingLink} onPress={() => setSubModal('password')}>
              <Text style={styles.settingLinkLabel}>Change Password</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingLink} onPress={() => setSubModal('privacy')}>
              <Text style={styles.settingLinkLabel}>Privacy Settings</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingLink} onPress={() => setSubModal('notifications')}>
              <Text style={styles.settingLinkLabel}>Notification Settings</Text>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
            <Text style={styles.logoutText}>Logout securely</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );

  const renderSupportModal = () => (
    <Modal visible={activeModal === 'support'} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <ModalHeader title="Customer Support" />
        <ScrollView style={styles.modalContent}>
          <View style={styles.card}>
            <TouchableOpacity style={styles.settingLink} onPress={() => setSubModal('chat')}><Text style={styles.settingLinkLabel}>Live Chat Support</Text><Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} /></TouchableOpacity>
            <TouchableOpacity style={styles.settingLink} onPress={() => Alert.alert('Call Support', 'Calling 1800-MKISANS...')}><Text style={styles.settingLinkLabel}>Call Support</Text><Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} /></TouchableOpacity>
            <TouchableOpacity style={styles.settingLink} onPress={() => setSubModal('help_center')}><Text style={styles.settingLinkLabel}>Help Center & FAQ</Text><Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} /></TouchableOpacity>
            <TouchableOpacity style={styles.settingLink} onPress={() => setSubModal('report_issue')}><Text style={styles.settingLinkLabel}>Report an Issue</Text><Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} /></TouchableOpacity>
            <TouchableOpacity style={styles.settingLink} onPress={() => setSubModal('track_tickets')}><Text style={styles.settingLinkLabel}>Track Support Tickets</Text><Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} /></TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );

  // --- NESTED SUB-MODALS ---
  const renderNestedModals = () => (
    <Modal visible={['language', 'password', 'privacy', 'notifications', 'chat', 'help_center', 'report_issue', 'track_tickets'].includes(subModal)} animationType="slide">
      <View style={styles.modalContainer}>
        {subModal === 'language' && (
          <><ModalHeader title="Language" onBack={() => setSubModal(null)} onClose={()=>setSubModal(null)}/>
          <ScrollView style={styles.modalContent}><View style={styles.card}>
            {['English', 'Hindi (हिंदी)', 'Hinglish'].map(lang => (
              <TouchableOpacity key={lang} style={styles.settingLink} onPress={() => { setLanguage(lang); Alert.alert('Language Updated'); setSubModal(null); }}>
                <Text style={styles.settingLinkLabel}>{lang}</Text>{language === lang && <Ionicons name="checkmark-circle" size={20} color={COLORS.indiaGreen} />}
              </TouchableOpacity>
            ))}
          </View></ScrollView></>
        )}
        {subModal === 'password' && (
          <><ModalHeader title="Change Password" onBack={() => setSubModal(null)} onClose={()=>setSubModal(null)}/>
          <ScrollView style={styles.modalContent}><View style={styles.card}>
            <View style={styles.inputGroup}><Text style={styles.inputLabel}>Current Password</Text><TextInput style={styles.input} secureTextEntry={!showPass} /></View>
            <View style={styles.inputGroup}><Text style={styles.inputLabel}>New Password</Text><TextInput style={styles.input} secureTextEntry={!showPass} /></View>
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{marginBottom: 20}}><Text style={{color: COLORS.indiaGreen, fontWeight: '600'}}>{showPass ? 'Hide' : 'Show'}</Text></TouchableOpacity>
            <TouchableOpacity style={styles.btnAction} onPress={() => simulateProcessing('Password changed.', () => setSubModal(null))}><Text style={styles.btnActionText}>Update Password</Text></TouchableOpacity>
          </View></ScrollView></>
        )}
        {subModal === 'privacy' && (
          <><ModalHeader title="Privacy" onBack={() => setSubModal(null)} onClose={()=>setSubModal(null)}/>
          <ScrollView style={styles.modalContent}><View style={styles.card}>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>Profile Visibility</Text><Switch value={toggles.profileVis} onValueChange={() => toggleSwitch('profileVis')} trackColor={{true: COLORS.indiaGreen}} /></View>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>Location Sharing</Text><Switch value={toggles.locShare} onValueChange={() => toggleSwitch('locShare')} trackColor={{true: COLORS.indiaGreen}} /></View>
          </View></ScrollView></>
        )}
        {subModal === 'notifications' && (
          <><ModalHeader title="Notifications" onBack={() => setSubModal(null)} onClose={()=>setSubModal(null)}/>
          <ScrollView style={styles.modalContent}><View style={styles.card}>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>Order Updates</Text><Switch value={toggles.orderNotif} onValueChange={() => toggleSwitch('orderNotif')} trackColor={{true: COLORS.indiaGreen}} /></View>
            <View style={styles.settingRow}><Text style={styles.settingLabel}>Special Offers</Text><Switch value={toggles.offerNotif} onValueChange={() => toggleSwitch('offerNotif')} trackColor={{true: COLORS.indiaGreen}} /></View>
          </View></ScrollView></>
        )}
        {subModal === 'chat' && (
          <><ModalHeader title="Live Chat" onBack={() => setSubModal(null)} onClose={()=>setSubModal(null)}/>
          <View style={[styles.modalContent, {flex: 1, backgroundColor: '#fff', justifyContent: 'flex-end', paddingBottom: 40}]}>
            <View style={{backgroundColor: '#F3F4F6', padding: 15, borderRadius: 15, alignSelf: 'flex-start', maxWidth: '80%', marginBottom: 15}}><Text>Hi! How can MKisans support help you?</Text></View>
            <View style={{flexDirection:'row', alignItems:'center', gap:10, borderTopWidth: 1, borderTopColor: '#F3F4F6', paddingTop: 15}}><TextInput style={[styles.input, {flex: 1, marginBottom: 0}]} placeholder="Type a message..." /><TouchableOpacity style={[styles.iconWrap, {backgroundColor: COLORS.indiaGreen}]}><Ionicons name="send" color="#fff" size={18}/></TouchableOpacity></View>
          </View></>
        )}
        {subModal === 'help_center' && (
          <><ModalHeader title="Help Center" onBack={() => setSubModal(null)} onClose={()=>setSubModal(null)}/>
          <ScrollView style={styles.modalContent}><View style={styles.inputGroup}><TextInput style={styles.input} placeholder="Search help topics..." /></View>
          <View style={styles.card}>{FAQS.map((faq, i) => (<View key={i} style={{marginBottom: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 15}}><Text style={{fontWeight: '700', fontSize: 15, color: COLORS.textPrimary, marginBottom: 5}}>{faq.q}</Text><Text style={{color: COLORS.textSecondary, fontSize: 13}}>{faq.a}</Text></View>))}</View></ScrollView></>
        )}
        {subModal === 'report_issue' && (
          <><ModalHeader title="Report Issue" onBack={() => setSubModal(null)} onClose={()=>setSubModal(null)}/>
          <ScrollView style={styles.modalContent}><View style={styles.card}>
            <View style={styles.inputGroup}><Text style={styles.inputLabel}>Category</Text><TextInput style={styles.input} placeholder="e.g. Delivery, App Error" /></View>
            <View style={styles.inputGroup}><Text style={styles.inputLabel}>Description</Text><TextInput style={[styles.input, {height: 100}]} multiline placeholder="Describe problem..." /></View>
            <TouchableOpacity style={styles.btnAction} onPress={() => simulateProcessing('Issue Submitted', () => setSubModal(null))}><Text style={styles.btnActionText}>Submit</Text></TouchableOpacity>
          </View></ScrollView></>
        )}
        {subModal === 'track_tickets' && (
          <><ModalHeader title="Tickets" onBack={() => setSubModal(null)} onClose={()=>setSubModal(null)}/>
          <ScrollView style={styles.modalContent}><View style={styles.card}><Text style={styles.emptyText}>No open tickets.</Text></View></ScrollView></>
        )}
      </View>
    </Modal>
  );

  // --- WALLET MODAL ---
  const renderWalletModal = () => {
    const filteredTxns = TRANSACTIONS.filter(t => 
      (txnFilter === 'All' || t.type === txnFilter) && 
      (t.type.toLowerCase().includes(txnSearch.toLowerCase()) || t.amount.includes(txnSearch))
    );

    return (
      <Modal visible={activeModal === 'wallet'} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <ModalHeader title={walletView === 'home' ? 'My Wallet' : walletView === 'add' ? 'Add Money' : walletView === 'withdraw' ? 'Withdraw to Bank' : walletView === 'history' ? 'Transaction History' : walletView === 'rewards' ? 'Rewards & Points' : 'Cashback Offers'} onBack={walletView !== 'home' ? () => setWalletView('home') : null} />
          
          <ScrollView style={styles.modalContent}>
            {walletView === 'home' && (
              <>
                <View style={[styles.card, { backgroundColor: COLORS.indiaGreen }]}>
                  <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>Available Balance</Text>
                  <Text style={{ color: '#fff', fontSize: 36, fontWeight: '800', marginVertical: 10 }}>₹1,250.00</Text>
                  <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                    <TouchableOpacity style={styles.walletActionBtn} onPress={() => setWalletView('add')}><Text style={styles.walletActionText}>+ Add Money</Text></TouchableOpacity>
                    <TouchableOpacity style={[styles.walletActionBtn, { backgroundColor: 'transparent', borderWidth: 1, borderColor: '#fff' }]} onPress={() => setWalletView('withdraw')}><Text style={styles.walletActionText}>Withdraw</Text></TouchableOpacity>
                  </View>
                </View>

                <View style={{flexDirection: 'row', gap: 15, marginBottom: SPACING.lg}}>
                  <TouchableOpacity style={styles.walletFeatureCard} onPress={() => setWalletView('history')}><Ionicons name="list" size={24} color={COLORS.indiaGreen} /><Text style={styles.wfText}>History</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.walletFeatureCard} onPress={() => setWalletView('rewards')}><Ionicons name="star" size={24} color={COLORS.saffron} /><Text style={styles.wfText}>Rewards</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.walletFeatureCard} onPress={() => setWalletView('cashback')}><Ionicons name="cash" size={24} color="#3B82F6" /><Text style={styles.wfText}>Cashback</Text></TouchableOpacity>
                </View>

                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Recent Transactions</Text>
                  {TRANSACTIONS.slice(0,3).map((txn, idx) => (
                    <TouchableOpacity key={idx} style={styles.txnRow}>
                      <View style={styles.txnIcon}><Ionicons name={txn.amount.includes('+') ? 'arrow-down' : 'arrow-up'} size={18} color={txn.amount.includes('+') ? COLORS.indiaGreen : COLORS.error} /></View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.txnType}>{txn.type}</Text>
                        <Text style={styles.txnDate}>{txn.date}</Text>
                      </View>
                      <Text style={[styles.txnAmount, { color: txn.amount.includes('+') ? COLORS.indiaGreen : COLORS.textPrimary }]}>{txn.amount}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity onPress={() => setWalletView('history')} style={{marginTop: 15, alignItems:'center'}}><Text style={{color: COLORS.indiaGreen, fontWeight:'700'}}>View All</Text></TouchableOpacity>
                </View>
              </>
            )}

            {walletView === 'add' && (
              <View style={styles.card}>
                <Text style={styles.inputLabel}>Enter Amount (₹)</Text>
                <TextInput style={[styles.input, {fontSize: 24, fontWeight: '800', height: 60}]} keyboardType="number-pad" value={walletAmount} onChangeText={setWalletAmount} placeholder="0" />
                <View style={{flexDirection: 'row', gap: 10, marginTop: 15, marginBottom: 25}}>
                  {['100', '500', '1000'].map(amt => (
                    <TouchableOpacity key={amt} style={styles.quickAmtBtn} onPress={() => setWalletAmount(amt)}><Text style={styles.quickAmtText}>+₹{amt}</Text></TouchableOpacity>
                  ))}
                </View>
                <Text style={styles.inputLabel}>Payment Method</Text>
                <View style={{flexDirection: 'row', gap: 10, marginBottom: 20}}>
                  {['UPI', 'Bank Card'].map(method => (
                    <TouchableOpacity key={method} style={[styles.payMethodBtn, paymentMethod === method && styles.payMethodActive]} onPress={() => setPaymentMethod(method)}><Text style={[styles.payMethodText, paymentMethod === method && {color: COLORS.indiaGreen}]}>{method}</Text></TouchableOpacity>
                  ))}
                </View>
                <TouchableOpacity style={styles.btnAction} onPress={() => simulateProcessing(`₹${walletAmount || 0} added to your wallet!`, () => setWalletView('home'))}>
                  {isProcessing ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnActionText}>Proceed to Pay</Text>}
                </TouchableOpacity>
              </View>
            )}

            {walletView === 'withdraw' && (
              <View style={styles.card}>
                <Text style={{color: COLORS.textSecondary, marginBottom: 15}}>Available for withdrawal: <Text style={{fontWeight:'700', color:COLORS.textPrimary}}>₹1,250.00</Text></Text>
                <Text style={styles.inputLabel}>Withdraw Amount (₹)</Text>
                <TextInput style={[styles.input, {fontSize: 24, fontWeight: '800', height: 60}]} keyboardType="number-pad" value={walletAmount} onChangeText={setWalletAmount} placeholder="0" />
                <View style={{marginTop: 20, marginBottom: 20}}>
                  <Text style={styles.inputLabel}>Transfer to</Text>
                  <TouchableOpacity style={[styles.payMethodBtn, styles.payMethodActive, {flexDirection:'row', justifyContent:'space-between', padding:15}]}>
                    <View><Text style={{fontWeight:'700'}}>State Bank of India</Text><Text style={{color:COLORS.textMuted}}>**** 1234</Text></View>
                    <Ionicons name="checkmark-circle" size={24} color={COLORS.indiaGreen} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.btnAction} onPress={() => simulateProcessing(`₹${walletAmount || 0} withdrawal initiated!`, () => setWalletView('home'))}>
                  {isProcessing ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnActionText}>Confirm Withdraw</Text>}
                </TouchableOpacity>
              </View>
            )}

            {walletView === 'history' && (
              <View style={{marginBottom: 40}}>
                <TextInput style={[styles.input, {marginBottom: 15}]} placeholder="Search transactions..." value={txnSearch} onChangeText={setTxnSearch} />
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: 15}}>
                  {['All', 'Cashback', 'Order', 'Refunds'].map(f => (
                    <TouchableOpacity key={f} style={[styles.filterChip, txnFilter === f && styles.filterChipActive]} onPress={() => setTxnFilter(f)}>
                      <Text style={[styles.filterChipText, txnFilter === f && {color: '#fff'}]}>{f}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                <View style={styles.card}>
                  {filteredTxns.length === 0 ? <Text style={styles.emptyText}>No transactions found.</Text> : filteredTxns.map((txn, idx) => (
                    <TouchableOpacity key={idx} style={styles.txnRow} onPress={() => Alert.alert('Transaction Details', `ID: TXN89${txn.id}\nStatus: Successful\nDate: ${txn.date}`)}>
                      <View style={styles.txnIcon}><Ionicons name={txn.amount.includes('+') ? 'arrow-down' : 'arrow-up'} size={18} color={txn.amount.includes('+') ? COLORS.indiaGreen : COLORS.error} /></View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.txnType}>{txn.type}</Text>
                        <Text style={styles.txnDate}>{txn.date}</Text>
                      </View>
                      <Text style={[styles.txnAmount, { color: txn.amount.includes('+') ? COLORS.indiaGreen : COLORS.textPrimary }]}>{txn.amount}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {walletView === 'rewards' && (
              <View style={styles.card}>
                <View style={{alignItems:'center', marginBottom: 20}}>
                  <Ionicons name="star" size={50} color={COLORS.saffron} />
                  <Text style={{fontSize: 32, fontWeight:'800', marginTop: 10}}>450</Text>
                  <Text style={{color: COLORS.textSecondary}}>Total Reward Points</Text>
                </View>
                <Text style={{fontSize: 12, color: COLORS.textMuted, marginBottom: 5}}>Progress to next VIP Tier (Silver)</Text>
                <View style={styles.progressBar}><View style={[styles.progressFill, {width: '45%', backgroundColor: COLORS.saffron}]} /></View>
                <Text style={{textAlign:'right', fontSize: 11, color: COLORS.textMuted, marginTop: 5}}>450 / 1000 Pts</Text>
                <TouchableOpacity style={[styles.btnAction, {marginTop: 20, backgroundColor: COLORS.saffron}]} onPress={() => Alert.alert('Redeem', 'Redeem 450 points for ₹45 wallet cash?')}>
                  <Text style={styles.btnActionText}>Redeem Points</Text>
                </TouchableOpacity>
              </View>
            )}

            {walletView === 'cashback' && (
              <View>
                {[1,2].map(i => (
                  <TouchableOpacity key={i} style={[styles.card, {backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', borderWidth: 1}]} onPress={() => Alert.alert('Offer Details', 'Get 20% off on your next Organic Vegetables order.')}>
                    <View style={{flexDirection:'row', alignItems:'center', gap: 15}}>
                      <Ionicons name="gift" size={36} color="#EF4444" />
                      <View style={{flex: 1}}>
                        <Text style={{fontSize: 16, fontWeight:'800', color: '#EF4444'}}>20% Cashback</Text>
                        <Text style={{fontSize: 13, color: COLORS.textSecondary, marginTop: 2}}>On Organic Vegetables</Text>
                        <View style={{backgroundColor:'#FEE2E2', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf:'flex-start', marginTop: 8}}><Text style={{fontSize: 10, color: '#EF4444', fontWeight:'700'}}>Expires in 2 days</Text></View>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  // --- SUBSCRIPTIONS MODAL ---
  const renderSubscriptionsModal = () => {
    return (
      <Modal visible={activeModal === 'subscriptions'} animationType="slide" presentationStyle="pageSheet">
        <View style={styles.modalContainer}>
          <ModalHeader title={subView === 'home' ? 'Subscriptions' : subView === 'upgrade' ? 'Upgrade Plan' : subView === 'pause' ? 'Pause Subscription' : subView === 'schedule' ? 'Delivery Schedule' : subView === 'manage' ? 'Manage Plan' : 'Cancel Subscription'} onBack={subView !== 'home' ? () => setSubView('home') : null} />
          
          <ScrollView style={styles.modalContent}>
            {subView === 'home' && (
              <>
                <View style={[styles.card, {backgroundColor: '#EEF2FF', borderColor: '#C7D2FE', borderWidth: 1}]}>
                  <Text style={{fontSize: 14, color: '#4338CA', fontWeight:'700'}}>Subscription Benefits</Text>
                  <View style={{flexDirection:'row', justifyContent:'space-between', marginTop: 15}}>
                    <View style={{alignItems:'center'}}><Text style={{fontSize:18, fontWeight:'800', color:'#3730A3'}}>₹850</Text><Text style={{fontSize:11, color:'#4F46E5'}}>Saved Total</Text></View>
                    <View style={{alignItems:'center'}}><Text style={{fontSize:18, fontWeight:'800', color:'#3730A3'}}>16</Text><Text style={{fontSize:11, color:'#4F46E5'}}>Deliveries</Text></View>
                    <View style={{alignItems:'center'}}><Text style={{fontSize:18, fontWeight:'800', color:'#3730A3'}}>Gold</Text><Text style={{fontSize:11, color:'#4F46E5'}}>Loyalty Tier</Text></View>
                  </View>
                </View>

                {SUBSCRIPTIONS.map((sub, idx) => (
                  <View key={idx} style={styles.card}>
                    <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 10}}>
                      <Text style={{fontSize: 16, fontWeight:'800', color: COLORS.textPrimary}}>{sub.name}</Text>
                      <View style={{backgroundColor: sub.status==='Active'?'#ECFDF5':'#FEF2F2', paddingHorizontal:8, paddingVertical:2, borderRadius:4}}><Text style={{fontSize: 11, fontWeight:'700', color: sub.status==='Active'?COLORS.indiaGreen:COLORS.error}}>{sub.status}</Text></View>
                    </View>
                    <Text style={{fontSize: 13, color: COLORS.textSecondary, marginBottom: 15}}>Next Delivery: <Text style={{fontWeight:'700', color:COLORS.textPrimary}}>{sub.next}</Text></Text>
                    
                    <View style={{flexDirection:'row', flexWrap:'wrap', gap: 10}}>
                      <TouchableOpacity style={[styles.trackBtn, {flex: 1, alignItems:'center'}]} onPress={() => {setSelectedPlan(sub); setSubView('manage');}}><Text style={styles.trackBtnText}>Manage</Text></TouchableOpacity>
                      <TouchableOpacity style={[styles.trackBtn, {flex: 1, alignItems:'center', backgroundColor: '#3B82F6'}]} onPress={() => {setSelectedPlan(sub); setSubView('schedule');}}><Text style={styles.trackBtnText}>Schedule</Text></TouchableOpacity>
                      {sub.status === 'Active' && <TouchableOpacity style={[styles.trackBtn, {flex: 1, alignItems:'center', backgroundColor: '#F3F4F6'}]} onPress={() => {setSelectedPlan(sub); setSubView('pause');}}><Text style={[styles.trackBtnText, {color:COLORS.textPrimary}]}>Pause</Text></TouchableOpacity>}
                    </View>
                    <TouchableOpacity style={{marginTop: 15, alignItems:'center'}} onPress={() => {setSelectedPlan(sub); setSubView('upgrade');}}><Text style={{color:COLORS.indiaGreen, fontWeight:'700'}}>Upgrade Plan</Text></TouchableOpacity>
                  </View>
                ))}
              </>
            )}

            {subView === 'manage' && (
              <View style={styles.card}>
                <Text style={styles.cardTitle}>{selectedPlan?.name}</Text>
                <TouchableOpacity style={styles.settingLink} onPress={() => Alert.alert('Edit', 'Address editor opening...')}><Text style={styles.settingLinkLabel}>Edit Delivery Address</Text><Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} /></TouchableOpacity>
                <TouchableOpacity style={styles.settingLink} onPress={() => Alert.alert('Edit', 'Product editor opening...')}><Text style={styles.settingLinkLabel}>Change Products & Quantities</Text><Ionicons name="chevron-forward" size={18} color={COLORS.textMuted} /></TouchableOpacity>
                <TouchableOpacity style={styles.settingLink} onPress={() => simulateProcessing('Next delivery skipped.', () => setSubView('home'))}><Text style={styles.settingLinkLabel}>Skip Next Delivery</Text><Ionicons name="play-forward" size={18} color={COLORS.textMuted} /></TouchableOpacity>
                <TouchableOpacity style={[styles.settingLink, {borderBottomWidth:0}]} onPress={() => setSubView('cancel')}><Text style={[styles.settingLinkLabel, {color: COLORS.error}]}>Cancel Subscription</Text><Ionicons name="close-circle" size={18} color={COLORS.error} /></TouchableOpacity>
              </View>
            )}

            {subView === 'schedule' && (
              <View style={styles.card}>
                <Text style={{fontSize: 14, fontWeight:'700', marginBottom: 15}}>Select Delivery Days</Text>
                <View style={{flexDirection:'row', justifyContent:'space-between', marginBottom: 25}}>
                  {['S','M','T','W','T','F','S'].map((day, i) => (
                    <TouchableOpacity key={i} style={{width: 36, height: 36, borderRadius: 18, backgroundColor: i===1||i===4 ? COLORS.indiaGreen : '#F3F4F6', justifyContent:'center', alignItems:'center'}}><Text style={{fontWeight:'700', color: i===1||i===4 ? '#fff' : COLORS.textSecondary}}>{day}</Text></TouchableOpacity>
                  ))}
                </View>
                <Text style={{fontSize: 14, fontWeight:'700', marginBottom: 15}}>Select Time Slot</Text>
                <View style={{gap: 10, marginBottom: 25}}>
                  <TouchableOpacity style={[styles.payMethodBtn, styles.payMethodActive]}><Text style={{color:COLORS.indiaGreen, fontWeight:'700'}}>Morning (7 AM - 9 AM)</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.payMethodBtn}><Text style={{color:COLORS.textSecondary, fontWeight:'600'}}>Evening (5 PM - 7 PM)</Text></TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.btnAction} onPress={() => simulateProcessing('Schedule updated!', () => setSubView('home'))}>{isProcessing ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnActionText}>Save Schedule</Text>}</TouchableOpacity>
              </View>
            )}

            {subView === 'upgrade' && (
              <View style={styles.card}>
                <View style={{backgroundColor: '#F0FDF4', padding: 15, borderRadius: 10, borderWidth: 1, borderColor: '#BBF7D0', marginBottom: 15}}>
                  <Text style={{fontSize: 18, fontWeight:'800', color: COLORS.indiaGreen}}>Organic Premium Plan</Text>
                  <Text style={{fontSize: 24, fontWeight:'800', color: COLORS.textPrimary, marginVertical: 10}}>₹2,499<Text style={{fontSize:14, color:COLORS.textMuted}}>/month</Text></Text>
                  <Text style={{fontSize: 13, color: COLORS.textSecondary, marginBottom: 5}}>✓ 100% Certified Organic</Text>
                  <Text style={{fontSize: 13, color: COLORS.textSecondary, marginBottom: 5}}>✓ Free Daily Delivery</Text>
                  <Text style={{fontSize: 13, color: COLORS.textSecondary, marginBottom: 5}}>✓ Zero Packaging Waste</Text>
                </View>
                <TouchableOpacity style={styles.btnAction} onPress={() => simulateProcessing('Plan upgraded successfully!', () => setSubView('home'))}>{isProcessing ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnActionText}>Confirm Upgrade</Text>}</TouchableOpacity>
              </View>
            )}

            {subView === 'pause' && (
              <View style={styles.card}>
                <Text style={styles.inputLabel}>Pause Duration</Text>
                <View style={{flexDirection:'row', gap:10, marginBottom: 20}}>
                  <TouchableOpacity style={[styles.filterChip, styles.filterChipActive]}><Text style={{color:'#fff', fontWeight:'600'}}>1 Week</Text></TouchableOpacity>
                  <TouchableOpacity style={styles.filterChip}><Text style={{color:COLORS.textPrimary, fontWeight:'600'}}>2 Weeks</Text></TouchableOpacity>
                </View>
                <Text style={{fontSize:13, color:COLORS.textSecondary, marginBottom: 20}}>Your subscription will automatically resume on <Text style={{fontWeight:'700'}}>18 May 2026</Text>.</Text>
                <TouchableOpacity style={styles.btnAction} onPress={() => simulateProcessing('Subscription paused.', () => setSubView('home'))}>{isProcessing ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnActionText}>Confirm Pause</Text>}</TouchableOpacity>
              </View>
            )}

            {subView === 'cancel' && (
              <View style={styles.card}>
                <Text style={{fontSize: 16, fontWeight:'700', color: COLORS.error, marginBottom: 15}}>Are you sure?</Text>
                <Text style={styles.inputLabel}>Reason for cancellation</Text>
                <TextInput style={styles.input} placeholder="e.g. Moving out, Too expensive..." />
                <Text style={[styles.inputLabel, {marginTop: 15}]}>Additional Feedback</Text>
                <TextInput style={[styles.input, {height: 80}]} multiline placeholder="Tell us how we can improve..." />
                <TouchableOpacity style={[styles.btnAction, {backgroundColor: COLORS.error, marginTop: 25}]} onPress={() => simulateProcessing('Subscription cancelled.', () => setSubView('home'))}>{isProcessing ? <ActivityIndicator color="#fff"/> : <Text style={styles.btnActionText}>Confirm Cancellation</Text>}</TouchableOpacity>
              </View>
            )}
            <View style={{height: 40}} />
          </ScrollView>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>My Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* HEADER CARD */}
        <View style={styles.headerCard}>
          <View style={styles.headerTop}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: 'https://i.pravatar.cc/150?img=33' }} style={styles.avatar} />
              <TouchableOpacity style={styles.editAvatarBtn} onPress={() => setActiveModal('edit_profile')}><Ionicons name="pencil" size={14} color="#fff" /></TouchableOpacity>
            </View>
            <View style={styles.headerInfo}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={styles.userName}>{editForm.name}</Text>
                <Ionicons name="checkmark-circle" size={18} color={COLORS.indiaGreen} />
              </View>
              <Text style={styles.userId}>ID: {kisan.id || 'CUST-849201'}</Text>
              <View style={styles.vipBadge}>
                <Ionicons name="star" size={12} color="#fff" />
                <Text style={styles.vipText}>VIP Member</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <TouchableOpacity style={styles.statBox} onPress={() => setActiveModal('orders')}><Text style={styles.statValue}>12</Text><Text style={styles.statLabel}>Total Orders</Text></TouchableOpacity>
          <View style={styles.statDivider} />
          <TouchableOpacity style={styles.statBox} onPress={() => {setActiveModal('wallet'); setWalletView('rewards');}}><Text style={styles.statValue}>450</Text><Text style={styles.statLabel}>Reward Pts</Text></TouchableOpacity>
          <View style={styles.statDivider} />
          <View style={styles.statBox}><Text style={styles.statValue}>₹1.2K</Text><Text style={styles.statLabel}>Saved</Text></View>
        </View>

        <View style={styles.sectionsContainer}>
          {renderSectionItem('person', 'Personal Information', 'Edit your details, address, and DOB', () => setActiveModal('edit_profile'), '#3B82F6')}
          {renderSectionItem('cube', 'Order Management', 'Track, return, or buy again', () => setActiveModal('orders'), COLORS.saffron)}
          {renderSectionItem('wallet', 'Wallet & Cashback', 'Check balance and transaction history', () => setActiveModal('wallet'), COLORS.indiaGreen)}
          {renderSectionItem('calendar', 'Subscription Plans', 'Manage your weekly/monthly boxes', () => setActiveModal('subscriptions'), '#8B5CF6')}
          {renderSectionItem('settings', 'App Settings', 'Notifications, Privacy, Language', () => setActiveModal('settings'), '#64748B')}
          {renderSectionItem('headset', 'Customer Support', 'Live chat, FAQ, Help center', () => setActiveModal('support'), '#EC4899')}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {renderEditProfileModal()}
      {renderOrdersModal()}
      {renderWalletModal()}
      {renderSubscriptionsModal()}
      {renderSettingsModal()}
      {renderSupportModal()}
      {renderNestedModals()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  pageHeader: { paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 15, paddingHorizontal: SPACING.xl, backgroundColor: COLORS.white },
  pageTitle: { fontSize: 24, fontWeight: '800', color: COLORS.textPrimary },
  scrollContent: { padding: SPACING.xl },
  headerCard: { backgroundColor: COLORS.white, borderRadius: RADIUS.xl, padding: SPACING.lg, ...SHADOWS.medium },
  headerTop: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  avatarWrap: { position: 'relative' },
  avatar: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: '#F3F4F6' },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.indiaGreen, width: 26, height: 26, borderRadius: 13, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.white },
  headerInfo: { flex: 1 },
  userName: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  userId: { fontSize: 13, color: COLORS.textSecondary, marginTop: 2 },
  vipBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.saffron, paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full, alignSelf: 'flex-start', marginTop: 8 },
  vipText: { fontSize: 11, fontWeight: '700', color: COLORS.white },

  statsContainer: { flexDirection: 'row', backgroundColor: COLORS.white, borderRadius: RADIUS.xl, marginTop: SPACING.lg, paddingVertical: SPACING.lg, ...SHADOWS.small },
  statBox: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: '800', color: COLORS.indiaGreen },
  statLabel: { fontSize: 12, color: COLORS.textSecondary, marginTop: 4 },
  statDivider: { width: 1, backgroundColor: '#F3F4F6' },

  sectionsContainer: { marginTop: SPACING.xl, gap: SPACING.md },
  sectionItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, padding: SPACING.lg, borderRadius: RADIUS.lg, ...SHADOWS.small },
  sectionIconWrap: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  sectionItemInfo: { flex: 1 },
  sectionItemTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary },
  sectionItemSub: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },

  // Modals
  modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.xl, paddingTop: Platform.OS === 'ios' ? 60 : SPACING.xl, backgroundColor: COLORS.white, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  modalTitle: { fontSize: 20, fontWeight: '800', color: COLORS.textPrimary },
  modalContent: { padding: SPACING.xl },
  card: { backgroundColor: COLORS.white, borderRadius: RADIUS.lg, padding: SPACING.lg, marginBottom: SPACING.lg, ...SHADOWS.small },
  cardTitle: { fontSize: 16, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 15 },
  
  orderCard: { borderWidth: 1, borderColor: '#F3F4F6', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  orderId: { fontSize: 14, fontWeight: '700', color: COLORS.textPrimary },
  orderStatus: { fontSize: 12, fontWeight: '700', color: COLORS.indiaGreen, backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
  orderItems: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 10 },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  orderTotal: { fontSize: 15, fontWeight: '800', color: COLORS.textPrimary },
  
  walletActionBtn: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 10, borderRadius: RADIUS.full },
  walletActionText: { color: COLORS.indiaGreen, fontWeight: '700', fontSize: 14 },
  walletFeatureCard: { flex: 1, backgroundColor: COLORS.white, borderRadius: RADIUS.md, padding: 15, alignItems: 'center', ...SHADOWS.small },
  wfText: { fontSize: 12, fontWeight: '600', color: COLORS.textPrimary, marginTop: 8 },

  txnRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  txnIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  txnType: { fontSize: 14, fontWeight: '600', color: COLORS.textPrimary },
  txnDate: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  txnAmount: { fontSize: 15, fontWeight: '700' },

  inputLabel: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary, marginBottom: 6 },
  inputGroup: { marginBottom: 15 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#F3F4F6', borderRadius: RADIUS.md, paddingHorizontal: 15, height: 48, fontSize: 15, color: COLORS.textPrimary },
  quickAmtBtn: { flex: 1, backgroundColor: '#F0FDF4', paddingVertical: 10, borderRadius: RADIUS.md, alignItems: 'center', borderWidth: 1, borderColor: '#BBF7D0' },
  quickAmtText: { color: COLORS.indiaGreen, fontWeight: '700' },
  payMethodBtn: { flex: 1, backgroundColor: '#F8FAFC', paddingVertical: 12, borderRadius: RADIUS.md, alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  payMethodActive: { borderColor: COLORS.indiaGreen, backgroundColor: '#F0FDF4' },
  payMethodText: { fontWeight: '600', color: COLORS.textSecondary },

  filterChip: { backgroundColor: '#F3F4F6', paddingHorizontal: 15, paddingVertical: 8, borderRadius: RADIUS.full, marginRight: 10 },
  filterChipActive: { backgroundColor: COLORS.textPrimary },
  filterChipText: { fontSize: 13, fontWeight: '600', color: COLORS.textSecondary },
  emptyText: { fontSize: 14, color: COLORS.textMuted, fontStyle: 'italic', marginVertical: 10 },
  
  progressBar: { height: 8, backgroundColor: '#F3F4F6', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%' },

  trackBtn: { backgroundColor: COLORS.saffron, paddingHorizontal: 15, paddingVertical: 8, borderRadius: RADIUS.full },
  trackBtnText: { fontSize: 13, fontWeight: '700', color: COLORS.white },

  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  settingLabel: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },
  settingLink: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  settingLinkLabel: { fontSize: 15, color: COLORS.textPrimary, fontWeight: '500' },
  
  btnAction: { backgroundColor: COLORS.indiaGreen, paddingVertical: 14, borderRadius: RADIUS.md, alignItems: 'center', width: '100%' },
  btnActionText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },
  buttonRow: { flexDirection: 'row', gap: 15, marginTop: 10 },
  
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FEF2F2', paddingVertical: 15, borderRadius: RADIUS.lg, marginTop: 10 },
  logoutText: { fontSize: 15, fontWeight: '700', color: COLORS.error },
  iconWrap: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' }
});
