import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal, TextInput } from 'react-native';
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

type InputMode = 'voice' | 'text';

export default function SimpleVoiceRecorder({ onCommand, isProcessing }: SimpleVoiceRecorderProps) {
  const [inputMode, setInputMode] = useState<InputMode>('voice');
  const [modalVisible, setModalVisible] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  // Request permissions on mount
  useEffect(() => {
    (async () => {
      try {
        const status = await AudioModule.requestRecordingPermissionsAsync();
        if (status.granted) {
          setPermissionGranted(true);
          await setAudioModeAsync({
            playsInSilentMode: true,
            allowsRecording: true,
            shouldPlayInBackground: false,
          });
        }
      } catch (error) {
        console.error('Failed to setup audio:', error);
      }
    })();
  }, []);

  // Voice recording functions
  const startRecording = async () => {
    if (!permissionGranted) {
      Alert.alert('Permission Required', 'Please grant microphone permission to use voice commands');
      return;
    }

    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      
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

  // Text input functions
  const openTextModal = () => {
    setTextInput('');
    setModalVisible(true);
  };

  const sendTextCommand = () => {
    if (textInput.trim()) {
      onCommand(textInput.trim());
      setTextInput('');
      setModalVisible(false);
    }
  };

  // Toggle between voice and text mode
  const toggleMode = () => {
    const newMode = inputMode === 'voice' ? 'text' : 'voice';
    setInputMode(newMode);
  };

  return (
    <>
      <View style={styles.container}>
        {/* Mode Toggle Button */}
        <TouchableOpacity 
          style={styles.modeToggle}
          onPress={toggleMode}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={inputMode === 'voice' ? 'text-outline' : 'mic-outline'} 
            size={14} 
            color="#94a3b8" 
          />
          <Text style={styles.modeToggleText}>
            Switch to {inputMode === 'voice' ? 'Text' : 'Voice'}
          </Text>
        </TouchableOpacity>

        {/* Voice Mode Button */}
        {inputMode === 'voice' && (
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
        )}

        {/* Text Mode Button */}
        {inputMode === 'text' && (
          <TouchableOpacity 
            style={[styles.voiceCard, isProcessing && styles.disabledCard]}
            onPress={openTextModal}
            disabled={isProcessing}
            activeOpacity={0.7}
          >
            <View style={styles.voiceIconContainer}>
              <Ionicons name="create-outline" size={22} color="#8b5cf6" />
            </View>
            <View style={styles.voiceTextContainer}>
              <Text style={styles.voiceTitle}>Text Command</Text>
              <Text style={styles.voiceSubtitle}>Tap and type "light on", "light off", or "auto mode"</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#475569" />
          </TouchableOpacity>
        )}
      </View>

      {/* Text Input Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Text Command</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
              Type: "light on", "light off", or "auto mode"
            </Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="Type your command here..."
              placeholderTextColor="#64748b"
              value={textInput}
              onChangeText={setTextInput}
              autoFocus={true}
              onSubmitEditing={sendTextCommand}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => {
                  setModalVisible(false);
                  setTextInput('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.sendButton]} 
                onPress={sendTextCommand}
              >
                <Text style={styles.sendButtonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  modeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: '#1e293b',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
    gap: 5,
    marginBottom: 8,
  },
  modeToggleText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '500',
  },
  voiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e293b',
    borderRadius: 24,
    padding: 20,
    width: '85%',
    maxWidth: 350,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f1f5f9',
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    marginBottom: 20,
  },
  textInput: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#334155',
  },
  cancelButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '500',
  },
  sendButton: {
    backgroundColor: '#8b5cf6',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});