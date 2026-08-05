// components/chat/ChatStats.tsx - Chat statistics
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { ChatMessage } from '../../types/chat';

interface ChatStatsProps {
  messages: ChatMessage[];
  chatName: string;
}

const ChatStats: React.FC<ChatStatsProps> = ({ messages, chatName }) => {
  const totalMessages = messages.length;
  const sentMessages = messages.filter(m => m.senderId === 1).length;
  const receivedMessages = totalMessages - sentMessages;
  const mediaMessages = messages.filter(m => ['image', 'video', 'audio'].includes(m.type)).length;
  const textMessages = messages.filter(m => m.type === 'text').length;
  const starredMessages = messages.filter(m => m.starred).length;
  
  // Most active time
  const hourCounts: { [hour: number]: number } = {};
  messages.forEach(m => {
    const hour = new Date(m.timestamp).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  const mostActiveHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>📊 {chatName} Statistics</Text>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Messages</Text>
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{totalMessages}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{sentMessages}</Text>
            <Text style={styles.statLabel}>Sent</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{receivedMessages}</Text>
            <Text style={styles.statLabel}>Received</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Media</Text>
        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{mediaMessages}</Text>
            <Text style={styles.statLabel}>Media</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{textMessages}</Text>
            <Text style={styles.statLabel}>Text</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>{starredMessages}</Text>
            <Text style={styles.statLabel}>Starred</Text>
          </View>
        </View>
      </View>
      
      {mostActiveHour && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Most Active Time</Text>
          <Text style={styles.activeTime}>
            🕐 {mostActiveHour[0]}:00 - {mostActiveHour[1]} messages
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.offWhite },
  content: { padding: SPACING.md },
  title: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.dark, textAlign: 'center', marginBottom: SPACING.lg },
  card: { backgroundColor: COLORS.white, borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.medium },
  cardTitle: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.dark, marginBottom: SPACING.md },
  statRow: { flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statNumber: { fontSize: FONTS.sizes.xxl, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 4 },
  activeTime: { fontSize: FONTS.sizes.md, color: COLORS.dark, textAlign: 'center' },
});

export default ChatStats;
