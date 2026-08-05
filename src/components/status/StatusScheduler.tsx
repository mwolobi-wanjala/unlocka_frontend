// components/status/StatusScheduler.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import Button from '../Button';

interface StatusSchedulerProps {
  visible: boolean;
  onSchedule: (time: Date) => void;
  onClose: () => void;
}

const StatusScheduler: React.FC<StatusSchedulerProps> = ({ visible, onSchedule, onClose }) => {
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  const handleSchedule = () => {
    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    onSchedule(new Date(Date.now() + (h * 3600000) + (m * 60000)));
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>⏰ Schedule Status</Text>
          <View style={styles.timeRow}>
            <View style={styles.timeInput}>
              <TextInput style={styles.input} value={hours} onChangeText={setHours} placeholder="HH" keyboardType="number-pad" maxLength={2} />
              <Text style={styles.label}>Hours</Text>
            </View>
            <Text style={styles.separator}>:</Text>
            <View style={styles.timeInput}>
              <TextInput style={styles.input} value={minutes} onChangeText={setMinutes} placeholder="MM" keyboardType="number-pad" maxLength={2} />
              <Text style={styles.label}>Minutes</Text>
            </View>
          </View>
          <Button title="Schedule" icon="⏰" onPress={handleSchedule} variant="primary" />
          <Button title="Cancel" onPress={onClose} variant="outline" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg },
  title: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.lg },
  timeRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: SPACING.md, marginBottom: SPACING.lg },
  timeInput: { alignItems: 'center' },
  input: { borderWidth: 2, borderColor: COLORS.primary, borderRadius: 10, width: 60, height: 50, textAlign: 'center', fontSize: FONTS.sizes.xl, fontWeight: 'bold' },
  label: { fontSize: 10, color: COLORS.gray, marginTop: 4 },
  separator: { fontSize: FONTS.sizes.xl, fontWeight: 'bold' },
});

export default StatusScheduler;
