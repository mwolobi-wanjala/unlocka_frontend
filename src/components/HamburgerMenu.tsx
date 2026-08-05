// components/HamburgerMenu.tsx - WhatsApp-Style Hamburger with Logout
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Modal,
  ScrollView, Dimensions, Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import { isAdminUser } from '../services/api';

const { width } = Dimensions.get('window');
const MENU_WIDTH = width * 0.7;

interface HamburgerMenuProps {
  visible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  onLogout: () => void;
  currentScreen: string;
  userEmail?: string;
  userName?: string;
  isLoggedIn?: boolean;
  walletBalance?: number;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  visible, onClose, onNavigate, onLogout,
  currentScreen, userEmail = '', userName = 'User',
  isLoggedIn = false, walletBalance = 0,
}) => {
  const [slideAnim] = useState(new Animated.Value(-MENU_WIDTH));
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }).start();
      setIsAdmin(isAdminUser(userEmail));
    } else {
      Animated.timing(slideAnim, { toValue: -MENU_WIDTH, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible, userEmail]);

  const menuSections = [
    {
      title: 'Account',
      items: [
        { id: 'wallet', label: 'Wallet', icon: '💰', screen: 'wallet', badge: walletBalance > 0 ? `KSH ${walletBalance?.toLocaleString()}` : undefined },
        { id: 'profile', label: 'Profile', icon: '👤', screen: 'profile' },
        { id: 'security', label: 'Security', icon: '🔒', screen: 'security' },
      ]
    },
    {
      title: 'Admin',
      items: [
        { id: 'admin', label: 'Admin Dashboard', icon: '🛡️', screen: 'admin', adminOnly: true, color: '#FFD700' },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { id: 'settings', label: 'Settings', icon: '⚙️', screen: 'settings' },
        { id: 'help', label: 'Help', icon: '❓', screen: 'help' },
        { id: 'about', label: 'About', icon: 'ℹ️', screen: 'about' },
      ]
    },
  ];

  const handleNavigate = (screen: string) => {
    onClose();
    setTimeout(() => onNavigate(screen), 300);
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
        
        <Animated.View style={[styles.menu, { transform: [{ translateX: slideAnim }] }]}>
          {/* Header */}
          <LinearGradient colors={['#1A1A2E', '#16213E']} style={styles.header}>
            <View style={styles.userAvatar}>
              <Text style={styles.avatarText}>{userName?.charAt(0)?.toUpperCase() || 'U'}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName} numberOfLines={1}>{userName || 'Guest'}</Text>
              <Text style={styles.userEmail} numberOfLines={1}>{userEmail || ''}</Text>
            </View>
            {isAdmin && <Text style={styles.adminStar}>👑</Text>}
          </LinearGradient>

          {/* Wallet Quick View */}
          {isLoggedIn && (
            <TouchableOpacity style={styles.walletQuickView} onPress={() => handleNavigate('wallet')}>
              <Text style={styles.walletIcon}>💰</Text>
              <Text style={styles.walletAmount}>KSH {walletBalance?.toLocaleString() || '0'}</Text>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          )}

          {/* Menu Sections */}
          <ScrollView style={styles.menuScroll} showsVerticalScrollIndicator={false}>
            {menuSections.map((section) => {
              if (section.title === 'Admin' && !isAdmin) return null;
              return (
                <View key={section.title}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  {section.items.map((item) => {
                    if (item.adminOnly && !isAdmin) return null;
                    const isActive = currentScreen === item.screen;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={[styles.menuItem, isActive && styles.activeItem]}
                        onPress={() => handleNavigate(item.screen)}
                      >
                        <Text style={styles.menuIcon}>{item.icon}</Text>
                        <Text style={[styles.menuLabel, isActive && styles.activeLabel, item.color && { color: item.color }]}>
                          {item.label}
                        </Text>
                        {item.badge && <Text style={styles.badge}>{item.badge}</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>

          {/* Logout - WhatsApp Style at bottom */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.logoutBtn} onPress={onLogout}>
              <Text style={styles.logoutText}>🚪 Logout</Text>
            </TouchableOpacity>
            <Text style={styles.version}>v1.0.0 • Jans Tech</Text>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row' },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)' },
  menu: { width: MENU_WIDTH, backgroundColor: '#FFF', height: '100%', ...SHADOWS.large },
  
  header: { paddingTop: 50, padding: SPACING.sm, flexDirection: 'row', alignItems: 'center' },
  userAvatar: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  avatarText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  userInfo: { flex: 1 },
  userName: { color: '#FFF', fontSize: FONTS.sizes.sm, fontWeight: 'bold' },
  userEmail: { color: 'rgba(255,255,255,0.6)', fontSize: 10, marginTop: 1 },
  adminStar: { fontSize: 16 },
  
  walletQuickView: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0EEFF', padding: SPACING.sm, marginHorizontal: SPACING.sm, marginTop: SPACING.xs, borderRadius: 10 },
  walletIcon: { fontSize: 18, marginRight: SPACING.sm },
  walletAmount: { flex: 1, fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: '#4CAF50' },
  arrow: { fontSize: 18, color: COLORS.lightGray },
  
  menuScroll: { flex: 1 },
  sectionTitle: { fontSize: 10, fontWeight: '600', color: COLORS.gray, textTransform: 'uppercase', paddingHorizontal: SPACING.md, paddingTop: SPACING.sm, paddingBottom: 2 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: SPACING.md, marginHorizontal: SPACING.xs, borderRadius: 8 },
  activeItem: { backgroundColor: '#F0EEFF' },
  menuIcon: { fontSize: 18, marginRight: SPACING.sm, width: 24, textAlign: 'center' },
  menuLabel: { flex: 1, fontSize: FONTS.sizes.sm, fontWeight: '500', color: COLORS.dark },
  activeLabel: { color: COLORS.primary, fontWeight: '600' },
  badge: { fontSize: 9, color: COLORS.primary, fontWeight: 'bold', backgroundColor: '#F0EEFF', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  
  footer: { padding: SPACING.sm, borderTopWidth: 1, borderTopColor: '#F0F0F0', alignItems: 'center' },
  logoutBtn: { backgroundColor: '#FFEBEE', paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm, borderRadius: 20, marginBottom: SPACING.xs, width: '80%', alignItems: 'center' },
  logoutText: { color: '#F44336', fontWeight: '600', fontSize: FONTS.sizes.sm },
  version: { fontSize: 9, color: COLORS.lightGray },
});

export default HamburgerMenu;
