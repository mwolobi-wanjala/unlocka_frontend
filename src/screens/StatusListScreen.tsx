// screens/StatusListScreen.tsx - Complete WhatsApp-Style Status List
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, RefreshControl, Dimensions, Alert, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import { Status, UserStatus } from '../types/status';
import { getStatuses, deleteStatus } from '../services/statusService';
import StatusHighlights from '../components/status/StatusHighlights';
import StatusViewersList from '../components/status/StatusViewersList';
import { useToast } from '../../App';

const { width } = Dimensions.get('window');
const RING_SIZE = 60;

interface StatusListScreenProps {
  onStatusPress: (userStatus: UserStatus, index: number) => void;
  onAddStatus: () => void;
  currentUserId: number;
  currentUserName: string;
}

const StatusListScreen: React.FC<StatusListScreenProps> = ({
  onStatusPress, onAddStatus, currentUserId, currentUserName,
}) => {
  const { showToast } = useToast();
  const [myStatuses, setMyStatuses] = useState<Status[]>([]);
  const [friendsStatuses, setFriendsStatuses] = useState<UserStatus[]>([]);
  const [activeTab, setActiveTab] = useState<'status' | 'channels'>('status');
  const [refreshing, setRefreshing] = useState(false);
  
  // New feature states
  const [highlights, setHighlights] = useState<any[]>([]);
  const [showViewers, setShowViewers] = useState(false);
  const [selectedStatusId, setSelectedStatusId] = useState('');
  const [statusViewers, setStatusViewers] = useState<any[]>([]);
  const [showMyStatusMenu, setShowMyStatusMenu] = useState(false);
  const [selectedMyStatus, setSelectedMyStatus] = useState<Status | null>(null);

  useEffect(() => { loadStatuses(); }, []);
  useEffect(() => {
    const interval = setInterval(loadStatuses, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStatuses = async () => {
    const data = await getStatuses(currentUserId);
    setMyStatuses(data.myStatuses || []);
    setFriendsStatuses(data.friendsStatuses || []);
  };

  const onRefresh = async () => { setRefreshing(true); await loadStatuses(); setRefreshing(false); };

  const formatTimeAgo = (timestamp: string): string => {
    const diff = Math.floor((Date.now() - new Date(timestamp).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleMyStatusLongPress = (status: Status) => {
    setSelectedMyStatus(status);
    setShowMyStatusMenu(true);
  };

  const handleDeleteStatus = async () => {
    if (selectedMyStatus) {
      await deleteStatus(selectedMyStatus.id);
      showToast('Status deleted');
      setShowMyStatusMenu(false);
      loadStatuses();
    }
  };

  const handleViewViewers = (statusId: string) => {
    setSelectedStatusId(statusId);
    // Mock viewers data
    setStatusViewers([
      { userId: 2, userName: 'Admin Test', viewedAt: '2m ago', hasReaction: '❤️' },
      { userId: 3, userName: 'Jane Doe', viewedAt: '5m ago' },
      { userId: 4, userName: 'John Smith', viewedAt: '10m ago', hasReaction: '👍' },
    ]);
    setShowViewers(true);
  };

  const handleAddHighlight = (status: Status) => {
    const newHighlight = {
      id: `hl_${Date.now()}`,
      title: status.type === 'text' ? status.content.slice(0, 20) : 'Photo',
      cover: status.content,
      statusCount: 1,
    };
    setHighlights(prev => [...prev, newHighlight]);
    showToast('Added to Highlights! 📌');
  };

  const unviewedStatuses = friendsStatuses.filter(s => s.hasUnviewed);
  const viewedStatuses = friendsStatuses.filter(s => !s.hasUnviewed);

  const renderMyStatus = () => (
    <View style={styles.myStatusSection}>
      <Text style={styles.sectionTitle}>My Status</Text>
      
      {/* My Status Ring */}
      <TouchableOpacity 
        style={styles.myStatusContainer} 
        onPress={() => {
          if (myStatuses.length > 0) {
            const myUserStatus: UserStatus = {
              userId: currentUserId, userName: 'My Status', isOnline: true,
              statuses: myStatuses, hasUnviewed: false,
              latestTimestamp: new Date().toISOString(),
            };
            onStatusPress(myUserStatus, 0);
          } else {
            onAddStatus();
          }
        }}
        onLongPress={() => myStatuses.length > 0 && handleMyStatusLongPress(myStatuses[0])}
      >
        <View style={styles.ringContainer}>
          <View style={[styles.ring, myStatuses.length > 0 ? styles.ringViewed : styles.ringAdd]}>
            <View style={styles.myAvatar}>
              {myStatuses.length > 0 ? (
                <Text style={styles.avatarText}>M</Text>
              ) : (
                <Text style={styles.addIcon}>+</Text>
              )}
            </View>
          </View>
          <View style={styles.myStatusInfo}>
            <Text style={styles.userLabel}>My Status</Text>
            <Text style={styles.statusCount}>
              {myStatuses.length > 0 ? `${myStatuses.length} updates` : 'Tap to add'}
            </Text>
            {myStatuses.length > 0 && (
              <Text style={styles.tapHint}>Tap to view • Hold for options</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* My Status Quick Actions */}
      {myStatuses.length > 0 && (
        <View style={styles.myStatusActions}>
          <TouchableOpacity style={styles.actionChip} onPress={() => handleViewViewers(myStatuses[0].id)}>
            <Text style={styles.actionChipText}>👁️ {myStatuses[0].viewCount || 0} views</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionChip} onPress={() => handleAddHighlight(myStatuses[0])}>
            <Text style={styles.actionChipText}>📌 Highlight</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionChip} onPress={onAddStatus}>
            <Text style={styles.actionChipText}>+ Add</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  const renderFriendStatus = ({ item }: { item: UserStatus }) => (
    <TouchableOpacity 
      style={styles.friendContainer} 
      onPress={() => onStatusPress(item, 0)}
      onLongPress={() => {
        Alert.alert(item.userName, '', [
          { text: '🔇 Mute Status', onPress: () => showToast(`${item.userName}'s status muted`) },
          { text: '👁️ View Profile', onPress: () => showToast('Profile view') },
          { text: 'Cancel', style: 'cancel' },
        ]);
      }}
    >
      <View style={styles.ringContainer}>
        <View style={[styles.ring, item.hasUnviewed ? styles.ringUnviewed : styles.ringViewed]}>
          <View style={[styles.friendAvatar, item.hasUnviewed && styles.friendAvatarUnviewed]}>
            <Text style={styles.avatarText}>{item.userName.charAt(0).toUpperCase()}</Text>
          </View>
        </View>
        <Text style={styles.userLabel} numberOfLines={1}>{item.userName}</Text>
        <Text style={styles.timeLabel}>{formatTimeAgo(item.latestTimestamp)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderViewedStatus = ({ item }: { item: UserStatus }) => (
    <TouchableOpacity style={styles.viewedItem} onPress={() => onStatusPress(item, 0)}>
      <View style={styles.viewedAvatar}>
        <Text style={styles.viewedAvatarText}>{item.userName.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.viewedInfo}>
        <Text style={styles.viewedName}>{item.userName}</Text>
        <Text style={styles.viewedTime}>{formatTimeAgo(item.latestTimestamp)}</Text>
      </View>
      <View style={styles.viewedRight}>
        <Text style={styles.viewedCount}>{item.statuses.length}</Text>
        <TouchableOpacity onPress={() => onStatusPress(item, 0)}>
          <Text style={styles.viewAgain}>View</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <Text style={styles.headerTitle}>Status</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={onAddStatus}>
            <Text style={styles.headerIcon}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.headerIcon}>⋮</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTab === 'status' && styles.activeTab]} onPress={() => setActiveTab('status')}>
          <Text style={[styles.tabText, activeTab === 'status' && styles.activeTabText]}>Status</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, activeTab === 'channels' && styles.activeTab]} onPress={() => setActiveTab('channels')}>
          <Text style={[styles.tabText, activeTab === 'channels' && styles.activeTabText]}>Channels</Text>
        </TouchableOpacity>
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {activeTab === 'status' ? (
          <>
            {/* Highlights */}
            <StatusHighlights
              highlights={highlights}
              onPress={(hl) => showToast(`Opening highlight: ${hl.title}`)}
              onAdd={() => showToast('Select statuses to highlight')}
            />

            {/* My Status */}
            <View style={styles.section}>
              {renderMyStatus()}
            </View>

            {/* Recent Updates */}
            {unviewedStatuses.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Updates</Text>
                <FlatList
                  data={unviewedStatuses}
                  renderItem={renderFriendStatus}
                  keyExtractor={item => item.userId.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalList}
                />
              </View>
            )}

            {/* Viewed Updates */}
            {viewedStatuses.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Viewed Updates</Text>
                {viewedStatuses.map(item => (
                  <View key={item.userId}>{renderViewedStatus({ item } as any)}</View>
                ))}
              </View>
            )}

            {/* Privacy Note */}
            <View style={styles.privacyNote}>
              <Text style={styles.privacyIcon}>🔒</Text>
              <Text style={styles.privacyText}>Your status updates are end-to-end encrypted</Text>
            </View>
          </>
        ) : (
          <View style={styles.channelsPlaceholder}>
            <Text style={styles.placeholderIcon}>📢</Text>
            <Text style={styles.placeholderTitle}>Channels</Text>
            <Text style={styles.placeholderSubtitle}>Coming soon!</Text>
          </View>
        )}
      </ScrollView>

      {/* Viewers Modal */}
      <Modal visible={showViewers} animationType="slide">
        <StatusViewersList
          statusId={selectedStatusId}
          viewers={statusViewers}
          onClose={() => setShowViewers(false)}
        />
      </Modal>

      {/* My Status Menu Modal */}
      <Modal visible={showMyStatusMenu} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setShowMyStatusMenu(false)}>
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>Status Options</Text>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              setShowMyStatusMenu(false);
              handleViewViewers(selectedMyStatus?.id || '');
            }}>
              <Text style={styles.menuItemText}>👁️ View Viewers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={() => {
              if (selectedMyStatus) handleAddHighlight(selectedMyStatus);
              setShowMyStatusMenu(false);
            }}>
              <Text style={styles.menuItemText}>📌 Add to Highlights</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem} onPress={onAddStatus}>
              <Text style={styles.menuItemText}>➕ Add New Status</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.menuItem, styles.deleteItem]} onPress={handleDeleteStatus}>
              <Text style={styles.deleteText}>🗑️ Delete Status</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelItem} onPress={() => setShowMyStatusMenu(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingBottom: 10, paddingHorizontal: SPACING.md },
  headerTitle: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: '#FFF' },
  headerActions: { flexDirection: 'row', gap: SPACING.lg },
  headerIcon: { fontSize: 20, color: '#FFF' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  tab: { flex: 1, paddingVertical: SPACING.md, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: COLORS.primary },
  tabText: { fontSize: FONTS.sizes.md, color: COLORS.gray, fontWeight: '600' },
  activeTabText: { color: COLORS.primary },
  
  // My Status
  section: { paddingVertical: SPACING.md, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  sectionTitle: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.gray, paddingHorizontal: SPACING.md, marginBottom: SPACING.sm },
  myStatusSection: { paddingHorizontal: SPACING.md },
  myStatusContainer: { marginBottom: SPACING.sm },
  ringContainer: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  ring: { width: RING_SIZE + 4, height: RING_SIZE + 4, borderRadius: (RING_SIZE + 4) / 2, justifyContent: 'center', alignItems: 'center' },
  ringUnviewed: { borderWidth: 3, borderColor: '#25D366' },
  ringViewed: { borderWidth: 3, borderColor: COLORS.lightGray },
  ringAdd: { borderWidth: 2, borderColor: COLORS.primary, borderStyle: 'dashed' },
  myAvatar: { width: RING_SIZE, height: RING_SIZE, borderRadius: RING_SIZE / 2, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  friendAvatar: { width: RING_SIZE, height: RING_SIZE, borderRadius: RING_SIZE / 2, backgroundColor: '#25D366', justifyContent: 'center', alignItems: 'center' },
  friendAvatarUnviewed: { backgroundColor: '#25D366' },
  avatarText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  addIcon: { color: '#FFF', fontSize: 30 },
  myStatusInfo: { flex: 1 },
  userLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark },
  statusCount: { fontSize: FONTS.sizes.xs, color: COLORS.gray, marginTop: 2 },
  tapHint: { fontSize: 10, color: COLORS.gray, marginTop: 2, fontStyle: 'italic' },
  
  // My Status Actions
  myStatusActions: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.sm, marginBottom: SPACING.sm, paddingLeft: RING_SIZE + SPACING.md + 4 },
  actionChip: { backgroundColor: '#F0F0F0', paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: 12 },
  actionChipText: { fontSize: FONTS.sizes.xs, color: COLORS.darkGray },
  
  timeLabel: { fontSize: 10, color: COLORS.gray },
  horizontalList: { paddingHorizontal: SPACING.md, gap: SPACING.md },
  friendContainer: { marginRight: SPACING.sm },
  
  viewedItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  viewedAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.lightGray, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.md },
  viewedAvatarText: { color: COLORS.dark, fontSize: 18, fontWeight: 'bold' },
  viewedInfo: { flex: 1 },
  viewedName: { fontSize: FONTS.sizes.md, fontWeight: '600', color: COLORS.dark },
  viewedTime: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  viewedRight: { alignItems: 'flex-end', gap: 2 },
  viewedCount: { fontSize: FONTS.sizes.xs, color: COLORS.gray, backgroundColor: COLORS.lightGray, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  viewAgain: { fontSize: 10, color: COLORS.primary, fontWeight: '600' },
  
  privacyNote: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: SPACING.lg, gap: SPACING.sm },
  privacyIcon: { fontSize: 14 }, privacyText: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  channelsPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xxl, minHeight: 300 },
  placeholderIcon: { fontSize: 60, marginBottom: SPACING.md },
  placeholderTitle: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.dark },
  placeholderSubtitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginTop: SPACING.xs },
  
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  menuCard: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg },
  menuTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.lg },
  menuItem: { padding: SPACING.md, borderRadius: 10, marginBottom: SPACING.xs, backgroundColor: '#F8F9FA' },
  menuItemText: { fontSize: FONTS.sizes.md, color: COLORS.dark },
  deleteItem: { backgroundColor: '#FFEBEE' },
  deleteText: { color: '#F44336', fontWeight: '600' },
  cancelItem: { padding: SPACING.md, alignItems: 'center', marginTop: SPACING.sm },
  cancelText: { color: COLORS.gray, fontSize: FONTS.sizes.md },
});

export default StatusListScreen;
