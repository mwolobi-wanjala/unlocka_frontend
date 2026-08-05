// components/status/StatusPrivacyModal.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

interface StatusPrivacyModalProps {
  visible: boolean;
  currentPrivacy: string;
  onSelect: (privacy: string) => void;
  onClose: () => void;
}

const StatusPrivacyModal: React.FC<StatusPrivacyModalProps> = ({ visible, currentPrivacy, onSelect, onClose }) => {
  const [selected, setSelected] = useState(currentPrivacy);

  const options = [
    { id: 'contacts', title: 'My Contacts', icon: '👥', desc: 'All your contacts' },
    { id: 'except', title: 'Contacts Except...', icon: '🚫', desc: 'Choose who cannot see' },
    { id: 'only', title: 'Only Share With...', icon: '✅', desc: 'Choose who can see' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Status Privacy</Text>
          {options.map(opt => (
            <TouchableOpacity key={opt.id} style={[styles.option, selected === opt.id && styles.selectedOption]} onPress={() => { setSelected(opt.id); onSelect(opt.id); onClose(); }}>
              <Text style={styles.optionIcon}>{opt.icon}</Text>
              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>{opt.title}</Text>
                <Text style={styles.optionDesc}>{opt.desc}</Text>
              </View>
              {selected === opt.id && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg },
  title: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.lg },
  option: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.sm, backgroundColor: '#F8F9FA' },
  selectedOption: { backgroundColor: '#F0EEFF', borderWidth: 1, borderColor: COLORS.primary },
  optionIcon: { fontSize: 24, marginRight: SPACING.md },
  optionInfo: { flex: 1 },
  optionTitle: { fontWeight: '600' },
  optionDesc: { fontSize: 12, color: COLORS.gray },
  checkmark: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 },
  cancelBtn: { padding: SPACING.md, alignItems: 'center' },
  cancelText: { color: COLORS.gray, fontSize: FONTS.sizes.md },
});

export default StatusPrivacyModal;
