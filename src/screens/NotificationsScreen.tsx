// screens/NotificationsScreen.tsx - Notifications Center
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import { useToast } from '../../App';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  data: any;
  createdAt: string;
}

interface NotificationsScreenProps {
  userId: number;
  onClose: () => void;
}

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: '1', title: '💰 Payment Received', body: 'You received KSH 45 from view once content', type: 'payment', isRead: false, data: { amount: 45 }, createdAt: new Date(Date.now() - 5*60000).toISOString() },
  { id: '2', title: '👤 New Follower', body: 'Admin Test started following you', type: 'social', isRead: false, data: { userId: 2 }, createdAt: new Date(Date.now() - 30*60000).toISOString() },
  { id: '3', title: '💎 View Once Viewed', body: 'Your view once was viewed by Jane Doe', type: 'view_once', isRead: true, data: { viewerId: 3 }, createdAt: new Date(Date.now() - 120*60000).toISOString() },
  { id: '4', title: '🎁 Referral Bonus', body: 'You earned KSH 20 from a referral', type: 'referral', isRead: true, data: { amount: 20 }, createdAt: new Date(Date.now() - 240*60000).toISOString() },
  { id: '5', title: '🔔 System Update', body: 'New features available! Check out Creators tab', type: 'system', isRead: false, data: {}, createdAt: new Date(Date.now() - 360*60000).toISOString() },
  { id: '6', title: '💬 New Message', body: 'Admin Test sent you a message', type: 'message', isRead: false, data: { chatId: '1' }, createdAt: new Date(Date.now() - 60*60000).toISOString() },
  { id: '7', title: '✅ Withdrawal Complete', body: 'KSH 500 sent to your M-Pesa', type: 'payment', isRead: true, data: { amount: 500 }, createdAt: new Date(Date.now() - 480*60000).toISOString() },
];

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ userId, onClose }) => {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const onRefresh = async () => {
    setRefreshing(true);
    setNotifications(MOCK_NOTIFICATIONS);
    setRefreshing(false);
  };

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('✅ All marked as read');
  };

  const handleClearAll = () => {
    Alert.alert('Clear All', 'Delete all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => {
        setNotifications([]);
        showToast('🗑️ All cleared');
      }},
    ]);
  };

  const formatTime = (ts: string) => {
    const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff/60)}m`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h`;
    return `${Math.floor(diff/86400)}d`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'payment': return '💰';
      case 'social': return '👤';
      case 'view_once': return '💎';
      case 'referral': return '🎁';
      case 'system': return '🔔';
      case 'message': return '💬';
      default: return '📢';
    }
  };

  const filteredNotifications = activeFilter === 'all' 
    ? notifications 
    : activeFilter === 'unread' 
      ? notifications.filter(n => !n.isRead)
      : notifications.filter(n => n.type === activeFilter);

  const renderItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      style={[styles.notifItem, !item.isRead && styles.unreadItem]}
      onPress={() => {
        setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, isRead: true } : n));
      }}
    >
      <View style={[styles.notifIcon, { backgroundColor: item.isRead ? '#F5F5F5' : '#E3F2FD' }]}>
        <Text style={styles.notifEmoji}>{getTypeIcon(item.type)}</Text>
      </View>
      <View style={styles.notifContent}>
        <View style={styles.notifHeader}>
          <Text style={styles.notifTitle}>{item.title}</Text>
          {!item.isRead && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
        <Text style={styles.notifTime}>{formatTime(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={onClose}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={handleMarkAllRead}>
              <Text style={styles.markRead}>✓ All</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: `Unread (${unreadCount})` },
          { key: 'payment', label: '💰' },
          { key: 'social', label: '👤' },
          { key: 'system', label: '🔔' },
        ].map(filter => (
          <TouchableOpacity
            key={filter.key}
            style={[styles.filterTab, activeFilter === filter.key && styles.activeFilter]}
            onPress={() => setActiveFilter(filter.key)}
          >
            <Text style={[styles.filterText, activeFilter === filter.key && styles.activeFilterText]}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>No notifications</Text>
          </View>
        }
      />

      {/* Clear All */}
      {notifications.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={handleClearAll}>
          <Text style={styles.clearText}>🗑️ Clear All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, padding: SPACING.md },
  backBtn: { color: '#FFF', fontSize: 22 },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  headerRight: { flexDirection: 'row', gap: SPACING.md },
  markRead: { color: '#FFF', fontSize: FONTS.sizes.sm },
  filterTabs: { flexDirection: 'row', backgroundColor: '#FFF', paddingHorizontal: SPACING.sm, paddingVertical: SPACING.sm, gap: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  filterTab: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 15, backgroundColor: '#F5F5F5' },
  activeFilter: { backgroundColor: COLORS.primary },
  filterText: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  activeFilterText: { color: '#FFF', fontWeight: 'bold' },
  list: { padding: SPACING.sm },
  notifItem: { flexDirection: 'row', backgroundColor: '#FFF', padding: SPACING.md, borderRadius: 12, marginBottom: SPACING.sm, ...SHADOWS.small },
  unreadItem: { borderLeftWidth: 4, borderLeftColor: COLORS.primary },
  notifIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  notifEmoji: { fontSize: 20 },
  notifContent: { flex: 1 },
  notifHeader: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  notifTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  notifBody: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  notifTime: { fontSize: 10, color: COLORS.gray, marginTop: 4 },
  clearBtn: { padding: SPACING.md, alignItems: 'center', backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  clearText: { color: '#F44336', fontSize: FONTS.sizes.sm, fontWeight: '600' },
  empty: { alignItems: 'center', padding: SPACING.xxl },
  emptyIcon: { fontSize: 60, marginBottom: SPACING.md },
  emptyText: { color: COLORS.gray },
});

export default NotificationsScreen;
