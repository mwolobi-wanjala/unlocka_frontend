// screens/ChatListScreen.tsx - WhatsApp-Style Chat List
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, RefreshControl, Alert, Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import { MOCK_CHATS } from '../services/localMockData';
import { useToast } from '../../App';

interface ChatListScreenProps {
  onChatPress: (chat: any) => void;
  onNavigate: (screen: string) => void;
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({ onChatPress, onNavigate }) => {
  const { showToast } = useToast();
  const [chats, setChats] = useState<any[]>(MOCK_CHATS);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'groups'>('all');

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setChats(MOCK_CHATS);
    setRefreshing(false);
  }, []);

  const formatTime = (timestamp: string): string => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800) return date.toLocaleDateString([], { weekday: 'short' });
    return date.toLocaleDateString([], { day: 'numeric', month: 'numeric', year: '2-digit' });
  };

  const getLastMessagePreview = (chat: any): string => {
    const msg = chat.lastMessage;
    if (!msg) return '';
    switch (msg.type) {
      case 'image': return '📷 Photo';
      case 'video': return '🎥 Video';
      case 'audio': return '🎤 Voice note';
      case 'document': return '📄 Document';
      case 'location': return '📍 Location';
      case 'contact': return '👤 Contact';
      case 'poll': return '📊 Poll';
      case 'call': return '📞 Call';
      default: return msg.content || '';
    }
  };

  const handleChatLongPress = (chat: any) => {
    Vibration.vibrate(30);
    Alert.alert(chat.name, '', [
      { text: chat.pinned ? '📌 Unpin' : '📌 Pin', onPress: () => {
        setChats(prev => prev.map(c => c.id === chat.id ? { ...c, pinned: !c.pinned } : c));
        showToast(chat.pinned ? 'Unpinned' : 'Pinned');
      }},
      { text: chat.muted ? '🔔 Unmute' : '🔇 Mute', onPress: () => {
        setChats(prev => prev.map(c => c.id === chat.id ? { ...c, muted: !c.muted } : c));
        showToast(chat.muted ? 'Unmuted' : 'Muted');
      }},
      { text: '👁️ Mark Unread', onPress: () => {
        setChats(prev => prev.map(c => c.id === chat.id ? { ...c, unreadCount: 1 } : c));
        showToast('Marked unread');
      }},
      { text: chat.archived ? '📥 Unarchive' : '📦 Archive', onPress: () => {
        setChats(prev => prev.map(c => c.id === chat.id ? { ...c, archived: !c.archived } : c));
        showToast(chat.archived ? 'Unarchived' : 'Archived');
      }},
      { text: '🗑️ Delete', style: 'destructive', onPress: () => {
        setChats(prev => prev.filter(c => c.id !== chat.id));
        showToast('Deleted');
      }},
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const filteredChats = chats.filter(chat => {
    if (searchQuery) return chat.name?.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'unread') return chat.unreadCount > 0;
    if (filterType === 'groups') return chat.type === 'group';
    return true;
  });

  const renderChatItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.chatItem, item.pinned && styles.pinnedItem]}
      onPress={() => onChatPress(item)}
      onLongPress={() => handleChatLongPress(item)}
      delayLongPress={400}
      activeOpacity={0.7}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name?.charAt(0)?.toUpperCase() || '?'}</Text>
        {item.participants?.[0]?.isOnline && <View style={styles.onlineDot} />}
      </View>
      <View style={styles.chatContent}>
        <View style={styles.chatTop}>
          <Text style={styles.chatName} numberOfLines={1}>
            {item.type === 'group' ? '👥 ' : ''}{item.name}
          </Text>
          <View style={styles.chatTopRight}>
            {item.pinned && <Text style={styles.pinIcon}>📌</Text>}
            <Text style={styles.chatTime}>{item.lastMessage ? formatTime(item.lastMessage.timestamp) : ''}</Text>
          </View>
        </View>
        <View style={styles.chatBottom}>
          <View style={styles.lastMessageRow}>
            {item.lastMessage?.status === 'read' && <Text style={styles.readCheck}>✓✓</Text>}
            <Text style={styles.lastMessage} numberOfLines={1}>{getLastMessagePreview(item)}</Text>
          </View>
          <View style={styles.rightSide}>
            {item.muted && <Text style={styles.muteIcon}>🔇</Text>}
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{item.unreadCount > 99 ? '99+' : item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <Text style={styles.headerTitle}>Un-locka</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}><Text style={styles.headerIcon}>🔍</Text></TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}><Text style={styles.headerIcon}>⋮</Text></TouchableOpacity>
        </View>
      </LinearGradient>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput style={styles.searchInput} value={searchQuery} onChangeText={setSearchQuery} placeholder="Search chats..." placeholderTextColor="#999" />
          {searchQuery.length > 0 && <TouchableOpacity onPress={() => setSearchQuery('')}><Text style={styles.clearBtn}>✕</Text></TouchableOpacity>}
        </View>
      </View>

      <View style={styles.filterTabs}>
        {['all', 'unread', 'groups'].map(filter => (
          <TouchableOpacity key={filter} style={[styles.filterTab, filterType === filter && styles.activeFilter]} onPress={() => setFilterType(filter as any)}>
            <Text style={[styles.filterText, filterType === filter && styles.activeFilterText]}>{filter === 'all' ? 'All' : filter === 'unread' ? 'Unread' : 'Groups'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<View style={styles.emptyContainer}><Text style={styles.emptyIcon}>💬</Text><Text style={styles.emptyText}>No chats yet</Text></View>}
      />

      <TouchableOpacity style={styles.fab} onPress={() => onNavigate('newChat')}>
        <Text style={styles.fabIcon}>💬</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 10, paddingHorizontal: SPACING.md },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: '#FFF' },
  headerActions: { flexDirection: 'row', gap: SPACING.md },
  headerBtn: { padding: SPACING.xs }, headerIcon: { fontSize: 20, color: '#FFF' },
  searchContainer: { padding: SPACING.sm, backgroundColor: COLORS.primary },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: SPACING.sm },
  searchIcon: { fontSize: 16, marginRight: SPACING.sm },
  searchInput: { flex: 1, padding: SPACING.sm, color: '#FFF', fontSize: FONTS.sizes.md },
  clearBtn: { color: '#FFF', fontSize: 16, padding: SPACING.xs },
  filterTabs: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  filterTab: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 15, marginRight: SPACING.sm },
  activeFilter: { backgroundColor: 'rgba(255,255,255,0.3)' },
  filterText: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm },
  activeFilterText: { color: '#FFF', fontWeight: 'bold' },
  listContent: { paddingBottom: 80 },
  chatItem: { flexDirection: 'row', padding: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: '#E0E0E0' },
  pinnedItem: { backgroundColor: '#F8F9FA' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#FFF' },
  chatContent: { flex: 1, justifyContent: 'center' },
  chatTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.dark, flex: 1 },
  chatTopRight: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pinIcon: { fontSize: 10 },
  chatTime: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  chatBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessageRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  readCheck: { fontSize: 12, color: '#34B7F1', marginRight: 4 },
  lastMessage: { fontSize: FONTS.sizes.sm, color: COLORS.gray, flex: 1 },
  rightSide: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  muteIcon: { fontSize: 12 },
  unreadBadge: { backgroundColor: '#25D366', borderRadius: 12, minWidth: 24, height: 24, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  unreadText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xxl },
  emptyIcon: { fontSize: 60, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark },
  fab: { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: '#25D366', justifyContent: 'center', alignItems: 'center', ...SHADOWS.large },
  fabIcon: { fontSize: 24 },
});

export default ChatListScreen;
