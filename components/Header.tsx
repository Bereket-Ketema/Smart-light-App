import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.headerIconContainer}>
        <Ionicons name="bulb" size={24} color="#fbbf24" />
      </View>
      <Text style={styles.headerTitle}>SmartLight</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginTop: 3,
    marginLeft: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: '700',
    color: '#f1f5f9',
  },
});