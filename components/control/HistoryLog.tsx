import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HistoryLogProps {
  logs: { time: string; action: string }[];
  onClear: () => void;
}

export default function HistoryLog({ logs, onClear }: HistoryLogProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="time-outline" size={22} color="#f59e0b" />
        <Text style={styles.cardTitle}>Activity History</Text>
        <TouchableOpacity onPress={onClear} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      {logs.length === 0 ? (
        <Text style={styles.historyEmpty}>No activity yet</Text>
      ) : (
        logs.map((entry, index) => (
          <View key={index} style={styles.historyEntry}>
            <Text style={styles.historyTime}>{entry.time}</Text>
            <Text style={styles.historyAction}>{entry.action}</Text>
          </View>
        ))
      )}
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
  clearButton: {
    backgroundColor: '#ef444420',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#f87171',
    fontSize: 10,
    fontWeight: '500',
  },
  historyEmpty: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 12,
    paddingVertical: 20,
  },
  historyEntry: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 12,
  },
  historyTime: {
    fontSize: 11,
    color: '#64748b',
    width: 70,
  },
  historyAction: {
    fontSize: 12,
    color: '#f1f5f9',
    flex: 1,
  },
});