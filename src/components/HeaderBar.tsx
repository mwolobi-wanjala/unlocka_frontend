// components/HeaderBar.tsx - Header with Notifications & Search
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import MarqueeText from './MarqueeText';
import MarqueeEditor from './MarqueeEditor';
import { isAdminUser } from '../services/api';

interface HeaderBarProps {
  title: string;
  onMenuPress: () => void;
  onRightPress?: () => void;
  rightIcon?: string;
  showMarquee?: boolean;
  isGuest?: boolean;
  userEmail?: string;
  onNotificationPress?: () => void;
  onSearchPress?: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({
  title, onMenuPress, onRightPress, rightIcon = 'Guest',
  showMarquee = true, isGuest = false, userEmail = '',
  onNotificationPress, onSearchPress,
}) => {
  const [showEditor, setShowEditor] = useState(false);
  const isAdmin = isAdminUser(userEmail);
  const unreadCount = 3; // Mock unread notifications

  return (
    <>
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        {/* Admin Edit Button */}
        {isAdmin && (
          <TouchableOpacity onPress={() => setShowEditor(true)} style={styles.editBtn}>
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        )}

        {/* Marquee */}
        <View style={styles.leftSection}>
          {showMarquee ? <MarqueeText speed={15} /> : <Text style={styles.headerTitle}>{title}</Text>}
        </View>

        {/* Right Icons */}
        <View style={styles.rightSection}>
          {/* Search Icon */}
          {onSearchPress && (
            <TouchableOpacity onPress={onSearchPress} style={styles.iconBtn}>
              <Text style={styles.headerIcon}>🔍</Text>
            </TouchableOpacity>
          )}

          {/* Notification Bell */}
          {onNotificationPress && (
            <TouchableOpacity onPress={onNotificationPress} style={styles.iconBtn}>
              <Text style={styles.headerIcon}>🔔</Text>
              {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifCount}>{unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Guest/Exit Pill */}
          {onRightPress && (
            <TouchableOpacity onPress={onRightPress} style={[styles.guestPill, isGuest && styles.exitPill]}>
              <Text style={[styles.guestPillText, isGuest && styles.exitPillText]}>{rightIcon}</Text>
            </TouchableOpacity>
          )}

          {/* Hamburger */}
          <TouchableOpacity onPress={onMenuPress} style={styles.menuBtn}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <MarqueeEditor visible={showEditor} onClose={() => setShowEditor(false)} isAdmin={isAdmin} />
    </>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 15, paddingBottom: 10, paddingHorizontal: SPACING.xs, minHeight: 50 },
  editBtn: { padding: 4, marginRight: 2 }, editIcon: { fontSize: 14, color: '#FFD700' },
  leftSection: { flex: 1, overflow: 'hidden', marginHorizontal: SPACING.xs },
  headerTitle: { color: COLORS.white, fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  rightSection: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconBtn: { padding: 4, position: 'relative' },
  headerIcon: { fontSize: 18, color: '#FFF' },
  notifBadge: { position: 'absolute', top: 0, right: 0, backgroundColor: '#F44336', width: 16, height: 16, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  notifCount: { color: '#FFF', fontSize: 9, fontWeight: 'bold' },
  guestPill: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  exitPill: { backgroundColor: 'rgba(255,152,0,0.2)' },
  guestPillText: { color: 'rgba(255,255,255,0.85)', fontSize: 10, fontWeight: '600' },
  exitPillText: { color: '#FF9800' },
  menuBtn: { padding: 4, width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)' },
  menuIcon: { color: COLORS.white, fontSize: 16, fontWeight: 'bold' },
});

export default HeaderBar;
