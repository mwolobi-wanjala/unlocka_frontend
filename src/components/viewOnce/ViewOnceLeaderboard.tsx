// components/viewOnce/ViewOnceLeaderboard.tsx - Top earners leaderboard
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';

interface LeaderboardEntry {
  rank: number;
  userId: number;
  userName: string;
  totalEarned: number;
  totalSent: number;
  totalViewed: number;
  avatar?: string;
}

interface ViewOnceLeaderboardProps {
  userId: number;
}

const ViewOnceLeaderboard: React.FC<ViewOnceLeaderboardProps> = ({ userId }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/v1/view-once/leaderboard?user_id=${userId}`);
      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
      setUserRank(data.userRank || null);
    } catch {
      setLeaderboard(getDemoLeaderboard());
    }
  };

  const getDemoLeaderboard = (): LeaderboardEntry[] => [
    { rank: 1, userId: 1, userName: 'Mwolobi', totalEarned: 5000, totalSent: 100, totalViewed: 80 },
    { rank: 2, userId: 2, userName: 'Jane', totalEarned: 3500, totalSent: 70, totalViewed: 55 },
    { rank: 3, userId: 3, userName: 'John', totalEarned: 2800, totalSent: 50, totalViewed: 40 },
  ];

  const getMedal = (rank: number): string => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const renderItem = ({ item }: { item: LeaderboardEntry }) => (
    <View style={[styles.item, item.userId === userId && styles.userItem]}>
      <Text style={styles.rank}>{getMedal(item.rank)}</Text>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.userName.charAt(0)}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.userName}</Text>
        <Text style={styles.stats}>
          📤 {item.totalSent} • 👁️ {item.totalViewed}
        </Text>
      </View>
      <Text style={styles.earned}>KSH {item.totalEarned}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🏆 View Once Leaderboard</Text>
      
      {userRank && (
        <View style={styles.userRank}>
          <Text style={styles.userRankText}>
            Your Rank: {getMedal(userRank.rank)} • KSH {userRank.totalEarned} earned
          </Text>
        </View>
      )}

      <FlatList
        data={leaderboard}
        renderItem={renderItem}
        keyExtractor={item => item.userId.toString()}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, ...SHADOWS.medium },
  title: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.md, textAlign: 'center' },
  userRank: { backgroundColor: '#F0EEFF', padding: SPACING.sm, borderRadius: 10, marginBottom: SPACING.md },
  userRankText: { textAlign: 'center', color: COLORS.primary, fontWeight: '600' },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  userItem: { backgroundColor: '#F8F7FF', borderRadius: 8, paddingHorizontal: SPACING.sm },
  rank: { fontSize: FONTS.sizes.lg, width: 40, textAlign: 'center' },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  avatarText: { color: '#FFF', fontWeight: 'bold' },
  info: { flex: 1 },
  name: { fontSize: FONTS.sizes.sm, fontWeight: '600' },
  stats: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  earned: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: '#4CAF50' },
});

export default ViewOnceLeaderboard;
