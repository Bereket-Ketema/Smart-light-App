import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorBannerProps {
  errorMessage: string | null;
}

export default function ErrorBanner({ errorMessage }: ErrorBannerProps) {
  if (!errorMessage) return null;
  
  return (
    <View style={styles.errorBanner}>
      <Ionicons name="alert-circle" size={18} color="#ef4444" />
      <Text style={styles.errorText}>{errorMessage}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef444420',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  errorText: {
    color: '#f87171',
    fontSize: 12,
    fontWeight: '500',
  },
});