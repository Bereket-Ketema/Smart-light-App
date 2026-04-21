import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface VoiceCommandButtonProps {
  onVoicePress: () => void;
}

export default function VoiceCommandButton({ onVoicePress }: VoiceCommandButtonProps) {
  return (
    <TouchableOpacity 
      style={styles.voiceCard}
      onPress={onVoicePress}
      activeOpacity={0.7}
    >
      <View style={styles.voiceIconContainer}>
        <Ionicons name="mic" size={22} color="#8b5cf6" />
      </View>
      <View style={styles.voiceTextContainer}>
        <Text style={styles.voiceTitle}>Voice Command</Text>
        <Text style={styles.voiceSubtitle}>Say "light on", "light off", or "auto mode"</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color="#475569" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  voiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 18,
  },
  voiceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#8b5cf620',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  voiceTextContainer: {
    flex: 1,
  },
  voiceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 2,
  },
  voiceSubtitle: {
    fontSize: 11,
    color: '#94a3b8',
  },
});