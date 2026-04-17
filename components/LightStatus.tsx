import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LightStatusProps {
  lightStatus: string;
  mode: string;
}

export default function LightStatus({ lightStatus, mode }: LightStatusProps) {
  const getStatusDisplay = () => {
    if (mode === 'auto') {
      return { text: 'Auto Mode', subtitle: 'Motion controlled', color: '#3b82f6' };
    }
    if (lightStatus === 'on') {
      return { text: 'Light On', subtitle: 'Manual mode', color: '#22c55e' };
    }
    return { text: 'Light Off', subtitle: 'Manual mode', color: '#ef4444' };
  };

  const statusDisplay = getStatusDisplay();

  return (
    <View style={styles.statusCard}>
      <View style={[styles.statusIconContainer, { backgroundColor: statusDisplay.color + '15' }]}>
        <Ionicons 
          name={lightStatus === 'on' ? 'bulb' : 'bulb-outline'} 
          size={48} 
          color={statusDisplay.color} 
        />
      </View>
      <Text style={[styles.statusText, { color: statusDisplay.color }]}>
        {statusDisplay.text}
      </Text>
      <Text style={styles.statusSubtitle}>{statusDisplay.subtitle}</Text>
      
      {mode === 'auto' && (
        <View style={styles.motionBadge}>
          <Ionicons name="walk-outline" size={12} color="#3b82f6" />
          <Text style={styles.motionBadgeText}>Waiting for motion</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statusCard: {
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: 'center',
  },
  statusIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statusText: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
  },
  motionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f620',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginTop: 12,
    gap: 4,
  },
  motionBadgeText: {
    color: '#60a5fa',
    fontSize: 11,
    fontWeight: '500',
  },
});