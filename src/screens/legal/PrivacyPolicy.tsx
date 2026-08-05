// screens/legal/PrivacyPolicy.tsx - Privacy Policy
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';

interface PrivacyPolicyProps {
  onClose: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdated}>Last Updated: January 2026</Text>

        <Text style={styles.section}>1. INTRODUCTION</Text>
        <Text style={styles.text}>
          Jans Tech ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy 
          explains how we collect, use, disclose, and safeguard your information when you use Un-locka.
        </Text>

        <Text style={styles.section}>2. INFORMATION WE COLLECT</Text>
        <Text style={styles.text}>
          <Text style={styles.bold}>Personal Information:</Text>
          {'\n'}- Full name, Username, Email address, Phone number
          {'\n'}- M-Pesa transaction details
          {'\n\n'}<Text style={styles.bold}>Content Information:</Text>
          {'\n'}- Chat messages (end-to-end encrypted)
          {'\n'}- View-once content (photos/videos)
          {'\n'}- Status updates, Creator videos
          {'\n\n'}<Text style={styles.bold}>Device Information:</Text>
          {'\n'}- Device type, OS, App version, IP address
        </Text>

        <Text style={styles.section}>3. HOW WE USE YOUR INFORMATION</Text>
        <Text style={styles.text}>
          - To provide and maintain the App's functionality
          {'\n'}- To process payments and withdrawals through M-Pesa
          {'\n'}- To facilitate communication between users
          {'\n'}- To verify user identity and prevent fraud
          {'\n'}- To improve and optimize the App experience
          {'\n'}- To send important notifications and updates
        </Text>

        <Text style={styles.section}>4. END-TO-END ENCRYPTION</Text>
        <Text style={styles.text}>
          All chat messages and view-once content are end-to-end encrypted. We use industry-standard 
          encryption (SHA-512, AES-256, RSA). We cannot read your encrypted messages or content. 
          Encryption keys are stored locally on your device.
        </Text>

        <Text style={styles.section}>5. DATA SHARING</Text>
        <Text style={styles.text}>
          We do NOT sell your personal information to third parties. We may share information with 
          service providers (payment processors) and law enforcement when required by law.
        </Text>

        <Text style={styles.section}>6. DATA RETENTION</Text>
        <Text style={styles.text}>
          - Account information: Retained while account is active
          {'\n'}- Chat messages: Stored until deleted by you
          {'\n'}- View-once content: Auto-deleted after viewing
          {'\n'}- Status updates: Auto-deleted after 24 hours
          {'\n'}- Payment records: Retained for 7 years per Kenyan law
        </Text>

        <Text style={styles.section}>7. YOUR RIGHTS</Text>
        <Text style={styles.text}>
          You have the right to access, correct, delete your data, export your data, 
          and withdraw consent for data processing.
        </Text>

        <Text style={styles.section}>8. SECURITY MEASURES</Text>
        <Text style={styles.text}>
          End-to-end encryption, secure servers, regular security audits, two-factor authentication, 
          biometric login, anti-screenshot protection, and session management.
        </Text>

        <Text style={styles.section}>9. CONTACT US</Text>
        <Text style={styles.text}>
          📧 Email: mwolobijavanson@gmail.com
          {'\n'}💬 WhatsApp: +254 784 095 825
          {'\n'}📞 Phone: +254 784 095 825 / +254 115 995 514
          {'\n'}🏢 Company: Jans Tech, Kenya
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2026 Jans Tech. All Rights Reserved.</Text>
          <Text style={styles.footerText}>Your privacy is our priority.</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, padding: SPACING.md },
  backBtn: { color: '#FFF', fontSize: 22 },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  content: { padding: SPACING.lg, paddingBottom: SPACING.xxl },
  lastUpdated: { fontSize: FONTS.sizes.xs, color: COLORS.gray, textAlign: 'center', marginBottom: SPACING.lg, fontStyle: 'italic' },
  section: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  text: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, lineHeight: 22, marginBottom: SPACING.sm },
  bold: { fontWeight: 'bold', color: COLORS.dark },
  footer: { marginTop: SPACING.xl, paddingTop: SPACING.lg, borderTopWidth: 1, borderTopColor: '#E0E0E0', alignItems: 'center' },
  footerText: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginBottom: 4 },
});

export default PrivacyPolicy;
