// components/status/StatusViewersList.tsx - Status Viewers List
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SPACING } from '../../constants/theme';

interface Viewer {
  userId: number;
  userName: string;
  viewedAt: string;
  hasReaction?: string;
}

interface StatusViewersListProps {
  statusId: string;
  viewers: Viewer[];
  onClose: () => void;
}

const StatusViewersList: React.FC<StatusViewersListProps> = ({ viewers, onClose }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'reactions'>('all');
  
  const filteredViewers = activeTab === 'reactions' 
    ? viewers.filter(v => v.hasReaction)
    : viewers;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>👁️ Views ({viewers.length})</Text>
        <TouchableOpacity onPress={onClose}><Text style={styles.closeBtn}>✕</Text></TouchableOpacity>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTab === 'all' && styles.activeTab]} onPress={() => setActiveTab('all')}>
          <Text style={[styles.tabText, activeTab === 'all' && styles.activeTabText]}>All ({viewers.length})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'reactions' && styles.activeTab]} onPress={() => setActiveTab('reactions')}>
          <Text style={[styles.tabText, activeTab === 'reactions' && styles.activeTabText]}>Reactions ({viewers.filter(v => v.hasReaction).length})</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredViewers}
        keyExtractor={item => item.userId.toString()}
        renderItem={({ item }) => (
          <View style={styles.viewerItem}>
            <View style={styles.avatar}><Text style={styles.avatarText}>{item.userName.charAt(0)}</Text></View>
            <View style={styles.info}>
              <Text style={styles.userName}>{item.userName}</Text>
              <Text style={styles.time}>{item.viewedAt}</Text>
            </View>
            {item.hasReaction && <Text style={styles.reaction}>{item.hasReaction}</Text>}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  title: { fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  closeBtn: { fontSize: 22 },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabText: { color: COLORS.gray }, activeTabText: { color: COLORS.primary, fontWeight: 'bold' },
  viewerItem: { flexDirection: 'row', alignItems: 'center', padding: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: '#F0F0F0' },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  avatarText: { color: '#FFF', fontWeight: 'bold' },
  info: { flex: 1 },
  userName: { fontWeight: '600' },
  time: { fontSize: 12, color: COLORS.gray },
  reaction: { fontSize: 20 },
});

export default StatusViewersList;
