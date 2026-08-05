import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput, Dimensions, Modal } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

const { width } = Dimensions.get('window');

const MOCK_STICKERS = {
  recent: ['👍', '😂', '❤️', '😮', '🎉', '🔥'],
  reactions: ['👍', '😂', '❤️', '😮', '😢', '😡', '🎉', '🔥', '💯', '👏'],
  love: ['❤️', '💕', '💖', '💗', '💝', '😍'],
};

const StickerPicker = ({ visible, onClose, onSelect }) => {
  const [activeTab, setActiveTab] = useState('reactions');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Stickers & GIFs</Text>
            <TouchableOpacity onPress={onClose}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
          </View>
          
          <View style={styles.tabs}>
            {Object.keys(MOCK_STICKERS).map(tab => (
              <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.stickerGrid}>
            {MOCK_STICKERS[activeTab]?.map((sticker, i) => (
              <TouchableOpacity key={i} style={styles.stickerItem} onPress={() => { onSelect(sticker); onClose(); }}>
                <Text style={styles.stickerEmoji}>{sticker}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  container: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg, height: '50%' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md },
  title: { fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  closeBtn: { fontSize: 22 },
  tabs: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.md },
  tab: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 15, backgroundColor: '#F5F5F5' },
  activeTab: { backgroundColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.xs, color: COLORS.gray }, activeTabText: { color: '#FFF' },
  stickerGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
  stickerItem: { width: (width - SPACING.lg * 2 - SPACING.sm * 3) / 4, height: 70, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 12 },
  stickerEmoji: { fontSize: 30 },
});

export default StickerPicker;
