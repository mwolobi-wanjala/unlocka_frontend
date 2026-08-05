// components/viewOnce/BulkSend.tsx - Send view once to multiple contacts
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, Alert,
} from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import Button from '../Button';

interface Contact {
  id: number;
  name: string;
  phone: string;
  selected: boolean;
}

interface BulkSendProps {
  contacts: Contact[];
  onSend: (selectedContacts: Contact[]) => void;
  onClose: () => void;
}

const BulkSend: React.FC<BulkSendProps> = ({ contacts: initialContacts, onSend, onClose }) => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectAll, setSelectAll] = useState(false);

  const selectedCount = contacts.filter(c => c.selected).length;

  const toggleContact = (id: number) => {
    setContacts(prev => prev.map(c => 
      c.id === id ? { ...c, selected: !c.selected } : c
    ));
  };

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setContacts(prev => prev.map(c => ({ ...c, selected: !selectAll })));
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBulkSend = () => {
    const selected = contacts.filter(c => c.selected);
    if (selected.length === 0) {
      Alert.alert('Error', 'Select at least one contact');
      return;
    }
    onSend(selected);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeBtn}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Bulk Send</Text>
        <Text style={styles.count}>{selectedCount} selected</Text>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search contacts..."
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity style={styles.selectAllRow} onPress={toggleSelectAll}>
        <View style={[styles.checkbox, selectAll && styles.checkboxChecked]}>
          {selectAll && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.selectAllText}>Select All</Text>
      </TouchableOpacity>

      <FlatList
        data={filteredContacts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.contactItem} onPress={() => toggleContact(item.id)}>
            <View style={[styles.checkbox, item.selected && styles.checkboxChecked]}>
              {item.selected && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.phone}>{item.phone}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      <View style={styles.footer}>
        <Button
          title={`Send to ${selectedCount} Contacts`}
          icon="📤"
          onPress={handleBulkSend}
          variant="primary"
          disabled={selectedCount === 0}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, padding: SPACING.md },
  closeBtn: { fontSize: 22 },
  headerTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  count: { fontSize: FONTS.sizes.sm, color: COLORS.primary },
  searchContainer: { padding: SPACING.md },
  searchInput: { backgroundColor: '#F5F5F5', borderRadius: 10, padding: SPACING.md },
  selectAllRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: '#CCC', borderRadius: 4, marginRight: SPACING.sm, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  checkmark: { color: '#FFF', fontSize: 14 },
  selectAllText: { fontSize: FONTS.sizes.md },
  contactItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  avatarText: { color: '#FFF', fontWeight: 'bold' },
  info: { flex: 1 },
  name: { fontSize: FONTS.sizes.md, fontWeight: '600' },
  phone: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  footer: { padding: SPACING.md, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
});

export default BulkSend;
