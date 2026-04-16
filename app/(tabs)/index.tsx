import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function HomePage() {
  // State for light status
  const [lightStatus, setLightStatus] = useState('off');
  const [mode, setMode] = useState('auto');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Mock API functions (will connect to real backend later)
  const turnLightOn = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setLightStatus('on');
      setMode('manual');
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to turn light on', error);
    } finally {
      setIsLoading(false);
    }
  };

  const turnLightOff = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setLightStatus('off');
      setMode('manual');
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  const setAutoMode = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setMode('auto');
      setLastUpdated(new Date());
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
              onPress={turnLightOn}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Ionicons name="flash" size={18} color="white" />
              <Text style={styles.buttonText}>On</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.offButton, isLoading && styles.disabledButton]}
              onPress={turnLightOff}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Ionicons name="flash-off" size={18} color="white" />
              <Text style={styles.buttonText}>Off</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.autoButton, isLoading && styles.disabledButton]}
              onPress={setAutoMode}
              disabled={isLoading}
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
          <View style={styles.statusDot} />
          <Text style={styles.statusBarText}>Connected</Text>
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

