// screens/legal/CopyrightNotice.tsx - Copyright Notice
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS, APP_INFO } from '../../constants/theme';

interface CopyrightNoticeProps {
  onClose: () => void;
}

const CopyrightNotice: React.FC<CopyrightNoticeProps> = ({ onClose }) => {
  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Copyright Notice</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.copyright}>© 2026 Jans Tech</Text>
        <Text style={styles.reserved}>All Rights Reserved</Text>

        <Text style={styles.section}>1. COPYRIGHT OWNERSHIP</Text>
        <Text style={styles.text}>
          Un-locka, including its source code, design, graphics, logos, and all content, 
          is the exclusive property of Jans Tech, protected by Kenyan and international copyright laws.
        </Text>

        <Text style={styles.section}>2. PROTECTED ELEMENTS</Text>
        <Text style={styles.text}>
          • The Un-locka name and logo{'\n'}
          • The App's source code{'\n'}
          • UI design and layout{'\n'}
          • Custom graphics and animations{'\n'}
          • The "Omoka!!!" slogan{'\n'}
          • All documentation
        </Text>

        <Text style={styles.section}>3. PROHIBITED ACTIONS</Text>
        <Text style={styles.text}>
          Copying, modifying, distributing, reverse engineering, or creating derivative works 
          without written permission is strictly prohibited.
        </Text>

        <Text style={styles.section}>4. TRADEMARKS</Text>
        <Text style={styles.text}>
          "Un-locka", "Omoka!!!", and the 🔓 logo are trademarks of Jans Tech.
        </Text>

        <Text style={styles.credits}>
          <Text style={styles.creditsTitle}>Credits</Text>
          {'\n'}Developer: Mwolobi Javanson
          {'\n'}Company: Jans Tech
          {'\n'}Founded: 2026
          {'\n'}Version: {APP_INFO.version}
          {'\n'}Location: Kenya 🇰🇪
        </Text>

        <View style={styles.footer}>
          <Text style={styles.footerMain}>© 2026 Jans Tech. All Rights Reserved.</Text>
          <Text style={styles.footerSub}>Copyright protected under Kenyan and International Law.</Text>
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
  copyright: { fontSize: FONTS.sizes.xxl, fontWeight: 'bold', color: COLORS.primary, textAlign: 'center', marginBottom: 4 },
  reserved: { fontSize: FONTS.sizes.md, color: COLORS.gray, textAlign: 'center', marginBottom: SPACING.lg },
  section: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark, marginTop: SPACING.lg, marginBottom: SPACING.sm },
  text: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, lineHeight: 22, marginBottom: SPACING.sm },
  credits: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, lineHeight: 22, marginTop: SPACING.lg },
  creditsTitle: { fontWeight: 'bold', color: COLORS.dark },
  footer: { marginTop: SPACING.xl, paddingTop: SPACING.lg, borderTopWidth: 1, borderTopColor: '#E0E0E0', alignItems: 'center' },
  footerMain: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: COLORS.dark, marginBottom: 4 },
  footerSub: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
});

export default CopyrightNotice;
