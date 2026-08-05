// components/chat/CallButtons.tsx - Voice & Video call triggers
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';

interface CallButtonsProps {
  chatName: string;
  onVoiceCall: () => void;
  onVideoCall: () => void;
}

const CallButtons: React.FC<CallButtonsProps> = ({ chatName, onVoiceCall, onVideoCall }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.callBtn} onPress={onVoiceCall}>
        <Text style={styles.callIcon}>📞</Text>
        <Text style={styles.callLabel}>Voice Call</Text>
      </TouchableOpacity>
      
      <View style={styles.divider} />
      
      <TouchableOpacity style={styles.callBtn} onPress={onVideoCall}>
        <Text style={styles.callIcon}>📹</Text>
        <Text style={styles.callLabel}>Video Call</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  callBtn: {
    flex: 1,
    alignItems: 'center',
    padding: SPACING.sm,
  },
  callIcon: {
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  callLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    backgroundColor: COLORS.lightGray,
  },
});

export default CallButtons;
