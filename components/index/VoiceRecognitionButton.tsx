import { View, Text, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface VoiceRecognitionButtonProps {
  onCommand: (command: string) => void;
  isProcessing: boolean;
}

export default function VoiceRecognitionButton({ onCommand, isProcessing }: VoiceRecognitionButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [listeningText, setListeningText] = useState('');

  // Note: This is a simplified version. For production, integrate:
  // - expo-speech-recognition for Expo
  // - @react-native-voice/voice for React Native CLI
  
  const startListening = async () => {
    setIsListening(true);
    setListeningText('Listening...');
    
    // Mock voice recognition for now - replace with actual library
    // This simulates listening for 2 seconds then returning a command
    setTimeout(() => {
      setIsListening(false);
      setListeningText('');
      
      // For demo purposes, show a prompt to enter command
      // In production, this would be actual speech recognition
      Alert.prompt(
        'Voice Command',
        'Say: light on, light off, or auto mode',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Send', 
            onPress: (text: any) => {
              if (text) onCommand(text);
            }
          }
        ],
        'plain-text'
      );
    }, 2000);
  };

  return (
    <TouchableOpacity 
      style={[styles.voiceCard, (isListening || isProcessing) && styles.disabledCard]}
      onPress={startListening}
      disabled={isListening || isProcessing}
      activeOpacity={0.7}
    >
      <View style={[styles.voiceIconContainer, (isListening || isProcessing) && styles.activeIcon]}>
        <Ionicons 
          name={isListening ? 'mic' : 'mic-outline'} 
          size={22} 
          color={isListening ? '#22c55e' : '#8b5cf6'} 
        />
      </View>
      <View style={styles.voiceTextContainer}>
        <Text style={styles.voiceTitle}>
          {isListening ? 'Listening...' : 'Voice Command'}
        </Text>
        <Text style={styles.voiceSubtitle}>
          {isListening ? 'Say "light on", "light off", or "auto mode"' : 'Tap and speak to control the light'}
        </Text>
      </View>
      {isListening && (
        <View style={styles.listeningDot}>
          <View style={styles.pulseDot} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
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
  disabledCard: {
    opacity: 0.6,
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
  activeIcon: {
    backgroundColor: '#22c55e20',
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
  listeningDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    marginLeft: 8,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22c55e',
    opacity: 0.5,
  },
});