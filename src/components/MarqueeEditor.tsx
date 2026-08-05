// components/MarqueeEditor.tsx - Quick Marquee Editor with Spinner & Toast
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Modal, ActivityIndicator } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { setMarqueeText, getMarqueeText, resetMarqueeText } from './MarqueeText';
import Button from './Button';
import { useToast } from '../../App';

interface MarqueeEditorProps {
  visible: boolean;
  onClose: () => void;
  isAdmin: boolean;
}

const MarqueeEditor: React.FC<MarqueeEditorProps> = ({ visible, onClose, isAdmin }) => {
  const { showToast } = useToast();
  const [text, setText] = useState('');
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadCurrentText();
    }
  }, [visible]);

  const loadCurrentText = async () => {
    setLoading(true);
    const current = await getMarqueeText();
    setText(current.replace(/•/g, '').trim());
    setLoading(false);
  };

  const handleSave = async () => {
    if (!text.trim()) {
      showToast('⚠️ Please enter text');
      return;
    }
    
    setSaving(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      await setMarqueeText(text.trim());
      showToast('✅ Marquee updated!');
      onClose();
    } catch {
      showToast('❌ Failed to save');
    }
    
    setSaving(false);
  };

  const handleReset = async () => {
    setResetting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 400));
      await resetMarqueeText();
      setText('Un-locka v1.0.0 • Omoka!!!');
      showToast('🔄 Marquee reset!');
    } catch {
      showToast('❌ Failed to reset');
    }
    
    setResetting(false);
  };

  if (!isAdmin) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>✏️ Edit Marquee</Text>
          <Text style={styles.subtitle}>Changes update in real-time</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={COLORS.primary} />
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : (
            <>
              <View style={styles.previewBox}>
                <Text style={styles.previewText} numberOfLines={1}>
                  {text || 'Enter text above...'}
                </Text>
              </View>

              <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="🔓 Un-locka v1.0.0 • Omoka!!!"
                placeholderTextColor="#999"
                maxLength={100}
                multiline
              />
              <Text style={styles.charCount}>{text.length}/100</Text>

              <View style={styles.buttons}>
                <Button 
                  title={saving ? '⏳ Saving...' : '💾 Save'} 
                  onPress={handleSave} 
                  loading={saving}
                  variant="primary" 
                />
                <Button 
                  title={resetting ? '⏳ Resetting...' : '🔄 Reset'} 
                  onPress={handleReset} 
                  loading={resetting}
                  variant="outline" 
                />
                <Button title="Cancel" onPress={onClose} variant="secondary" />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg },
  title: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', textAlign: 'center' },
  subtitle: { fontSize: FONTS.sizes.xs, color: COLORS.gray, textAlign: 'center', marginBottom: SPACING.lg },
  loadingContainer: { alignItems: 'center', padding: SPACING.xl },
  loadingText: { color: COLORS.gray, marginTop: SPACING.sm },
  previewBox: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: 10, marginBottom: SPACING.md },
  previewText: { color: '#FFD700', fontSize: FONTS.sizes.sm, fontWeight: 'bold' },
  input: { borderWidth: 2, borderColor: COLORS.primary, borderRadius: 12, padding: SPACING.md, fontSize: FONTS.sizes.md, minHeight: 60, textAlignVertical: 'top' },
  charCount: { fontSize: 10, color: COLORS.gray, textAlign: 'right', marginTop: 2 },
  buttons: { marginTop: SPACING.lg, gap: SPACING.sm },
});

export default MarqueeEditor;
