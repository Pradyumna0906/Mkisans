import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../theme';

export default function AddCropScreen({ navigation }) {
  // Form State
  const [cropType, setCropType] = useState('');
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

  const handleSave = () => {
    // Validations
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

    if (Platform.OS === 'web') {
      window.alert('Crop added for pre-harvesting successfully!');
      navigation.goBack();
    } else {
      Alert.alert('Success', 'Crop added for pre-harvesting successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Type of Crop Grown *</Text>
            <TextInput style={styles.input} placeholder="e.g., Wheat, Tomato" value={cropType} onChangeText={setCropType} />
          </View>

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
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Water Source</Text>
              <TextInput style={styles.input} placeholder="e.g., Well" value={waterSource} onChangeText={setWaterSource} />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Irrigation Method</Text>
              <TextInput style={styles.input} placeholder="e.g., Drip" value={irrigationMethod} onChangeText={setIrrigationMethod} />
            </View>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Method of Sowing</Text>
            <TextInput style={styles.input} placeholder="e.g., Broadcasting" value={sowingMethod} onChangeText={setSowingMethod} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Harvesting & Sales</Text>
          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Expected Harvest Date</Text>
              <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={harvestDate} onChangeText={setHarvestDate} />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Mode of Harvesting</Text>
              <TextInput style={styles.input} placeholder="e.g., Manual" value={harvestMode} onChangeText={setHarvestMode} />
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

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Crop Info</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: SPACING.md,
    paddingHorizontal: SPACING.xl,
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  backBtn: {
    padding: SPACING.sm,
    marginRight: SPACING.md,
  },
  headerTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: '800',
    color: COLORS.textPrimary,
  },
  scrollContent: {
    padding: SPACING.xl,
    paddingBottom: 100,
  },
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
  inputGroup: {
    marginBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
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
  helperText: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    marginTop: 4,
  },
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
  saveBtnText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
  },
});
