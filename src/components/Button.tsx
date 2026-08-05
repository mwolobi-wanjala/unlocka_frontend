import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import { ButtonProps } from '../types';

const Button: React.FC<ButtonProps> = ({
  title, onPress, loading = false, disabled = false, variant = 'primary', icon,
}) => {
  const getStyle = () => {
    switch (variant) {
      case 'secondary': return styles.secondary;
      case 'success': return styles.success;
      case 'outline': return styles.outline;
      case 'google': return styles.google;
      default: return styles.primary;
    }
  };
  const getTextStyle = () => {
    switch (variant) {
      case 'outline': return styles.outlineText;
      case 'google': return styles.googleText;
      default: return styles.text;
    }
  };

  return (
    <TouchableOpacity style={[styles.btn, getStyle(), disabled && styles.disabled]} onPress={onPress} disabled={disabled || loading} activeOpacity={0.8}>
      {loading ? <ActivityIndicator color={variant === 'outline' || variant === 'google' ? COLORS.primary : COLORS.white} size="small" /> : (
        <View style={styles.row}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={[styles.text, getTextStyle()]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: { padding: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginVertical: 6, minHeight: 50, ...SHADOWS.small },
  primary: { backgroundColor: COLORS.primary },
  secondary: { backgroundColor: COLORS.secondary },
  success: { backgroundColor: COLORS.success },
  outline: { backgroundColor: COLORS.transparent, borderWidth: 2, borderColor: COLORS.primary },
  google: { backgroundColor: COLORS.white, borderWidth: 1, borderColor: '#DDD', ...SHADOWS.small },
  disabled: { opacity: 0.6 },
  row: { flexDirection: 'row', alignItems: 'center' },
  icon: { fontSize: 18, marginRight: SPACING.sm },
  text: { color: COLORS.white, fontSize: FONTS.sizes.md, fontWeight: '600' },
  outlineText: { color: COLORS.primary, fontSize: FONTS.sizes.md, fontWeight: '600' },
  googleText: { color: '#444', fontSize: FONTS.sizes.md, fontWeight: '600' },
});

export default Button;
