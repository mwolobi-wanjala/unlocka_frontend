import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING } from '../constants/theme';
import { ProgressIndicatorProps } from '../types';

const steps = [{ n: 1, t: 'Account', i: '👤' }, { n: 2, t: 'Payment', i: '💳' }, { n: 3, t: 'Done', i: '✅' }];

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({ currentStep }) => (
  <View style={styles.container}>
    <View style={styles.barWrap}><View style={[styles.fill, { width: `${((currentStep-1)/2)*100}%` }]} /></View>
    <View style={styles.row}>
      {steps.map((s, i) => {
        const active = i+1 === currentStep, done = i+1 < currentStep;
        return (
          <View key={s.n} style={styles.item}>
            <View style={[styles.circle, active && styles.act, done && styles.done]}>
              <Text style={{ fontSize: 16 }}>{done ? '✅' : s.i}</Text>
            </View>
            <Text style={[styles.lbl, active && styles.actLbl, done && styles.doneLbl]}>{s.t}</Text>
          </View>
        );
      })}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md },
  barWrap: { paddingHorizontal: 25, marginBottom: SPACING.sm, height: 3, backgroundColor: COLORS.lightGray, borderRadius: 2 },
  fill: { height: '100%', backgroundColor: COLORS.primary, borderRadius: 2 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  item: { alignItems: 'center', flex: 1 },
  circle: { width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  act: { backgroundColor: COLORS.primary, transform: [{ scale: 1.1 }] },
  done: { backgroundColor: COLORS.success },
  lbl: { fontSize: FONTS.sizes.xs, color: COLORS.gray, fontWeight: '600' },
  actLbl: { color: COLORS.primary, fontWeight: 'bold' },
  doneLbl: { color: COLORS.success, fontWeight: 'bold' },
});

export default ProgressIndicator;
