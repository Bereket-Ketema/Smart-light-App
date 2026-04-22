import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorderState,
} from 'expo-audio';

interface SimpleVoiceRecorderProps {
  onCommand: (command: string) => void;
  isProcessing: boolean;
}

export default function SimpleVoiceRecorder({ onCommand, isProcessing }: SimpleVoiceRecorderProps) {
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);
  const [permissionGranted, setPermissionGranted] = useState(false);

  // Request permissions and configure audio mode on mount
  useEffect(() => {
    (async () => {
      try {
        // Request microphone permission
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (!status.granted) {
          Alert.alert('Permission Denied', 'Microphone permission is required for voice commands');
          setPermissionGranted(false);
          return;
        }
        
        setPermissionGranted(true);
        
        // Configure audio mode for recording
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: true,
          shouldPlayInBackground: false,
        });
      } catch (error) {
        console.error('Failed to setup audio:', error);
        setPermissionGranted(false);
      }
    })();
  }, []);

  const startRecording = async () => {
    if (!permissionGranted) {
      Alert.alert('Permission Required', 'Please grant microphone permission to use voice commands');
      return;
    }

    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      
      // Automatically stop after 4 seconds
      setTimeout(() => {
        if (recorderState.isRecording) {
          stopRecording();
        }
      }, 4000);
      
    } catch (error) {
      console.error('Failed to start recording:', error);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    if (!recorderState.isRecording) return;
    
    try {
      await audioRecorder.stop();
      const uri = audioRecorder.uri;
      console.log('Recording saved to:', uri);
      
      // Show prompt for command input
      // In production, you would send the audio file to a speech-to-text service
      Alert.prompt(
        'Voice Command',
        'What did you say?',
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
      
    } catch (error) {
      console.error('Failed to stop recording:', error);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.voiceCard, (recorderState.isRecording || isProcessing) && styles.disabledCard]}
      onPress={recorderState.isRecording ? stopRecording : startRecording}
      disabled={isProcessing || !permissionGranted}
      activeOpacity={0.7}
    >
      <View style={[styles.voiceIconContainer, recorderState.isRecording && styles.activeIcon]}>
        <Ionicons 
          name={recorderState.isRecording ? 'mic' : 'mic-outline'} 
          size={22} 
          color={recorderState.isRecording ? '#22c55e' : '#8b5cf6'} 
        />
      </View>
      <View style={styles.voiceTextContainer}>
        <Text style={styles.voiceTitle}>
          {recorderState.isRecording ? 'Recording...' : 'Voice Command'}
        </Text>
        <Text style={styles.voiceSubtitle}>
          {recorderState.isRecording 
            ? 'Listening...' 
            : 'Tap and speak to control the light'}
        </Text>
      </View>
      {recorderState.isRecording && <ActivityIndicator size="small" color="#22c55e" />}
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
});