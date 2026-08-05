// components/AdminMarqueePanel.tsx - Admin Marquee Control with Spinner & Toast
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, Alert, Switch, ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import { setMarqueeText, getMarqueeText, resetMarqueeText } from './MarqueeText';
import Button from './Button';
import { useToast } from '../../App';

interface AdminMarqueePanelProps {
  onClose: () => void;
}

const AdminMarqueePanel: React.FC<AdminMarqueePanelProps> = ({ onClose }) => {
  const { showToast } = useToast();
  const [marqueeText, setMarqueeTextLocal] = useState('');
  const [marqueeSpeed, setMarqueeSpeed] = useState('15');
  const [enableMarquee, setEnableMarquee] = useState(true);
  const [currentText, setCurrentText] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  
  // Loading states
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoadingSettings(true);
    try {
      const text = await getMarqueeText();
      setCurrentText(text);
      setMarqueeTextLocal(text.replace(/•/g, '').trim());
      
      const speed = await AsyncStorage.getItem('@marquee_speed');
      if (speed) setMarqueeSpeed(speed);
      
      const enabled = await AsyncStorage.getItem('@marquee_enabled');
      setEnableMarquee(enabled !== 'false');
      
      const hist = await AsyncStorage.getItem('@marquee_history');
      if (hist) setHistory(JSON.parse(hist));
    } catch (error) {
      showToast('Failed to load settings');
    }
    setLoadingSettings(false);
  };

  const handleSave = async () => {
    if (!marqueeText.trim()) {
      showToast('⚠️ Please enter text for the marquee');
      return;
    }
    
    setSaving(true);
    
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      await setMarqueeText(marqueeText.trim());
      await AsyncStorage.setItem('@marquee_speed', marqueeSpeed);
      await AsyncStorage.setItem('@marquee_enabled', enableMarquee.toString());
      
      // Save to history
      const newHistory = [marqueeText.trim(), ...history.slice(0, 9)];
      setHistory(newHistory);
      await AsyncStorage.setItem('@marquee_history', JSON.stringify(newHistory));
      
      showToast('✅ Marquee updated successfully! Restart app to see changes.');
      
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      showToast('❌ Failed to save marquee settings');
    }
    
    setSaving(false);
  };

  const handleReset = async () => {
    setResetting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await resetMarqueeText();
      await AsyncStorage.removeItem('@marquee_speed');
      await AsyncStorage.removeItem('@marquee_enabled');
      
      setMarqueeTextLocal('Un-locka v1.0.0 • Omoka!!!');
      setMarqueeSpeed('15');
      setEnableMarquee(true);
      
      showToast('🔄 Marquee reset to default!');
    } catch (error) {
      showToast('❌ Failed to reset marquee');
    }
    
    setResetting(false);
  };

  const handleUseHistory = (text: string) => {
    setMarqueeTextLocal(text.replace(/•/g, '').trim());
    showToast('📋 Text loaded from history');
  };

  if (loadingSettings) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading marquee settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>✏️ Marquee Settings</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Enable/Disable Toggle */}
      <View style={styles.card}>
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleTitle}>Enable Marquee</Text>
            <Text style={styles.toggleDesc}>Show scrolling text in header</Text>
          </View>
          <Switch
            value={enableMarquee}
            onValueChange={(v) => {
              setEnableMarquee(v);
              showToast(v ? '🔛 Marquee enabled' : '🔴 Marquee disabled');
            }}
            trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
            thumbColor="#FFF"
          />
        </View>
      </View>

      {/* Current Marquee Preview */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Current Marquee:</Text>
        <View style={styles.previewBox}>
          <Text style={styles.previewText} numberOfLines={1}>
            {currentText}
          </Text>
        </View>
      </View>

      {/* Text Input */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Marquee Text:</Text>
        <TextInput
          style={styles.input}
          value={marqueeText}
          onChangeText={setMarqueeTextLocal}
          placeholder="Enter marquee text..."
          placeholderTextColor="#999"
          maxLength={100}
          multiline
        />
        <Text style={styles.charCount}>{marqueeText.length}/100 characters</Text>
      </View>

      {/* Speed Control */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Scroll Speed: {marqueeSpeed}</Text>
        <Text style={styles.speedDesc}>Lower = Slower (1-30)</Text>
        <View style={styles.speedRow}>
          {[5, 10, 15, 20, 25, 30].map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.speedBtn, marqueeSpeed === s.toString() && styles.speedBtnActive]}
              onPress={() => {
                setMarqueeSpeed(s.toString());
                showToast(`⚡ Speed set to ${s}`);
              }}
            >
              <Text style={[styles.speedText, marqueeSpeed === s.toString() && styles.speedTextActive]}>
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Quick Templates */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Quick Templates:</Text>
        {[
          '🔓 Un-locka v1.0.0 • Omoka!!! • Created by Mwolobi Javanson',
          '💎 View Once • Earn 90% • Share Exclusive Content • Join Now',
          '💰 Refer & Earn KSH 20 • Invite Friends • Start Earning Today',
          '🎬 Creators Hub • Share Your Videos • Get Discovered',
          '📊 Status Updates • 24hr Stories • Share Your Moments',
          '🔒 End-to-End Encrypted • Your Privacy Matters',
          '🚀 Omoka!!! • Unlock Your Potential • Join Un-locka',
        ].map((template, i) => (
          <TouchableOpacity
            key={i}
            style={styles.templateBtn}
            onPress={() => {
              setMarqueeTextLocal(template);
              showToast('📋 Template loaded!');
            }}
          >
            <Text style={styles.templateText} numberOfLines={1}>{template}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* History */}
      {history.length > 0 && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent Marquee Texts:</Text>
          {history.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.historyItem}
              onPress={() => handleUseHistory(item)}
            >
              <Text style={styles.historyText} numberOfLines={1}>{item}</Text>
              <Text style={styles.historyArrow}>↩️</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <Button
          title={saving ? '⏳ Saving...' : '💾 Save Settings'}
          icon="💾"
          onPress={handleSave}
          loading={saving}
          variant="primary"
          disabled={saving}
        />
        <Button
          title={resetting ? '⏳ Resetting...' : '🔄 Reset to Default'}
          icon="🔄"
          onPress={handleReset}
          loading={resetting}
          variant="outline"
          disabled={resetting}
        />
        <Button title="Cancel" onPress={onClose} variant="secondary" />
      </View>

      <Text style={styles.note}>
        Changes take effect after app restart
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F5' },
  loadingText: { color: COLORS.gray, marginTop: SPACING.md, fontSize: FONTS.sizes.sm },
  
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.dark },
  closeBtn: { fontSize: 22, color: COLORS.gray, padding: SPACING.xs },
  
  card: {
    backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg,
    marginBottom: SPACING.sm, ...SHADOWS.small,
  },
  sectionTitle: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.sm },
  
  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  toggleTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark },
  toggleDesc: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  
  previewBox: {
    backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: 12,
  },
  previewText: { color: '#FFD700', fontSize: FONTS.sizes.sm, fontWeight: 'bold' },
  
  input: {
    borderWidth: 2, borderColor: COLORS.primary, borderRadius: 12,
    padding: SPACING.md, fontSize: FONTS.sizes.md, minHeight: 60,
    textAlignVertical: 'top',
  },
  charCount: { fontSize: 10, color: COLORS.gray, textAlign: 'right', marginTop: 4 },
  
  speedDesc: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginBottom: SPACING.sm },
  speedRow: { flexDirection: 'row', gap: SPACING.sm },
  speedBtn: {
    flex: 1, padding: SPACING.sm, borderRadius: 8,
    backgroundColor: '#F5F5F5', alignItems: 'center',
    borderWidth: 1, borderColor: '#E0E0E0',
  },
  speedBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  speedText: { fontSize: FONTS.sizes.sm, color: COLORS.dark, fontWeight: '600' },
  speedTextActive: { color: '#FFF' },
  
  templateBtn: {
    backgroundColor: '#F5F5F5', padding: SPACING.sm, borderRadius: 8,
    marginBottom: SPACING.xs, borderWidth: 1, borderColor: '#E0E0E0',
  },
  templateText: { fontSize: FONTS.sizes.xs, color: COLORS.dark },
  
  historyItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  historyText: { flex: 1, fontSize: FONTS.sizes.xs, color: COLORS.gray },
  historyArrow: { fontSize: 14, marginLeft: SPACING.sm },
  
  actions: { marginTop: SPACING.md, gap: SPACING.sm },
  note: { textAlign: 'center', fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: SPACING.md, fontStyle: 'italic' },
});

export default AdminMarqueePanel;
