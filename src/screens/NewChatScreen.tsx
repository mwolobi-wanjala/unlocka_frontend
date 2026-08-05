// screens/NewChatScreen.tsx - New Chat - Pick from Contacts
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  TextInput, ActivityIndicator, Alert, PermissionsAndroid, Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Contacts from 'expo-contacts';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import { useToast } from '../../App';

interface NewChatScreenProps {
  onBack: () => void;
  onStartChat: (contact: any) => void;
}

interface ContactItem {
  id: string;
  name: string;
  phone: string;
  hasApp: boolean;
  isRegistered: boolean;
  initials: string;
}

const NewChatScreen: React.FC<NewChatScreenProps> = ({ onBack, onStartChat }) => {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState<ContactItem[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<ContactItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = contacts.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.phone.includes(searchQuery)
      );
      setFilteredContacts(filtered);
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchQuery, contacts]);

  const loadContacts = async () => {
    setLoading(true);
    
    try {
      // Request permission
      const { status } = await Contacts.requestPermissionsAsync();
      
      if (status !== 'granted') {
        setPermissionGranted(false);
        setLoading(false);
        Alert.alert(
          'Contacts Permission Required',
          'Un-locka needs access to your contacts to start new conversations.',
          [
            { text: 'Cancel', style: 'cancel', onPress: onBack },
            { text: 'Open Settings', onPress: () => {
              if (Platform.OS === 'ios') {
                const { Linking } = require('react-native');
                Linking.openURL('app-settings:');
              } else {
                const { Linking } = require('react-native');
                Linking.openSettings();
              }
            }},
          ]
        );
        return;
      }
      
      setPermissionGranted(true);
      
      // Get all contacts
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Name,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Image,
        ],
        sort: Contacts.SortTypes.FirstName,
      });

      // Process contacts
      const processedContacts: ContactItem[] = [];
      const seenPhones = new Set<string>();

      data.forEach(contact => {
        if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
          const phone = contact.phoneNumbers[0].number?.replace(/[\s\-\+\(\)]/g, '') || '';
          const cleanPhone = phone.replace(/^254/, '0').slice(-10);
          
          // Skip duplicates
          if (seenPhones.has(cleanPhone)) return;
          seenPhones.add(cleanPhone);

          const name = contact.name || 'Unknown';
          const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

          // Check if contact is registered on Un-locka (mock - some are registered)
          const isRegistered = Math.random() > 0.5;

          processedContacts.push({
            id: contact.id || `contact_${Date.now()}_${Math.random()}`,
            name,
            phone: cleanPhone,
            hasApp: isRegistered,
            isRegistered,
            initials,
          });
        }
      });

      // Sort: registered users first, then alphabetically
      processedContacts.sort((a, b) => {
        if (a.isRegistered && !b.isRegistered) return -1;
        if (!a.isRegistered && b.isRegistered) return 1;
        return a.name.localeCompare(b.name);
      });

      setContacts(processedContacts);
      setFilteredContacts(processedContacts);
      
    } catch (error) {
      console.log('Error loading contacts:', error);
      showToast('Failed to load contacts');
    }
    
    setLoading(false);
  };

  const handleContactPress = (contact: ContactItem) => {
    if (contact.isRegistered) {
      // Start chat with registered user
      onStartChat({
        id: contact.phone,
        name: contact.name,
        phone: contact.phone,
        type: 'individual',
        participants: [{ id: contact.phone, name: contact.name, isOnline: false }],
        lastMessage: null,
        unreadCount: 0,
        muted: false,
        pinned: false,
        archived: false,
      });
      showToast(`Starting chat with ${contact.name}`);
    } else {
      // Invite non-registered user
      Alert.alert(
        'Invite to Un-locka',
        `${contact.name} is not on Un-locka yet. Invite them?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Invite via SMS',
            onPress: () => {
              const { Linking } = require('react-native');
              const message = `Hey ${contact.name}! Join me on Un-locka 🔓\n\nChat, share view-once content, and earn money!\n\nDownload: https://unlocka.app\nMy referral code: USER1234`;
              Linking.openURL(`sms:${contact.phone}?body=${encodeURIComponent(message)}`);
            },
          },
          {
            text: 'Invite via WhatsApp',
            onPress: () => {
              const { Linking } = require('react-native');
              const message = `Hey ${contact.name}! Join me on Un-locka 🔓\n\nChat, share view-once content, and earn money!\n\nDownload: https://unlocka.app`;
              Linking.openURL(`https://wa.me/${contact.phone}?text=${encodeURIComponent(message)}`);
            },
          },
        ]
      );
    }
  };

  const renderContactItem = ({ item }: { item: ContactItem }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => handleContactPress(item)}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={[styles.avatar, item.isRegistered && styles.registeredAvatar]}>
        <Text style={styles.avatarText}>{item.initials}</Text>
        {item.isRegistered && <View style={styles.onlineDot} />}
      </View>

      {/* Info */}
      <View style={styles.contactInfo}>
        <Text style={styles.contactName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.contactPhone}>{item.phone}</Text>
      </View>

      {/* Status */}
      <View style={styles.contactStatus}>
        {item.isRegistered ? (
          <View style={styles.registeredBadge}>
            <Text style={styles.registeredText}>On Un-locka</Text>
          </View>
        ) : (
          <TouchableOpacity style={styles.inviteBtn}>
            <Text style={styles.inviteText}>Invite</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderAlphabetIndex = () => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('');
    
    return (
      <View style={styles.alphabetIndex}>
        {alphabet.map(letter => (
          <TouchableOpacity
            key={letter}
            style={styles.alphabetBtn}
            onPress={() => {
              const contact = filteredContacts.find(c =>
                c.name.toUpperCase().startsWith(letter)
              );
              if (contact) {
                // Scroll to contact (in a real app)
              }
            }}
          >
            <Text style={styles.alphabetText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  // Group contacts by first letter
  const groupedContacts = filteredContacts.reduce((groups: any, contact) => {
    const letter = contact.name.charAt(0).toUpperCase();
    if (!groups[letter]) groups[letter] = [];
    groups[letter].push(contact);
    return groups;
  }, {});

  const sections = Object.keys(groupedContacts).sort().map(letter => ({
    title: letter,
    data: groupedContacts[letter],
  }));

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
          <TouchableOpacity onPress={onBack}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>New Chat</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading contacts...</Text>
        </View>
      </View>
    );
  }

  if (!permissionGranted) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
          <TouchableOpacity onPress={onBack}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>New Chat</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <Text style={styles.permissionIcon}>🔒</Text>
          <Text style={styles.permissionTitle}>Contacts Access Required</Text>
          <Text style={styles.permissionDesc}>
            Allow Un-locka to access your contacts to start conversations
          </Text>
          <TouchableOpacity style={styles.permissionBtn} onPress={loadContacts}>
            <Text style={styles.permissionBtnText}>Grant Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={onBack}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>New Chat</Text>
        <Text style={styles.headerCount}>{filteredContacts.length}</Text>
      </LinearGradient>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search contacts..."
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Registered Users Section */}
      {filteredContacts.some(c => c.isRegistered) && (
        <View style={styles.registeredSection}>
          <Text style={styles.sectionTitle}>On Un-locka</Text>
          <FlatList
            data={filteredContacts.filter(c => c.isRegistered).slice(0, 5)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.registeredItem}
                onPress={() => handleContactPress(item)}
              >
                <View style={styles.registeredAvatarLarge}>
                  <Text style={styles.registeredAvatarText}>{item.initials}</Text>
                  <View style={styles.onlineDotLarge} />
                </View>
                <Text style={styles.registeredName} numberOfLines={1}>{item.name.split(' ')[0]}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.registeredList}
          />
        </View>
      )}

      {/* All Contacts with Alphabet Index */}
      <View style={styles.contactsContainer}>
        <FlatList
          data={filteredContacts}
          renderItem={renderContactItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>👥</Text>
              <Text style={styles.emptyText}>No contacts found</Text>
            </View>
          }
        />
        {/* Alphabet Index */}
        {filteredContacts.length > 20 && (
          <View style={styles.alphabetIndex}>
            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ#'.split('').map(letter => (
              <TouchableOpacity key={letter} style={styles.alphabetBtn}>
                <Text style={styles.alphabetText}>{letter}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 50, paddingBottom: 10, paddingHorizontal: SPACING.md,
  },
  backBtn: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  headerCount: { color: 'rgba(255,255,255,0.6)', fontSize: FONTS.sizes.sm },
  
  searchContainer: { padding: SPACING.sm, backgroundColor: COLORS.primary },
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10,
    paddingHorizontal: SPACING.sm,
  },
  searchIcon: { fontSize: 16, marginRight: SPACING.sm },
  searchInput: { flex: 1, padding: SPACING.sm, color: '#FFF', fontSize: FONTS.sizes.md },
  clearBtn: { color: '#FFF', fontSize: 16, padding: SPACING.xs },
  
  // Registered section
  registeredSection: { paddingVertical: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  sectionTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: '#4CAF50', paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  registeredList: { paddingHorizontal: SPACING.md, gap: SPACING.md },
  registeredItem: { alignItems: 'center', width: 64 },
  registeredAvatarLarge: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    marginBottom: 4,
  },
  registeredAvatarText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  onlineDotLarge: {
    position: 'absolute', bottom: 2, right: 2,
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#FFF',
  },
  registeredName: { fontSize: 11, color: COLORS.dark, textAlign: 'center' },
  
  // Contacts list
  contactsContainer: { flex: 1, flexDirection: 'row' },
  listContent: { paddingBottom: 20 },
  
  contactItem: {
    flexDirection: 'row', alignItems: 'center',
    padding: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: '#F0F0F0',
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center',
    marginRight: SPACING.md,
  },
  registeredAvatar: { backgroundColor: COLORS.primary },
  avatarText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#4CAF50', borderWidth: 2, borderColor: '#FFF',
  },
  
  contactInfo: { flex: 1 },
  contactName: { fontSize: FONTS.sizes.md, fontWeight: '500', color: COLORS.dark },
  contactPhone: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  
  contactStatus: { marginLeft: SPACING.sm },
  registeredBadge: {
    backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
  },
  registeredText: { color: '#4CAF50', fontSize: 10, fontWeight: '600' },
  inviteBtn: {
    backgroundColor: '#E3F2FD', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12,
  },
  inviteText: { color: '#2196F3', fontSize: 10, fontWeight: '600' },
  
  // Alphabet index
  alphabetIndex: {
    position: 'absolute', right: 2, top: 0, bottom: 0,
    justifyContent: 'center', paddingVertical: 10,
  },
  alphabetBtn: { padding: 1, paddingHorizontal: 4 },
  alphabetText: { fontSize: 9, color: COLORS.primary, fontWeight: 'bold' },
  
  // Loading / Empty / Permission
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  loadingText: { color: COLORS.gray, marginTop: SPACING.md },
  emptyContainer: { alignItems: 'center', padding: SPACING.xxl },
  emptyIcon: { fontSize: 60, marginBottom: SPACING.md },
  emptyText: { color: COLORS.gray, fontSize: FONTS.sizes.md },
  permissionIcon: { fontSize: 60, marginBottom: SPACING.md },
  permissionTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.sm },
  permissionDesc: { fontSize: FONTS.sizes.sm, color: COLORS.gray, textAlign: 'center', marginBottom: SPACING.lg },
  permissionBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md, borderRadius: 25,
  },
  permissionBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: FONTS.sizes.md },
});

export default NewChatScreen;
