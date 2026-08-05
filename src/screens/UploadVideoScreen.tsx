// screens/UploadVideoScreen.tsx - Upload Creator Video
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Image,
  ScrollView, Alert, Dimensions, Switch, ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import { useToast } from '../../App';

const { width, height } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', name: 'General', icon: '📱' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'comedy', name: 'Comedy', icon: '😂' },
  { id: 'dance', name: 'Dance', icon: '💃' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'food', name: 'Food', icon: '🍔' },
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  { id: 'tech', name: 'Tech', icon: '💻' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
];

interface UploadVideoScreenProps {
  onClose: () => void;
  onUploaded: (videoData: any) => void;
  userId: number;
}

const UploadVideoScreen: React.FC<UploadVideoScreenProps> = ({ onClose, onUploaded, userId }) => {
  const { showToast } = useToast();
  
  // Steps: select -> record -> preview -> details -> uploading
  const [step, setStep] = useState<'select' | 'record' | 'preview' | 'details' | 'uploading'>('select');
  
  // Video
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  
  // Details
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('all');
  const [hashtags, setHashtags] = useState('');
  const [musicTitle, setMusicTitle] = useState('');
  const [musicArtist, setMusicArtist] = useState('');
  
  // Settings
  const [allowComments, setAllowComments] = useState(true);
  const [allowDuet, setAllowDuet] = useState(true);
  const [allowStitch, setAllowStitch] = useState(true);
  const [privacy, setPrivacy] = useState<'public' | 'followers' | 'private'>('public');
  const [saveToDrafts, setSaveToDrafts] = useState(false);
  
  // Camera
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>('back');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const cameraRef = useRef<any>(null);
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);

  // ============================================
  // RECORD VIDEO
  // ============================================
  const startRecording = async () => {
    if (cameraRef.current) {
      try {
        setIsRecording(true);
        setRecordingTime(0);
        
        recordingTimer.current = setInterval(() => {
          setRecordingTime(prev => {
            if (prev >= 60) {
              stopRecording();
              return 60;
            }
            return prev + 1;
          });
        }, 1000);

        const video = await cameraRef.current.recordAsync({
          maxDuration: 60,
          quality: '720p',
        });
        
        setVideoUri(video.uri);
        setStep('preview');
      } catch (error) {
        showToast('Failed to record video');
      }
      setIsRecording(false);
      if (recordingTimer.current) clearInterval(recordingTimer.current);
    }
  };

  const stopRecording = () => {
    if (cameraRef.current && isRecording) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
      if (recordingTimer.current) clearInterval(recordingTimer.current);
    }
  };

  // ============================================
  // PICK FROM GALLERY
  // ============================================
  const pickFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Gallery access needed to select videos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.8,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets[0]) {
      setVideoUri(result.assets[0].uri);
      setStep('preview');
    }
  };

  // ============================================
  // UPLOAD
  // ============================================
  const handleUpload = async () => {
    if (!videoUri) {
      showToast('Please select a video');
      return;
    }

    setStep('uploading');
    
    // Simulate upload
    setTimeout(() => {
      const videoData = {
        id: `cv_${Date.now()}`,
        videoUri,
        thumbnailUri: thumbnailUri || videoUri,
        caption: caption.trim(),
        category,
        hashtags: hashtags.split(/[\s,]+/).filter(h => h.startsWith('#')).map(h => h.replace('#', '')),
        musicTitle: musicTitle.trim() || undefined,
        musicArtist: musicArtist.trim() || undefined,
        allowComments,
        allowDuet,
        allowStitch,
        privacy,
      };

      if (saveToDrafts) {
        showToast('📝 Saved to drafts!');
      } else {
        showToast('🎉 Video uploaded successfully!');
        onUploaded(videoData);
      }
      
      onClose();
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ============================================
  // RENDER: SELECT MODE
  // ============================================
  if (step === 'select') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Create Video</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.selectContainer}>
          <Text style={styles.selectTitle}>Add Your Content</Text>
          <Text style={styles.selectSubtitle}>Choose how to create your video</Text>

          {/* Record Video */}
          <TouchableOpacity 
            style={styles.optionCard} 
            onPress={async () => {
              if (!permission?.granted) await requestPermission();
              if (permission?.granted) setStep('record');
            }}
          >
            <View style={[styles.optionIcon, { backgroundColor: '#F44336' }]}>
              <Text style={styles.optionEmoji}>🎥</Text>
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionName}>Record Video</Text>
              <Text style={styles.optionDesc}>Record up to 60 seconds</Text>
            </View>
            <Text style={styles.optionArrow}>→</Text>
          </TouchableOpacity>

          {/* Gallery */}
          <TouchableOpacity style={styles.optionCard} onPress={pickFromGallery}>
            <View style={[styles.optionIcon, { backgroundColor: '#9C27B0' }]}>
              <Text style={styles.optionEmoji}>🖼️</Text>
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionName}>From Gallery</Text>
              <Text style={styles.optionDesc}>Pick a video from your device</Text>
            </View>
            <Text style={styles.optionArrow}>→</Text>
          </TouchableOpacity>

          {/* Drafts */}
          <TouchableOpacity style={styles.optionCard} onPress={() => showToast('Opening drafts...')}>
            <View style={[styles.optionIcon, { backgroundColor: '#FF9800' }]}>
              <Text style={styles.optionEmoji}>📝</Text>
            </View>
            <View style={styles.optionInfo}>
              <Text style={styles.optionName}>Continue Draft</Text>
              <Text style={styles.optionDesc}>Resume from saved drafts</Text>
            </View>
            <Text style={styles.optionArrow}>→</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ============================================
  // RENDER: RECORD MODE
  // ============================================
  if (step === 'record' && permission?.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.camHeader}>
          <TouchableOpacity onPress={() => setStep('select')}>
            <Text style={styles.closeBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Record Video</Text>
          <TouchableOpacity onPress={() => setFacing(f => f === 'back' ? 'front' : 'back')}>
            <Text style={styles.flipBtn}>🔄</Text>
          </TouchableOpacity>
        </View>

        <CameraView ref={cameraRef} style={styles.camera} facing={facing} mode="video">
          {isRecording && (
            <View style={styles.recIndicator}>
              <View style={styles.recDot} />
              <Text style={styles.recTime}>{formatTime(recordingTime)}</Text>
            </View>
          )}
          
          <View style={styles.camControls}>
            <TouchableOpacity 
              style={[styles.recordBtn, isRecording && styles.recordingActive]}
              onPress={isRecording ? stopRecording : startRecording}
            >
              <View style={[styles.recordInner, isRecording && styles.recordInnerActive]} />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    );
  }

  // ============================================
  // RENDER: PREVIEW MODE
  // ============================================
  if (step === 'preview' && videoUri) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep('select')}>
            <Text style={styles.closeBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Preview</Text>
          <TouchableOpacity onPress={() => setStep('details')}>
            <Text style={styles.nextBtn}>Next →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.previewContainer}>
          <Image 
            source={{ uri: thumbnailUri || videoUri }} 
            style={styles.preview} 
            resizeMode="cover"
          />
          <View style={styles.playOverlay}>
            <Text style={styles.playIcon}>▶️</Text>
          </View>
        </View>

        <View style={styles.previewActions}>
          <Button title="Use This Video" icon="✅" onPress={() => setStep('details')} variant="primary" />
          <Button title="Retake" icon="🔄" onPress={() => setStep('record')} variant="outline" />
        </View>
      </View>
    );
  }

  // ============================================
  // RENDER: DETAILS MODE
  // ============================================
  if (step === 'details') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setStep('preview')}>
            <Text style={styles.closeBtn}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Video Details</Text>
          <TouchableOpacity onPress={handleUpload}>
            <Text style={styles.postBtn}>Post</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.detailsContent}>
          {/* Caption */}
          <Text style={styles.inputLabel}>Caption</Text>
          <TextInput
            style={styles.captionInput}
            value={caption}
            onChangeText={setCaption}
            placeholder="Write a caption for your video..."
            placeholderTextColor="#999"
            multiline
            maxLength={500}
          />

          {/* Category */}
          <Text style={styles.inputLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catList}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.catBtn, category === cat.id && styles.catBtnActive]}
                onPress={() => setCategory(cat.id)}
              >
                <Text style={styles.catIcon}>{cat.icon}</Text>
                <Text style={[styles.catText, category === cat.id && styles.catTextActive]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Hashtags */}
          <Text style={styles.inputLabel}>Hashtags</Text>
          <TextInput
            style={styles.tagInput}
            value={hashtags}
            onChangeText={setHashtags}
            placeholder="#tag1 #tag2 #tag3"
            placeholderTextColor="#999"
          />

          {/* Music */}
          <Text style={styles.inputLabel}>Music (Optional)</Text>
          <View style={styles.musicRow}>
            <TextInput
              style={[styles.musicInput, { flex: 1 }]}
              value={musicTitle}
              onChangeText={setMusicTitle}
              placeholder="Song title"
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.musicInput, { flex: 1 }]}
              value={musicArtist}
              onChangeText={setMusicArtist}
              placeholder="Artist"
              placeholderTextColor="#999"
            />
          </View>

          {/* Settings */}
          <Text style={styles.sectionTitle}>Settings</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Allow Comments</Text>
            <Switch value={allowComments} onValueChange={setAllowComments} trackColor={{ false: '#E0E0E0', true: '#4CAF50' }} />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Allow Duet</Text>
            <Switch value={allowDuet} onValueChange={setAllowDuet} trackColor={{ false: '#E0E0E0', true: '#4CAF50' }} />
          </View>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Allow Stitch</Text>
            <Switch value={allowStitch} onValueChange={setAllowStitch} trackColor={{ false: '#E0E0E0', true: '#4CAF50' }} />
          </View>

          {/* Privacy */}
          <Text style={styles.sectionTitle}>Privacy</Text>
          <View style={styles.privacyRow}>
            {[
              { id: 'public' as const, label: '🌍 Public', desc: 'Everyone can see' },
              { id: 'followers' as const, label: '👥 Followers', desc: 'Only followers' },
              { id: 'private' as const, label: '🔒 Private', desc: 'Only you' },
            ].map(opt => (
              <TouchableOpacity
                key={opt.id}
                style={[styles.privacyOption, privacy === opt.id && styles.privacyActive]}
                onPress={() => setPrivacy(opt.id)}
              >
                <Text style={[styles.privacyText, privacy === opt.id && styles.privacyTextActive]}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Save to Drafts */}
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Save to Drafts</Text>
            <Switch value={saveToDrafts} onValueChange={setSaveToDrafts} trackColor={{ false: '#E0E0E0', true: '#FF9800' }} />
          </View>

          {/* Post Button */}
          <Button 
            title={saveToDrafts ? "💾 Save to Drafts" : "🚀 Post Video"} 
            icon={saveToDrafts ? "💾" : "🚀"} 
            onPress={handleUpload} 
            variant="primary" 
          />
        </ScrollView>
      </View>
    );
  }

  // ============================================
  // RENDER: UPLOADING
  // ============================================
  if (step === 'uploading') {
    return (
      <View style={styles.container}>
        <View style={styles.uploadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.uploadingTitle}>Uploading Video...</Text>
          <Text style={styles.uploadingSubtitle}>Please wait while we process your video</Text>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  closeBtn: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  nextBtn: { color: '#25D366', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  postBtn: { color: '#25D366', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  
  // Select
  selectContainer: { padding: SPACING.lg },
  selectTitle: { fontSize: FONTS.sizes.xxl, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  selectSubtitle: { fontSize: FONTS.sizes.sm, color: '#999', marginBottom: SPACING.lg },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', padding: SPACING.lg, borderRadius: 16, marginBottom: SPACING.md, gap: SPACING.md },
  optionIcon: { width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  optionEmoji: { fontSize: 24 },
  optionInfo: { flex: 1 },
  optionName: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: '#FFF' },
  optionDesc: { fontSize: FONTS.sizes.sm, color: '#999' },
  optionArrow: { fontSize: 24, color: '#666' },
  
  // Camera
  camHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  flipBtn: { color: '#FFF', fontSize: 24 },
  camera: { flex: 1 },
  recIndicator: { position: 'absolute', top: 100, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(244,67,54,0.8)', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 20, gap: SPACING.sm },
  recDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFF' },
  recTime: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  camControls: { position: 'absolute', bottom: 50, left: 0, right: 0, alignItems: 'center' },
  recordBtn: { width: 76, height: 76, borderRadius: 38, borderWidth: 4, borderColor: '#FFF', justifyContent: 'center', alignItems: 'center' },
  recordingActive: { borderColor: '#F44336', transform: [{ scale: 1.1 }] },
  recordInner: { width: 62, height: 62, borderRadius: 31, backgroundColor: '#F44336' },
  recordInnerActive: { width: 30, height: 30, borderRadius: 4 },
  
  // Preview
  previewContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  preview: { width, height: width, resizeMode: 'cover' },
  playOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  playIcon: { fontSize: 50, color: '#FFF' },
  previewActions: { padding: SPACING.lg, gap: SPACING.sm },
  
  // Details
  detailsContent: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  inputLabel: { color: '#FFF', fontSize: FONTS.sizes.sm, fontWeight: '600', marginBottom: SPACING.xs, marginTop: SPACING.md },
  captionInput: { backgroundColor: '#1A1A2E', color: '#FFF', borderRadius: 12, padding: SPACING.md, fontSize: FONTS.sizes.sm, minHeight: 80, textAlignVertical: 'top' },
  catList: { gap: SPACING.sm, paddingVertical: SPACING.sm },
  catBtn: { alignItems: 'center', padding: SPACING.sm, borderRadius: 12, backgroundColor: '#1A1A2E', minWidth: 70 },
  catBtnActive: { backgroundColor: COLORS.primary },
  catIcon: { fontSize: 20, marginBottom: 2 },
  catText: { color: '#999', fontSize: 10 }, catTextActive: { color: '#FFF', fontWeight: 'bold' },
  tagInput: { backgroundColor: '#1A1A2E', color: '#FFF', borderRadius: 12, padding: SPACING.md, fontSize: FONTS.sizes.sm },
  musicRow: { flexDirection: 'row', gap: SPACING.sm },
  musicInput: { backgroundColor: '#1A1A2E', color: '#FFF', borderRadius: 12, padding: SPACING.md, fontSize: FONTS.sizes.sm },
  sectionTitle: { color: '#999', fontSize: FONTS.sizes.xs, fontWeight: '600', textTransform: 'uppercase', marginTop: SPACING.lg, marginBottom: SPACING.sm },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#222' },
  settingLabel: { color: '#FFF', fontSize: FONTS.sizes.sm },
  privacyRow: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm },
  privacyOption: { flex: 1, padding: SPACING.md, borderRadius: 10, backgroundColor: '#1A1A2E', alignItems: 'center' },
  privacyActive: { backgroundColor: COLORS.primary },
  privacyText: { color: '#999', fontSize: FONTS.sizes.xs }, privacyTextActive: { color: '#FFF', fontWeight: 'bold' },
  
  // Uploading
  uploadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  uploadingTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold', marginTop: SPACING.lg },
  uploadingSubtitle: { color: '#999', fontSize: FONTS.sizes.sm, marginTop: SPACING.sm },
  progressBar: { width: '80%', height: 4, backgroundColor: '#333', borderRadius: 2, marginTop: SPACING.lg, overflow: 'hidden' },
  progressFill: { width: '60%', height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
});

export default UploadVideoScreen;
