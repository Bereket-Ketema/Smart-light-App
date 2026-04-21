import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BrightnessControlProps {
  brightness: number;
  onBrightnessChange: (value: number) => void;
}

const brightnessOptions = [0, 20, 40, 60, 80, 100];

export default function BrightnessControl({ brightness, onBrightnessChange }: BrightnessControlProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="sunny-outline" size={22} color="#fbbf24" />
        <Text style={styles.cardTitle}>Brightness</Text>
      </View>
      <Text style={styles.brightnessValue}>{brightness}%</Text>
      <View style={styles.brightnessContainer}>
        {brightnessOptions.map((value) => (
          <TouchableOpacity
            key={value}
            style={[
              styles.brightnessButton,
              brightness === value && styles.brightnessButtonActive,
            ]}
            onPress={() => onBrightnessChange(value)}
          >
            <Text style={[
              styles.brightnessButtonText,
              brightness === value && styles.brightnessButtonTextActive,
            ]}>{value}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.brightnessBar}>
        <View style={[styles.brightnessFill, { width: `${brightness}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    flex: 1,
  },
  brightnessValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 16,
  },
  brightnessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brightnessButton: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  brightnessButtonActive: {
    backgroundColor: '#fbbf24',
  },
  brightnessButtonText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  brightnessButtonTextActive: {
    color: '#0f172a',
    fontWeight: '700',
  },
  brightnessBar: {
    height: 6,
    backgroundColor: '#0f172a',
    borderRadius: 3,
    overflow: 'hidden',
  },
  brightnessFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 3,
  },
});