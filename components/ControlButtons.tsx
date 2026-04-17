import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ControlButtonsProps {
  onTurnLightOn: () => void;
  onTurnLightOff: () => void;
  onSetAutoMode: () => void;
  isLoading: boolean;
  isConnected: boolean;
}

export default function ControlButtons({
  onTurnLightOn,
  onTurnLightOff,
  onSetAutoMode,
  isLoading,
  isConnected,
}: ControlButtonsProps) {
  return (
    <View style={styles.panel}>
      <Text style={styles.panelTitle}>Controls</Text>
      <View style={styles.buttonGrid}>
        <TouchableOpacity 
          style={[styles.button, styles.onButton, isLoading && styles.disabledButton]}
          onPress={onTurnLightOn}
          disabled={isLoading || !isConnected}
          activeOpacity={0.7}
        >
          <Ionicons name="flash" size={18} color="white" />
          <Text style={styles.buttonText}>On</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.offButton, isLoading && styles.disabledButton]}
          onPress={onTurnLightOff}
          disabled={isLoading || !isConnected}
          activeOpacity={0.7}
        >
          <Ionicons name="flash-off" size={18} color="white" />
          <Text style={styles.buttonText}>Off</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.autoButton, isLoading && styles.disabledButton]}
          onPress={onSetAutoMode}
          disabled={isLoading || !isConnected}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={18} color="white" />
          <Text style={styles.buttonText}>Auto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  panelTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 12,
  },
  buttonGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  onButton: {
    backgroundColor: '#22c55e',
  },
  offButton: {
    backgroundColor: '#ef4444',
  },
  autoButton: {
    backgroundColor: '#3b82f6',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.5,
  },
});