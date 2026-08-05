// screens/ProfileScreen.tsx - User Profile Page
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Image, Alert, TextInput, Switch,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { COLORS, FONTS, SPACING, SHADOWS, APP_INFO } from '../constants/theme';
import Button from '../components/Button';
import { useToast } from '../../App';

interface ProfileScreenProps {
  onClose: () => void;
  onNavigate: (screen: string) => void;
  userId: number;
  userName: string;
  userEmail: string;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onClose, onNavigate, userId, userName, userEmail,
}) => {
  const { showToast } = useToast();
  const [bio, setBio] = useState('Hey there! I am using Un-locka 🔓');
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState(bio);
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  const stats = {
    totalChats: 5,
    totalViewOnce: 12,
    totalEarned: 1250,
    totalReferrals: 3,
    totalStatuses: 8,
    memberSince: 'January 2026',
  };

  const handlePickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setAvatarUri(result.assets[0].uri);
      showToast('✅ Profile photo updated!');
    }
  };

  const handleSaveBio = () => {
    setBio(bioText);
    setEditingBio(false);
    showToast('✅ Bio updated!');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={onClose}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity onPress={() => onNavigate('settings')}>
          <Text style={styles.settingsBtn}>⚙️</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Avatar & Name */}
      <View style={styles.profileTop}>
        <TouchableOpacity onPress={handlePickAvatar}>
          <View style={styles.avatar}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>{userName?.charAt(0)?.toUpperCase()}</Text>
            )}
            <View style={styles.cameraBadge}>
              <Text style={styles.cameraIcon}>📷</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userEmail}>{userEmail}</Text>
        
        {editingBio ? (
          <View style={styles.bioEdit}>
            <TextInput style={styles.bioInput} value={bioText} onChangeText={setBioText} multiline maxLength={150} autoFocus />
            <View style={styles.bioActions}>
              <TouchableOpacity onPress={() => setEditingBio(false)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
              <TouchableOpacity onPress={handleSaveBio}><Text style={styles.saveText}>Save</Text></TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={() => { setBioText(bio); setEditingBio(true); }}>
            <Text style={styles.bio}>{bio}</Text>
            <Text style={styles.editHint}>Tap to edit bio</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalViewOnce}</Text>
          <Text style={styles.statLabel}>View Once</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>KSH {stats.totalEarned}</Text>
          <Text style={styles.statLabel}>Earned</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalReferrals}</Text>
          <Text style={styles.statLabel}>Referrals</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{stats.totalStatuses}</Text>
          <Text style={styles.statLabel}>Statuses</Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📧 Email</Text>
          <Text style={styles.infoValue}>{userEmail}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>📅 Member Since</Text>
          <Text style={styles.infoValue}>{stats.memberSince}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>💬 Total Chats</Text>
          <Text style={styles.infoValue}>{stats.totalChats}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>🎁 Referral Code</Text>
          <Text style={styles.infoValue}>USER1234</Text>
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionRow} onPress={() => onNavigate('wallet')}>
          <Text style={styles.actionIcon}>💰</Text>
          <Text style={styles.actionText}>Wallet</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionRow} onPress={() => onNavigate('security')}>
          <Text style={styles.actionIcon}>🔒</Text>
          <Text style={styles.actionText}>Security & Privacy</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionRow} onPress={() => onNavigate('notifications')}>
          <Text style={styles.actionIcon}>🔔</Text>
          <Text style={styles.actionText}>Notifications</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionRow} onPress={() => onNavigate('help')}>
          <Text style={styles.actionIcon}>❓</Text>
          <Text style={styles.actionText}>Help & Support</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Un-locka v{APP_INFO.version}</Text>
        <Text style={styles.footerText}>© 2026 Jans Tech</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { paddingBottom: SPACING.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, padding: SPACING.md },
  backBtn: { color: '#FFF', fontSize: 22 }, headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  settingsBtn: { color: '#FFF', fontSize: 22 },
  profileTop: { alignItems: 'center', backgroundColor: '#FFF', padding: SPACING.xl, marginBottom: SPACING.sm },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md, position: 'relative' },
  avatarImage: { width: 100, height: 100, borderRadius: 50 },
  avatarText: { color: '#FFF', fontSize: 40, fontWeight: 'bold' },
  cameraBadge: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: '#FFF', justifyContent: 'center', alignItems: 'center', ...SHADOWS.small },
  cameraIcon: { fontSize: 14 },
  userName: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.dark },
  userEmail: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginTop: 4 },
  bio: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, textAlign: 'center', marginTop: SPACING.sm },
  editHint: { fontSize: 10, color: COLORS.primary, marginTop: 4 },
  bioEdit: { width: '100%', marginTop: SPACING.sm },
  bioInput: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: 10, padding: SPACING.sm, fontSize: FONTS.sizes.sm, minHeight: 60, textAlignVertical: 'top' },
  bioActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: SPACING.md, marginTop: SPACING.xs },
  cancelText: { color: COLORS.gray }, saveText: { color: COLORS.primary, fontWeight: 'bold' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, padding: SPACING.md },
  statCard: { width: '47%', backgroundColor: '#FFF', padding: SPACING.md, borderRadius: 12, alignItems: 'center', ...SHADOWS.small },
  statValue: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 4 },
  section: { backgroundColor: '#FFF', marginBottom: SPACING.sm, padding: SPACING.lg },
  sectionTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.gray, marginBottom: SPACING.md, textTransform: 'uppercase' },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  infoLabel: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray },
  infoValue: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark },
  actionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  actionIcon: { fontSize: 20, marginRight: SPACING.md, width: 30 },
  actionText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.dark },
  arrow: { fontSize: 20, color: COLORS.lightGray },
  footer: { alignItems: 'center', padding: SPACING.lg },
  footerText: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
});

export default ProfileScreen;
