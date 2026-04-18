// components/MockToggle.tsx

import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MockToggleProps {
  useMock: boolean;
  onToggle: () => void;
}

export default function MockToggle({ useMock, onToggle }: MockToggleProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.mockToggle}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Ionicons 
          name={useMock ? 'construct' : 'wifi'} 
          size={14} 
          color="#94a3b8" 
        />
        <Text style={styles.mockToggleText}>
          {useMock ? 'Mock Mode ON' : 'Mock Mode OFF'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  mockToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  mockToggleText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '500',
  },
});