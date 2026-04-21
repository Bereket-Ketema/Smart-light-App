import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

interface VoiceRecognitionButtonProps {
  onCommand: (command: string) => void;
  isProcessing: boolean;
}

export default function VoiceRecognitionButton({ onCommand, isProcessing }: VoiceRecognitionButtonProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputText, setInputText] = useState('');

  const handleSend = () => {
    if (inputText.trim()) {
      onCommand(inputText.trim());
      setInputText('');
      setModalVisible(false);
    }
  };

  return (
    <>
      <TouchableOpacity 
        style={[styles.voiceCard, isProcessing && styles.disabledCard]}
        onPress={() => setModalVisible(true)}
        disabled={isProcessing}
        activeOpacity={0.7}
      >
        <View style={styles.voiceIconContainer}>
          <Ionicons name="mic-outline" size={22} color="#8b5cf6" />
        </View>
        <View style={styles.voiceTextContainer}>
          <Text style={styles.voiceTitle}>Voice Command</Text>
          <Text style={styles.voiceSubtitle}>Tap and type "light on", "light off", or "auto mode"</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#475569" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Voice Command</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalSubtitle}>
          Say or type: "light on", "light off", or "auto mode"
            </Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="Type your command here..."
              placeholderTextColor="#64748b"
              value={inputText}
              onChangeText={setInputText}
              autoFocus={true}
              onSubmitEditing={handleSend}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={() => {
                  setModalVisible(false);
                  setInputText('');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.sendButton]} 
                onPress={handleSend}
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