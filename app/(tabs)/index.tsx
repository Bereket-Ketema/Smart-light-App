import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  turnLightOn, 
  turnLightOff, 
  setAutoMode, 
  getLightStatus, 
  sendVoiceCommand,
  testConnection 
} from '@/services/api';

export default function HomePage() {
  const [lightStatus, setLightStatus] = useState('off');
  const [mode, setMode] = useState('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  //const [mockMotion, setMockMotion] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [backendUrl, setBackendUrl] = useState('http://192.168.1.100:5000');

  // Test connection to backend when app starts
  useEffect(() => {
    const checkConnection = async () => {
      const connected = await testConnection(backendUrl);
      setIsConnected(connected);
      if (connected) {
        // Fetch initial status
        fetchStatus();
      } else {
        setErrorMessage('Cannot connect to backend. Check settings.');
      }
    };
    checkConnection();
  }, []);

  // Poll status every 2 seconds when connected
  useEffect(() => {
    if (!isConnected) return;
    
    const interval = setInterval(() => {
      fetchStatus();
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isConnected]);

  // Add this effect to poll status every 2 seconds
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await getLightStatus();
        setLightStatus(response.status);
        setMode(response.mode);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Polling failed:', error);
      }
    };

    const interval = setInterval(fetchStatus, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (mode === 'auto') {
      const interval = setInterval(() => {
        // Randomly simulate motion every 5 seconds for testing
        const motionDetected = Math.random() > 0.7;
        if (motionDetected) {
          setLightStatus('on');
        } else {
          setLightStatus('off');
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  useEffect(() => {
    const loadConfig = async () => {
      try {
        const savedUrl = await AsyncStorage.getItem('backendUrl');
        if (savedUrl) {
          setBackendUrl(savedUrl);
          console.log('Loaded backend URL:', savedUrl);
        }
      } catch (error) {
        console.error('Failed to load backend URL', error);
      }
    };
    loadConfig();
  }, []);

  // Save backend URL whenever it changes
  const saveBackendUrl = async (url: string) => {
    try {
      await AsyncStorage.setItem('backendUrl', url);
      setBackendUrl(url);
      console.log('Saved backend URL:', url);
    } catch (error) {
      console.error('Failed to save backend URL', error);
    }
  };

  const fetchStatus = async () => {
    try {
      const response = await getLightStatus(backendUrl);
      setLightStatus(response.status);
      setMode(response.mode);
      setLastUpdated(new Date());
      setErrorMessage(null);
    } catch (error) {
      console.error('Failed to fetch status:', error);
      setIsConnected(false);
    }
  };

  const handleTurnLightOn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await turnLightOn(backendUrl);
      setLightStatus(response.status);
      setMode(response.mode);
      setLastUpdated(new Date());
    } catch (error) {
      setErrorMessage('Failed to turn light on');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTurnLightOff = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await turnLightOff(backendUrl);
      setLightStatus(response.status);
      setMode(response.mode);
      setLastUpdated(new Date());
    } catch (error) {
      setErrorMessage('Failed to turn light off');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSetAutoMode = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await setAutoMode(backendUrl);
      setLightStatus(response.status);
      setMode(response.mode);
      setLastUpdated(new Date());
    } catch (error) {
      setErrorMessage('Failed to set auto mode');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceCommand = async (commandText: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const response = await sendVoiceCommand(commandText, backendUrl);
      setLightStatus(response.status);
      setMode(response.mode);
      setLastUpdated(new Date());
    } catch (error) {
      setErrorMessage('Voice command failed');
    } finally {
      setIsLoading(false);
    }
  };

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
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIconContainer}>
            <Ionicons name="bulb" size={24} color="#fbbf24" />
          </View>
          <Text style={styles.headerTitle}>SmartSimLight</Text>
        </View>

        {/* Error Message Banner */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#ef4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        {/* Status Card */}
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

        {/* Control Panel */}
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Controls</Text>
          <View style={styles.buttonGrid}>
          <TouchableOpacity 
              style={[styles.button, styles.onButton, isLoading && styles.disabledButton]}
              onPress={handleTurnLightOn}
              disabled={isLoading || !isConnected}
              activeOpacity={0.7}
            >
              <Ionicons name="flash" size={18} color="white" />
              <Text style={styles.buttonText}>On</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.offButton, isLoading && styles.disabledButton]}
              onPress={handleTurnLightOff}
              disabled={isLoading || !isConnected}
              activeOpacity={0.7}
            >
              <Ionicons name="flash-off" size={18} color="white" />
              <Text style={styles.buttonText}>Off</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.autoButton, isLoading && styles.disabledButton]}
              onPress={handleSetAutoMode}
              disabled={isLoading || !isConnected}
              activeOpacity={0.7}
            >
              <Ionicons name="refresh" size={18} color="white" />
              <Text style={styles.buttonText}>Auto</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Voice Section */}
        <TouchableOpacity 
          style={styles.voiceCard}
          onPress={() => handleVoiceCommand('auto mode')} // Change this to open voice input
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

        {/* Status Bar */}
        <View style={styles.statusBar}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? '#22c55e' : '#ef4444' }]} />
          <Text style={styles.statusBarText}>{isConnected ? 'Connected' : 'Disconnected'}</Text>
          <View style={styles.separator} />
          <Text style={styles.timestamp}>{lastUpdated.toLocaleTimeString()}</Text>
        </View>
      </ScrollView>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#3b82f6" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
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
    fontSize: 20,
    fontWeight: '700',
    color: '#f1f5f9',
  },
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
    backgroundColor: '#22c55e',
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#0f172a80',
    alignItems: 'center',
    justifyContent: 'center',
  },
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