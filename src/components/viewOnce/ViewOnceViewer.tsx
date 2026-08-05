// components/viewOnce/ViewOnceViewer.tsx - View Once Content Viewer
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Image, TouchableOpacity,
  Dimensions, Alert, TextInput, ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { ViewOnceContent } from '../../types/viewOnce';
import Button from '../Button';
import { useToast } from '../../../App';

const { width, height } = Dimensions.get('window');

interface ViewOnceViewerProps {
  content: ViewOnceContent;
  userId: number;
  onClose: () => void;
  onOpened: () => void;
}

const ViewOnceViewer: React.FC<ViewOnceViewerProps> = ({ content, userId, onClose, onOpened }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<'preview' | 'payment' | 'viewing' | 'opened'>('preview');
  const [mpesaNumber, setMpesaNumber] = useState('0712345678');
  const [loading, setLoading] = useState(false);
  const [checkoutId, setCheckoutId] = useState<string | null>(null);
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    if (content.status === 'paid' || content.status === 'viewed') {
      setStep('viewing');
    }
  }, [content.status]);

  // Auto-check payment
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (checkoutId) {
      interval = setInterval(async () => {
        // Simulate payment confirmation
        setStep('viewing');
        clearInterval(interval);
      }, 3000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [checkoutId]);

  const handlePayNow = async () => {
    const cleaned = mpesaNumber.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      Alert.alert('Error', 'Enter valid M-Pesa number');
      return;
    }

    setLoading(true);
    // Simulate payment
    setTimeout(() => {
      setCheckoutId('ws_CO_test');
      showToast('📱 STK Push sent! Enter M-Pesa PIN');
      setLoading(false);
    }, 1500);
  };

  const handleOpen = () => {
    setOpened(true);
    setStep('opened');
    onOpened();
    // Auto-close after 5 seconds
    setTimeout(() => onClose(), 5000);
  };

  // Preview Step
  if (step === 'preview') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.previewContent}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.previewTitle}>Pay to View</Text>
          <Text style={styles.previewAmount}>KSH {content.amount}</Text>
          <Text style={styles.previewInfo}>
            {content.senderName} sent you a view-once {content.type}
          </Text>
          {content.caption && (
            <Text style={styles.previewCaption}>"{content.caption}"</Text>
          )}
          <Text style={styles.previewNote}>
            Content disappears after viewing
          </Text>
        </View>
        <View style={styles.previewActions}>
          <Button
            title={`Pay KSH ${content.amount} to View`}
            icon="💳"
            onPress={() => setStep('payment')}
            variant="primary"
          />
          <Button title="Cancel" onPress={onClose} variant="outline" />
        </View>
      </View>
    );
  }

  // Payment Step
  if (step === 'payment') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.paymentContent}>
          <Text style={styles.paymentTitle}>Complete Payment</Text>
          <Text style={styles.paymentDesc}>
            Pay KSH {content.amount} to view {content.senderName}'s content
          </Text>
          
          <View style={styles.amountBreakdown}>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Amount:</Text>
              <Text style={styles.breakdownValue}>KSH {content.amount}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Sender earns:</Text>
              <Text style={styles.breakdownValue}>KSH {content.senderCut} (90%)</Text>
            </View>
            <View style={styles.breakdownRow}>
              <Text style={styles.breakdownLabel}>Platform fee:</Text>
              <Text style={styles.breakdownValue}>KSH {content.platformCut} (10%)</Text>
            </View>
          </View>

          <View style={styles.mpesaInput}>
            <Text style={styles.inputLabel}>M-Pesa Number</Text>
            <TextInput
              style={styles.input}
              value={mpesaNumber}
              onChangeText={(t) => setMpesaNumber(t.replace(/\D/g, '').slice(0, 10))}
              placeholder="0712345678"
              placeholderTextColor="#999"
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <Button
            title="Pay with M-Pesa"
            icon="📱"
            onPress={handlePayNow}
            loading={loading}
            variant="success"
          />
          <Button title="Cancel" onPress={onClose} variant="outline" />
        </View>
      </View>
    );
  }

  // Viewing Step
  if (step === 'viewing' && !opened) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </TouchableOpacity>
        <View style={styles.viewingContent}>
          <Text style={styles.viewOnceLabel}>🔒 View Once</Text>
          <Text style={styles.tapToOpen}>Tap to reveal content</Text>
          <Text style={styles.warning}>Content will disappear after viewing</Text>
          
          <TouchableOpacity style={styles.openBtn} onPress={handleOpen}>
            <Text style={styles.openBtnIcon}>
              {content.type === 'image' ? '📷' : '🎥'}
            </Text>
            <Text style={styles.openBtnText}>Open</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Opened Step
  if (step === 'opened') {
    return (
      <View style={styles.container}>
        <View style={styles.openedHeader}>
          <Text style={styles.openedLabel}>🔒 View Once</Text>
          <Text style={styles.openedTimer}>Disappearing...</Text>
        </View>
        
        {content.type === 'image' && (
          <Image source={{ uri: content.content }} style={styles.fullMedia} resizeMode="contain" />
        )}
        {content.type === 'video' && (
          <View style={styles.videoPlaceholder}>
            <Text style={styles.videoIcon}>🎥</Text>
            <Text style={styles.videoText}>Video playing...</Text>
          </View>
        )}
        
        {content.caption && (
          <View style={styles.captionBar}>
            <Text style={styles.captionText}>{content.caption}</Text>
          </View>
        )}
        
        <Text style={styles.disappearingNote}>
          📸 Screenshot blocked • This will disappear
        </Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 },
  closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10, width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  closeText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  
  // Preview
  previewContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  lockIcon: { fontSize: 80, marginBottom: SPACING.lg },
  previewTitle: { color: '#FFF', fontSize: FONTS.sizes.xxl, fontWeight: 'bold' },
  previewAmount: { color: '#25D366', fontSize: FONTS.sizes.hero, fontWeight: 'bold', marginVertical: SPACING.sm },
  previewInfo: { color: '#999', fontSize: FONTS.sizes.sm, textAlign: 'center' },
  previewCaption: { color: '#FFF', fontSize: FONTS.sizes.sm, fontStyle: 'italic', marginTop: SPACING.sm },
  previewNote: { color: '#FF9800', fontSize: FONTS.sizes.xs, marginTop: SPACING.lg },
  previewActions: { padding: SPACING.lg, gap: SPACING.sm },
  
  // Payment
  paymentContent: { flex: 1, justifyContent: 'center', padding: SPACING.xl },
  paymentTitle: { color: '#FFF', fontSize: FONTS.sizes.xl, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.sm },
  paymentDesc: { color: '#999', fontSize: FONTS.sizes.sm, textAlign: 'center', marginBottom: SPACING.lg },
  amountBreakdown: { backgroundColor: '#1A1A2E', padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.lg },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  breakdownLabel: { color: '#999', fontSize: FONTS.sizes.sm },
  breakdownValue: { color: '#FFF', fontSize: FONTS.sizes.sm, fontWeight: '600' },
  mpesaInput: { marginBottom: SPACING.lg },
  inputLabel: { color: '#FFF', fontSize: FONTS.sizes.sm, marginBottom: SPACING.xs },
  input: { backgroundColor: '#1A1A2E', color: '#FFF', padding: SPACING.md, borderRadius: 12, fontSize: FONTS.sizes.lg, borderWidth: 1, borderColor: '#25D366', textAlign: 'center', fontWeight: 'bold' },
  
  // Viewing
  viewingContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  viewOnceLabel: { color: '#25D366', fontSize: FONTS.sizes.lg, fontWeight: 'bold', marginBottom: SPACING.md },
  tapToOpen: { color: '#FFF', fontSize: FONTS.sizes.md, marginBottom: SPACING.xl },
  warning: { color: '#FF9800', fontSize: FONTS.sizes.xs, marginBottom: SPACING.xl },
  openBtn: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#25D366', justifyContent: 'center', alignItems: 'center' },
  openBtnIcon: { fontSize: 40, marginBottom: 4 },
  openBtnText: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  
  // Opened
  openedHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingTop: 50, paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  openedLabel: { color: '#25D366', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  openedTimer: { color: '#FF9800', fontSize: FONTS.sizes.sm },
  fullMedia: { flex: 1, width, height: height * 0.7 },
  videoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  videoIcon: { fontSize: 60 },
  videoText: { color: '#FFF', marginTop: SPACING.md },
  captionBar: { padding: SPACING.md, backgroundColor: 'rgba(0,0,0,0.5)' },
  captionText: { color: '#FFF', fontSize: FONTS.sizes.sm, textAlign: 'center' },
  disappearingNote: { color: '#FF9800', fontSize: FONTS.sizes.xs, textAlign: 'center', padding: SPACING.md, position: 'absolute', bottom: 40, left: 0, right: 0 },
});

export default ViewOnceViewer;
