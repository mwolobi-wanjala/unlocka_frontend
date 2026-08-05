// components/chat/PaidMediaBubble.tsx - Paid media in chat
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, TextInput,
  Dimensions, Alert, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { ChatMessage, PaidMedia, PAID_MEDIA } from '../../types/chat';
import { 
  requestMediaPayment, 
  checkMediaPayment, 
  unlockMedia 
} from '../../services/chat/paidMediaService';

const { width } = Dimensions.get('window');

interface PaidMediaBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  userId: number;
  onUnlock: (messageId: string) => void;
}

const PaidMediaBubble: React.FC<PaidMediaBubbleProps> = ({
  message,
  isMine,
  userId,
  onUnlock,
}) => {
  const paidMedia = message.paidMedia as PaidMedia | undefined;
  const [mpesaNumber, setMpesaNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(
    paidMedia?.status === 'unlocked' || paidMedia?.paidBy === userId
  );

  // Auto-check payment status
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (checkoutId && !isUnlocked) {
      interval = setInterval(async () => {
        const result = await checkMediaPayment(checkoutId);
        if (result.success && result.status === 'completed') {
          clearInterval(interval);
          setIsUnlocked(true);
          onUnlock(message.id);
        }
      }, 3000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [checkoutId, isUnlocked]);

  // If not paid media, render normally
  if (!paidMedia?.isPaid) {
    return (
      <View style={styles.normalMedia}>
        {message.type === 'image' && (
          <Image source={{ uri: message.mediaUrl }} style={styles.mediaImage} />
        )}
        {message.type === 'video' && (
          <View style={styles.videoContainer}>
            <Image source={{ uri: message.thumbnailUrl }} style={styles.mediaImage} />
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶️</Text>
            </View>
          </View>
        )}
      </View>
    );
  }

  // For sender - show with payment badge
  if (isMine) {
    return (
      <View style={styles.container}>
        <View style={styles.senderMedia}>
          {message.type === 'image' && (
            <Image source={{ uri: message.mediaUrl }} style={styles.mediaImage} />
          )}
          {message.type === 'video' && (
            <View style={styles.videoContainer}>
              <Image source={{ uri: message.thumbnailUrl }} style={styles.mediaImage} />
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶️</Text>
              </View>
            </View>
          )}
        </View>
        {/* Payment badge */}
        <View style={styles.senderBadge}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.badgeText}>
            KSH {paidMedia.amount} • {paidMedia.status === 'unlocked' ? 'Paid ✅' : 'Pending'}
          </Text>
          <Text style={styles.earnText}>
            Earn: KSH {paidMedia.senderCut}
          </Text>
        </View>
      </View>
    );
  }

  // For recipient - locked content
  if (!isUnlocked) {
    return (
      <View style={styles.container}>
        {/* Blurred preview */}
        <View style={styles.lockedContainer}>
          <View style={styles.lockedOverlay}>
            <Text style={styles.lockedIcon}>🔒</Text>
            <Text style={styles.lockedTitle}>Paid Content</Text>
            <Text style={styles.lockedAmount}>KSH {paidMedia.amount}</Text>
            <Text style={styles.lockedDesc}>Pay to view this media</Text>
          </View>
        </View>

        {!showPayment ? (
          <TouchableOpacity
            style={styles.payButton}
            onPress={() => setShowPayment(true)}
          >
            <Text style={styles.payButtonText}>
              💳 Pay KSH {paidMedia.amount} to View
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.paymentForm}>
            <Text style={styles.paymentTitle}>Complete Payment</Text>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Amount:</Text>
              <Text style={styles.amountValue}>KSH {paidMedia.amount}</Text>
            </View>
            
            <View style={styles.mpesaInput}>
              <TextInput
                style={styles.input}
                value={mpesaNumber}
                onChangeText={(t) => setMpesaNumber(t.replace(/\D/g, '').slice(0, 10))}
                placeholder="Enter M-Pesa number"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>

            <TouchableOpacity
              style={[styles.payNowBtn, loading && styles.disabledBtn]}
              onPress={async () => {
                if (mpesaNumber.replace(/\D/g, '').length !== 10) {
                  Alert.alert('Error', 'Enter valid M-Pesa number');
                  return;
                }
                setLoading(true);
                const result = await requestMediaPayment(
                  message.id, mpesaNumber, userId
                );
                if (result.success) {
                  setCheckoutId(result.checkout_request_id);
                  Alert.alert('📱 STK Push Sent', 'Check your phone and enter PIN');
                } else {
                  Alert.alert('Error', result.message || 'Payment failed');
                }
                setLoading(false);
              }}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.payNowText}>📱 Pay with M-Pesa</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowPayment(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // Unlocked - show media normally
  return (
    <View style={styles.container}>
      <View style={styles.unlockedMedia}>
        {message.type === 'image' && (
          <Image source={{ uri: message.mediaUrl }} style={styles.mediaImage} />
        )}
        {message.type === 'video' && (
          <View style={styles.videoContainer}>
            <Image source={{ uri: message.thumbnailUrl }} style={styles.mediaImage} />
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶️</Text>
            </View>
          </View>
        )}
      </View>
      <View style={styles.unlockedBadge}>
        <Text style={styles.unlockedIcon}>✅</Text>
        <Text style={styles.unlockedText}>Unlocked</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginVertical: 2 },
  
  // Normal media
  normalMedia: {},
  mediaImage: { width: width * 0.55, height: width * 0.55, borderRadius: 12 },
  videoContainer: { position: 'relative' },
  playButton: { position: 'absolute', top: '50%', left: '50%', marginLeft: -25, marginTop: -25, width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  playIcon: { fontSize: 24, color: '#FFF' },
  
  // Sender
  senderMedia: {},
  senderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 6,
    borderRadius: 8,
    marginTop: 4,
    gap: 4,
  },
  lockIcon: { fontSize: 12 },
  badgeText: { fontSize: 10, color: '#E65100', fontWeight: '600' },
  earnText: { fontSize: 9, color: '#4CAF50', fontWeight: 'bold' },
  
  // Locked
  lockedContainer: {
    width: width * 0.55,
    height: width * 0.55,
    backgroundColor: '#1A1A2E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedOverlay: { alignItems: 'center', padding: SPACING.lg },
  lockedIcon: { fontSize: 40, marginBottom: SPACING.sm },
  lockedTitle: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  lockedAmount: { color: '#FFD700', fontSize: FONTS.sizes.xl, fontWeight: 'bold', marginVertical: SPACING.xs },
  lockedDesc: { color: '#999', fontSize: FONTS.sizes.xs },
  
  // Pay button
  payButton: {
    backgroundColor: '#FF9800',
    padding: SPACING.sm,
    borderRadius: 8,
    marginTop: 4,
    alignItems: 'center',
  },
  payButtonText: { color: '#FFF', fontWeight: 'bold', fontSize: FONTS.sizes.sm },
  
  // Payment form
  paymentForm: {
    backgroundColor: '#FFF',
    padding: SPACING.md,
    borderRadius: 12,
    marginTop: 4,
    ...SHADOWS.small,
  },
  paymentTitle: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.sm },
  amountRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  amountLabel: { color: COLORS.gray },
  amountValue: { fontWeight: 'bold', color: '#E65100' },
  mpesaInput: { marginBottom: SPACING.sm },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: SPACING.sm, fontSize: FONTS.sizes.md },
  payNowBtn: { backgroundColor: '#4CAF50', padding: SPACING.sm, borderRadius: 8, alignItems: 'center' },
  disabledBtn: { opacity: 0.6 },
  payNowText: { color: '#FFF', fontWeight: 'bold' },
  cancelText: { color: COLORS.gray, textAlign: 'center', marginTop: SPACING.sm },
  
  // Unlocked
  unlockedMedia: {},
  unlockedBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: 4, borderRadius: 6, marginTop: 4, alignSelf: 'flex-start', gap: 4 },
  unlockedIcon: { fontSize: 10 },
  unlockedText: { fontSize: 9, color: '#2E7D32', fontWeight: '600' },
});

export default PaidMediaBubble;
