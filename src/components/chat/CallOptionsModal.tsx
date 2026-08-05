// components/chat/CallOptionsModal.tsx - Call Options (Voice/Video/Conference)
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  TextInput, Alert, Switch,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import Button from '../Button';

interface CallOptionsModalProps {
  visible: boolean;
  chatName: string;
  onClose: () => void;
  onVoiceCall: () => void;
  onVideoCall: () => void;
  onConferenceCall: (title: string, sendCode: boolean) => void;
}

const CallOptionsModal: React.FC<CallOptionsModalProps> = ({
  visible, chatName, onClose,
  onVoiceCall, onVideoCall, onConferenceCall,
}) => {
  const [showConferenceOptions, setShowConferenceOptions] = useState(false);
  const [conferenceTitle, setConferenceTitle] = useState(`${chatName}'s Meeting`);
  const [sendCode, setSendCode] = useState(true);

  const handleConferenceCall = () => {
    if (!conferenceTitle.trim()) {
      Alert.alert('Error', 'Please enter a meeting title');
      return;
    }
    onConferenceCall(conferenceTitle.trim(), sendCode);
    setShowConferenceOptions(false);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={onClose}>
        <View style={styles.container}>
          {!showConferenceOptions ? (
            <>
              <Text style={styles.title}>📞 Call {chatName}</Text>
              <Text style={styles.subtitle}>Choose call type</Text>

              {/* Voice Call */}
              <TouchableOpacity style={styles.option} onPress={() => { onVoiceCall(); onClose(); }}>
                <View style={[styles.optionIcon, { backgroundColor: '#4CAF50' }]}>
                  <Text style={styles.optionEmoji}>📞</Text>
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionTitle}>Voice Call</Text>
                  <Text style={styles.optionDesc}>One-on-one voice call</Text>
                </View>
              </TouchableOpacity>

              {/* Video Call */}
              <TouchableOpacity style={styles.option} onPress={() => { onVideoCall(); onClose(); }}>
                <View style={[styles.optionIcon, { backgroundColor: '#2196F3' }]}>
                  <Text style={styles.optionEmoji}>📹</Text>
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionTitle}>Video Call</Text>
                  <Text style={styles.optionDesc}>One-on-one video call</Text>
                </View>
              </TouchableOpacity>

              {/* Conference Call */}
              <TouchableOpacity style={styles.option} onPress={() => setShowConferenceOptions(true)}>
                <View style={[styles.optionIcon, { backgroundColor: '#9C27B0' }]}>
                  <Text style={styles.optionEmoji}>👥</Text>
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionTitle}>Conference Call</Text>
                  <Text style={styles.optionDesc}>Group call with multiple participants</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.backRow} onPress={() => setShowConferenceOptions(false)}>
                <Text style={styles.backText}>← Back</Text>
              </TouchableOpacity>
              
              <Text style={styles.title}>👥 Conference Call</Text>
              <Text style={styles.subtitle}>Create a group meeting</Text>

              {/* Meeting Title */}
              <Text style={styles.inputLabel}>Meeting Title</Text>
              <TextInput
                style={styles.input}
                value={conferenceTitle}
                onChangeText={setConferenceTitle}
                placeholder="Enter meeting title..."
                placeholderTextColor="#999"
              />

              {/* Send Code Toggle */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleInfo}>
                  <Text style={styles.toggleTitle}>📤 Send invitation code</Text>
                  <Text style={styles.toggleDesc}>
                    Automatically send the room code to {chatName}
                  </Text>
                </View>
                <Switch
                  value={sendCode}
                  onValueChange={setSendCode}
                  trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                  thumbColor="#FFF"
                />
              </View>

              {/* Start Button */}
              <Button
                title="🚀 Start Conference"
                onPress={handleConferenceCall}
                variant="primary"
              />
              
              <Button
                title="Cancel"
                onPress={() => { setShowConferenceOptions(false); onClose(); }}
                variant="outline"
              />
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFF', borderRadius: 20,
    padding: SPACING.xl, width: '85%', maxWidth: 400,
    ...SHADOWS.large,
  },
  backRow: { marginBottom: SPACING.md },
  backText: { color: COLORS.primary, fontSize: FONTS.sizes.sm, fontWeight: '600' },
  title: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', textAlign: 'center', color: COLORS.dark },
  subtitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray, textAlign: 'center', marginBottom: SPACING.lg },
  
  option: {
    flexDirection: 'row', alignItems: 'center',
    padding: SPACING.md, borderRadius: 12,
    marginBottom: SPACING.sm, backgroundColor: '#F8F9FA',
  },
  optionIcon: {
    width: 50, height: 50, borderRadius: 25,
    justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md,
  },
  optionEmoji: { fontSize: 24 },
  optionInfo: { flex: 1 },
  optionTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.dark },
  optionDesc: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  
  cancelBtn: { padding: SPACING.md, alignItems: 'center', marginTop: SPACING.sm },
  cancelText: { color: COLORS.gray, fontSize: FONTS.sizes.md },
  
  inputLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark, marginBottom: 4 },
  input: {
    borderWidth: 2, borderColor: COLORS.primary, borderRadius: 12,
    padding: SPACING.md, fontSize: FONTS.sizes.md, marginBottom: SPACING.md,
  },
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: SPACING.md, backgroundColor: '#F8F9FA', borderRadius: 12, marginBottom: SPACING.md,
  },
  toggleInfo: { flex: 1, marginRight: SPACING.md },
  toggleTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600' },
  toggleDesc: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
});

export default CallOptionsModal;
