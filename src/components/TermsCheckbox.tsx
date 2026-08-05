// components/TermsCheckbox.tsx - Terms Agreement Checkbox for Signup
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';

interface TermsCheckboxProps {
  agreed: boolean;
  onToggle: () => void;
  onViewTerms: () => void;
  onViewPrivacy: () => void;
}

const TermsCheckbox: React.FC<TermsCheckboxProps> = ({
  agreed,
  onToggle,
  onViewTerms,
  onViewPrivacy,
}) => {
  return (
    <View style={styles.container}>
      {/* Checkbox */}
      <TouchableOpacity style={styles.checkboxRow} onPress={onToggle}>
        <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
          {agreed && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.text}>
          I agree to the{' '}
          <Text style={styles.link} onPress={onViewTerms}>
            Terms of Service
          </Text>
          {' '}and{' '}
          <Text style={styles.link} onPress={onViewPrivacy}>
            Privacy Policy
          </Text>
        </Text>
      </TouchableOpacity>
      
      {!agreed && (
        <Text style={styles.required}>
          ⚠️ You must agree to the Terms of Service to create an account
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SPACING.sm,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: COLORS.gray,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
    backgroundColor: '#FFF',
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  text: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.darkGray,
    lineHeight: 20,
  },
  link: {
    color: COLORS.primary,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  required: {
    color: '#F44336',
    fontSize: FONTS.sizes.xs,
    marginTop: SPACING.xs,
    marginLeft: 30,
  },
});

export default TermsCheckbox;
