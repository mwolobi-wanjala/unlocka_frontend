// components/LegalLinks.tsx - Reusable Legal Links Component
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface LegalLinksProps {
  onNavigate: (screen: string) => void;
  compact?: boolean;
  showCopyright?: boolean;
}

const LegalLinks: React.FC<LegalLinksProps> = ({ 
  onNavigate, 
  compact = false,
  showCopyright = true 
}) => {
  return (
    <View style={[styles.container, compact && styles.compact]}>
      {showCopyright && (
        <Text style={[styles.copyright, compact && styles.compactText]}>
          © 2026 Jans Tech
        </Text>
      )}
      
      <View style={styles.linksRow}>
        <TouchableOpacity onPress={() => onNavigate('termsOfService')}>
          <Text style={[styles.link, compact && styles.compactText]}>
            Terms
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.dot, compact && styles.compactText]}>•</Text>
        
        <TouchableOpacity onPress={() => onNavigate('privacyPolicy')}>
          <Text style={[styles.link, compact && styles.compactText]}>
            Privacy
          </Text>
        </TouchableOpacity>
        
        <Text style={[styles.dot, compact && styles.compactText]}>•</Text>
        
        <TouchableOpacity onPress={() => onNavigate('copyrightNotice')}>
          <Text style={[styles.link, compact && styles.compactText]}>
            Copyright
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: SPACING.md,
  },
  compact: {
    padding: SPACING.sm,
  },
  copyright: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.gray,
    marginBottom: 4,
  },
  compactText: {
    fontSize: 9,
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  link: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.primary,
    fontWeight: '600',
  },
  dot: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.lightGray,
  },
});

export default LegalLinks;
