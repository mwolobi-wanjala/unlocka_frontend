// screens/AddStatusScreen.tsx - Add Status with Privacy & Schedule
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Image,
  ScrollView, Alert, Dimensions, Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import Button from '../components/Button';
import StatusPrivacyModal from '../components/status/StatusPrivacyModal';
import StatusScheduler from '../components/status/StatusScheduler';
import StatusMentions from '../components/status/StatusMentions';
import { useToast } from '../../App';

const { width } = Dimensions.get('window');
const BG_COLORS = ['#6C63FF','#FF6584','#4CAF50','#FF9800','#2196F3','#9C27B0','#00BCD4','#FF5722','#607D8B','#795548','#1A1A2E','#16213E','#0F3460','#E94560','#533483'];
const FONT_STYLES = ['Normal', 'Bold', 'Italic', 'Serif', 'Monospace'];
const TEXT_COLORS = ['#FFFFFF', '#FFD700', '#FF6B6B', '#4ECDC4', '#000000'];

interface AddStatusScreenProps {
  onClose: () => void;
  onPost: (statusData: any) => void;
  userId: number;
}

const AddStatusScreen: React.FC<AddStatusScreenProps> = ({ onClose, onPost, userId }) => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'select' | 'text' | 'camera' | 'preview'>('select');
  const [textContent, setTextContent] = useState('');
  const [bgColor, setBgColor] = useState('#6C63FF');
  const [textColor, setTextColor] = useState('#FFFFFF');
  const [fontStyle, setFontStyle] = useState('Normal');
  const [caption, setCaption] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  
  // New features
  const [privacy, setPrivacy] = useState('contacts');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showMentions, setShowMentions] = useState(false);
  const [mentions, setMentions] = useState<any[]>([]);
  
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const cameraRef = useRef<any>(null);

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
        setSelectedMedia(photo.uri); setMediaType('image'); setMode('preview');
      } catch { showToast('Failed to take photo'); }
    }
  };

  const handlePickGallery = async (type: 'image' | 'video') => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission', 'Gallery access needed'); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: type === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, quality: 0.8, videoMaxDuration: 30,
    });
    if (!result.canceled && result.assets[0]) {
      setSelectedMedia(result.assets[0].uri); setMediaType(type); setMode('preview');
    }
  };

  const handlePost = () => {
    let statusData: any = {
      type: 'text', content: textContent, backgroundColor: bgColor,
      textColor, fontStyle, caption: caption.trim(), privacy,
      mentions, scheduled: false,
    };
    if (selectedMedia) {
      statusData = { ...statusData, type: mediaType, content: selectedMedia };
    }
    if (!statusData.content && !selectedMedia) { showToast('Add content'); return; }
    onPost(statusData);
  };

  const handleSchedule = (time: Date) => {
    showToast(`⏰ Status scheduled for ${time.toLocaleTimeString()}`);
    onClose();
  };

  const handleMention = (user: any) => {
    setMentions(prev => [...prev, user]);
    setTextContent(prev => prev + ` @${user.username}`);
  };

  // Select Mode
  if (mode === 'select') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Add Status</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.selectContainer}>
          <Text style={styles.selectTitle}>Create Status</Text>
          {[
            { icon: '📝', name: 'Text', desc: 'Share a text update', color: '#6C63FF', action: () => setMode('text') },
            { icon: '🖼️', name: 'Photo', desc: 'Choose from gallery', color: '#4CAF50', action: () => handlePickGallery('image') },
            { icon: '🎥', name: 'Video', desc: 'Share a video (up to 30s)', color: '#FF9800', action: () => handlePickGallery('video') },
            { icon: '📷', name: 'Camera', desc: 'Take a photo', color: '#F44336', action: async () => {
              if (!permission?.granted) await requestPermission();
              if (permission?.granted) setMode('camera');
            }},
          ].map(opt => (
            <TouchableOpacity key={opt.name} style={styles.optionCard} onPress={opt.action}>
              <View style={[styles.optionIcon, { backgroundColor: opt.color }]}>
                <Text style={styles.optionEmoji}>{opt.icon}</Text>
              </View>
              <View style={styles.optionInfo}>
                <Text style={styles.optionName}>{opt.name}</Text>
                <Text style={styles.optionDesc}>{opt.desc}</Text>
              </View>
              <Text style={styles.optionArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }

  // Text Mode
  if (mode === 'text') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMode('select')}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Text Status</Text>
          <TouchableOpacity onPress={handlePost}><Text style={styles.postBtn}>Post</Text></TouchableOpacity>
        </View>

        <View style={[styles.textEditor, { backgroundColor: bgColor }]}>
          <TextInput style={[styles.textInput, { color: textColor }]} value={textContent} onChangeText={setTextContent} placeholder="Type a status..." placeholderTextColor="rgba(255,255,255,0.4)" multiline maxLength={500} autoFocus />
        </View>

        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>Background</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.colorList}>
            {BG_COLORS.map(c => (
              <TouchableOpacity key={c} style={[styles.colorDot, { backgroundColor: c }, bgColor === c && styles.selectedDot]} onPress={() => setBgColor(c)} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>Font</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.fontList}>
            {FONT_STYLES.map(f => (
              <TouchableOpacity key={f} style={[styles.fontBtn, fontStyle === f && styles.selectedFontBtn]} onPress={() => setFontStyle(f)}>
                <Text style={[styles.fontText, fontStyle === f && styles.selectedFontText]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>Text Color</Text>
          <ScrollView horizontal contentContainerStyle={styles.colorList}>
            {TEXT_COLORS.map(c => (
              <TouchableOpacity key={c} style={[styles.colorDot, { backgroundColor: c }, textColor === c && styles.selectedDot]} onPress={() => setTextColor(c)} />
            ))}
          </ScrollView>
        </View>

        <View style={styles.captionBar}>
          <TextInput style={styles.captionInput} value={caption} onChangeText={setCaption} placeholder="Add a caption..." placeholderTextColor="#999" maxLength={200} />
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowMentions(true)}>
            <Text>@Mention</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowPrivacyModal(true)}>
            <Text>🔒 Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowScheduler(true)}>
            <Text>⏰ Schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Modals */}
        <StatusPrivacyModal visible={showPrivacyModal} currentPrivacy={privacy} onSelect={(p) => { setPrivacy(p); setShowPrivacyModal(false); }} onClose={() => setShowPrivacyModal(false)} />
        <StatusScheduler visible={showScheduler} onSchedule={handleSchedule} onClose={() => setShowScheduler(false)} />
        <StatusMentions visible={showMentions} onSelect={handleMention} onClose={() => setShowMentions(false)} />
      </View>
    );
  }

  // Camera Mode
  if (mode === 'camera' && permission?.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.camHeader}>
          <TouchableOpacity onPress={() => setMode('select')}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}><Text style={styles.flipBtn}>🔄</Text></TouchableOpacity>
        </View>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <View style={styles.camControls}>
            <TouchableOpacity style={styles.captureBtn} onPress={handleTakePhoto}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  // Preview Mode
  if (mode === 'preview' && selectedMedia) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setMode('select')}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Preview</Text>
          <TouchableOpacity onPress={handlePost}><Text style={styles.postBtn}>Post</Text></TouchableOpacity>
        </View>
        <Image source={{ uri: selectedMedia }} style={styles.preview} resizeMode="contain" />
        <View style={styles.captionBar}>
          <TextInput style={styles.captionInput} value={caption} onChangeText={setCaption} placeholder="Add a caption..." placeholderTextColor="#999" />
        </View>
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowPrivacyModal(true)}>
            <Text>🔒 Privacy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowScheduler(true)}>
            <Text>⏰ Schedule</Text>
          </TouchableOpacity>
        </View>
        <StatusPrivacyModal visible={showPrivacyModal} currentPrivacy={privacy} onSelect={(p) => { setPrivacy(p); setShowPrivacyModal(false); }} onClose={() => setShowPrivacyModal(false)} />
        <StatusScheduler visible={showScheduler} onSchedule={handleSchedule} onClose={() => setShowScheduler(false)} />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  closeBtn: { color: '#FFF', fontSize: 22 }, backBtn: { color: '#FFF', fontSize: 22 },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  postBtn: { color: '#25D366', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  selectContainer: { padding: SPACING.lg },
  selectTitle: { fontSize: FONTS.sizes.xxl, fontWeight: 'bold', color: '#FFF', marginBottom: SPACING.lg },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', padding: SPACING.lg, borderRadius: 16, marginBottom: SPACING.md, gap: SPACING.md },
  optionIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  optionEmoji: { fontSize: 24 }, optionInfo: { flex: 1 },
  optionName: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: '#FFF' },
  optionDesc: { fontSize: FONTS.sizes.sm, color: '#999' }, optionArrow: { fontSize: 24, color: '#666' },
  textEditor: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  textInput: { fontSize: FONTS.sizes.xxl, textAlign: 'center', width: '100%', minHeight: 200 },
  toolbar: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  toolbarTitle: { color: '#999', fontSize: 10, fontWeight: '600', marginBottom: SPACING.sm, textTransform: 'uppercase' },
  colorList: { gap: SPACING.sm }, fontList: { gap: SPACING.sm },
  colorDot: { width: 32, height: 32, borderRadius: 16, borderWidth: 2, borderColor: 'transparent' },
  selectedDot: { borderColor: '#FFF', transform: [{ scale: 1.2 }] },
  fontBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.1)' },
  selectedFontBtn: { backgroundColor: '#25D366' },
  fontText: { color: '#999', fontSize: FONTS.sizes.sm }, selectedFontText: { color: '#FFF', fontWeight: 'bold' },
  captionBar: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, backgroundColor: '#111' },
  captionInput: { color: '#FFF', fontSize: FONTS.sizes.sm },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around', padding: SPACING.md },
  actionBtn: { padding: SPACING.sm, backgroundColor: '#222', borderRadius: 10 },
  camHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  flipBtn: { color: '#FFF', fontSize: 24 },
  camera: { flex: 1 },
  camControls: { position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center' },
  captureBtn: { width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  captureInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF' },
  preview: { width, height: width, resizeMode: 'contain' },
});

export default AddStatusScreen;
