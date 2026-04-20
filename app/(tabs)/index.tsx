import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';

// Components
import Header from '@/components/Header';
import LightStatus from '@/components/LightStatus';
import ControlButtons from '@/components/ControlButtons';
import VoiceCommandButton from '@/components/VoiceCommandButton';
import MockToggle from '@/components/MockToggle';

// Services
import { 
  turnLightOn, 
  turnLightOff, 
  getLightStatus,
  setAutoMode, 
  sendVoiceCommand,
  testConnection 
} from '@/services/api';

// Hooks
import { useApi } from '@/hooks/useApi';

// Constants
import { CONFIG } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';

const USE_MOCK_DATA = true;

export default function HomePage() {
  const [lightStatus, setLightStatus] = useState('off');
  const [mode, setMode] = useState('auto');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [useMock, setUseMock] = useState(USE_MOCK_DATA);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [backendUrl, setBackendUrl] = useState('http://192.168.1.100:5000');

  // Test connection to backend when app starts
  useEffect(() => {
    const checkConnection = async () => {
      if (useMock) {
        setIsConnected(true);
        setErrorMessage(null);
        return;
      }
      
      const connected = await testConnection(backendUrl);
      setIsConnected(connected);
      if (connected) {
        fetchStatus();
        setErrorMessage(null);
      } else {
        // Show error in the banner but don't log to console
        setErrorMessage('Cannot connect to backend. Please check settings.');
      }
    };
    checkConnection();
  }, [useMock, backendUrl]);



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
        }
      } catch (error) {
        // Silent fail - keep default URL
      }
    };
    loadConfig();
  }, []);

  // Reload config when screen comes into focus (after returning from Settings)
  useFocusEffect(
    React.useCallback(() => {
      const reloadConfig = async () => {
        try {
          const savedUrl = await AsyncStorage.getItem('backendUrl');
          if (savedUrl && savedUrl !== backendUrl) {
            setBackendUrl(savedUrl);
            // Re-check connection with new URL
            if (!useMock) {
              const connected = await testConnection(savedUrl);
              setIsConnected(connected);
              if (connected) {
                setErrorMessage(null);
                fetchStatus();
              } else {
                setErrorMessage('Cannot connect to backend. Check settings.');
              }
            }
          }
        } catch (error) {
          // Silent fail
        }
      };
      reloadConfig();
    }, [backendUrl, useMock])
  );


  // Re-check connection when backendUrl changes
  useEffect(() => {
    if (useMock) return;
    
    const checkConnection = async () => {
      const connected = await testConnection(backendUrl);
      setIsConnected(connected);
      if (!connected) {
        setErrorMessage('Cannot connect to backend. Check settings.');
      } else {
        setErrorMessage(null);
        fetchStatus();
      }
    };
    
    checkConnection();
  }, [backendUrl]);

  // MOCK MOTION SIMULATION - COMMENT THIS ENTIRE BLOCK WHEN BACKEND IS READY
  useEffect(() => {
    if (!useMock) return;
    if (mode !== 'auto') return;
  
    const interval = setInterval(() => {
      const motionDetected = Math.random() > 0.7;
      
      if (motionDetected && mode === 'auto') {
        setLightStatus('on');
        setTimeout(() => {
          if (mode === 'auto') {
            setLightStatus('off');
          }
        }, 3000);
      }
      setLastUpdated(new Date());
    }, 5000);
  
    return () => clearInterval(interval);
  }, [mode, useMock]);

  useEffect(() => {
    if (!isConnected || useMock) return; // Don't poll when mock mode is on
    
    const interval = setInterval(() => {
      fetchStatus();
    }, 2000);
    
    return () => clearInterval(interval);
  }, [isConnected, useMock]);

  // API hook for loading and error management
  const { isLoading: apiLoading, error: apiError, execute, clearError } = useApi({
    onError: (err) => setErrorMessage(err.message),
  });

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
    // MOCK BLOCK - Skip real API call when using mock
    if (useMock) {
      setLastUpdated(new Date());
      return;
    }
    // END MOCK BLOCK
    
    try {
      const response = await getLightStatus(backendUrl);
      setLightStatus(response.status);
      setMode(response.mode);
      setLastUpdated(new Date());
      setErrorMessage(null);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const handleTurnLightOn = async () => {
    if (apiLoading) return;
    
    setErrorMessage(null);
    
    if (useMock) {
      setTimeout(() => {
        setLightStatus('on');
        setMode('manual');
        setLastUpdated(new Date());
      }, CONFIG.MOCK_DELAY_MS);
      return;
    }
    
    const result = await execute(() => turnLightOn(backendUrl));
    if (result) {
      setLightStatus(result.status as 'on' | 'off');
      setMode(result.mode as 'auto' | 'manual');
      setLastUpdated(new Date());
    }
  };

  const handleTurnLightOff = async () => {
    if (apiLoading) return;
    
    setErrorMessage(null);
    
    if (useMock) {
      setTimeout(() => {
        setLightStatus('off');
        setMode('manual');
        setLastUpdated(new Date());
      }, CONFIG.MOCK_DELAY_MS);
      return;
    }
    
    const result = await execute(() => turnLightOff(backendUrl));
    if (result) {
      setLightStatus(result.status as 'on' | 'off');
      setMode(result.mode as 'auto' | 'manual');
      setLastUpdated(new Date());
    }
  };

  const handleSetAutoMode = async () => {
    if (apiLoading) return;
    
    setErrorMessage(null);
    
    if (useMock) {
      setTimeout(() => {
        setMode('auto');
        setLastUpdated(new Date());
      }, CONFIG.MOCK_DELAY_MS);
      return;
    }
    
    const result = await execute(() => setAutoMode(backendUrl));
    if (result) {
      setLightStatus(result.status as 'on' | 'off');
      setMode(result.mode as 'auto' | 'manual');
      setLastUpdated(new Date());
    }
  };
  
  const handleVoiceCommand = async (commandText: string) => {
    if (apiLoading) return;
    
    setErrorMessage(null);
    
    if (useMock) {
      setTimeout(() => {
        const lowerCommand = commandText.toLowerCase();
        if (lowerCommand.includes('on')) {
          setLightStatus('on');
          setMode('manual');
        } else if (lowerCommand.includes('off')) {
          setLightStatus('off');
          setMode('manual');
        } else if (lowerCommand.includes('auto')) {
          setMode('auto');
        }
        setLastUpdated(new Date());
      }, CONFIG.MOCK_DELAY_MS);
      return;
    }
    
    const result = await execute(() => sendVoiceCommand(commandText, backendUrl));
    if (result) {
      setLightStatus(result.status as 'on' | 'off');
      setMode(result.mode as 'auto' | 'manual');
      setLastUpdated(new Date());
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
        <Header/>

        {/* Error Message Banner */}
        {errorMessage && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#ef4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <LightStatus lightStatus={lightStatus} mode={mode} />

        {/* Control Panel */}
        <ControlButtons 
          onTurnLightOn={handleTurnLightOn}
          onTurnLightOff={handleTurnLightOff}
          onSetAutoMode={handleSetAutoMode}
          isLoading={apiLoading}
          isConnected={isConnected}
        />

        <VoiceCommandButton onVoicePress={() => handleVoiceCommand('auto mode')} />

        {/* Status Bar */}
        <View style={styles.statusBar}>
          <View style={[styles.statusDot, { backgroundColor: isConnected ? '#22c55e' : '#ef4444' }]} />
          <Text style={styles.statusBarText}>{isConnected ? 'Connected' : 'Disconnected'}</Text>
          <View style={styles.separator} />
          <Text style={styles.timestamp}>{lastUpdated.toLocaleTimeString()}</Text>
        </View>

        <MockToggle 
          useMock={useMock} 
          onToggle={() => {
            setUseMock(!useMock);
            setErrorMessage(null);
            if (!useMock) {
              setIsConnected(true);
            }
          }} 
        />
      </ScrollView>

      {apiLoading && (
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