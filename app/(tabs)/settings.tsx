import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { testConnection } from '@/services/api';

export default function SettingsScreen() {
  const [backendUrl, setBackendUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Load saved URL when screen opens
  useEffect(() => {
    loadSavedUrl();
  }, []);

  const loadSavedUrl = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem('backendUrl');
      if (savedUrl) {
        setBackendUrl(savedUrl);
      } else {
        setBackendUrl('http://192.168.1.100:5000');
      }
    } catch (error) {
      console.error('Failed to load URL:', error);
    }
  };

  const saveBackendUrl = async () => {
    if (!backendUrl.trim()) {
      Alert.alert('Error', 'Please enter a valid backend URL');
      return;
    }

    setIsLoading(true);
    try {
      await AsyncStorage.setItem('backendUrl', backendUrl);
      Alert.alert('Success', 'Backend URL saved successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to save backend URL');
    } finally {
      setIsLoading(false);
    }
  };

  const testBackendConnection = async () => {
    if (!backendUrl.trim()) {
      Alert.alert('Error', 'Please enter a backend URL first');
      return;
    }

    setIsTesting(true);
    setIsConnected(false);
    
    try {
      const connected = await testConnection(backendUrl);
      setIsConnected(connected);
      if (connected) {
        Alert.alert('Success', 'Connected to backend successfully!');
      } else {
        Alert.alert('Failed', 'Cannot connect to backend. Check the URL and make sure backend is running.');
      }
    } catch (error) {
      setIsConnected(false);
      Alert.alert('Error', 'Connection test failed');
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >

      <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
      <StatusBar style="light" />
      
      <View style={styles.header}>
        <Ionicons name="settings-outline" size={28} color="#f1f5f9" />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Backend Configuration</Text>
        <Text style={styles.cardSubtitle}>
          Enter the IP address and port of your Flask backend server
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Backend URL</Text>
          <TextInput
            style={styles.input}
            placeholder="http://192.168.1.100:5000"
            placeholderTextColor="#64748b"
            value={backendUrl}
            onChangeText={setBackendUrl}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.inputHint}>
            Example: http://192.168.1.100:5000 or http://localhost:5000
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton, isLoading && styles.disabledButton]}
            onPress={saveBackendUrl}
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="save-outline" size={18} color="white" />
                <Text style={styles.buttonText}>Save</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.testButton, isTesting && styles.disabledButton]}
            onPress={testBackendConnection}
            disabled={isTesting}
            activeOpacity={0.7}
          >
            {isTesting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <Ionicons name="wifi-outline" size={18} color="white" />
                <Text style={styles.buttonText}>Test Connection</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {isConnected && (
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#22c55e" />
            <Text style={styles.statusText}>Connected to backend</Text>
          </View>
        )}
      </View>

      <View style={styles.infoCard}>
        <Ionicons name="information-circle-outline" size={20} color="#64748b" />
        <Text style={styles.infoText}>
          Make sure your Flask backend is running on the same network as your phone.
          Use `ipconfig` (Windows) or `ifconfig` (Mac/Linux) to find your computer's IP address.
        </Text>
      </View>
      </KeyboardAvoidingView>
  </ScrollView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: 8,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 20,
    lineHeight: 18,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94a3b8',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
  },
  inputHint: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 6,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  saveButton: {
    backgroundColor: '#3b82f6',
  },
  testButton: {
    backgroundColor: '#22c55e',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e20',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  statusText: {
    color: '#22c55e',
    fontSize: 13,
    fontWeight: '500',
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
  },
});