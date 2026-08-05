// screens/AboutScreen.tsx - About Un-locka
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Linking, Dimensions, Share, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS, APP_INFO } from '../constants/theme';

const { width } = Dimensions.get('window');

interface AboutScreenProps {
  onClose: () => void;
  onNavigate?: (screen: string) => void;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ onClose, onNavigate }) => {
  const [tapCount, setTapCount] = useState(0);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🔓 Un-locka - Create Account, Omoka!!!\n\nChat, share view-once content, and earn money!\n\nDeveloped by Mwolobi Javanson\n© 2026 Jans Tech\nVersion ${APP_INFO.version}`,
      });
    } catch {}
  };

  const handleEasterEgg = () => {
    setTapCount(prev => prev + 1);
    if (tapCount >= 5) {
      Alert.alert('🎉', 'You found the Easter egg! Omoka!!! 🚀');
      setTapCount(0);
    }
  };

  const navigateTo = (screen: string) => {
    if (onNavigate) onNavigate(screen);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* App Logo & Name */}
      <View style={styles.heroSection}>
        <TouchableOpacity onPress={handleEasterEgg} activeOpacity={0.8}>
          <View style={styles.logoContainer}>
            <Text style={styles.logo}>🔓</Text>
          </View>
        </TouchableOpacity>
        <Text style={styles.appName}>{APP_INFO.name}</Text>
        <Text style={styles.tagline}>Create Account, Omoka!!!</Text>
        <Text style={styles.version}>Version {APP_INFO.version}</Text>
      </View>

      {/* App Description */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📱 About Un-locka</Text>
        <Text style={styles.description}>
          Un-locka is a revolutionary messaging and content monetization platform 
          designed to help you connect, share, and earn.
        </Text>
      </View>

      {/* Key Features */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>✨ Key Features</Text>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>💬</Text>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Secure Chat</Text>
            <Text style={styles.featureDesc}>End-to-end encrypted messaging</Text>
          </View>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>💎</Text>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>View Once</Text>
            <Text style={styles.featureDesc}>Paid content that disappears</Text>
          </View>
        </View>
        <View style={styles.featureCard}>
          <Text style={styles.featureIcon}>💰</Text>
          <View style={styles.featureInfo}>
            <Text style={styles.featureTitle}>Earn Money</Text>
            <Text style={styles.featureDesc}>Referrals, view once, paid media</Text>
          </View>
        </View>
      </View>

      {/* Developer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>👨‍💻 Developer</Text>
        <View style={styles.devCard}>
          <View style={styles.devAvatar}>
            <Text style={styles.devAvatarText}>M</Text>
          </View>
          <View style={styles.devInfo}>
            <Text style={styles.devName}>Mwolobi Javanson</Text>
            <Text style={styles.devRole}>Lead Developer & Founder</Text>
          </View>
        </View>
      </View>

      {/* Company Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏢 Company</Text>
        <View style={styles.companyCard}>
          <Text style={styles.companyName}>Jans Tech</Text>
          <Text style={styles.companyTagline}>Innovating for Tomorrow</Text>
          <Text style={styles.companyDesc}>Founded 2026 | Kenya 🇰🇪</Text>
          <View style={styles.companyDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Founder:</Text>
              <Text style={styles.detailValue}>Mwolobi Javanson</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Contact:</Text>
              <Text style={styles.detailValue}>mwolobijavanson@gmail.com</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Technical Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🔧 Technical Details</Text>
        <View style={styles.techCard}>
          <View style={styles.techRow}>
            <Text style={styles.techLabel}>Version:</Text>
            <Text style={styles.techValue}>{APP_INFO.version}</Text>
          </View>
          <View style={styles.techRow}>
            <Text style={styles.techLabel}>Platform:</Text>
            <Text style={styles.techValue}>React Native (Expo)</Text>
          </View>
          <View style={styles.techRow}>
            <Text style={styles.techLabel}>Backend:</Text>
            <Text style={styles.techValue}>Python (FastAPI)</Text>
          </View>
          <View style={styles.techRow}>
            <Text style={styles.techLabel}>Database:</Text>
            <Text style={styles.techValue}>PostgreSQL</Text>
          </View>
          <View style={styles.techRow}>
            <Text style={styles.techLabel}>Encryption:</Text>
            <Text style={styles.techValue}>SHA-512, AES-256, RSA</Text>
          </View>
          <View style={styles.techRow}>
            <Text style={styles.techLabel}>Payment:</Text>
            <Text style={styles.techValue}>M-Pesa (Safaricom)</Text>
          </View>
        </View>
      </View>

      {/* Legal */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📄 Legal</Text>
        
        <TouchableOpacity style={styles.legalItem} onPress={() => navigateTo('termsOfService')}>
          <Text style={styles.legalIcon}>📜</Text>
          <Text style={styles.legalText}>Terms of Service</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.legalItem} onPress={() => navigateTo('privacyPolicy')}>
          <Text style={styles.legalIcon}>🔒</Text>
          <Text style={styles.legalText}>Privacy Policy</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.legalItem} onPress={() => navigateTo('copyrightNotice')}>
          <Text style={styles.legalIcon}>©️</Text>
          <Text style={styles.legalText}>Copyright Notice</Text>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Credits */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🙏 Credits</Text>
        <View style={styles.creditCard}>
          <Text style={styles.creditTitle}>Created by:</Text>
          <Text style={styles.creditName}>Mwolobi Javanson</Text>
          <Text style={styles.creditText}>
            Special thanks to all Jans Tech testers and early adopters who helped 
            shape Un-locka into what it is today.
          </Text>
          <Text style={styles.creditText}>Built with ❤️ in Kenya 🇰🇪</Text>
        </View>
      </View>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareBtn} onPress={handleShare}>
        <Text style={styles.shareIcon}>📤</Text>
        <Text style={styles.shareText}>Share Un-locka</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerCopyright}>Copyright © 2026 Jans Tech</Text>
        <Text style={styles.footerFounder}>Founder: Mwolobi Javanson</Text>
        <Text style={styles.footerRights}>All Rights Reserved</Text>
        <Text style={styles.footerVersion}>Un-locka v{APP_INFO.version}</Text>
        <TouchableOpacity onPress={handleEasterEgg}>
          <Text style={styles.footerMoto}>Omoka!!! 🚀</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { paddingBottom: SPACING.xxl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, padding: SPACING.md },
  backBtn: { color: '#FFF', fontSize: 22 },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  heroSection: { alignItems: 'center', padding: SPACING.xl, backgroundColor: '#FFF', marginBottom: SPACING.sm },
  logoContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F0EEFF', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
  logo: { fontSize: 40 },
  appName: { fontSize: FONTS.sizes.xxxl, fontWeight: 'bold', color: COLORS.primary },
  tagline: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginTop: 4 },
  version: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginTop: 8, backgroundColor: '#F5F5F5', paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: 10 },
  section: { backgroundColor: '#FFF', marginBottom: SPACING.sm, padding: SPACING.lg },
  sectionTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md },
  description: { fontSize: FONTS.sizes.sm, color: COLORS.gray, lineHeight: 22 },
  featureCard: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  featureIcon: { fontSize: 28, marginRight: SPACING.md, width: 40, textAlign: 'center' },
  featureInfo: { flex: 1 },
  featureTitle: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: COLORS.dark },
  featureDesc: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  devCard: { flexDirection: 'row', alignItems: 'center' },
  devAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  devAvatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  devInfo: { flex: 1 },
  devName: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark },
  devRole: { fontSize: FONTS.sizes.sm, color: COLORS.primary, marginTop: 2 },
  companyCard: { backgroundColor: '#F8F9FA', padding: SPACING.md, borderRadius: 12 },
  companyName: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.primary },
  companyTagline: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginTop: 2, fontStyle: 'italic' },
  companyDesc: { fontSize: FONTS.sizes.sm, color: COLORS.dark, marginTop: SPACING.sm },
  companyDetails: { marginTop: SPACING.md, borderTopWidth: 1, borderTopColor: '#E0E0E0', paddingTop: SPACING.md },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  detailLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  detailValue: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark },
  techCard: { backgroundColor: '#F8F9FA', padding: SPACING.md, borderRadius: 12 },
  techRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.xs, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  techLabel: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  techValue: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark },
  legalItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  legalIcon: { fontSize: 18, marginRight: SPACING.md, width: 30, textAlign: 'center' },
  legalText: { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.dark },
  arrow: { fontSize: 22, color: COLORS.lightGray },
  creditCard: { backgroundColor: '#F8F9FA', padding: SPACING.lg, borderRadius: 12, alignItems: 'center' },
  creditTitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginBottom: 4 },
  creditName: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.md },
  creditText: { fontSize: FONTS.sizes.sm, color: COLORS.gray, textAlign: 'center', marginBottom: SPACING.sm, lineHeight: 20 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.primary, margin: SPACING.md, padding: SPACING.md, borderRadius: 12, gap: SPACING.sm },
  shareIcon: { fontSize: 18 },
  shareText: { color: '#FFF', fontWeight: 'bold', fontSize: FONTS.sizes.md },
  footer: { alignItems: 'center', padding: SPACING.lg, backgroundColor: '#FFF', marginTop: SPACING.md },
  footerCopyright: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: COLORS.dark },
  footerFounder: { fontSize: FONTS.sizes.sm, color: COLORS.primary, marginTop: 4, fontWeight: '600' },
  footerRights: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  footerVersion: { fontSize: FONTS.sizes.xs, color: COLORS.lightGray, marginTop: 4 },
  footerMoto: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.primary, marginTop: SPACING.sm },
});

export default AboutScreen;
