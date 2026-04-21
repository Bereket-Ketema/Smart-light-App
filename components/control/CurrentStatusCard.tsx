import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CurrentStatusCardProps {
  lightStatus: string;
  mode: string;
  sensitivity: string;
  timer: number;
}

export default function CurrentStatusCard({ lightStatus, mode, sensitivity, timer }: CurrentStatusCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="information-circle-outline" size={22} color="#3b82f6" />
        <Text style={styles.cardTitle}>Current Status</Text>
      </View>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Light:</Text>
        <Text style={[styles.statusValue, { color: lightStatus === 'on' ? '#22c55e' : '#ef4444' }]}>
          {lightStatus === 'on' ? 'ON' : 'OFF'}
        </Text>
      </View>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Mode:</Text>
        <Text style={[styles.statusValue, { color: mode === 'auto' ? '#3b82f6' : '#8b5cf6' }]}>
          {mode === 'auto' ? 'Auto Mode' : 'Manual Mode'}
        </Text>
      </View>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Sensitivity:</Text>
        <Text style={styles.statusValue}>{sensitivity}</Text>
      </View>
      <View style={styles.statusRow}>
        <Text style={styles.statusLabel}>Timer:</Text>
        <Text style={styles.statusValue}>{timer} seconds</Text>
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
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  statusLabel: {
    fontSize: 13,
    color: '#94a3b8',
  },
  statusValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f1f5f9',
  },
});