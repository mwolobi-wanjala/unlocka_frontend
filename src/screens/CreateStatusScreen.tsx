// screens/CreateStatusScreen.tsx - Create Status
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, Image,
  Dimensions, ScrollView, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import { useToast } from '../../App';

const { width } = Dimensions.get('window');
const COLORS_LIST = ['#6C63FF', '#FF6584', '#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#00BCD4', '#FF5722', '#607D8B', '#795548'];

interface CreateStatusScreenProps {
  userId: number;
  onClose: () => void;
  onCreated: () => void;
}

const CreateStatusScreen: React.FC<CreateStatusScreenProps> = ({ userId, onClose, onCreated }) => {
  const { showToast } = useToast();
  const [mode, setMode] = useState<'select' | 'text' | 'preview'>('select');
  const [textContent, setTextContent] = useState('');
  const [bgColor, setBgColor] = useState('#6C63FF');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setMode('preview');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission', 'Camera access needed'); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setMode('preview');
    }
  };

  const handlePost = async () => {
    showToast('✅ Status posted!');
    onCreated();
    onClose();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Add Status</Text>
        <TouchableOpacity onPress={handlePost}>
          <Text style={styles.postBtn}>Post</Text>
        </TouchableOpacity>
      </View>

      {mode === 'select' && (
        <View style={styles.selectContainer}>
          <TouchableOpacity style={styles.optionCard} onPress={() => setMode('text')}>
            <Text style={styles.optionIcon}>📝</Text>
            <View><Text style={styles.optionTitle}>Text</Text><Text style={styles.optionDesc}>Share a text update</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard} onPress={pickFromGallery}>
            <Text style={styles.optionIcon}>🖼️</Text>
            <View><Text style={styles.optionTitle}>Photo/Video</Text><Text style={styles.optionDesc}>Choose from gallery</Text></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionCard} onPress={takePhoto}>
            <Text style={styles.optionIcon}>📷</Text>
            <View><Text style={styles.optionTitle}>Camera</Text><Text style={styles.optionDesc}>Take a photo</Text></View>
          </TouchableOpacity>
        </View>
      )}

      {mode === 'text' && (
        <View style={[styles.textContainer, { backgroundColor: bgColor }]}>
          <TextInput style={[styles.textInput]} value={textContent} onChangeText={setTextContent} placeholder="Type a status..." placeholderTextColor="rgba(255,255,255,0.5)" multiline maxLength={500} autoFocus />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.colorPicker}>
            {COLORS_LIST.map(color => (
              <TouchableOpacity key={color} style={[styles.colorDot, { backgroundColor: color }, bgColor === color && styles.selectedColor]} onPress={() => setBgColor(color)} />
            ))}
          </ScrollView>
          <TextInput style={styles.captionInput} value={caption} onChangeText={setCaption} placeholder="Add a caption..." placeholderTextColor="rgba(255,255,255,0.5)" />
        </View>
      )}

      {mode === 'preview' && selectedImage && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: selectedImage }} style={styles.preview} resizeMode="contain" />
          <TextInput style={styles.previewCaption} value={caption} onChangeText={setCaption} placeholder="Add a caption..." placeholderTextColor="#999" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: SPACING.md, paddingBottom: SPACING.md },
  closeBtn: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  postBtn: { color: '#25D366', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  selectContainer: { padding: SPACING.lg },
  optionCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1A1A2E', padding: SPACING.lg, borderRadius: 16, marginBottom: SPACING.md, gap: SPACING.md },
  optionIcon: { fontSize: 30 }, optionTitle: { fontSize: FONTS.sizes.lg, fontWeight: '600', color: '#FFF' }, optionDesc: { fontSize: FONTS.sizes.sm, color: '#999' },
  textContainer: { flex: 1, padding: SPACING.lg, justifyContent: 'center' },
  textInput: { fontSize: FONTS.sizes.xxl, color: '#FFF', textAlign: 'center', minHeight: 100 },
  colorPicker: { marginTop: SPACING.lg },
  colorDot: { width: 36, height: 36, borderRadius: 18, marginRight: SPACING.sm, borderWidth: 2, borderColor: 'transparent' },
  selectedColor: { borderColor: '#FFF', transform: [{ scale: 1.2 }] },
  captionInput: { color: '#FFF', marginTop: SPACING.lg, fontSize: FONTS.sizes.md, textAlign: 'center' },
  previewContainer: { flex: 1 },
  preview: { width, height: width, resizeMode: 'contain' },
  previewCaption: { color: '#FFF', padding: SPACING.md, fontSize: FONTS.sizes.md, textAlign: 'center' },
});

export default CreateStatusScreen;
