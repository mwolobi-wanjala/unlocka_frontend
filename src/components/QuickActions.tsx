// components/QuickActions.tsx - Quick login actions
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';

interface Action {
  icon: string;
  label: string;
  onPress: () => void;
}

interface QuickActionsProps {
  actions: Action[];
}

const QuickActions: React.FC<QuickActionsProps> = ({ actions }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((action, index) => (
          <TouchableOpacity key={index} style={styles.action} onPress={action.onPress}>
            <Text style={styles.icon}>{action.icon}</Text>
            <Text style={styles.label}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: SPACING.md },
  title: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.darkGray, marginBottom: SPACING.sm },
  grid: { flexDirection: 'row', gap: SPACING.sm },
  action: { flex: 1, backgroundColor: COLORS.white, padding: SPACING.md, borderRadius: 12, alignItems: 'center', ...SHADOWS.small },
  icon: { fontSize: 24, marginBottom: SPACING.xs },
  label: { fontSize: FONTS.sizes.xs, color: COLORS.darkGray, textAlign: 'center' },
});

export default QuickActions;
