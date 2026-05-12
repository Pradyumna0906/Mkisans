import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Platform,
  Modal,
  FlatList,
  Dimensions
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Intelligent Options for Madhya Pradesh
const OPTIONS = {
  cropTypes: [
    { label: 'Soybean (सोयाबीन)', value: 'Soybean' },
    { label: 'Wheat (गेहूं)', value: 'Wheat' },
    { label: 'Gram (Chana - चना)', value: 'Gram' },
    { label: 'Maize (मक्का)', value: 'Maize' },
    { label: 'Mustard (सरसों)', value: 'Mustard' },
    { label: 'Garlic (लहसुन)', value: 'Garlic' },
    { label: 'Onion (प्याज)', value: 'Onion' },
    { label: 'Tomato (टमाटर)', value: 'Tomato' },
    { label: 'Potato (आलू)', value: 'Potato' },
    { label: 'Cotton (कपास)', value: 'Cotton' },
    { label: 'Sugarcane (गन्ना)', value: 'Sugarcane' },
    { label: 'Moong (मूंग)', value: 'Moong' },
    { label: 'Arhar (Tur - अरहर)', value: 'Arhar' },
  ],
  waterSources: [
    { label: 'Borewell Water (बोरवेल)', value: 'Borewell' },
    { label: 'Open Well Water (कुआं)', value: 'Open Well' },
    { label: 'Rainwater (वर्षा जल)', value: 'Rainwater' },
    { label: 'Canal Water (नहर)', value: 'Canal' },
    { label: 'Tube Well Water (ट्यूबवेल)', value: 'Tube Well' },
    { label: 'River Water (नदी)', value: 'River' },
    { label: 'Dam Reservoir (बाँध)', value: 'Dam' },
  ],
  irrigationMethods: [
    { label: 'Surface Irrigation (सतही सिंचाई)', value: 'Surface' },
    { label: 'Sprinkler Irrigation (फव्वारा सिंचाई)', value: 'Sprinkler' },
    { label: 'Drip Irrigation (टपक सिंचाई)', value: 'Drip' },
    { label: 'Flood Irrigation (प्लावन सिंचाई)', value: 'Flood' },
    { label: 'Furrow Irrigation (नाली सिंचाई)', value: 'Furrow' },
  ],
  sowingMethods: [
    { label: 'Seed Drill Method (सीड ड्रिल)', value: 'Seed Drill' },
    { label: 'Broadcasting Method (छिटकवाँ विधि)', value: 'Broadcasting' },
    { label: 'Drilling Method (ड्रिलिंग)', value: 'Drilling' },
    { label: 'Transplanting Method (रोपणी विधि)', value: 'Transplanting' },
    { label: 'Dibbling Method (डिबलिंग)', value: 'Dibbling' },
  ],
  harvestModes: [
    { label: 'Manual Harvesting (हाथ से कटाई)', value: 'Manual' },
    { label: 'Mechanical Harvesting (मशीन से कटाई)', value: 'Mechanical' },
    { label: 'Timely Harvesting (समय पर कटाई)', value: 'Timely' },
    { label: 'Dry Harvesting (सूखी कटाई)', value: 'Dry' },
  ],
  seasons: [
    { label: 'Kharif (खरीफ)', value: 'Kharif' },
    { label: 'Rabi (रबी)', value: 'Rabi' },
    { label: 'Zaid (जायद)', value: 'Zaid' },
  ]
};

export default function AddCropScreen({ navigation }) {
  // Form State
  const [cropType, setCropType] = useState('');
  const [season, setSeason] = useState('');
  const [totalLand, setTotalLand] = useState('');
  const [landUsed, setLandUsed] = useState('');
  const [fertilizers, setFertilizers] = useState('');
  const [pesticides, setPesticides] = useState('');
  const [waterSource, setWaterSource] = useState('');
  const [irrigationMethod, setIrrigationMethod] = useState('');
  const [sowingMethod, setSowingMethod] = useState('');
  const [harvestDate, setHarvestDate] = useState('');
  const [harvestMode, setHarvestMode] = useState('');
  const [totalProduction, setTotalProduction] = useState('');
  const [preHarvestSaleAmount, setPreHarvestSaleAmount] = useState('');

  // Picker State
  const [pickerVisible, setPickerVisible] = useState(false);
  const [pickerType, setPickerType] = useState(null); // 'cropTypes', 'waterSources', etc.
  const [pickerTitle, setPickerTitle] = useState('');

  const openPicker = (type, title) => {
    setPickerType(type);
    setPickerTitle(title);
    setPickerVisible(true);
  };

  const handleSelect = (value) => {
    switch (pickerType) {
      case 'cropTypes': setCropType(value); break;
      case 'waterSources': setWaterSource(value); break;
      case 'irrigationMethods': setIrrigationMethod(value); break;
      case 'sowingMethods': setSowingMethod(value); break;
      case 'harvestModes': setHarvestMode(value); break;
      case 'seasons': setSeason(value); break;
    }
    setPickerVisible(false);
  };

  const handleSave = async () => {
    if (!cropType || !totalLand || !landUsed || !totalProduction || !preHarvestSaleAmount) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (parseFloat(landUsed) > parseFloat(totalLand)) {
      Alert.alert('Error', 'Land used cannot be more than total land');
      return;
    }

    const maxSaleAmount = parseFloat(totalProduction) * 0.3;
    if (parseFloat(preHarvestSaleAmount) > maxSaleAmount) {
      Alert.alert('Error', `Pre-harvest sale amount cannot exceed 30% of total production (${maxSaleAmount.toFixed(2)})`);
      return;
    }

    try {
      const newCrop = {
        id: Date.now().toString(),
        name: cropType,
        qty: `${totalProduction} क्विंटल`,
        status: 'pre-harvest',
        price: '₹ --',
        details: {
          season,
          landUsed,
          fertilizers,
          pesticides,
          waterSource,
          irrigationMethod,
          sowingMethod,
          harvestDate,
          harvestMode,
          preHarvestSaleAmount
        }
      };

      const existingCropsJson = await AsyncStorage.getItem('user_crops');
      const existingCrops = existingCropsJson ? JSON.parse(existingCropsJson) : [];
      const updatedCrops = [newCrop, ...existingCrops];
      await AsyncStorage.setItem('user_crops', JSON.stringify(updatedCrops));

      if (Platform.OS === 'web') {
        window.alert('Crop added successfully!');
        navigation.goBack();
      } else {
        Alert.alert('Success', 'Crop added successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save crop information');
    }
  };

  const SelectInput = ({ label, value, placeholder, onPress, icon }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity style={styles.selector} onPress={onPress}>
        <View style={styles.selectorContent}>
          {icon && <MaterialCommunityIcons name={icon} size={20} color={COLORS.primary} style={{marginRight: 8}} />}
          <Text style={[styles.selectorText, !value && { color: COLORS.textMuted }]}>
            {value || placeholder}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Crop (Pre-Harvest)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Info</Text>
          
          <SelectInput 
            label="Type of Crop Grown *" 
            value={cropType} 
            placeholder="Select Crop" 
            onPress={() => openPicker('cropTypes', 'Select Crop')}
            icon="seed"
          />

          <SelectInput 
            label="Crop Season" 
            value={season} 
            placeholder="Select Season" 
            onPress={() => openPicker('seasons', 'Select Season')}
            icon="weather-sunny"
          />

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Total Land (Acres) *</Text>
              <TextInput style={styles.input} placeholder="e.g., 10" keyboardType="numeric" value={totalLand} onChangeText={setTotalLand} />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Land Used (Acres) *</Text>
              <TextInput style={styles.input} placeholder="e.g., 5" keyboardType="numeric" value={landUsed} onChangeText={setLandUsed} />
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Farming Details</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type of Fertilizers</Text>
            <TextInput style={styles.input} placeholder="e.g., Urea, Organic" value={fertilizers} onChangeText={setFertilizers} />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pesticide Used</Text>
            <TextInput style={styles.input} placeholder="e.g., Neem Oil" value={pesticides} onChangeText={setPesticides} />
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <SelectInput 
                label="Water Source" 
                value={waterSource} 
                placeholder="Select Source" 
                onPress={() => openPicker('waterSources', 'Water Source')}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <SelectInput 
                label="Irrigation Method" 
                value={irrigationMethod} 
                placeholder="Select Method" 
                onPress={() => openPicker('irrigationMethods', 'Irrigation Method')}
              />
            </View>
          </View>
          
          <SelectInput 
            label="Method of Sowing" 
            value={sowingMethod} 
            placeholder="Select Sowing Method" 
            onPress={() => openPicker('sowingMethods', 'Sowing Method')}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Harvesting & Sales</Text>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Expected Harvest Date</Text>
              <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={harvestDate} onChangeText={setHarvestDate} />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <SelectInput 
                label="Mode of Harvesting" 
                value={harvestMode} 
                placeholder="Select Mode" 
                onPress={() => openPicker('harvestModes', 'Harvest Mode')}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Total Production (Expected in Quintal) *</Text>
            <TextInput style={styles.input} placeholder="e.g., 50" keyboardType="numeric" value={totalProduction} onChangeText={setTotalProduction} />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Pre-Harvest Sale Amount (Max 30%) *</Text>
            <TextInput style={styles.input} placeholder="e.g., 10" keyboardType="numeric" value={preHarvestSaleAmount} onChangeText={setPreHarvestSaleAmount} />
            {totalProduction ? (
              <Text style={styles.helperText}>Max allowed: {(parseFloat(totalProduction || 0) * 0.3).toFixed(2)} Quintal</Text>
            ) : null}
          </View>
        </View>

      </ScrollView>

      {/* Modern Picker Modal */}
      <Modal
        visible={pickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{pickerTitle}</Text>
              <TouchableOpacity onPress={() => setPickerVisible(false)}>
                <Ionicons name="close" size={24} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={OPTIONS[pickerType] || []}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  style={styles.optionItem} 
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={[styles.optionText, cropType === item.value && { color: COLORS.primary, fontWeight: '700' }]}>
                    {item.label}
                  </Text>
                  { (cropType === item.value || waterSource === item.value || irrigationMethod === item.value || sowingMethod === item.value || harvestMode === item.value || season === item.value) && 
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                  }
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          </View>
        </View>
      </Modal>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Crop Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  backBtn: { padding: SPACING.sm, marginRight: SPACING.md },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.textPrimary },
  scrollContent: { padding: SPACING.xl, paddingBottom: 120 },
  section: {
    marginBottom: SPACING.xl,
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  inputGroup: { marginBottom: SPACING.md },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    minHeight: 45,
  },
  selectorContent: { flexDirection: 'row', alignItems: 'center' },
  selectorText: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
  helperText: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 4 },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.xl,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveBtn: {
    backgroundColor: COLORS.indiaGreen,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  saveBtnText: { color: COLORS.white, fontSize: FONTS.sizes.lg, fontWeight: '700' },
  
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    maxHeight: SCREEN_HEIGHT * 0.7,
    paddingTop: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.textPrimary },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  optionText: { fontSize: FONTS.sizes.md, color: COLORS.textPrimary },
});

