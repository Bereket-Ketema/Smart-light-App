import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MotionSensitivityControlProps {
  value: string;
  options: { label: string; value: string; probability: number; delay: number }[];
  probability: number;
  onSensitivityChange: (value: string) => void;
}

export default function MotionSensitivityControl({ 
  value, 
  options, 
  probability, 
  onSensitivityChange 
}: MotionSensitivityControlProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="walk-outline" size={22} color="#8b5cf6" />
        <Text style={styles.cardTitle}>Motion Sensitivity</Text>
      </View>
      <View style={styles.sensitivityContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.sensitivityButton,
              value === option.value && styles.sensitivityButtonActive,
            ]}
            onPress={() => onSensitivityChange(option.value)}
          >
            <Text style={[
              styles.sensitivityButtonText,
              value === option.value && styles.sensitivityButtonTextActive,
            ]}>{option.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.sensitivityBar}>
        <View style={[styles.sensitivityFill, { width: `${probability}%` }]} />
      </View>
      <Text style={styles.sensitivityHint}>
        Detection probability: {probability}%
      </Text>
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
  sensitivityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sensitivityButton: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  sensitivityButtonActive: {
    backgroundColor: '#8b5cf6',
  },
  sensitivityButtonText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  sensitivityButtonTextActive: {
    color: 'white',
  },
  sensitivityBar: {
    height: 6,
    backgroundColor: '#0f172a',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  sensitivityFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
  },
  sensitivityHint: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
});