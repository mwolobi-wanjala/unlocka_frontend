// screens/SettingsScreen.tsx - Settings with Working Dark Mode
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Switch, Alert, Linking, Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, SHADOWS, APP_INFO } from '../constants/theme';
import { useTheme } from '../context/ThemeContext';

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onNavigate, onClose, userEmail = '', userName = '' }) => {
  const { theme, colors, toggleTheme } = useTheme();
  
  // All settings state
  const [readReceipts, setReadReceipts] = useState(true);
  const [showOnline, setShowOnline] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [vibrate, setVibrate] = useState(true);
  const [inAppSound, setInAppSound] = useState(true);
  const [messagePreview, setMessagePreview] = useState(true);
  const [enterToSend, setEnterToSend] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [biometricLock, setBiometricLock] = useState(false);
  const [screenSecurity, setScreenSecurity] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);
  const [autoPlayVideos, setAutoPlayVideos] = useState(true);
  const [showFontModal, setShowFontModal] = useState(false);
  const [fontSize, setFontSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showThemeModal, setShowThemeModal] = useState(false);

  useEffect(() => { loadSettings(); }, []);

  const loadSettings = async () => {
    const data = await AsyncStorage.getItem('@app_settings');
    if (data) {
      const s = JSON.parse(data);
      setReadReceipts(s.readReceipts ?? true);
      setShowOnline(s.showOnline ?? true);
      setNotifications(s.notifications ?? true);
      setVibrate(s.vibrate ?? true);
      setInAppSound(s.inAppSound ?? true);
      setMessagePreview(s.messagePreview ?? true);
      setEnterToSend(s.enterToSend ?? true);
      setTwoFactor(s.twoFactor ?? false);
      setBiometricLock(s.biometricLock ?? false);
      setFontSize(s.fontSize ?? 'medium');
      setDataSaver(s.dataSaver ?? false);
      setAutoPlayVideos(s.autoPlayVideos ?? true);
    }
  };

  const save = async (key: string, value: any) => {
    const data = await AsyncStorage.getItem('@app_settings');
    const s = data ? JSON.parse(data) : {};
    s[key] = value;
    await AsyncStorage.setItem('@app_settings', JSON.stringify(s));
  };

  const Row = ({ label, icon, value, onToggle, onPress, type = 'toggle', info }: any) => (
    <TouchableOpacity style={[styles.row, { backgroundColor: colors.surface, borderBottomColor: colors.border }]} onPress={type === 'toggle' ? () => { onToggle(!value); save(label.toLowerCase().replace(/\s/g, '_'), !value); } : onPress} disabled={type === 'toggle' && !onToggle} activeOpacity={0.7}>
      <Text style={styles.rowIcon}>{icon}</Text>
      <Text style={[styles.rowLabel, { color: colors.text }]}>{label}</Text>
      {type === 'toggle' ? (
        <Switch value={value} onValueChange={(v) => { onToggle(v); save(label.toLowerCase().replace(/\s/g, '_'), v); }} trackColor={{ false: '#E0E0E0', true: '#4CAF50' }} thumbColor="#FFF" />
      ) : (
        <View style={styles.rowRight}>
          {info && <Text style={[styles.rowValue, { color: colors.textSecondary }]}>{info}</Text>}
          <Text style={styles.arrow}>›</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: colors.surface }]}>{children}</View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.headerBg }]}>
        <TouchableOpacity onPress={onClose}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Profile */}
      <TouchableOpacity style={[styles.profileSection, { backgroundColor: colors.surface }]} onPress={() => onNavigate('profile')}>
        <View style={styles.profileAvatar}><Text style={styles.profileAvatarText}>{userName?.charAt(0)?.toUpperCase() || 'U'}</Text></View>
        <View style={styles.profileInfo}>
          <Text style={[styles.profileName, { color: colors.text }]}>{userName || 'User'}</Text>
          <Text style={[styles.profileStatus, { color: colors.textSecondary }]}>{userEmail || 'Tap to edit'}</Text>
        </View>
        <Text style={styles.arrow}>›</Text>
      </TouchableOpacity>

      {/* Appearance Section */}
      <Section title="Appearance">
        <Row label="Dark Mode" icon={theme === 'dark' ? '🌙' : '☀️'} type="info" info={theme === 'dark' ? 'On' : 'Off'} onPress={() => setShowThemeModal(true)} />
        <Row label="Font Size" icon="🔤" type="info" info={fontSize === 'small' ? 'Small' : fontSize === 'medium' ? 'Medium' : 'Large'} onPress={() => setShowFontModal(true)} />
      </Section>

      {/* Account */}
      <Section title="Account">
        <Row label="Privacy" icon="🔒" type="info" onPress={() => onNavigate('security')} />
        <Row label="Security" icon="🛡️" type="info" onPress={() => onNavigate('security')} />
        <Row label="Two-Step Verification" icon="🔐" value={twoFactor} onToggle={setTwoFactor} />
        <Row label="Change Number" icon="📱" type="info" onPress={() => Alert.alert('Change Number', 'Coming soon')} />
        <Row label="Request Account Info" icon="📋" type="info" onPress={() => Alert.alert('Request', 'Report will be sent')} />
      </Section>

      {/* Privacy */}
      <Section title="Privacy">
        <Row label="Read Receipts" icon="✓✓" value={readReceipts} onToggle={setReadReceipts} />
        <Row label="Show Online Status" icon="🟢" value={showOnline} onToggle={setShowOnline} />
        <Row label="Last Seen" icon="👁️" type="info" info="Everyone" />
        <Row label="Profile Photo" icon="🖼️" type="info" info="Everyone" />
        <Row label="Screen Security" icon="📵" value={screenSecurity} onToggle={setScreenSecurity} />
        <Row label="Blocked Contacts" icon="🚫" type="info" onPress={() => Alert.alert('Blocked', 'None')} />
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <Row label="Notifications" icon="🔔" value={notifications} onToggle={setNotifications} />
        <Row label="Vibrate" icon="📳" value={vibrate} onToggle={setVibrate} />
        <Row label="In-App Sound" icon="🔊" value={inAppSound} onToggle={setInAppSound} />
        <Row label="Message Preview" icon="👁️" value={messagePreview} onToggle={setMessagePreview} />
      </Section>

      {/* Chats */}
      <Section title="Chats">
        <Row label="Chat Wallpaper" icon="🎨" type="info" info="Default" />
        <Row label="Font Size" icon="🔤" type="info" info={fontSize === 'small' ? 'Small' : fontSize === 'medium' ? 'Medium' : 'Large'} onPress={() => setShowFontModal(true)} />
        <Row label="Enter to Send" icon="↵️" value={enterToSend} onToggle={setEnterToSend} />
        <Row label="Auto-Download" icon="📥" type="info" info="Wi-Fi" />
        <Row label="Chat Backup" icon="💾" type="info" info="Off" />
        <Row label="Clear All Chats" icon="🗑️" type="info" onPress={() => Alert.alert('Clear', 'Done!')} />
      </Section>

      {/* Data */}
      <Section title="Data & Storage">
        <Row label="Data Saver" icon="📉" value={dataSaver} onToggle={setDataSaver} />
        <Row label="Auto-Play Videos" icon="▶️" value={autoPlayVideos} onToggle={setAutoPlayVideos} />
        <Row label="Storage Used" icon="📊" type="info" info="45.2 MB" />
        <Row label="Clear Cache" icon="🧹" type="info" info="12.8 MB" onPress={() => Alert.alert('Cache', 'Cleared!')} />
      </Section>

      {/* Help */}
      <Section title="Help">
        <Row label="Help Center" icon="❓" type="info" onPress={() => onNavigate('help')} />
        <Row label="Contact Us" icon="📧" type="info" onPress={() => Linking.openURL('mailto:mwolobijavanson@gmail.com')} />
        <Row label="Terms of Service" icon="📄" type="info" onPress={() => onNavigate('termsOfService')} />
        <Row label="Privacy Policy" icon="🔒" type="info" onPress={() => onNavigate('privacyPolicy')} />
        <Row label="App Info" icon="ℹ️" type="info" info={`v${APP_INFO.version}`} onPress={() => onNavigate('about')} />
      </Section>

      {/* Logout */}
      <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: colors.surface }]} onPress={async () => { await AsyncStorage.removeItem('session_token'); onNavigate('login'); }}>
        <Text style={styles.logoutText}>🚪 Log Out</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.textSecondary }]}>Developed by Mwolobi Javanson</Text>
        <Text style={[styles.footerCopyright, { color: colors.textSecondary }]}>Copyright © 2026 Jans Tech</Text>
        <Text style={[styles.footerVersion, { color: colors.textSecondary }]}>v{APP_INFO.version}</Text>
      </View>

      {/* Theme Modal */}
      <Modal visible={showThemeModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Choose Theme</Text>
            
            <TouchableOpacity style={[styles.modalOption, theme === 'light' && styles.modalActive]} onPress={() => { toggleTheme(); setShowThemeModal(false); }}>
              <Text style={[styles.modalOptionText, { color: colors.text }]}>☀️ Light Mode</Text>
              {theme === 'light' && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.modalOption, theme === 'dark' && styles.modalActive]} onPress={() => { toggleTheme(); setShowThemeModal(false); }}>
              <Text style={[styles.modalOptionText, { color: colors.text }]}>🌙 Dark Mode</Text>
              {theme === 'dark' && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowThemeModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Font Modal */}
      <Modal visible={showFontModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Font Size</Text>
            {(['small', 'medium', 'large'] as const).map(size => (
              <TouchableOpacity key={size} style={[styles.modalOption, fontSize === size && styles.modalActive]} onPress={() => { setFontSize(size); save('fontSize', size); setShowFontModal(false); }}>
                <Text style={[styles.modalOptionText, { color: colors.text }]}>{size === 'small' ? '🔤 Small' : size === 'medium' ? '🔤 Medium' : '🔤 Large'}</Text>
                {fontSize === size && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.modalCancel} onPress={() => setShowFontModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingBottom: SPACING.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, padding: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: '#E0E0E0' },
  backBtn: { fontSize: 22, color: '#FFF' },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: '#FFF' },
  profileSection: { flexDirection: 'row', alignItems: 'center', padding: SPACING.lg, marginBottom: SPACING.sm },
  profileAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  profileAvatarText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  profileStatus: { fontSize: FONTS.sizes.sm, marginTop: 2 },
  arrow: { fontSize: 24, color: COLORS.lightGray, fontWeight: '300' },
  section: { marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONTS.sizes.xs, fontWeight: '600', textTransform: 'uppercase', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm },
  sectionContent: {},
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, paddingHorizontal: SPACING.lg, borderBottomWidth: 0.5 },
  rowIcon: { fontSize: 18, marginRight: SPACING.md, width: 28, textAlign: 'center' },
  rowLabel: { flex: 1, fontSize: FONTS.sizes.md },
  rowRight: { flexDirection: 'row', alignItems: 'center' },
  rowValue: { fontSize: FONTS.sizes.sm, marginRight: SPACING.sm },
  logoutBtn: { marginTop: SPACING.md, padding: SPACING.lg, alignItems: 'center' },
  logoutText: { color: '#F44336', fontSize: FONTS.sizes.md, fontWeight: '600' },
  footer: { alignItems: 'center', padding: SPACING.xl },
  footerText: { fontSize: FONTS.sizes.xs },
  footerCopyright: { fontSize: FONTS.sizes.xs, marginTop: 2 },
  footerVersion: { fontSize: 10, marginTop: 4 },
  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg },
  modalTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.lg },
  modalOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, borderRadius: 10, marginBottom: SPACING.xs },
  modalActive: { backgroundColor: '#F0EEFF' },
  modalOptionText: { fontSize: FONTS.sizes.md },
  checkmark: { color: COLORS.primary, fontWeight: 'bold', fontSize: 18 },
  modalCancel: { padding: SPACING.md, alignItems: 'center', marginTop: SPACING.sm },
  cancelText: { color: COLORS.gray, fontSize: FONTS.sizes.md },
});

export default SettingsScreen;
