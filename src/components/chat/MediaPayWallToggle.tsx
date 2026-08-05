// components/chat/MediaPayWallToggle.tsx - Toggle pay wall on media
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, Switch, TextInput, TouchableOpacity,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { PAID_MEDIA } from '../../types/chat';

interface MediaPayWallToggleProps {
  onToggle: (enabled: boolean, amount: number) => void;
  onClose: () => void;
}

const MediaPayWallToggle: React.FC<MediaPayWallToggleProps> = ({
  onToggle,
  onClose,
}) => {
  const [enabled, setEnabled] = useState(false);
  const [amount, setAmount] = useState('50');
  const [showAmountInput, setShowAmountInput] = useState(false);

  const handleToggle = (value: boolean) => {
    setEnabled(value);
    setShowAmountInput(value);
    if (value) {
      onToggle(true, parseInt(amount) || 50);
    } else {
      onToggle(false, 0);
    }
  };

  const handleAmountChange = (value: string) => {
    const cleaned = value.replace(/[^0-9]/g, '');
    setAmount(cleaned);
    if (enabled && cleaned) {
      onToggle(true, parseInt(cleaned) || 0);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>💎 Pay to View</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Toggle */}
      <View style={styles.toggleRow}>
        <View style={styles.toggleInfo}>
          <Text style={styles.toggleTitle}>Enable Pay Wall</Text>
          <Text style={styles.toggleDesc}>
            Recipient pays to view this media
          </Text>
        </View>
        <Switch
          value={enabled}
          onValueChange={handleToggle}
          trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
          thumbColor={enabled ? '#FFF' : '#FFF'}
        />
      </View>

      {/* Amount Input */}
      {showAmountInput && (
        <View style={styles.amountSection}>
          <Text style={styles.amountLabel}>Set Price (KSH)</Text>
          <View style={styles.amountInputRow}>
            <Text style={styles.currencySymbol}>KSH</Text>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={handleAmountChange}
              placeholder="50"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={4}
            />
          </View>
          
          <Text style={styles.amountHint}>
            Min: KSH {PAID_MEDIA.MIN_AMOUNT} • Max: KSH {PAID_MEDIA.MAX_AMOUNT}
          </Text>

          {/* Quick amounts */}
          <View style={styles.quickAmounts}>
            {[20, 50, 100, 200, 500].map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.quickBtn, amount === val.toString() && styles.quickBtnActive]}
                onPress={() => { setAmount(val.toString()); onToggle(true, val); }}
              >
                <Text style={[styles.quickText, amount === val.toString() && styles.quickTextActive]}>
                  {val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Earnings preview */}
          {amount && parseInt(amount) > 0 && (
            <View style={styles.earningsBox}>
              <Text style={styles.earningsTitle}>💰 You'll Earn:</Text>
              <Text style={styles.earningsAmount}>
                KSH {((parseInt(amount) || 0) * PAID_MEDIA.SENDER_PERCENTAGE / 100).toFixed(2)}
              </Text>
              <Text style={styles.earningsPercent}>
                ({PAID_MEDIA.SENDER_PERCENTAGE}% of {amount} KSH)
              </Text>
              <Text style={styles.platformFee}>
                Platform fee: KSH {((parseInt(amount) || 0) * PAID_MEDIA.PLATFORM_PERCENTAGE / 100).toFixed(2)} ({PAID_MEDIA.PLATFORM_PERCENTAGE}%)
              </Text>
            </View>
          )}
        </View>
      )}

      {!enabled && (
        <Text style={styles.disabledNote}>
          💡 Media will be sent free. Toggle on to charge recipients.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  title: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark },
  closeBtn: { fontSize: 20, color: COLORS.gray },
  
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  toggleInfo: { flex: 1 },
  toggleTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark },
  toggleDesc: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  
  amountSection: { marginTop: SPACING.md },
  amountLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark, marginBottom: SPACING.sm },
  amountInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 10,
    overflow: 'hidden',
  },
  currencySymbol: {
    backgroundColor: COLORS.primary,
    color: '#FFF',
    fontWeight: 'bold',
    padding: SPACING.md,
    fontSize: FONTS.sizes.md,
  },
  amountInput: {
    flex: 1,
    fontSize: FONTS.sizes.xxl,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: SPACING.sm,
    color: COLORS.dark,
  },
  amountHint: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 4, textAlign: 'center' },
  
  quickAmounts: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  quickBtn: {
    flex: 1,
    padding: SPACING.sm,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  quickBtnActive: { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' },
  quickText: { fontSize: FONTS.sizes.sm, color: COLORS.dark },
  quickTextActive: { color: '#4CAF50', fontWeight: 'bold' },
  
  earningsBox: {
    backgroundColor: '#F0EEFF',
    padding: SPACING.md,
    borderRadius: 10,
    marginTop: SPACING.md,
    alignItems: 'center',
  },
  earningsTitle: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  earningsAmount: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.primary, marginTop: 2 },
  earningsPercent: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  platformFee: { fontSize: 10, color: COLORS.gray, marginTop: 4 },
  
  disabledNote: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray,
    textAlign: 'center',
    marginTop: SPACING.md,
    fontStyle: 'italic',
  },
});

export default MediaPayWallToggle;
