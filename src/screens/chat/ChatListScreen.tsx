// screens/chat/ChatListScreen.tsx - WhatsApp-style chat list
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput,
  Animated, Image, Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { ChatConversation, ChatMessage } from '../../types/chat';
import { formatChatTime, getMessageTypePreview } from '../../utils/chat/helpers';
import { chatAPI, chatSocket } from '../../services/chat/socketService';

interface ChatListScreenProps {
  onChatPress: (chatId: string, chatName: string) => void;
  onNewChat: () => void;
}

const ChatListScreen: React.FC<ChatListScreenProps> = ({ onChatPress, onNewChat }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'groups'>('all');

  useEffect(() => {
    loadConversations();
    chatSocket.on('conversation_updated', handleConversationUpdate);
    return () => chatSocket.off('conversation_updated', handleConversationUpdate);
  }, []);

  const loadConversations = async () => {
    const chats = await chatAPI.getConversations();
    setConversations(chats);
  };

  const handleConversationUpdate = (updated: ChatConversation) => {
    setConversations(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const filteredChats = conversations.filter(chat => {
    if (searchQuery) return chat.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (filterType === 'unread') return chat.unreadCount > 0;
    if (filterType === 'groups') return chat.type === 'group';
    return true;
  });

  const renderChatItem = ({ item }: { item: ChatConversation }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => onChatPress(item.id, item.name)}
      onLongPress={() => {
        Alert.alert(item.name, '', [
          { text: item.pinned ? 'Unpin' : 'Pin', onPress: () => {} },
          { text: item.muted ? 'Unmute' : 'Mute', onPress: () => {} },
          { text: item.archived ? 'Unarchive' : 'Archive', onPress: () => {} },
          { text: 'Delete', style: 'destructive', onPress: () => {} },
          { text: 'Cancel', style: 'cancel' },
        ]);
      }}
    >
      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
        {item.participants[0]?.isOnline && <View style={styles.onlineDot} />}
      </View>

      {/* Content */}
      <View style={styles.chatContent}>
        <View style={styles.chatTop}>
          <Text style={styles.chatName} numberOfLines={1}>
            {item.type === 'group' ? '👥 ' : ''}{item.name}
          </Text>
          <Text style={styles.chatTime}>
            {item.lastMessage && formatChatTime(item.lastMessage.timestamp)}
          </Text>
        </View>
        <View style={styles.chatBottom}>
          <View style={styles.lastMessageRow}>
            {item.lastMessage && (
              <>
                <Text style={styles.messageStatus}>
                  {item.lastMessage.status === 'read' ? '✓✓' : '✓'}
                </Text>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {getMessageTypePreview(item.lastMessage)}
                </Text>
              </>
            )}
          </View>
          <View style={styles.rightSide}>
            {item.pinned && <Text style={styles.pinIcon}>📌</Text>}
            {item.muted && <Text style={styles.muteIcon}>🔇</Text>}
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>
                  {item.unreadCount > 99 ? '99+' : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Un-locka Chat</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <Text style={styles.headerIcon}>🔍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={onNewChat}>
            <Text style={styles.headerIcon}>✏️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search chats..."
            placeholderTextColor="#999"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterTabs}>
        {['all', 'unread', 'groups'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterTab, filterType === filter && styles.activeFilter]}
            onPress={() => setFilterType(filter as any)}
          >
            <Text style={[styles.filterText, filterType === filter && styles.activeFilterText]}>
              {filter === 'all' ? 'All' : filter === 'unread' ? 'Unread' : 'Groups'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Archived Chats */}
      {conversations.some(c => c.archived) && (
        <TouchableOpacity style={styles.archivedBar}>
          <Text style={styles.archivedText}>
            📦 Archived ({conversations.filter(c => c.archived).length})
          </Text>
        </TouchableOpacity>
      )}

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChatItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyText}>No chats yet</Text>
            <Text style={styles.emptySubtext}>Start a new conversation</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 10, paddingHorizontal: SPACING.md, backgroundColor: COLORS.primary },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.white },
  headerActions: { flexDirection: 'row', gap: SPACING.md },
  headerBtn: { padding: SPACING.xs },
  headerIcon: { fontSize: 20 },
  
  // Search
  searchContainer: { padding: SPACING.sm, backgroundColor: COLORS.primary },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10, paddingHorizontal: SPACING.sm },
  searchIcon: { fontSize: 16, marginRight: SPACING.sm },
  searchInput: { flex: 1, padding: SPACING.sm, color: COLORS.white, fontSize: FONTS.sizes.md },
  
  // Filters
  filterTabs: { flexDirection: 'row', backgroundColor: COLORS.primary, paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  filterTab: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 15, marginRight: SPACING.sm },
  activeFilter: { backgroundColor: 'rgba(255,255,255,0.3)' },
  filterText: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.sm },
  activeFilterText: { color: COLORS.white, fontWeight: 'bold' },
  
  // Archived
  archivedBar: { padding: SPACING.sm, backgroundColor: '#F5F5F5', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  archivedText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '600' },
  
  // Chat list
  listContent: { paddingBottom: 100 },
  chatItem: { flexDirection: 'row', padding: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: '#E0E0E0' },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  avatarText: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  onlineDot: { position: 'absolute', bottom: 0, right: 0, width: 14, height: 14, borderRadius: 7, backgroundColor: '#4CAF50', borderWidth: 2, borderColor: COLORS.white },
  
  chatContent: { flex: 1, justifyContent: 'center' },
  chatTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  chatName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.dark, flex: 1 },
  chatTime: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  
  chatBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  lastMessageRow: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  messageStatus: { fontSize: 12, color: '#34B7F1', marginRight: 4 },
  lastMessage: { fontSize: FONTS.sizes.sm, color: COLORS.gray, flex: 1 },
  
  rightSide: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  pinIcon: { fontSize: 12 },
  muteIcon: { fontSize: 12 },
  unreadBadge: { backgroundColor: '#25D366', borderRadius: 12, minWidth: 24, height: 24, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  unreadText: { color: COLORS.white, fontSize: 12, fontWeight: 'bold' },
  
  // Empty
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xxl },
  emptyIcon: { fontSize: 60, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark },
  emptySubtext: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginTop: SPACING.xs },
});

export default ChatListScreen;
