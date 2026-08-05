// components/Footer.tsx - Footer with Working Links
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, APP_INFO } from '../constants/theme';

interface FooterProps {
  onNavigate?: (screen: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const navigateTo = (screen: string) => {
    if (onNavigate) onNavigate(screen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.divider} />
      
      <Text style={styles.copyright}>Copyright © 2026 Jans Tech</Text>
      <Text style={styles.rights}>All Rights Reserved</Text>
      
      {/* Legal Links - ALL CLICKABLE */}
      <View style={styles.legalLinks}>
        <TouchableOpacity onPress={() => navigateTo('termsOfService')}>
          <Text style={styles.legalLink}>Terms of Service</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity onPress={() => navigateTo('privacyPolicy')}>
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.separator}>•</Text>
        <TouchableOpacity onPress={() => navigateTo('copyrightNotice')}>
          <Text style={styles.legalLink}>Copyright</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.version}>Un-locka v{APP_INFO.version}</Text>
      <Text style={styles.developer}>Developed by Mwolobi Javanson</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', paddingVertical: SPACING.lg, paddingHorizontal: SPACING.md },
  divider: { width: 40, height: 3, backgroundColor: COLORS.primary, borderRadius: 2, marginBottom: SPACING.md },
  copyright: { fontSize: FONTS.sizes.xs, color: COLORS.darkGray, fontWeight: '600', marginBottom: 2 },
  rights: { fontSize: 10, color: COLORS.gray, marginBottom: SPACING.sm },
  legalLinks: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center', marginBottom: SPACING.sm },
  legalLink: { fontSize: 10, color: COLORS.primary, fontWeight: '600', paddingHorizontal: 6, paddingVertical: 2, textDecorationLine: 'underline' },
  separator: { fontSize: 10, color: COLORS.lightGray, marginHorizontal: 2 },
  version: { fontSize: 10, color: COLORS.lightGray, marginBottom: 2 },
  developer: { fontSize: 9, color: COLORS.lightGray },
});

export default Footer;
