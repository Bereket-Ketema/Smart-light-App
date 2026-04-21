import { View, StyleSheet, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Services
import { getLightStatus, testConnection } from '@/services/api';

// Constants
import { CONFIG } from '@/constants/config';

// Components
import ControlHeader from '@/components/control/ControlHeader';
import ConnectionStatusCard from '@/components/control/ConnectionStatusCard';
import BrightnessControl from '@/components/control/BrightnessControl';
import MotionSensitivityControl from '@/components/control/MotionSensitivityControl';
import AutoOffTimerControl from '@/components/control/AutoOffTimerControl';
import CurrentStatusCard from '@/components/control/CurrentStatusCard';
import HistoryLog from '@/components/control/HistoryLog';
import MockModeIndicator from '@/components/control/MockModeIndicator';

export default function ControlPage() {
  const [lightStatus, setLightStatus] = useState('off');
  const [mode, setMode] = useState('auto');
  const [isConnected, setIsConnected] = useState(false);
  const [useMock, setUseMock] = useState(true);
  const [backendUrl, setBackendUrl] = useState<string>(CONFIG.DEFAULT_BACKEND_URL);
  
  // Advanced settings
  const [brightness, setBrightness] = useState(70);
  const [motionSensitivity, setMotionSensitivity] = useState('medium');
  const [autoOffTimer, setAutoOffTimer] = useState(10);
  const [historyLog, setHistoryLog] = useState<{ time: string; action: string }[]>([]);
  
  // Options
  const sensitivityOptions = [
    { label: 'Low', value: 'low', probability: 0.3, delay: 5000 },
    { label: 'Medium', value: 'medium', probability: 0.5, delay: 3000 },
    { label: 'High', value: 'high', probability: 0.8, delay: 1000 },
  ];
  const timerOptions = [5, 10, 30, 60];

  // Load config on start
  useEffect(() => {
    loadConfig();
    checkConnection();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const refresh = async () => {
        const loadedMock = await loadConfig();
        if (loadedMock !== null) {
          if (loadedMock) {
            setIsConnected(true);
          } else {
            setIsConnected(false);
            const connected = await testConnection(backendUrl);
            setIsConnected(connected);
            if (connected) {
              fetchStatus();
            }
          }
        } else {
          await checkConnection();
        }
      };
      refresh();
    }, [])
  );

  const loadConfig = async () => {
    try {
      const savedUrl = await AsyncStorage.getItem('backendUrl');
      const savedMock = await AsyncStorage.getItem('useMock');
      if (savedUrl) setBackendUrl(savedUrl);
      if (savedMock !== null) {
        const newMockValue = savedMock === 'true';
        setUseMock(newMockValue);
        return newMockValue;
      }
      return null;
    } catch (error) {
      return null;
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
    setHistoryLog(prev => [newEntry, ...prev].slice(0, 20));
  };

  const handleBrightnessChange = (value: number) => {
    setBrightness(value);
    addToHistory(`Brightness changed to ${value}%`);
  };

  const handleSensitivityChange = (value: string) => {
    setMotionSensitivity(value);
    const option = sensitivityOptions.find(opt => opt.value === value);
    const probabilityPercent = option ? option.probability * 100 : 50;
    addToHistory(`Motion sensitivity set to ${value} (${probabilityPercent}% detection)`);
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
    if (option && option.probability !== undefined) {
      return option.probability * 100;
    }
    return 50;
  };

  const getTimerDisplay = (seconds: number) => {
    if (seconds >= 60) return `${seconds / 60} min`;
    return `${seconds} sec`;
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <ControlHeader />
        <ConnectionStatusCard isConnected={isConnected} useMock={useMock} />
        <BrightnessControl brightness={brightness} onBrightnessChange={handleBrightnessChange} />
        <MotionSensitivityControl 
          value={motionSensitivity}
          options={sensitivityOptions}
          probability={getSensitivityProbability()}
          onSensitivityChange={handleSensitivityChange}
        />
        <AutoOffTimerControl 
          timer={autoOffTimer}
          options={timerOptions}
          onTimerChange={handleTimerChange}
          getDisplayText={getTimerDisplay}
        />
        <CurrentStatusCard 
          lightStatus={lightStatus}
          mode={mode}
          sensitivity={motionSensitivity}
          timer={autoOffTimer}
        />
        <HistoryLog logs={historyLog} onClear={clearHistory} />
        <MockModeIndicator visible={useMock} />
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
});