// components/PermissionSetup.tsx - Initial Permissions Setup
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Dimensions,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import {
  PermissionType, PermissionStatus,
  checkAllPermissions, requestAllPermissions,
  requestCameraPermission, requestGalleryPermission,
  requestMicrophonePermission, requestContactsPermission,
  requestLocationPermission, requestNotificationPermission,
} from '../utils/permissions';
import Button from './Button';

const { width } = Dimensions.get('window');

interface PermissionSetupProps {
  onComplete: () => void;
  onSkip: () => void;
}

interface PermissionItem {
  type: PermissionType;
  icon: string;
  title: string;
  description: string;
  color: string;
  requestFn: () => Promise<boolean>;
}

const PERMISSIONS_LIST: PermissionItem[] = [
  {
    type: 'camera', icon: '📷', title: 'Camera',
    description: 'Take photos and record videos for View Once, Status, and Creators',
    color: '#F44336',
    requestFn: requestCameraPermission,
  },
  {
    type: 'gallery', icon: '🖼️', title: 'Gallery',
    description: 'Access your photos and videos to share in chats and status',
    color: '#9C27B0',
    requestFn: requestGalleryPermission,
  },
  {
    type: 'microphone', icon: '🎤', title: 'Microphone',
    description: 'Record voice notes and audio for videos',
    color: '#FF9800',
    requestFn: requestMicrophonePermission,
  },
  {
    type: 'contacts', icon: '👥', title: 'Contacts',
    description: 'Find friends who are using Un-locka',
    color: '#2196F3',
    requestFn: requestContactsPermission,
  },
  {
    type: 'location', icon: '📍', title: 'Location',
    description: 'Share your location with friends in chats',
    color: '#4CAF50',
    requestFn: requestLocationPermission,
  },
  {
    type: 'notifications', icon: '🔔', title: 'Notifications',
    description: 'Receive alerts for new messages, view once, and updates',
    color: '#607D8B',
    requestFn: requestNotificationPermission,
  },
];

const PermissionSetup: React.FC<PermissionSetupProps> = ({ onComplete, onSkip }) => {
  const [permissions, setPermissions] = useState<PermissionStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingAll, setRequestingAll] = useState(false);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    setLoading(true);
    const perms = await checkAllPermissions();
    setPermissions(perms);
    setLoading(false);
  };

  const handleRequestPermission = async (item: PermissionItem) => {
    const granted = await item.requestFn();
    await loadPermissions();
  };

  const handleRequestAll = async () => {
    setRequestingAll(true);
    await requestAllPermissions();
    await loadPermissions();
    setRequestingAll(false);
  };

  const getPermissionStatus = (type: PermissionType): PermissionStatus | undefined => {
    return permissions.find(p => p.type === type);
  };

  const grantedCount = permissions.filter(p => p.granted).length;
  const totalCount = PERMISSIONS_LIST.length;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Checking permissions...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerIcon}>🔐</Text>
        <Text style={styles.headerTitle}>Setup Permissions</Text>
        <Text style={styles.headerSubtitle}>
          Un-locka needs these permissions to work properly
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressCard}>
        <Text style={styles.progressText}>
          {grantedCount} of {totalCount} permissions granted
        </Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(grantedCount / totalCount) * 100}%` }]} />
        </View>
      </View>

      {/* Permissions List */}
      <View style={styles.permissionsList}>
        {PERMISSIONS_LIST.map((item) => {
          const status = getPermissionStatus(item.type);
          const isGranted = status?.granted || false;

          return (
            <View key={item.type} style={styles.permissionItem}>
              <View style={[styles.permissionIcon, { backgroundColor: item.color + '20' }]}>
                <Text style={styles.permissionEmoji}>{item.icon}</Text>
              </View>
              <View style={styles.permissionInfo}>
                <Text style={styles.permissionTitle}>{item.title}</Text>
                <Text style={styles.permissionDesc}>{item.description}</Text>
              </View>
              {isGranted ? (
                <View style={styles.grantedBadge}>
                  <Text style={styles.grantedText}>✅</Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.requestBtn, { backgroundColor: item.color }]}
                  onPress={() => handleRequestPermission(item)}
                >
                  <Text style={styles.requestText}>Allow</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        {grantedCount < totalCount && (
          <Button
            title={`Grant All Permissions (${totalCount - grantedCount} remaining)`}
            icon="🔐"
            onPress={handleRequestAll}
            loading={requestingAll}
            variant="primary"
          />
        )}
        
        <Button
          title={grantedCount >= 3 ? "Continue to App" : "Skip for Now"}
          icon={grantedCount >= 3 ? "🚀" : "⏭️"}
          onPress={onComplete}
          variant={grantedCount >= 3 ? "success" : "outline"}
        />
      </View>

      <Text style={styles.note}>
        You can change these permissions anytime in your device Settings.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: COLORS.gray, marginTop: SPACING.md },
  
  header: { alignItems: 'center', marginTop: SPACING.xl, marginBottom: SPACING.lg },
  headerIcon: { fontSize: 60, marginBottom: SPACING.md },
  headerTitle: { fontSize: FONTS.sizes.xxl, fontWeight: 'bold', color: COLORS.dark },
  headerSubtitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray, textAlign: 'center', marginTop: SPACING.sm },
  
  progressCard: {
    backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg,
    marginBottom: SPACING.lg, alignItems: 'center', ...SHADOWS.small,
  },
  progressText: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark, marginBottom: SPACING.sm },
  progressBar: { width: '100%', height: 8, backgroundColor: '#E0E0E0', borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 4 },
  
  permissionsList: { marginBottom: SPACING.lg },
  permissionItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF',
    padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.sm, ...SHADOWS.small,
  },
  permissionIcon: {
    width: 50, height: 50, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md,
  },
  permissionEmoji: { fontSize: 24 },
  permissionInfo: { flex: 1 },
  permissionTitle: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: COLORS.dark },
  permissionDesc: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  grantedBadge: { width: 40, alignItems: 'center' },
  grantedText: { fontSize: 20 },
  requestBtn: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: 20 },
  requestText: { color: '#FFF', fontWeight: 'bold', fontSize: FONTS.sizes.xs },
  
  actions: { gap: SPACING.sm },
  note: { textAlign: 'center', fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: SPACING.lg },
});

export default PermissionSetup;
