// components/chat/ArchivedChats.tsx - View archived chats
import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { ChatConversation } from '../../types/chat';

interface ArchivedChatsProps {
  chats: ChatConversation[];
  onUnarchive: (chatId: string) => void;
  onDelete: (chatId: string) => void;
  onClose: () => void;
}

const ArchivedChats: React.FC<ArchivedChatsProps> = ({
  chats,
  onUnarchive,
  onDelete,
  onClose,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>📦 Archived Chats</Text>
        <Text style={styles.count}>{chats.length}</Text>
      </View>

      {chats.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyText}>No archived chats</Text>
        </View>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.chatItem}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {item.name.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.lastMessage}>
                  Archived on {new Date(item.updatedAt).toLocaleDateString()}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.unarchiveBtn}
                onPress={() => onUnarchive(item.id)}
              >
                <Text style={styles.unarchiveText}>Unarchive</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: COLORS.lightGray },
  closeBtn: { fontSize: 20, color: COLORS.primary, marginRight: SPACING.md },
  title: { flex: 1, fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark },
  count: { fontSize: FONTS.sizes.sm, color: COLORS.gray },
  empty: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyIcon: { fontSize: 60, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.gray },
  chatItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: '#E0E0E0' },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  avatarText: { color: COLORS.white, fontSize: 18, fontWeight: 'bold' },
  info: { flex: 1 },
  chatName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.dark },
  lastMessage: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  unarchiveBtn: { backgroundColor: '#E3F2FD', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 8 },
  unarchiveText: { color: COLORS.primary, fontWeight: '600', fontSize: FONTS.sizes.xs },
});

export default ArchivedChats;
