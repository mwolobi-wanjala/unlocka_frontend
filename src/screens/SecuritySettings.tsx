// screens/SecuritySettings.tsx - Security Settings Screen
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import ActivityLog from '../components/ActivityLog';
import TwoFactorSetup from '../components/TwoFactorSetup';
import PinLock from '../components/PinLock';
import { useToast } from '../../App';

interface SecuritySettingsProps {
  onNavigate: (screen: string) => void;
}

const SecuritySettings: React.FC<SecuritySettingsProps> = ({ onNavigate }) => {
  const { showToast } = useToast();
  
  const [settings, setSettings] = useState({
    twoFactor: false,
    biometricLogin: false,
    pinLock: false,
    loginAlerts: true,
    rememberDevice: true,
  });

  const [show2FA, setShow2FA] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const toggleSetting = (key: keyof typeof settings) => {
    if (key === 'twoFactor' && !settings.twoFactor) {
      setShow2FA(true);
      return;
    }
    if (key === 'pinLock' && !settings.pinLock) {
      setShowPin(true);
      return;
    }
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    showToast(`${key} ${settings[key] ? 'disabled' : 'enabled'}`);
  };

  const demoActivities = [
    { id: 1, login_time: '2024-01-15 14:30', ip_address: '192.168.1.1', device_info: 'iPhone 15 - Safari', success: true, location: 'Nairobi, KE' },
    { id: 2, login_time: '2024-01-14 09:15', ip_address: '192.168.1.1', device_info: 'Android - Chrome', success: true, location: 'Nairobi, KE' },
    { id: 3, login_time: '2024-01-13 22:45', ip_address: '41.80.0.1', device_info: 'Unknown Device', success: false, location: 'Unknown' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>🔒 Security Settings</Text>

      {/* Two-Factor Authentication */}
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>🔐 Two-Factor Auth</Text>
            <Text style={styles.settingDesc}>Add extra security layer</Text>
          </View>
          <Switch
            value={settings.twoFactor}
            onValueChange={() => toggleSetting('twoFactor')}
            trackColor={{ false: '#ddd', true: COLORS.primary }}
          />
        </View>
      </View>

      {/* Biometric Login */}
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>👆 Biometric Login</Text>
            <Text style={styles.settingDesc}>Use fingerprint or face ID</Text>
          </View>
          <Switch
            value={settings.biometricLogin}
            onValueChange={() => toggleSetting('biometricLogin')}
            trackColor={{ false: '#ddd', true: COLORS.primary }}
          />
        </View>
      </View>

      {/* PIN Lock */}
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>🔢 PIN Lock</Text>
            <Text style={styles.settingDesc}>Quick access with 4-digit PIN</Text>
          </View>
          <Switch
            value={settings.pinLock}
            onValueChange={() => toggleSetting('pinLock')}
            trackColor={{ false: '#ddd', true: COLORS.primary }}
          />
        </View>
      </View>

      {/* Login Alerts */}
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>🔔 Login Alerts</Text>
            <Text style={styles.settingDesc}>Get notified of new logins</Text>
          </View>
          <Switch
            value={settings.loginAlerts}
            onValueChange={() => toggleSetting('loginAlerts')}
            trackColor={{ false: '#ddd', true: COLORS.primary }}
          />
        </View>
      </View>

      {/* Activity Log */}
      <ActivityLog activities={demoActivities} />

      {/* Change Password */}
      <View style={styles.card}>
        <TouchableOpacity onPress={() => onNavigate('changePassword')}>
          <Text style={styles.linkText}>🔑 Change Password</Text>
        </TouchableOpacity>
      </View>

      {/* Logout All Devices */}
      <View style={styles.card}>
        <TouchableOpacity onPress={() => showToast('Logged out from all devices')}>
          <Text style={[styles.linkText, { color: COLORS.error }]}>🚪 Logout All Devices</Text>
        </TouchableOpacity>
      </View>

      {/* 2FA Modal */}
      {show2FA && (
        <TwoFactorSetup
          onComplete={() => {
            setSettings(prev => ({ ...prev, twoFactor: true }));
            setShow2FA(false);
          }}
          onSkip={() => setShow2FA(false)}
        />
      )}

      {/* PIN Modal */}
      {showPin && (
        <PinLock
          onSuccess={() => {
            setSettings(prev => ({ ...prev, pinLock: true }));
            setShowPin(false);
            showToast('PIN lock enabled');
          }}
          onCancel={() => setShowPin(false)}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  content: { padding: SPACING.md, paddingBottom: SPACING.xxl },
  pageTitle: { fontSize: FONTS.sizes.xxl, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.lg, textAlign: 'center' },
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.sm, ...SHADOWS.medium },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  settingInfo: { flex: 1, marginRight: SPACING.md },
  settingTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.dark },
  settingDesc: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  linkText: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.primary, textAlign: 'center', padding: SPACING.sm },
});

export default SecuritySettings;
