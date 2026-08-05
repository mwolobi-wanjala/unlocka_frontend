// screens/SendViewOnceScreen.tsx - Send View Once Content
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  Image, ScrollView, Alert, Dimensions, FlatList, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import { VIEW_ONCE_MIN_AMOUNT, VIEW_ONCE_MAX_AMOUNT } from '../types/viewOnce';
import { useToast } from '../../App';

const { width, height } = Dimensions.get('window');

interface Contact {
  id: number; name: string; phone: string;
  hasMutualContact: boolean; isRegistered: boolean;
}

interface SendViewOnceScreenProps {
  onClose: () => void;
  onSent: (data: any) => void;
  senderId: number;
  senderName: string;
}

const SendViewOnceScreen: React.FC<SendViewOnceScreenProps> = ({ onClose, onSent, senderId, senderName }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<'contact' | 'camera' | 'preview' | 'amount' | 'confirm' | 'sending'>('contact');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [mediaUri, setMediaUri] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [caption, setCaption] = useState('');
  const [amount, setAmount] = useState('50');

  useEffect(() => { loadContacts(); }, []);

  const loadContacts = async () => {
    setLoadingContacts(true);
    setContacts([
      { id: 2, name: 'Admin Test', phone: '0798765432', hasMutualContact: true, isRegistered: true },
      { id: 3, name: 'Jane Doe', phone: '0723456789', hasMutualContact: true, isRegistered: true },
      { id: 4, name: 'John Smith', phone: '0734567890', hasMutualContact: true, isRegistered: true },
    ]);
    setLoadingContacts(false);
  };

  const filteredContacts = contacts.filter(c =>
    c.hasMutualContact && c.isRegistered &&
    (searchQuery === '' || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery))
  );

  const pickFromGallery = async (type: 'image' | 'video') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission', 'Gallery access needed'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, quality: 0.8, videoMaxDuration: 30,
    });
    if (!result.canceled && result.assets[0]) {
      setMediaUri(result.assets[0].uri); setMediaType(type); setStep('preview');
    }
  };

  const isValidAmount = (val: string): boolean => {
    const num = parseInt(val);
    return !isNaN(num) && num >= VIEW_ONCE_MIN_AMOUNT && num <= VIEW_ONCE_MAX_AMOUNT;
  };

  const handleSend = () => {
    if (!selectedContact) { showToast('Select a contact'); return; }
    if (!mediaUri) { showToast('Capture or select media'); return; }
    if (!isValidAmount(amount)) { showToast(`Amount must be between ${VIEW_ONCE_MIN_AMOUNT} and ${VIEW_ONCE_MAX_AMOUNT} KSH`); return; }
    setStep('sending');
    setTimeout(() => {
      showToast(`✅ View once sent to ${selectedContact.name}!`);
      onSent({ id: `vo_${Date.now()}`, senderName, recipientName: selectedContact.name, type: mediaType, content: mediaUri, amount: parseInt(amount) });
      onClose();
    }, 1500);
  };

  // STEP 1: SELECT CONTACT
  if (step === 'contact') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Send View Once</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>Send photo/video that disappears after viewing. Recipient pays to unlock.</Text>
        </View>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} placeholder="Search contacts..." placeholderTextColor="#999" />
        </View>
        {loadingContacts ? (
          <View style={styles.loadingContainer}><ActivityIndicator size="large" color={COLORS.primary} /></View>
        ) : (
          <FlatList
            data={filteredContacts}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity style={[styles.contactItem, selectedContact?.id === item.id && styles.selectedContact]} onPress={() => { setSelectedContact(item); setStep('camera'); }}>
                <View style={styles.avatar}><Text style={styles.avatarText}>{item.name.charAt(0)}</Text></View>
                <View style={styles.contactInfo}><Text style={styles.contactName}>{item.name}</Text><Text style={styles.contactPhone}>{item.phone}</Text></View>
                <Text style={styles.arrow}>→</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    );
  }

  // STEP 2: CAMERA/GALLERY
  if (step === 'camera') {
    return (
      <View style={styles.container}>
        <View style={styles.camHeader}>
          <TouchableOpacity onPress={() => setStep('contact')}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>To: {selectedContact?.name}</Text>
          <View style={styles.camActions}>
            <TouchableOpacity onPress={() => pickFromGallery('image')}><Text style={styles.galleryBtn}>🖼️</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.cameraPlaceholder}>
          <Text style={styles.cameraIcon}>📷</Text>
          <Text style={styles.cameraText}>Tap to capture</Text>
          <TouchableOpacity style={styles.captureBtn} onPress={() => pickFromGallery('image')}>
            <Text style={styles.captureText}>📷 Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.captureBtn, { backgroundColor: '#FF9800' }]} onPress={() => pickFromGallery('video')}>
            <Text style={styles.captureText}>🎥 Pick Video</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.modeToggle}>
          <TouchableOpacity style={[styles.modeBtn, mediaType === 'image' && styles.modeActive]} onPress={() => setMediaType('image')}>
            <Text style={styles.modeText}>📷 Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.modeBtn, mediaType === 'video' && styles.modeActive]} onPress={() => setMediaType('video')}>
            <Text style={styles.modeText}>🎥 Video</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // STEP 3: PREVIEW
  if (step === 'preview' && mediaUri) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep('camera')}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Preview</Text>
          <TouchableOpacity onPress={() => setStep('amount')}><Text style={styles.nextBtn}>Next →</Text></TouchableOpacity>
        </View>
        <View style={styles.previewContainer}>
          <Image source={{ uri: mediaUri }} style={styles.preview} resizeMode="contain" />
        </View>
        <View style={styles.captionBar}>
          <TextInput style={styles.captionInput} value={caption} onChangeText={setCaption} placeholder="Add caption... (optional)" placeholderTextColor="#999" maxLength={200} />
        </View>
        <View style={styles.previewInfo}>
          <Text style={styles.previewInfoText}>📤 To: <Text style={styles.bold}>{selectedContact?.name}</Text></Text>
          <Text style={styles.previewInfoText}>🔒 Disappears after viewing once</Text>
        </View>
        <View style={styles.previewActions}>
          <Button title="Next: Set Price" icon="💰" onPress={() => setStep('amount')} variant="primary" />
          <Button title="Retake" icon="📷" onPress={() => setStep('camera')} variant="outline" />
        </View>
      </View>
    );
  }

  // STEP 4: SET AMOUNT
  if (step === 'amount') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep('preview')}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Set Price</Text>
        </View>
        <ScrollView contentContainerStyle={styles.amountContent}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>📋 Summary</Text>
            <Text style={styles.summaryText}>To: {selectedContact?.name}</Text>
            <Text style={styles.summaryText}>Type: {mediaType === 'image' ? '📷 Photo' : '🎥 Video'}</Text>
          </View>
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>How much to charge?</Text>
            <View style={styles.amountInputRow}>
              <Text style={styles.currencyLabel}>KSH</Text>
              <TextInput style={styles.amountInput} value={amount} onChangeText={(t) => setAmount(t.replace(/[^0-9]/g, ''))} placeholder="50" placeholderTextColor="#999" keyboardType="number-pad" maxLength={3} />
            </View>
            <Text style={styles.amountHint}>Min: KSH {VIEW_ONCE_MIN_AMOUNT} • Max: KSH {VIEW_ONCE_MAX_AMOUNT}</Text>
            <View style={styles.quickAmounts}>
              {[20, 50, 100, 200, 300, 500].map(val => (
                <TouchableOpacity key={val} style={[styles.quickBtn, amount === val.toString() && styles.quickBtnActive]} onPress={() => setAmount(val.toString())}>
                  <Text style={[styles.quickText, amount === val.toString() && styles.quickTextActive]}>{val}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {amount && parseInt(amount) > 0 && isValidAmount(amount) && (
              <View style={styles.earningsBox}>
                <Text style={styles.earningsTitle}>💰 You'll Earn: KSH {Math.round(parseInt(amount) * 0.9)}</Text>
                <Text style={styles.earningsNote}>(90% of KSH {amount})</Text>
              </View>
            )}
          </View>
          <View style={styles.actionButtons}>
            <Button title="Review & Send" icon="📤" onPress={() => setStep('confirm')} variant="primary" disabled={!isValidAmount(amount)} />
            <Button title="← Back" onPress={() => setStep('preview')} variant="outline" />
          </View>
        </ScrollView>
      </View>
    );
  }

  // STEP 5: CONFIRM & SEND
  const amt = parseInt(amount) || 0;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setStep('amount')}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Confirm & Send</Text>
      </View>
      <ScrollView contentContainerStyle={styles.confirmContent}>
        <View style={styles.confirmCard}>
          <Text style={styles.confirmTitle}>📋 Summary</Text>
          <View style={styles.confirmRow}><Text style={styles.confirmLabel}>To:</Text><Text style={styles.confirmValue}>{selectedContact?.name}</Text></View>
          <View style={styles.confirmRow}><Text style={styles.confirmLabel}>Amount:</Text><Text style={styles.confirmAmount}>KSH {amt}</Text></View>
          <View style={styles.confirmRow}><Text style={styles.confirmLabel}>You earn:</Text><Text style={styles.confirmEarn}>KSH {Math.round(amt * 0.9)}</Text></View>
        </View>
        <View style={styles.disappearingNotice}>
          <Text style={styles.disappearingIcon}>⚠️</Text>
          <View style={styles.disappearingInfo}>
            <Text style={styles.disappearingTitle}>View Once - Disappears After Viewing</Text>
            <Text style={styles.disappearingText}>• Content disappears after being viewed once{'\n'}• Recipient pays KSH {amt} to view{'\n'}• Screenshots blocked{'\n'}• End-to-end encrypted</Text>
          </View>
        </View>
        <Button title={step === 'sending' ? '⏳ Sending...' : `📤 Send • KSH ${amt}`} icon="📤" onPress={handleSend} loading={step === 'sending'} variant="primary" />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  closeBtn: { fontSize: 22, color: COLORS.dark }, backBtn: { fontSize: 22, color: COLORS.primary },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark },
  nextBtn: { color: '#4CAF50', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  infoBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E3F2FD', padding: SPACING.sm, paddingHorizontal: SPACING.md, gap: SPACING.sm },
  infoIcon: { fontSize: 14 }, infoText: { flex: 1, fontSize: FONTS.sizes.xs, color: '#1565C0' },
  searchBar: { flexDirection: 'row', alignItems: 'center', margin: SPACING.md, backgroundColor: '#F5F5F5', borderRadius: 12, paddingHorizontal: SPACING.md },
  searchIcon: { fontSize: 16, marginRight: SPACING.sm }, searchInput: { flex: 1, padding: SPACING.md, fontSize: FONTS.sizes.md },
  contactItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderRadius: 12, marginHorizontal: SPACING.md, marginBottom: SPACING.sm, backgroundColor: '#FAFAFA' },
  selectedContact: { backgroundColor: '#E8F5E9', borderWidth: 1, borderColor: '#4CAF50' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  avatarText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  contactInfo: { flex: 1 }, contactName: { fontSize: FONTS.sizes.md, fontWeight: '600' }, contactPhone: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  arrow: { fontSize: 20, color: COLORS.gray },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  camHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  camActions: { flexDirection: 'row', gap: SPACING.md }, galleryBtn: { fontSize: 22 },
  cameraPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  cameraIcon: { fontSize: 60, marginBottom: SPACING.md }, cameraText: { color: '#FFF', fontSize: FONTS.sizes.md, marginBottom: SPACING.lg },
  captureBtn: { backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.md, borderRadius: 25, marginBottom: SPACING.sm },
  captureText: { color: '#FFF', fontWeight: 'bold', fontSize: FONTS.sizes.md },
  modeToggle: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.md, padding: SPACING.md, backgroundColor: '#000' },
  modeBtn: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: 20, backgroundColor: '#333' },
  modeActive: { backgroundColor: COLORS.primary }, modeText: { color: '#FFF' },
  previewContainer: { flex: 1, backgroundColor: '#000' },
  preview: { width, height: width, resizeMode: 'contain' },
  captionBar: { padding: SPACING.md },
  captionInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: SPACING.md, fontSize: FONTS.sizes.sm },
  previewInfo: { padding: SPACING.md, backgroundColor: '#F8F9FA' },
  previewInfoText: { fontSize: FONTS.sizes.sm, color: COLORS.dark, marginBottom: 4 }, bold: { fontWeight: 'bold' },
  previewActions: { padding: SPACING.md, gap: SPACING.sm },
  amountContent: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  summaryCard: { backgroundColor: '#F8F9FA', padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.md },
  summaryTitle: { fontSize: FONTS.sizes.md, fontWeight: 'bold', marginBottom: SPACING.sm },
  summaryText: { fontSize: FONTS.sizes.sm, color: COLORS.dark, marginBottom: 4 },
  amountCard: { backgroundColor: '#FFF', padding: SPACING.lg, borderRadius: 16, ...SHADOWS.medium },
  amountLabel: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  amountInputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: COLORS.primary, borderRadius: 12, overflow: 'hidden', marginBottom: SPACING.sm },
  currencyLabel: { backgroundColor: COLORS.primary, color: '#FFF', fontWeight: 'bold', padding: SPACING.md, paddingHorizontal: SPACING.lg, fontSize: FONTS.sizes.md },
  amountInput: { flex: 1, fontSize: FONTS.sizes.xxl, fontWeight: 'bold', textAlign: 'center', padding: SPACING.sm, color: COLORS.dark },
  amountHint: { fontSize: FONTS.sizes.xs, color: COLORS.gray, textAlign: 'center', marginBottom: SPACING.md },
  quickAmounts: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.md },
  quickBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 20, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0' },
  quickBtnActive: { backgroundColor: '#E8F5E9', borderColor: '#4CAF50' },
  quickText: { fontSize: FONTS.sizes.sm, color: COLORS.dark }, quickTextActive: { color: '#4CAF50', fontWeight: 'bold' },
  earningsBox: { backgroundColor: '#F0EEFF', padding: SPACING.md, borderRadius: 12, marginTop: SPACING.md, alignItems: 'center' },
  earningsTitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  earningsNote: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  actionButtons: { gap: SPACING.sm, marginTop: SPACING.md },
  confirmContent: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  confirmCard: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, ...SHADOWS.medium, marginBottom: SPACING.md },
  confirmTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  confirmRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm },
  confirmLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray }, confirmValue: { fontSize: FONTS.sizes.sm, fontWeight: '500', color: COLORS.dark },
  confirmAmount: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: '#E65100' },
  confirmEarn: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: '#4CAF50' },
  disappearingNotice: { flexDirection: 'row', backgroundColor: '#FFF3E0', padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.md, gap: SPACING.sm, borderLeftWidth: 4, borderLeftColor: '#FF9800' },
  disappearingIcon: { fontSize: 24 }, disappearingInfo: { flex: 1 },
  disappearingTitle: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: '#E65100', marginBottom: 4 },
  disappearingText: { fontSize: FONTS.sizes.xs, color: '#E65100', lineHeight: 18 },
});

export default SendViewOnceScreen;
