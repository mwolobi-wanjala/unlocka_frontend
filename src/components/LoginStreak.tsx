// components/LoginStreak.tsx - Show login streak & rewards
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';

interface LoginStreakProps {
  streak: number;
  lastLogin: string;
  reward?: number;
}

const LoginStreak: React.FC<LoginStreakProps> = ({ streak, lastLogin, reward }) => {
  return (
    <View style={styles.container}>
      <View style={styles.streakRow}>
        <Text style={styles.fireIcon}>🔥</Text>
        <View>
          <Text style={styles.streakCount}>{streak} Day Streak!</Text>
          <Text style={styles.lastLogin}>Last login: {lastLogin}</Text>
        </View>
      </View>
      {reward && (
        <View style={styles.rewardBadge}>
          <Text style={styles.rewardText}>🎁 +{reward} KSH Bonus</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF8E1', borderRadius: 16, padding: SPACING.md, marginBottom: SPACING.md, ...SHADOWS.small },
  streakRow: { flexDirection: 'row', alignItems: 'center' },
  fireIcon: { fontSize: 30, marginRight: SPACING.sm },
  streakCount: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: '#E65100' },
  lastLogin: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  rewardBadge: { backgroundColor: COLORS.gold, padding: SPACING.xs, paddingHorizontal: SPACING.md, borderRadius: 20, alignSelf: 'flex-start', marginTop: SPACING.sm },
  rewardText: { fontSize: FONTS.sizes.xs, fontWeight: 'bold', color: COLORS.dark },
});

export default LoginStreak;
