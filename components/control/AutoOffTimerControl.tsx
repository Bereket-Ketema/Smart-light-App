import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AutoOffTimerControlProps {
  timer: number;
  options: number[];
  onTimerChange: (seconds: number) => void;
  getDisplayText: (seconds: number) => string;
}

export default function AutoOffTimerControl({ 
  timer, 
  options, 
  onTimerChange, 
  getDisplayText 
}: AutoOffTimerControlProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="timer-outline" size={22} color="#22c55e" />
        <Text style={styles.cardTitle}>Auto-Off Timer</Text>
      </View>
      <View style={styles.timerContainer}>
        {options.map((seconds) => (
          <TouchableOpacity
            key={seconds}
            style={[
              styles.timerButton,
              timer === seconds && styles.timerButtonActive,
            ]}
            onPress={() => onTimerChange(seconds)}
          >
            <Text style={[
              styles.timerButtonText,
              timer === seconds && styles.timerButtonTextActive,
            ]}>{getDisplayText(seconds)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.timerHint}>
        Light will turn off after {timer} seconds of no motion
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
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timerButton: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  timerButtonActive: {
    backgroundColor: '#22c55e',
  },
  timerButtonText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  timerButtonTextActive: {
    color: 'white',
  },
  timerHint: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
});