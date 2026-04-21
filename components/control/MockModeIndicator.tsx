import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MockModeIndicatorProps {
  visible: boolean;
}

export default function MockModeIndicator({ visible }: MockModeIndicatorProps) {
  if (!visible) return null;
  
  return (
    <View style={styles.mockCard}>
      <Ionicons name="construct" size={18} color="#fbbf24" />
      <Text style={styles.mockCardText}>
        Mock Mode Active - Settings are simulated
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  mockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbbf2420',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  mockCardText: {
    fontSize: 11,
    color: '#fbbf24',
  },
});