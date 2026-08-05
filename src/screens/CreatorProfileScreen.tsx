// screens/CreatorProfileScreen.tsx - Creator Profile & Content Management
import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Image, Alert, RefreshControl, Dimensions,
  TextInput, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import { useToast } from '../../App';

const { width } = Dimensions.get('window');
const GRID_SIZE = (width - SPACING.md * 4) / 3;

interface CreatorVideo {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  caption: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  createdAt: string;
  category: string;
  hashtags: string[];
  isActive: boolean;
}

interface CreatorProfileScreenProps {
  userId: number;
  userName: string;
  onClose: () => void;
  onNavigate: (screen: string) => void;
}

const CreatorProfileScreen: React.FC<CreatorProfileScreenProps> = ({ 
  userId, userName, onClose, onNavigate 
}) => {
  const { showToast } = useToast();
  
  // Profile state
  const [activeTab, setActiveTab] = useState<'videos' | 'drafts' | 'liked'>('videos');
  const [videos, setVideos] = useState<CreatorVideo[]>([]);
  const [drafts, setDrafts] = useState<CreatorVideo[]>([]);
  const [likedVideos, setLikedVideos] = useState<CreatorVideo[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalFollowers: 0,
    totalFollowing: 0,
  });

  // Edit states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<CreatorVideo | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [editCategory, setEditCategory] = useState('all');
  const [editHashtags, setEditHashtags] = useState('');

  // Bio state
  const [bio, setBio] = useState('Content Creator on Un-locka 🎬\nSharing amazing videos!');
  const [editingBio, setEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    
    // Mock data - replace with API calls
    const mockVideos: CreatorVideo[] = [
      {
        id: '1', videoUrl: 'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4',
        thumbnailUrl: 'https://picsum.photos/400/300', caption: 'My first video! 🎬 #unlocka',
        views: 150, likes: 45, comments: 12, shares: 8,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        category: 'tech', hashtags: ['unlocka', 'firstpost'], isActive: true,
      },
      {
        id: '2', videoUrl: 'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4',
        thumbnailUrl: 'https://picsum.photos/400/301', caption: 'Testing new features! 🔥 #omoka',
        views: 89, likes: 23, comments: 5, shares: 3,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        category: 'comedy', hashtags: ['omoka', 'testing'], isActive: true,
      },
      {
        id: '3', videoUrl: 'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4',
        thumbnailUrl: 'https://picsum.photos/400/302', caption: 'Behind the scenes 🎥',
        views: 200, likes: 67, comments: 15, shares: 10,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        category: 'education', hashtags: ['bts', 'behindthescenes'], isActive: true,
      },
    ];

    const mockDrafts: CreatorVideo[] = [
      {
        id: 'draft_1', videoUrl: '', thumbnailUrl: 'https://picsum.photos/400/303',
        caption: 'Draft video...', views: 0, likes: 0, comments: 0, shares: 0,
        createdAt: new Date().toISOString(),
        category: 'music', hashtags: [], isActive: false,
      },
    ];

    setVideos(mockVideos);
    setDrafts(mockDrafts);
    setLikedVideos(mockVideos.slice(0, 2));
    
    setStats({
      totalVideos: mockVideos.length,
      totalViews: mockVideos.reduce((sum, v) => sum + v.views, 0),
      totalLikes: mockVideos.reduce((sum, v) => sum + v.likes, 0),
      totalFollowers: 1250,
      totalFollowing: 89,
    });
    
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadProfileData();
    setRefreshing(false);
  };

  // ============================================
  // DELETE VIDEO
  // ============================================
  const handleDeleteVideo = (videoId: string) => {
    Alert.alert(
      'Delete Video',
      'Are you sure you want to delete this video? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            setVideos(prev => prev.filter(v => v.id !== videoId));
            setStats(prev => ({ ...prev, totalVideos: prev.totalVideos - 1 }));
            showToast('🗑️ Video deleted');
          }
        },
      ]
    );
  };

  // ============================================
  // EDIT VIDEO
  // ============================================
  const handleEditVideo = (video: CreatorVideo) => {
    setEditingVideo(video);
    setEditCaption(video.caption);
    setEditCategory(video.category);
    setEditHashtags(video.hashtags?.join(' ') || '');
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (editingVideo) {
      const updatedVideos = videos.map(v => 
        v.id === editingVideo.id 
          ? { 
              ...v, 
              caption: editCaption, 
              category: editCategory,
              hashtags: editHashtags.split(' ').filter(h => h.startsWith('#')).map(h => h.replace('#', ''))
            }
          : v
      );
      setVideos(updatedVideos);
      showToast('✅ Video updated!');
    }
    setShowEditModal(false);
    setEditingVideo(null);
  };

  // ============================================
  // ARCHIVE/UNARCHIVE VIDEO
  // ============================================
  const handleToggleArchive = (videoId: string) => {
    const updatedVideos = videos.map(v => 
      v.id === videoId ? { ...v, isActive: !v.isActive } : v
    );
    setVideos(updatedVideos);
    const video = videos.find(v => v.id === videoId);
    showToast(video?.isActive ? '📦 Video archived' : '📤 Video unarchived');
  };

  // ============================================
  // SAVE BIO
  // ============================================
  const handleSaveBio = () => {
    setBio(bioText);
    setEditingBio(false);
    showToast('✅ Bio updated!');
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (date: string): string => {
    const diff = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff}d ago`;
    if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
    return new Date(date).toLocaleDateString();
  };

  const renderVideoItem = ({ item }: { item: CreatorVideo }) => (
    <TouchableOpacity 
      style={styles.gridItem}
      onPress={() => onNavigate('viewVideo')}
      onLongPress={() => {
        Alert.alert('Video Options', '', [
          { text: '✏️ Edit', onPress: () => handleEditVideo(item) },
          { text: '👁️ View', onPress: () => onNavigate('viewVideo') },
          { text: item.isActive ? '📦 Archive' : '📤 Unarchive', onPress: () => handleToggleArchive(item.id) },
          { text: '📤 Share', onPress: () => showToast('Sharing...') },
          { text: '🗑️ Delete', style: 'destructive', onPress: () => handleDeleteVideo(item.id) },
          { text: 'Cancel', style: 'cancel' },
        ]);
      }}
    >
      <Image 
        source={{ uri: item.thumbnailUrl || 'https://picsum.photos/400/300' }} 
        style={styles.gridImage} 
      />
      
      {/* Views overlay */}
      <View style={styles.viewsOverlay}>
        <Text style={styles.viewsText}>▶️ {formatNumber(item.views)}</Text>
      </View>
      
      {/* Archive badge */}
      {!item.isActive && (
        <View style={styles.archiveBadge}>
          <Text style={styles.archiveText}>📦</Text>
        </View>
      )}
    </TouchableOpacity>
  );

  const displayData = activeTab === 'videos' ? videos : 
                      activeTab === 'drafts' ? drafts : likedVideos;

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity onPress={() => onNavigate('settings')}>
          <Text style={styles.settingsBtn}>⚙️</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <View style={styles.profileRow}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{userName?.charAt(0)?.toUpperCase()}</Text>
            </View>
          </View>
          
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{stats.totalVideos}</Text>
              <Text style={styles.statLabel}>Videos</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{formatNumber(stats.totalFollowers)}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statValue}>{stats.totalFollowing}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>
        </View>

        {/* Name & Bio */}
        <Text style={styles.userName}>{userName}</Text>
        
        {editingBio ? (
          <View style={styles.bioEditContainer}>
            <TextInput
              style={styles.bioInput}
              value={bioText}
              onChangeText={setBioText}
              placeholder="Write your bio..."
              placeholderTextColor="#999"
              multiline
              maxLength={150}
              autoFocus
            />
            <View style={styles.bioActions}>
              <TouchableOpacity onPress={() => setEditingBio(false)}>
                <Text style={styles.cancelBioText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSaveBio}>
                <Text style={styles.saveBioText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <TouchableOpacity onPress={() => { setBioText(bio); setEditingBio(true); }}>
            <Text style={styles.bioText}>{bio}</Text>
            <Text style={styles.editBioHint}>Tap to edit bio</Text>
          </TouchableOpacity>
        )}

        {/* Stats Summary */}
        <View style={styles.statsSummary}>
          <Text style={styles.summaryText}>👁️ {formatNumber(stats.totalViews)} total views</Text>
          <Text style={styles.summaryText}>❤️ {formatNumber(stats.totalLikes)} total likes</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Button 
            title="Edit Profile" 
            icon="✏️" 
            onPress={() => { setBioText(bio); setEditingBio(true); }} 
            variant="outline" 
          />
          <Button 
            title="Create Video" 
            icon="🎬" 
            onPress={() => onNavigate('uploadVideo')} 
            variant="primary" 
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { key: 'videos' as const, label: 'Videos', icon: '🎬' },
          { key: 'drafts' as const, label: 'Drafts', icon: '📝' },
          { key: 'liked' as const, label: 'Liked', icon: '❤️' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.label}
            </Text>
            {tab.key === 'drafts' && drafts.length > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{drafts.length}</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Video Grid */}
      <FlatList
        data={displayData}
        renderItem={renderVideoItem}
        keyExtractor={item => item.id}
        numColumns={3}
        scrollEnabled={false}
        contentContainerStyle={styles.grid}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {activeTab === 'videos' ? '🎬' : activeTab === 'drafts' ? '📝' : '❤️'}
            </Text>
            <Text style={styles.emptyText}>
              {activeTab === 'videos' ? 'No videos yet' : 
               activeTab === 'drafts' ? 'No drafts' : 'No liked videos'}
            </Text>
            {activeTab === 'videos' && (
              <Button 
                title="Create First Video" 
                icon="🎬" 
                onPress={() => onNavigate('uploadVideo')} 
                variant="primary" 
              />
            )}
          </View>
        }
      />

      {/* Edit Video Modal */}
      <Modal visible={showEditModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>✏️ Edit Video</Text>
            
            <Text style={styles.inputLabel}>Caption</Text>
            <TextInput
              style={styles.modalInput}
              value={editCaption}
              onChangeText={setEditCaption}
              placeholder="Video caption..."
              placeholderTextColor="#999"
              multiline
              maxLength={500}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryRow}>
              {['all', 'music', 'comedy', 'dance', 'education', 'sports', 'food', 'fashion', 'tech', 'travel'].map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.catBtn, editCategory === cat && styles.catBtnActive]}
                  onPress={() => setEditCategory(cat)}
                >
                  <Text style={[styles.catText, editCategory === cat && styles.catTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Hashtags</Text>
            <TextInput
              style={styles.modalInput}
              value={editHashtags}
              onChangeText={setEditHashtags}
              placeholder="#tag1 #tag2 #tag3"
              placeholderTextColor="#999"
            />

            <View style={styles.modalActions}>
              <Button title="💾 Save Changes" onPress={handleSaveEdit} variant="primary" />
              <Button title="Cancel" onPress={() => setShowEditModal(false)} variant="outline" />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { paddingBottom: SPACING.xxl },
  
  // Header
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, padding: SPACING.md },
  backBtn: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  settingsBtn: { color: '#FFF', fontSize: 22 },
  
  // Profile
  profileSection: { backgroundColor: '#FFF', padding: SPACING.lg, marginBottom: SPACING.sm },
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md },
  avatarContainer: { marginRight: SPACING.xl },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
  statsRow: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  stat: { alignItems: 'center' },
  statValue: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', color: COLORS.dark },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  userName: { fontSize: FONTS.sizes.md, fontWeight: 'bold', color: COLORS.dark, marginBottom: 4 },
  bioText: { fontSize: FONTS.sizes.sm, color: COLORS.darkGray, lineHeight: 20, marginBottom: 4 },
  editBioHint: { fontSize: 10, color: COLORS.primary, fontStyle: 'italic' },
  bioEditContainer: { marginBottom: SPACING.sm },
  bioInput: { borderWidth: 1, borderColor: COLORS.primary, borderRadius: 10, padding: SPACING.sm, fontSize: FONTS.sizes.sm, minHeight: 60, textAlignVertical: 'top' },
  bioActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: SPACING.md, marginTop: SPACING.xs },
  cancelBioText: { color: COLORS.gray, fontSize: FONTS.sizes.sm },
  saveBioText: { color: COLORS.primary, fontWeight: 'bold', fontSize: FONTS.sizes.sm },
  statsSummary: { flexDirection: 'row', gap: SPACING.lg, marginBottom: SPACING.md },
  summaryText: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  actionButtons: { flexDirection: 'row', gap: SPACING.sm },
  
  // Tabs
  tabs: { flexDirection: 'row', backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0', marginBottom: SPACING.sm },
  tab: { flex: 1, alignItems: 'center', paddingVertical: SPACING.md, borderBottomWidth: 2, borderBottomColor: 'transparent', flexDirection: 'row', justifyContent: 'center', gap: 4 },
  activeTab: { borderBottomColor: COLORS.primary },
  tabIcon: { fontSize: 14 },
  tabText: { fontSize: FONTS.sizes.sm, color: COLORS.gray, fontWeight: '600' },
  activeTabText: { color: COLORS.primary },
  tabBadge: { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 1 },
  tabBadgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  
  // Grid
  grid: { paddingHorizontal: SPACING.sm },
  gridItem: { width: GRID_SIZE, height: GRID_SIZE * 1.3, margin: 2, borderRadius: 4, overflow: 'hidden', position: 'relative' },
  gridImage: { width: '100%', height: '100%', backgroundColor: '#E0E0E0' },
  viewsOverlay: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  viewsText: { color: '#FFF', fontSize: 10 },
  archiveBadge: { position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(0,0,0,0.6)', width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  archiveText: { fontSize: 12 },
  
  emptyContainer: { alignItems: 'center', padding: SPACING.xxl },
  emptyIcon: { fontSize: 60, marginBottom: SPACING.md },
  emptyText: { fontSize: FONTS.sizes.md, color: COLORS.gray, marginBottom: SPACING.md },
  
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg, maxHeight: '80%' },
  modalTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.lg },
  inputLabel: { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.dark, marginBottom: 4, marginTop: SPACING.sm },
  modalInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: SPACING.sm, fontSize: FONTS.sizes.sm, marginBottom: SPACING.sm },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.xs, marginBottom: SPACING.sm },
  catBtn: { paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs, borderRadius: 15, backgroundColor: '#F5F5F5', borderWidth: 1, borderColor: '#E0E0E0' },
  catBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  catText: { fontSize: 11, color: COLORS.gray },
  catTextActive: { color: '#FFF', fontWeight: 'bold' },
  modalActions: { marginTop: SPACING.md, gap: SPACING.sm },
});

export default CreatorProfileScreen;
