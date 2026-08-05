import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Modal } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import Button from '../Button';

const GroupChatModal = ({ visible, onClose, onCreate }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  
  const contacts = [
    { id: 2, name: 'Admin Test' }, { id: 3, name: 'Jane Doe' }, { id: 4, name: 'John Smith' }
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>👥 Create Group</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Group name" placeholderTextColor="#999" />
          <TextInput style={styles.input} value={description} onChangeText={setDescription} placeholder="Description (optional)" placeholderTextColor="#999" />
          <Text style={styles.sectionTitle}>Add Members ({selectedMembers.length})</Text>
          {contacts.map(c => (
            <TouchableOpacity key={c.id} style={styles.memberItem} onPress={() => {
              setSelectedMembers(prev => prev.includes(c.id) ? prev.filter(i => i !== c.id) : [...prev, c.id]);
            }}>
              <View style={[styles.checkbox, selectedMembers.includes(c.id) && styles.checked]} />
              <Text>{c.name}</Text>
            </TouchableOpacity>
          ))}
          <Button title="Create Group" onPress={() => { onCreate({ name, description, members: selectedMembers }); onClose(); }} variant="primary" />
          <Button title="Cancel" onPress={onClose} variant="outline" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg, maxHeight: '80%' },
  title: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.lg },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: SPACING.md, marginBottom: SPACING.sm },
  sectionTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600', marginTop: SPACING.md, marginBottom: SPACING.sm },
  memberItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm, gap: SPACING.sm },
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: '#CCC', borderRadius: 4 },
  checked: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
});

export default GroupChatModal;
