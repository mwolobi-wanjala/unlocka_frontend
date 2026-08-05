// components/MediaSendModal.tsx - Media Send with Optional Pay Wall
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  Image, Dimensions, Switch, Modal,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import Button from './Button';
import { PAID_MEDIA } from '../types/chat';

const { width } = Dimensions.get('window');

interface MediaSendModalProps {
  visible: boolean;
  mediaUri: string;
  mediaType: 'image' | 'video';
  onSend: (data: { uri: string; type: string; isPaid: boolean; amount: number; caption: string }) => void;
  onCancel: () => void;
}

const MediaSendModal: React.FC<MediaSendModalProps> = ({
  visible, mediaUri, mediaType, onSend, onCancel,
}) => {
  const [isPaid, setIsPaid] = useState(false);
  const [amount, setAmount] = useState('50');
  const [caption, setCaption] = useState('');
  const [showAmountInput, setShowAmountInput] = useState(false);

  const handleTogglePaid = (value: boolean) => {
    setIsPaid(value);
    setShowAmountInput(value);
  };

  const handleSend = () => {
    const finalAmount = isPaid ? (parseInt(amount) || 0) : 0;
    
    // Validate amount if paid
    if (isPaid && finalAmount < PAID_MEDIA.MIN_AMOUNT) {
      alert(`Minimum amount is KSH ${PAID_MEDIA.MIN_AMOUNT}`);
      return;
    }
    if (isPaid && finalAmount > PAID_MEDIA.MAX_AMOUNT) {
      alert(`Maximum amount is KSH ${PAID_MEDIA.MAX_AMOUNT}`);
      return;
    }

    onSend({
      uri: mediaUri,
      type: mediaType,
      isPaid,
      amount: finalAmount,
      caption: caption.trim(),
    });
  };

  const formatCurrency = (val: number) => `KSH ${val?.toLocaleString() || '0'}`;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancelBtn}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              Send {mediaType === 'image' ? 'Photo' : 'Video'}
            </Text>
            <View style={{ width: 30 }} />
          </View>

          {/* Media Preview */}
          <View style={styles.previewContainer}>
            <Image source={{ uri: mediaUri }} style={styles.preview} resizeMode="cover" />
          </View>

          {/* Caption */}
          <TextInput
            style={styles.captionInput}
            value={caption}
            onChangeText={setCaption}
            placeholder="Add a caption... (optional)"
            placeholderTextColor="#999"
            maxLength={200}
            multiline
          />

          {/* Pay Wall Toggle */}
          <View style={styles.payWallSection}>
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Text style={styles.toggleTitle}>💰 Set Price (Pay to View)</Text>
                <Text style={styles.toggleDesc}>
                  Recipient must pay to see this media
                </Text>
              </View>
              <Switch
                value={isPaid}
                onValueChange={handleTogglePaid}
                trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
                thumbColor="#FFF"
              />
            </View>

            {/* Amount Input - Only shown when paid is enabled */}
            {showAmountInput && (
              <View style={styles.amountSection}>
                <Text style={styles.amountLabel}>Set Price (KSH)</Text>
                
                {/* Amount Input */}
                <View style={styles.amountInputRow}>
                  <Text style={styles.currencySymbol}>KSH</Text>
                  <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ''))}
                    placeholder="50"
                    placeholderTextColor="#999"
                    keyboardType="number-pad"
                    maxLength={4}
                  />
                </View>

                <Text style={styles.amountHint}>
                  Min: KSH {PAID_MEDIA.MIN_AMOUNT} • Max: KSH {PAID_MEDIA.MAX_AMOUNT}
                </Text>

                {/* Quick Amounts */}
                <View style={styles.quickAmounts}>
                  {[20, 50, 100, 200, 500, 1000].map((val) => (
                    <TouchableOpacity
                      key={val}
                      style={[styles.quickBtn, amount === val.toString() && styles.quickBtnActive]}
                      onPress={() => setAmount(val.toString())}
                    >
                      <Text style={[styles.quickText, amount === val.toString() && styles.quickTextActive]}>
                        {val}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Earnings Preview */}
                {amount && parseInt(amount) > 0 && (
                  <View style={styles.earningsBox}>
                    <Text style={styles.earningsTitle}>💰 You'll Earn:</Text>
                    <Text style={styles.earningsAmount}>
                      {formatCurrency((parseInt(amount) || 0) * PAID_MEDIA.SENDER_PERCENTAGE / 100)}
                    </Text>
                    <Text style={styles.earningsPercent}>
                      ({PAID_MEDIA.SENDER_PERCENTAGE}% of {amount} KSH)
                    </Text>
                    <Text style={styles.platformFee}>
                      Platform fee: {formatCurrency((parseInt(amount) || 0) * PAID_MEDIA.PLATFORM_PERCENTAGE / 100)} ({PAID_MEDIA.PLATFORM_PERCENTAGE}%)
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Free Note */}
          {!isPaid && (
            <View style={styles.freeNote}>
              <Text style={styles.freeIcon}>🆓</Text>
              <Text style={styles.freeText}>Media will be sent FREE. Toggle on to set a price.</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Button
              title={isPaid ? `Send for KSH ${amount || 0}` : 'Send for Free'}
              icon={isPaid ? '💰' : '📤'}
              onPress={handleSend}
              variant={isPaid ? 'success' : 'primary'}
            />
            <Button title="Cancel" onPress={onCancel} variant="outline" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: {
    backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20,
    maxHeight: '90%', padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cancelBtn: { fontSize: 22, color: COLORS.gray },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark },
  
  previewContainer: {
    width: '100%', height: 200, borderRadius: 12, overflow: 'hidden',
    marginBottom: SPACING.md, backgroundColor: '#F5F5F5',
  },
  preview: { width: '100%', height: '100%' },
  
  captionInput: {
    borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10,
    padding: SPACING.md, fontSize: FONTS.sizes.sm, marginBottom: SPACING.md,
    minHeight: 50, textAlignVertical: 'top',
  },
  
  payWallSection: {
    backgroundColor: '#F8F9FA', borderRadius: 12, padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  toggleRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  toggleInfo: { flex: 1, marginRight: SPACING.md },
  toggleTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark },
  toggleDesc: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  
  amountSection: { marginTop: SPACING.md },
  amountLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark, marginBottom: SPACING.sm },
  amountInputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.primary, borderRadius: 10, overflow: 'hidden',
  },
  currencySymbol: {
    backgroundColor: COLORS.primary, color: '#FFF', fontWeight: 'bold',
    padding: SPACING.md, fontSize: FONTS.sizes.md,
  },
  amountInput: {
    flex: 1, fontSize: FONTS.sizes.xxl, fontWeight: 'bold',
    textAlign: 'center', padding: SPACING.sm, color: COLORS.dark,
  },
  amountHint: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 4, textAlign: 'center' },
  
  quickAmounts: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },
  quickBtn: {
    flex: 1, padding: SPACING.sm, borderRadius: 8,
    backgroundColor: '#F5F5F5', alignItems: 'center',
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  quickBtnActive: { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' },
  quickText: { fontSize: FONTS.sizes.sm, color: COLORS.dark },
  quickTextActive: { color: '#4CAF50', fontWeight: 'bold' },
  
  earningsBox: {
    backgroundColor: '#F0EEFF', padding: SPACING.md, borderRadius: 10,
    marginTop: SPACING.md, alignItems: 'center',
  },
  earningsTitle: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  earningsAmount: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.primary, marginTop: 2 },
  earningsPercent: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  platformFee: { fontSize: 10, color: COLORS.gray, marginTop: 4 },
  
  freeNote: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD',
    padding: SPACING.sm, borderRadius: 10, marginBottom: SPACING.md, gap: SPACING.sm,
  },
  freeIcon: { fontSize: 16 },
  freeText: { flex: 1, fontSize: FONTS.sizes.xs, color: '#1565C0' },
  
  actions: { gap: SPACING.sm },
});

export default MediaSendModal;
