import { View, Text, StyleSheet } from 'react-native';

interface ConnectionStatusBarProps {
  isConnected: boolean;
  lastUpdated: Date;
}

export default function ConnectionStatusBar({ isConnected, lastUpdated }: ConnectionStatusBarProps) {
  return (
    <View style={styles.statusBar}>
      <View style={[styles.statusDot, { backgroundColor: isConnected ? '#22c55e' : '#ef4444' }]} />
      <Text style={styles.statusBarText}>{isConnected ? 'Connected' : 'Disconnected'}</Text>
      <View style={styles.separator} />
      <Text style={styles.timestamp}>{lastUpdated.toLocaleTimeString()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    gap: 8,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBarText: {
    fontSize: 11,
    color: '#64748b',
  },
  separator: {
    width: 1,
    height: 10,
    backgroundColor: '#334155',
  },
  timestamp: {
    fontSize: 11,
    color: '#64748b',
  },
});