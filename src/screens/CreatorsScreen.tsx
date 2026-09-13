// screens/CreatorsScreen.tsx - Instagram Reels-Style Creators
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, Dimensions, TouchableOpacity,
  FlatList, Image, TextInput, ActivityIndicator,
  RefreshControl, Alert, Share, Modal, Animated,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import { CreatorVideo, VideoComment, VIDEO_CATEGORIES } from '../types/creators';
import {
  getVideoFeed, toggleLikeVideo, toggleSaveVideo,
  getVideoComments, addComment, likeComment,
  replyToComment, shareVideo, toggleFollowCreator,
  getTrendingVideos, getSavedVideos,
} from '../services/creatorsService';
import Button from '../components/Button';
import CreatorPaywall from "../components/creators/CreatorPaywall";
import { downloadCreatorVideo } from "../utils/mediaDownloader";
import { useToast } from '../../App';

const { width, height } = Dimensions.get('window');

interface CreatorsScreenProps {
  userId: number;
  userName: string;
  onNavigate: (screen: string) => void;
}

const REACTIONS = ['❤️', '😂', '😮', '😢', '😡', '👍', '👏', '🎉', '🔥', '💯'];

const CreatorsScreen: React.FC<CreatorsScreenProps> = ({ userId, userName, onNavigate }) => {
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subStatus, setSubStatus] = useState<any>(null);
  const [checkingSub, setCheckingSub] = useState(true);
  const { showToast } = useToast();
  const [videos, setVideos] = useState<CreatorVideo[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [category, setCategory] = useState('all');
  
  // Comment states
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [commentText, setCommentText] = useState('');
  const [replyingTo, setReplyingTo] = useState<any>(null);
  
  // Share states
  const [showShare, setShowShare] = useState(false);
  
  // Video refs
  const videoRefs = useRef<Record<string, Video | null>>({});

  useEffect(() => { loadVideos(); }, [category]);
  useEffect(() => { checkSubscription(); }, []);

  const checkSubscription = async () => {
    setCheckingSub(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/creators/subscription/status/${userId}`);
      const data = await response.json();
      setHasSubscription(data.isActive);
      setSubStatus(data);
    } catch { setHasSubscription(true); }
    setCheckingSub(false);
  };

  const loadVideos = async () => {
    setLoading(true);
    const feed = await getVideoFeed(userId, category);
    setVideos(feed);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVideos();
    setRefreshing(false);
  };

  const handleLike = async (videoId: string) => {
    const result = await toggleLikeVideo(videoId, userId);
    if (result.success) {
      setVideos(prev => prev.map(v =>
        v.id === videoId ? { ...v, isLiked: result.liked, likes: result.likes } : v
      ));
    }
  };

  const handleSave = async (videoId: string) => {
    const result = await toggleSaveVideo(videoId, userId);
    if (result.success) {
      setVideos(prev => prev.map(v =>
        v.id === videoId ? { ...v, isSaved: result.saved } : v
      ));
      showToast(result.saved ? 'Video saved!' : 'Video unsaved');
    }
  };

  const handleFollow = async (creatorId: number) => {
    const result = await toggleFollowCreator(creatorId, userId);
    if (result.success) {
      setVideos(prev => prev.map(v =>
        v.creatorId === creatorId ? { ...v, isFollowing: result.following } : v
      ));
      showToast(result.following ? 'Following!' : 'Unfollowed');
    }
  };

  const handleOpenComments = async (videoId: string) => {
    const videoComments = await getVideoComments(videoId);
    setComments(videoComments);
    setShowComments(true);
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const activeVideo = videos[activeIndex];
    if (!activeVideo) return;

    const comment = replyingTo
      ? await replyToComment(activeVideo.id, replyingTo.id, userId, userName, commentText)
      : await addComment(activeVideo.id, userId, userName, commentText);

    if (comment) {
      const responseComment = (comment as VideoComment & { comment?: VideoComment }).comment ?? comment;
      setComments(prev => [responseComment, ...prev]);
      setCommentText('');
      setReplyingTo(null);
      setVideos(prev => prev.map(v =>
        v.id === activeVideo.id ? { ...v, comments: v.comments + 1 } : v
      ));
    }
  };

  const handleShare = async (platform: 'copy' | 'whatsapp' | 'instagram' | 'twitter') => {
    const activeVideo = videos[activeIndex];
    if (!activeVideo) return;

    if (platform === 'copy') {
      await Share.share({ message: `Check out this video on Un-locka!\n\n${activeVideo.caption}` });
    } else {
      await shareVideo(activeVideo.id, userId, platform);
    }
    setShowShare(false);
    showToast('Shared! 📤');
  };

  const shareOptions = [
    { id: 'whatsapp' as const, name: 'WhatsApp', icon: '💬' },
    { id: 'instagram' as const, name: 'Instagram', icon: '📷' },
    { id: 'twitter' as const, name: 'Twitter', icon: '🐦' },
    { id: 'copy' as const, name: 'Copy Link', icon: '🔗' },
  ];

  const renderVideoItem = ({ item, index }: { item: CreatorVideo; index: number }) => {
    const isActive = index === activeIndex;

    return (
      <View style={styles.videoContainer}>
        {/* Video */}
        <TouchableOpacity activeOpacity={1} onPress={() => setActiveIndex(index)}>
          <Video
            ref={(ref: any) => { videoRefs.current[item.id] = ref; }}
            source={{ uri: item.videoUrl }}
            style={styles.video}
            resizeMode={ResizeMode.COVER}
            shouldPlay={isActive}
            isLooping
            isMuted={false}
          />
        </TouchableOpacity>

        {/* Right Actions */}
        <View style={styles.rightActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => handleLike(item.id)}>
            <Text style={styles.actionIcon}>{item.isLiked ? '❤️' : '🤍'}</Text>
            <Text style={styles.actionText}>{item.likes || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => handleOpenComments(item.id)}>
            <Text style={styles.actionIcon}>💬</Text>
            <Text style={styles.actionText}>{item.comments || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowShare(true)}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>{item.shares || 0}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionBtn} onPress={() => handleSave(item.id)}>
            <Text style={styles.actionIcon}>{item.isSaved ? '🔖' : '🏷️'}</Text>
            <Text style={styles.actionText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Info */}
        <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.bottomInfo}>
          <TouchableOpacity style={styles.creatorRow} onPress={() => onNavigate('creatorProfile')}>
            <View style={styles.creatorAvatar}>
              <Text style={styles.avatarText}>{item.creatorName?.charAt(0) || '?'}</Text>
            </View>
            <Text style={styles.creatorName}>@{item.creatorName}</Text>
            {!item.isFollowing && (
              <TouchableOpacity style={styles.followBtn} onPress={() => handleFollow(item.creatorId)}>
                <Text style={styles.followText}>Follow</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          <Text style={styles.caption} numberOfLines={2}>{item.caption}</Text>
          
          {item.hashtags && item.hashtags.length > 0 && (
            <Text style={styles.hashtags}>{item.hashtags.map((t: string) => `#${t} `)}</Text>
          )}

          {item.musicTitle && (
            <View style={styles.musicRow}>
              <Text style={styles.musicIcon}>🎵</Text>
              <Text style={styles.musicText}>{item.musicTitle} • {item.musicArtist}</Text>
            </View>
          )}
        </LinearGradient>
      </View>
    );
  };

  if (loading || checkingSub) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>{checkingSub ? 'Checking access...' : 'Loading videos...'}</Text>
      </View>
    );
  }

  if (!hasSubscription) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
          <Text style={styles.headerTitle}>🎬 Creators</Text>
        </LinearGradient>
        <CreatorPaywall 
          userId={userId} 
          onSubscribe={() => { setHasSubscription(true); loadVideos(); }}
          subscriptionStatus={subStatus}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <Text style={styles.headerTitle}>🎬 Creators</Text>
        <TouchableOpacity onPress={() => onNavigate('uploadVideo')}>
          <Text style={styles.uploadBtn}>+ Create</Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={VIDEO_CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.categoryBtn, category === item.id && styles.categoryActive]}
              onPress={() => setCategory(item.id)}
            >
              <Text style={styles.categoryIcon}>{item.icon}</Text>
              <Text style={[styles.categoryText, category === item.id && styles.categoryTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Video Feed */}
      <FlatList<CreatorVideo>
        data={videos}
        renderItem={renderVideoItem}
        keyExtractor={(item: CreatorVideo) => item.id}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={height - 110}
        snapToAlignment="start"
        decelerationRate="fast"
        onMomentumScrollEnd={(e: any) => {
          const index = Math.round(e.nativeEvent.contentOffset.y / (height - 110));
          setActiveIndex(index);
        }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎬</Text>
            <Text style={styles.emptyText}>No videos yet</Text>
            <Text style={styles.emptySubtext}>Be the first to create!</Text>
          </View>
        }
      />

      {/* Comments Modal */}
      <Modal visible={showComments} transparent animationType="slide">
        <View style={styles.commentsOverlay}>
          <View style={styles.commentsContainer}>
            <View style={styles.commentsHeader}>
              <Text style={styles.commentsTitle}>Comments ({comments.length})</Text>
              <TouchableOpacity onPress={() => setShowComments(false)}>
                <Text style={styles.closeBtn}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList<VideoComment>
              data={comments}
              keyExtractor={(item: VideoComment) => item.id}
              renderItem={({ item }: { item: VideoComment }) => (
                <View style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    <Text style={styles.commentAvatarText}>{item.userName?.charAt(0)}</Text>
                  </View>
                  <View style={styles.commentContent}>
                    <Text style={styles.commentUser}>{item.userName}</Text>
                    <Text style={styles.commentText}>{item.text}</Text>
                    <View style={styles.commentActions}>
                      <Text style={styles.commentTime}>now</Text>
                      <TouchableOpacity onPress={() => setReplyingTo(item)}>
                        <Text style={styles.replyBtn}>Reply</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => likeComment(item.id, userId)}>
                        <Text style={styles.commentLike}>
                          🤍 {item.likes || 0}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    {item.replies?.map((reply: any) => (
                      <View key={reply.id} style={styles.replyItem}>
                        <Text style={styles.replyUser}>{reply.userName}</Text>
                        <Text style={styles.replyText}>{reply.text}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            />

            <View style={styles.commentInputRow}>
              {replyingTo && (
                <View style={styles.replyingBar}>
                  <Text style={styles.replyingText}>Replying to @{replyingTo.userName}</Text>
                  <TouchableOpacity onPress={() => setReplyingTo(null)}>
                    <Text style={styles.cancelReply}>✕</Text>
                  </TouchableOpacity>
                </View>
              )}
              <TextInput
                style={styles.commentInput}
                value={commentText}
                onChangeText={setCommentText}
                placeholder={replyingTo ? `Reply...` : 'Add a comment...'}
                placeholderTextColor="#999"
              />
              <TouchableOpacity onPress={handleAddComment}>
                <Text style={styles.postBtn}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Share Modal */}
      <Modal visible={showShare} transparent animationType="slide">
        <View style={styles.shareOverlay}>
          <View style={styles.shareContainer}>
            <Text style={styles.shareTitle}>Share to</Text>
            <View style={styles.shareGrid}>
              {shareOptions.map(option => (
                <TouchableOpacity key={option.id} style={styles.shareOption} onPress={() => handleShare(option.id)}>
                  <Text style={styles.shareIcon}>{option.icon}</Text>
                  <Text style={styles.shareOptionText}>{option.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.cancelShare} onPress={() => setShowShare(false)}>
              <Text style={styles.cancelShareText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  loadingText: { color: '#FFF', marginTop: SPACING.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, padding: SPACING.md, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  uploadBtn: { color: '#FFD700', fontSize: FONTS.sizes.sm, fontWeight: 'bold' },
  categoriesContainer: { position: 'absolute', top: 90, left: 0, right: 0, zIndex: 10 },
  categoriesList: { paddingHorizontal: SPACING.md, gap: SPACING.sm },
  categoryBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)' },
  categoryActive: { backgroundColor: '#FFD700' },
  categoryIcon: { fontSize: 14, marginRight: 4 },
  categoryText: { color: '#FFF', fontSize: FONTS.sizes.xs },
  categoryTextActive: { color: '#000', fontWeight: 'bold' },
  videoContainer: { width, height: height - 110 },
  video: { width, height: '100%' },
  rightActions: { position: 'absolute', right: 12, bottom: 120, alignItems: 'center', gap: 20 },
  actionBtn: { alignItems: 'center' },
  actionIcon: { fontSize: 32, marginBottom: 2 },
  actionText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  bottomInfo: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: SPACING.md, paddingBottom: 30, paddingRight: 70 },
  creatorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  creatorAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: 8 },
  avatarText: { color: '#FFF', fontWeight: 'bold' },
  creatorName: { color: '#FFF', fontWeight: 'bold', fontSize: FONTS.sizes.sm, flex: 1 },
  followBtn: { borderWidth: 1, borderColor: '#FFD700', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 15 },
  followText: { color: '#FFD700', fontSize: FONTS.sizes.xs, fontWeight: 'bold' },
  caption: { color: '#FFF', fontSize: FONTS.sizes.sm, marginBottom: 4 },
  hashtags: { color: '#87CEEB', fontSize: FONTS.sizes.xs, marginBottom: 4 },
  musicRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  musicIcon: { fontSize: 12, marginRight: 4 },
  musicText: { color: '#FFF', fontSize: FONTS.sizes.xs },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', height: height - 200 },
  emptyIcon: { fontSize: 60, marginBottom: SPACING.md },
  emptyText: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  emptySubtext: { color: '#999', fontSize: FONTS.sizes.sm },
  // Comments
  commentsOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  commentsContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: height * 0.6, paddingTop: SPACING.md },
  commentsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: SPACING.lg, marginBottom: SPACING.md },
  commentsTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  closeBtn: { fontSize: 22 },
  commentItem: { flexDirection: 'row', padding: SPACING.md, borderBottomWidth: 0.5, borderBottomColor: '#F0F0F0' },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  commentAvatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  commentContent: { flex: 1 },
  commentUser: { fontSize: FONTS.sizes.xs, fontWeight: 'bold' },
  commentText: { fontSize: FONTS.sizes.sm, marginTop: 2 },
  commentActions: { flexDirection: 'row', gap: SPACING.md, marginTop: 4 },
  commentTime: { fontSize: 10, color: COLORS.gray },
  replyBtn: { fontSize: 10, color: COLORS.gray, fontWeight: '600' },
  commentLike: { fontSize: 10 },
  replyItem: { marginLeft: 40, marginTop: 4, padding: 4, backgroundColor: '#F5F5F5', borderRadius: 6 },
  replyUser: { fontSize: 10, fontWeight: 'bold' },
  replyText: { fontSize: 10 },
  commentInputRow: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm, borderTopWidth: 1, borderTopColor: '#E0E0E0' },
  replyingBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', padding: 4, paddingHorizontal: 8, borderRadius: 10, marginRight: 8 },
  replyingText: { fontSize: 10, color: COLORS.gray, flex: 1 },
  cancelReply: { fontSize: 12, color: COLORS.gray, marginLeft: 4 },
  commentInput: { flex: 1, backgroundColor: '#F5F5F5', borderRadius: 20, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm },
  postBtn: { color: COLORS.primary, fontWeight: 'bold', marginLeft: SPACING.sm },
  // Share
  shareOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  shareContainer: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg },
  shareTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.lg },
  shareGrid: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: SPACING.lg },
  shareOption: { alignItems: 'center' },
  shareIcon: { fontSize: 32, marginBottom: 4 },
  shareOptionText: { fontSize: FONTS.sizes.xs, color: COLORS.dark },
  cancelShare: { padding: SPACING.md, alignItems: 'center' },
  cancelShareText: { color: COLORS.gray, fontSize: FONTS.sizes.md },
});

export default CreatorsScreen;
