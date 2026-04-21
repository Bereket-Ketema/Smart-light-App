import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ConnectionStatusCardProps {
  isConnected: boolean;
  useMock: boolean;
}

export default function ConnectionStatusCard({ isConnected, useMock }: ConnectionStatusCardProps) {
  return (
    <View style={styles.connectionCard}>
      <View style={[styles.connectionDot, { backgroundColor: isConnected ? '#22c55e' : '#ef4444' }]} />
      <Text style={styles.connectionText}>
        {isConnected ? 'Connected to backend' : useMock ? 'Mock Mode Active' : 'Disconnected'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  connectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionText: {
    fontSize: 12,
    color: '#94a3b8',
  },
});