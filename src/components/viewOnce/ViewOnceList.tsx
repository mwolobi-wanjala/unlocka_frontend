// components/viewOnce/ViewOnceList.tsx - Complete View Once List
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  RefreshControl, Alert, Dimensions, Image, TextInput,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { ViewOnceContent, VIEW_ONCE_MIN_AMOUNT, VIEW_ONCE_MAX_AMOUNT } from '../../types/viewOnce';
import { useToast } from '../../../App';

const { width } = Dimensions.get('window');

// Mock data
const MOCK_VIEW_ONCE: ViewOnceContent[] = [
  {
    id: 'vo_1', senderId: 2, senderName: 'Admin Test', recipientId: 1,
    recipientName: 'You', recipientPhone: '0712345678', type: 'image',
    content: 'https://picsum.photos/400/600', caption: 'Check out this exclusive photo! 📸',
    amount: 50, senderCut: 45, platformCut: 5, status: 'pending',
    direction: 'received', isEncrypted: true,
    expiresAt: new Date(Date.now() + 48 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 'vo_2', senderId: 1, senderName: 'You', recipientId: 2,
    recipientName: 'Admin Test', recipientPhone: '0798765432', type: 'video',
    content: 'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4',
    caption: 'Behind the scenes footage 🎬', amount: 100, senderCut: 90, platformCut: 10,
    status: 'paid', direction: 'sent', isEncrypted: true,
    expiresAt: new Date(Date.now() + 24 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
  {
    id: 'vo_3', senderId: 2, senderName: 'Admin Test', recipientId: 1,
    recipientName: 'You', recipientPhone: '0712345678', type: 'image',
    content: 'https://picsum.photos/400/500', caption: 'Premium content 💎',
    amount: 200, senderCut: 180, platformCut: 20, status: 'viewed',
    direction: 'received', isEncrypted: true,
    expiresAt: new Date(Date.now() + 12 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
  },
];

interface ViewOnceListProps {
  userId: number;
  onViewOncePress: (content: ViewOnceContent) => void;
  onCreatePress: () => void;
}

const ViewOnceList: React.FC<ViewOnceListProps> = ({ userId, onViewOncePress, onCreatePress }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<ViewOnceContent[]>(MOCK_VIEW_ONCE);
  const [activeTab, setActiveTab] = useState<'all' | 'received' | 'sent'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setItems(MOCK_VIEW_ONCE);
    setRefreshing(false);
  }, []);

  const formatTime = (timestamp: string): string => {
    const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  };

  const getStatusInfo = (item: ViewOnceContent) => {
    if (item.direction === 'sent') {
      switch (item.status) {
        case 'pending': return { text: '⏳ Waiting', color: '#FF9800' };
        case 'paid': return { text: '💰 Paid', color: '#2196F3' };
        case 'viewed': return { text: '👁️ Viewed', color: '#4CAF50' };
        case 'expired': return { text: '⏰ Expired', color: '#F44336' };
        default: return { text: item.status, color: '#999' };
      }
    } else {
      switch (item.status) {
        case 'pending': return { text: '💳 Pay KSH ' + item.amount, color: '#E65100' };
        case 'paid': return { text: '👆 Tap to view', color: '#4CAF50' };
        case 'viewed': return { text: '✅ Viewed', color: '#2196F3' };
        case 'expired': return { text: '⏰ Expired', color: '#F44336' };
        default: return { text: item.status, color: '#999' };
      }
    }
  };

  const filteredItems = activeTab === 'all' 
    ? items 
    : items.filter(i => i.direction === activeTab);

  const renderItem = ({ item }: { item: ViewOnceContent }) => {
    const statusInfo = getStatusInfo(item);
    const isReceived = item.direction === 'received';
    const isPending = item.status === 'pending' && isReceived;

    return (
      <TouchableOpacity
        style={[styles.item, isPending && styles.pendingItem]}
        onPress={() => onViewOncePress(item)}
        onLongPress={() => {
          Alert.alert('View Once', '', [
            { text: '👁️ View Details', onPress: () => onViewOncePress(item) },
            { text: item.direction === 'sent' ? '📤 Share' : '💳 Pay Now', onPress: () => onViewOncePress(item) },
            { text: '🗑️ Delete', style: 'destructive', onPress: () => {
              setItems(prev => prev.filter(i => i.id !== item.id));
              showToast('Deleted');
            }},
            { text: 'Cancel', style: 'cancel' },
          ]);
        }}
      >
        {/* Header */}
        <View style={styles.itemHeader}>
          <View style={styles.userInfo}>
            <View style={[styles.avatar, { backgroundColor: isReceived ? '#2196F3' : '#4CAF50' }]}>
              <Text style={styles.avatarText}>
                {(isReceived ? item.senderName : item.recipientName)?.charAt(0) || '?'}
              </Text>
            </View>
            <View>
              <Text style={styles.userName}>
                {isReceived ? `From: ${item.senderName}` : `To: ${item.recipientName}`}
              </Text>
              <Text style={styles.timestamp}>{formatTime(item.createdAt)}</Text>
            </View>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo.color + '20' }]}>
            <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.text}</Text>
          </View>
        </View>

        {/* Preview */}
        <View style={styles.preview}>
          <Text style={styles.typeIcon}>
            {item.type === 'image' ? '📷' : '🎥'}
          </Text>
          <View style={styles.previewInfo}>
            <Text style={styles.previewText} numberOfLines={1}>
              {item.type === 'image' ? 'Photo' : 'Video'} message
            </Text>
            {item.caption && (
              <Text style={styles.captionText} numberOfLines={1}>"{item.caption}"</Text>
            )}
          </View>
        </View>

        {/* Amount & Encryption */}
        <View style={styles.bottomRow}>
          <Text style={styles.amountLabel}>
            {isReceived ? 'Amount to pay:' : 'Asking price:'}
          </Text>
          <Text style={styles.amountValue}>KSH {item.amount}</Text>
        </View>
        
        {item.isEncrypted && (
          <View style={styles.encryptedBadge}>
            <Text style={styles.encryptedIcon}>🔐</Text>
            <Text style={styles.encryptedText}>End-to-End Encrypted</Text>
          </View>
        )}

        {/* Expiry timer for pending received items */}
        {isPending && (
          <View style={styles.expiryRow}>
            <Text style={styles.expiryText}>
              ⏰ Expires in {formatTime(item.expiresAt)}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>💎 View Once</Text>
          <Text style={styles.headerSubtitle}>
            Min KSH {VIEW_ONCE_MIN_AMOUNT} • Max KSH {VIEW_ONCE_MAX_AMOUNT}
          </Text>
        </View>
        <TouchableOpacity style={styles.createBtn} onPress={onCreatePress}>
          <Text style={styles.createBtnText}>+ New</Text>
        </TouchableOpacity>
      </View>

      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <Text style={styles.infoIcon}>💡</Text>
        <Text style={styles.infoText}>
          Send photo/video that disappears after viewing. Recipient pays to unlock. You earn 90%!
        </Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['all', 'received', 'sent'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab === 'all' ? `All (${items.length})` : 
               tab === 'received' ? `Received (${items.filter(i => i.direction === 'received').length})` : 
               `Sent (${items.filter(i => i.direction === 'sent').length})`}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💎</Text>
            <Text style={styles.emptyText}>
              {activeTab === 'all' ? 'No view once messages' :
               activeTab === 'received' ? 'No received view once' : 'No sent view once'}
            </Text>
            <Text style={styles.emptySubtext}>
              Tap + New to send view once content
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 55, paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm, backgroundColor: '#FFF' },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.dark },
  headerSubtitle: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  createBtn: { backgroundColor: '#4CAF50', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.sm, borderRadius: 20, ...SHADOWS.small },
  createBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: FONTS.sizes.sm },
  infoBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E8F5E9', padding: SPACING.sm, paddingHorizontal: SPACING.md, gap: SPACING.sm },
  infoIcon: { fontSize: 14 },
  infoText: { flex: 1, fontSize: FONTS.sizes.xs, color: '#2E7D32' },
  tabs: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#4CAF50' },
  tabText: { fontSize: FONTS.sizes.sm, color: COLORS.gray, fontWeight: '600' },
  activeTabText: { color: '#4CAF50' },
  list: { padding: SPACING.sm },
  item: { backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.md, marginBottom: SPACING.sm, ...SHADOWS.small },
  pendingItem: { borderLeftWidth: 4, borderLeftColor: '#E65100' },
  itemHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.sm },
  userInfo: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  avatar: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  userName: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark },
  timestamp: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  statusBadge: { paddingHorizontal: SPACING.sm, paddingVertical: 2, borderRadius: 10 },
  statusText: { fontSize: FONTS.sizes.xs, fontWeight: 'bold' },
  preview: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F9FA', padding: SPACING.sm, borderRadius: 10, marginBottom: SPACING.sm },
  typeIcon: { fontSize: 20, marginRight: SPACING.sm },
  previewInfo: { flex: 1 },
  previewText: { fontSize: FONTS.sizes.sm, color: COLORS.dark },
  captionText: { fontSize: FONTS.sizes.xs, color: COLORS.gray, fontStyle: 'italic', marginTop: 2 },
  bottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  amountLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  amountValue: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: '#E65100' },
  encryptedBadge: { flexDirection: 'row', alignItems: 'center', marginTop: SPACING.xs, gap: 4 },
  encryptedIcon: { fontSize: 10 },
  encryptedText: { fontSize: 9, color: '#4CAF50' },
  expiryRow: { marginTop: SPACING.xs },
  expiryText: { fontSize: 10, color: '#F44336', fontStyle: 'italic' },
  empty: { alignItems: 'center', padding: SPACING.xxl },
  emptyIcon: { fontSize: 60, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark },
  emptySubtext: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginTop: SPACING.xs, textAlign: 'center' },
});

export default ViewOnceList;
