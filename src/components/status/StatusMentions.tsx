// components/status/StatusMentions.tsx - @Mention users in status
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, TextInput } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

interface StatusMentionsProps {
  visible: boolean;
  onSelect: (user: any) => void;
  onClose: () => void;
}

const MOCK_USERS = [
  { id: 1, name: 'Admin Test', username: 'admin_test' },
  { id: 2, name: 'Jane Doe', username: 'jane_doe' },
  { id: 3, name: 'John Smith', username: 'john_smith' },
];

const StatusMentions: React.FC<StatusMentionsProps> = ({ visible, onSelect, onClose }) => {
  const [search, setSearch] = useState('');
  const filtered = MOCK_USERS.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase())
  );
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>@ Mention</Text>
      <TextInput style={styles.search} value={search} onChangeText={setSearch} placeholder="Search users..." placeholderTextColor="#999" />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => { onSelect(item); onClose(); }}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{item.name.charAt(0)}</Text></View>
            <View><Text style={styles.name}>{item.name}</Text><Text style={styles.username}>@{item.username}</Text></View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: '#FFF', borderRadius: 12, padding: SPACING.md, maxHeight: 300, elevation: 5, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  title: { fontSize: FONTS.sizes.md, fontWeight: 'bold', marginBottom: SPACING.sm },
  search: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 8, padding: SPACING.sm, marginBottom: SPACING.sm },
  item: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  avatarText: { color: '#FFF', fontWeight: 'bold' },
  name: { fontWeight: '600' },
  username: { fontSize: 12, color: COLORS.gray },
});

export default StatusMentions;
