import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from 'expo-speech-recognition';

interface RealVoiceRecognitionProps {
  onCommand: (command: string) => void;
  isProcessing: boolean;
}

export default function RealVoiceRecognition({ onCommand, isProcessing }: RealVoiceRecognitionProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Event listeners
  useSpeechRecognitionEvent('start', () => {
    console.log('🎤 Speech recognition started');
    setIsListening(true);
    setTranscript('');
  });

  useSpeechRecognitionEvent('end', () => {
    console.log('🎤 Speech recognition ended');
    setIsListening(false);
  });

  useSpeechRecognitionEvent('result', (event) => {
    const text = event.results[0]?.transcript;
    console.log('🎤 Result:', text);
    if (text) {
      setTranscript(text);
      // Stop listening and process the command
      ExpoSpeechRecognitionModule.stop();
      
      // Normalize and send command
      const command = normalizeCommand(text);
      if (command) {
        onCommand(command);
      } else {
        Alert.alert('Command Not Recognized', `You said: "${text}"\n\nTry saying:\n- Light on\n- Light off\n- Auto mode`);
      }
    }
  });

  useSpeechRecognitionEvent('error', (event) => {
    console.log('🎤 Error:', event.error, event.message);
    setIsListening(false);
    if (event.error !== 'aborted') {
      Alert.alert('Error', `Speech recognition error: ${event.message || event.error}`);
    }
  });

  // Normalize speech to valid commands
  const normalizeCommand = (spokenText: string): string | null => {
    const text = spokenText.toLowerCase().trim();
    
    if (text.includes('turn on') || text.includes('light on') || text === 'on' ||
        text.includes('switch on') || text.includes('power on')) {
      return 'light on';
    }
    
    if (text.includes('turn off') || text.includes('light off') || text === 'off' ||
        text.includes('switch off') || text.includes('power off')) {
      return 'light off';
    }
    
    if (text.includes('auto') || text.includes('automatic') || text.includes('auto mode')) {
      return 'auto mode';
    }
    
    return null;
  };

  const startListening = async () => {
    try {
      // Request permissions
      const permissionResult = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Microphone access is needed for voice commands');
        setPermissionGranted(false);
        return;
      }
      setPermissionGranted(true);

      // Start speech recognition
      ExpoSpeechRecognitionModule.start({
        lang: 'en-US',
        interimResults: true,
        maxAlternatives: 1,
        continuous: false,
        requiresOnDeviceRecognition: false,
        addsPunctuation: false,
      });
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      Alert.alert('Error', 'Failed to start voice recognition');
    }
  };

  const stopListening = () => {
    ExpoSpeechRecognitionModule.stop();
    setIsListening(false);
  };

  return (
    <TouchableOpacity 
      style={[styles.voiceCard, (isListening || isProcessing) && styles.disabledCard]}
      onPress={isListening ? stopListening : startListening}
      disabled={isProcessing}
      activeOpacity={0.7}
    >
      <View style={[styles.voiceIconContainer, isListening && styles.activeIcon]}>
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
          {isListening 
            ? (transcript || 'Say "light on", "light off", or "auto mode"')
            : 'Tap and speak to control the light'}
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