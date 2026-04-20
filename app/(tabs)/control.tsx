import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Services
import { getLightStatus, testConnection } from '@/services/api';

// Constants
import { CONFIG } from '@/constants/config';

export default function ControlPage() {
  const [lightStatus, setLightStatus] = useState('off');
  const [mode, setMode] = useState('auto');
  const [isConnected, setIsConnected] = useState(false);
  const [useMock, setUseMock] = useState(true);
  const [backendUrl, setBackendUrl] = useState(CONFIG.DEFAULT_BACKEND_URL);
  const [isLoading, setIsLoading] = useState(false);
  
  // Advanced settings
  const [brightness, setBrightness] = useState(70);
  const [motionSensitivity, setMotionSensitivity] = useState('medium');
  const [autoOffTimer, setAutoOffTimer] = useState(10);
  const [historyLog, setHistoryLog] = useState<{ time: string; action: string }[]>([]);
  
  // Sensitivity options
  const sensitivityOptions = [
    { label: 'Low', value: 'low', probability: 0.3, delay: 5000 },
    { label: 'Medium', value: 'medium', probability: 0.5, delay: 3000 },
    { label: 'High', value: 'high', probability: 0.8, delay: 1000 },
  ];
  
  // Timer options (seconds)
  const timerOptions = [5, 10, 30, 60];

  // Load config on start
  useEffect(() => {
    loadConfig();
    checkConnection();
  }, []);

  const loadConfig = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem('backendUrl');
      const savedMock = await AsyncStorage.getItem('useMock');
      if (savedUrl) setBackendUrl(savedUrl);
      if (savedMock !== null) setUseMock(savedMock === 'true');
    } catch (error) {
      // Silent fail
    }
  };

  const checkConnection = async () => {
    if (useMock) {
      setIsConnected(true);
      return;
    }
    const connected = await testConnection(backendUrl);
    setIsConnected(connected);
    if (connected) {
      fetchStatus();
    }
  };

  const fetchStatus = async () => {
    if (useMock) return;
    try {
      const response = await getLightStatus(backendUrl);
      setLightStatus(response.status);
      setMode(response.mode);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const addToHistory = (action: string) => {
    const newEntry = {
      time: new Date().toLocaleTimeString(),
      action: action,
    };
    setHistoryLog(prev => [newEntry, ...prev].slice(0, 20)); // Keep last 20 entries
  };

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    addToHistory(`Brightness changed to ${value}%`);
  };

  const handleSensitivityChange = (value: string) => {
    setMotionSensitivity(value);
    const option = sensitivityOptions.find(opt => opt.value === value);
    addToHistory(`Motion sensitivity set to ${value} (${option?.probability * 100}% detection)`);
  };

  const handleTimerChange = (seconds: number) => {
    setAutoOffTimer(seconds);
    addToHistory(`Auto-off timer set to ${seconds} seconds`);
  };

  const clearHistory = () => {
    setHistoryLog([]);
    addToHistory('History cleared');
  };

  const getSensitivityProbability = () => {
    const option = sensitivityOptions.find(opt => opt.value === motionSensitivity);
    return option ? option.probability * 100 : 50;
  };

  const getTimerDisplay = (seconds: number) => {
    if (seconds >= 60) return `${seconds / 60} min`;
    return `${seconds} sec`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="options-outline" size={28} color="#f1f5f9" />
          <Text style={styles.headerTitle}>Advanced Controls</Text>
        </View>

        {/* Connection Status */}
        <View style={styles.connectionCard}>
          <View style={[styles.connectionDot, { backgroundColor: isConnected ? '#22c55e' : '#ef4444' }]} />
          <Text style={styles.connectionText}>
            {isConnected ? 'Connected to backend' : useMock ? 'Mock Mode Active' : 'Disconnected'}
          </Text>
        </View>

        {/* Brightness Control */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="sunny-outline" size={22} color="#fbbf24" />
            <Text style={styles.cardTitle}>Brightness</Text>
          </View>
          <Text style={styles.brightnessValue}>{brightness}%</Text>
          <View style={styles.brightnessContainer}>
            {[0, 20, 40, 60, 80, 100].map((value) => (
              <TouchableOpacity
                key={value}
                style={[
                  styles.brightnessButton,
                  brightness === value && styles.brightnessButtonActive,
                ]}
                onPress={() => handleBrightnessChange(value)}
              >
                <Text style={[
                  styles.brightnessButtonText,
                  brightness === value && styles.brightnessButtonTextActive,
                ]}>{value}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.brightnessBar}>
            <View style={[styles.brightnessFill, { width: `${brightness}%` }]} />
          </View>
        </View>

        {/* Motion Sensitivity */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="walk-outline" size={22} color="#8b5cf6" />
            <Text style={styles.cardTitle}>Motion Sensitivity</Text>
          </View>
          <View style={styles.sensitivityContainer}>
            {sensitivityOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.sensitivityButton,
                  motionSensitivity === option.value && styles.sensitivityButtonActive,
                ]}
                onPress={() => handleSensitivityChange(option.value)}
              >
                <Text style={[
                  styles.sensitivityButtonText,
                  motionSensitivity === option.value && styles.sensitivityButtonTextActive,
                ]}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.sensitivityBar}>
            <View style={[styles.sensitivityFill, { width: `${getSensitivityProbability()}%` }]} />
          </View>
          <Text style={styles.sensitivityHint}>
            Detection probability: {getSensitivityProbability()}%
          </Text>
        </View>

        {/* Auto-Off Timer */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="timer-outline" size={22} color="#22c55e" />
            <Text style={styles.cardTitle}>Auto-Off Timer</Text>
          </View>
          <View style={styles.timerContainer}>
            {timerOptions.map((seconds) => (
              <TouchableOpacity
                key={seconds}
                style={[
                  styles.timerButton,
                  autoOffTimer === seconds && styles.timerButtonActive,
                ]}
                onPress={() => handleTimerChange(seconds)}
              >
                <Text style={[
                  styles.timerButtonText,
                  autoOffTimer === seconds && styles.timerButtonTextActive,
                ]}>{getTimerDisplay(seconds)}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.timerHint}>
            Light will turn off after {autoOffTimer} seconds of no motion
          </Text>
        </View>

        {/* Current Status Summary */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={22} color="#3b82f6" />
            <Text style={styles.cardTitle}>Current Status</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Light:</Text>
            <Text style={[styles.statusValue, { color: lightStatus === 'on' ? '#22c55e' : '#ef4444' }]}>
              {lightStatus === 'on' ? 'ON' : 'OFF'}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Mode:</Text>
            <Text style={[styles.statusValue, { color: mode === 'auto' ? '#3b82f6' : '#8b5cf6' }]}>
              {mode === 'auto' ? 'Auto Mode' : 'Manual Mode'}
            </Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Sensitivity:</Text>
            <Text style={styles.statusValue}>{motionSensitivity}</Text>
          </View>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Timer:</Text>
            <Text style={styles.statusValue}>{autoOffTimer} seconds</Text>
          </View>
        </View>

        {/* History Log */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="time-outline" size={22} color="#f59e0b" />
            <Text style={styles.cardTitle}>Activity History</Text>
            <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear</Text>
            </TouchableOpacity>
          </View>
          {historyLog.length === 0 ? (
            <Text style={styles.historyEmpty}>No activity yet</Text>
          ) : (
            historyLog.map((entry, index) => (
              <View key={index} style={styles.historyEntry}>
                <Text style={styles.historyTime}>{entry.time}</Text>
                <Text style={styles.historyAction}>{entry.action}</Text>
              </View>
            ))
          )}
        </View>

        {/* Mock Mode Indicator */}
        {useMock && (
          <View style={styles.mockCard}>
            <Ionicons name="construct" size={18} color="#fbbf24" />
            <Text style={styles.mockCardText}>
              Mock Mode Active - Settings are simulated
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 20,
    gap: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  connectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  connectionText: {
    fontSize: 12,
    color: '#94a3b8',
  },
  card: {
    backgroundColor: '#1e293b',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f1f5f9',
    flex: 1,
  },
  brightnessValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fbbf24',
    textAlign: 'center',
    marginBottom: 16,
  },
  brightnessContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brightnessButton: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  brightnessButtonActive: {
    backgroundColor: '#fbbf24',
  },
  brightnessButtonText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  brightnessButtonTextActive: {
    color: '#0f172a',
    fontWeight: '700',
  },
  brightnessBar: {
    height: 6,
    backgroundColor: '#0f172a',
    borderRadius: 3,
    overflow: 'hidden',
  },
  brightnessFill: {
    height: '100%',
    backgroundColor: '#fbbf24',
    borderRadius: 3,
  },
  sensitivityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sensitivityButton: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  sensitivityButtonActive: {
    backgroundColor: '#8b5cf6',
  },
  sensitivityButtonText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  sensitivityButtonTextActive: {
    color: 'white',
  },
  sensitivityBar: {
    height: 6,
    backgroundColor: '#0f172a',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  sensitivityFill: {
    height: '100%',
    backgroundColor: '#8b5cf6',
    borderRadius: 3,
  },
  sensitivityHint: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  timerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timerButton: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  timerButtonActive: {
    backgroundColor: '#22c55e',
  },
  timerButtonText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '500',
  },
  timerButtonTextActive: {
    color: 'white',
  },
  timerHint: {
    fontSize: 10,
    color: '#64748b',
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  statusLabel: {
    fontSize: 13,
    color: '#94a3b8',
  },
  statusValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  clearButton: {
    backgroundColor: '#ef444420',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  clearButtonText: {
    color: '#f87171',
    fontSize: 10,
    fontWeight: '500',
  },
  historyEmpty: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 12,
    paddingVertical: 20,
  },
  historyEntry: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    gap: 12,
  },
  historyTime: {
    fontSize: 11,
    color: '#64748b',
    width: 70,
  },
  historyAction: {
    fontSize: 12,
    color: '#f1f5f9',
    flex: 1,
  },
  mockCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fbbf2420',
    marginHorizontal: 16,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  mockCardText: {
    fontSize: 11,
    color: '#fbbf24',
  },
});