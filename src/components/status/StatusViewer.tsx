// components/status/StatusViewer.tsx - WhatsApp-Style Status Viewer
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Image, Dimensions,
  Animated, StatusBar, TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING } from '../../constants/theme';
import { useToast } from '../../../App';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const REACTIONS = ['❤️', '😂', '😮', '😢', '😡', '👍', '👏', '🎉', '🔥', '💯'];

interface StatusViewerProps {
  userStatus: any;
  initialIndex: number;
  currentUserId: number;
  currentUserName: string;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

const StatusViewer: React.FC<StatusViewerProps> = ({
  userStatus, initialIndex, currentUserId, currentUserName,
  onClose, onNext, onPrevious,
}) => {
  const { showToast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReply, setShowReply] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const currentStatus = userStatus.statuses?.[currentIndex];

  useEffect(() => {
    if (!isPaused && currentStatus) {
      startProgress();
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [currentIndex, isPaused]);

  const startProgress = () => {
    setProgress(0);
    const duration = 5000;
    const interval = 50;
    const totalSteps = duration / interval;
    let step = 0;
    timerRef.current = setInterval(() => {
      step++;
      setProgress((step / totalSteps) * 100);
      if (step >= totalSteps) {
        if (timerRef.current) clearInterval(timerRef.current);
        goToNext();
      }
    }, interval);
  };

  const goToNext = () => {
    if (currentIndex < (userStatus.statuses?.length || 1) - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onNext();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    } else {
      onPrevious();
    }
  };

  const handlePress = (side: 'left' | 'right') => {
    side === 'right' ? goToNext() : goToPrevious();
  };

  const handleReaction = (emoji: string) => {
    showToast(`Reacted ${emoji}`);
    setShowReactions(false);
  };

  if (!currentStatus) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Progress Bars */}
      <View style={styles.progressContainer}>
        {(userStatus.statuses || []).map((_: any, index: number) => (
          <View key={index} style={styles.progressBar}>
            <View style={[styles.progressFill, {
              width: index < currentIndex ? '100%' : index === currentIndex ? `${progress}%` : '0%'
            }]} />
          </View>
        ))}
      </View>

      {/* Header */}
      <LinearGradient colors={['rgba(0,0,0,0.6)', 'transparent']} style={styles.header}>
        <View style={styles.headerInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{userStatus.userName?.charAt(0)?.toUpperCase()}</Text>
          </View>
          <View>
            <Text style={styles.userName}>{userStatus.userName}</Text>
            <Text style={styles.timestamp}>Just now</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setIsPaused(!isPaused)}>
            <Text style={styles.headerIcon}>{isPaused ? '▶️' : '⏸️'}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.headerClose}>✕</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        <TouchableOpacity style={styles.leftTap} onPress={() => handlePress('left')} />
        <TouchableOpacity style={styles.rightTap} onPress={() => handlePress('right')} />

        {currentStatus.type === 'text' ? (
          <View style={[styles.textStatus, { backgroundColor: currentStatus.backgroundColor || '#6C63FF' }]}>
            <Text style={[styles.textContent, { color: currentStatus.textColor || '#FFF' }]}>
              {currentStatus.content}
            </Text>
          </View>
        ) : (
          <Image source={{ uri: currentStatus.content }} style={styles.media} resizeMode="contain" />
        )}
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        {showReply ? (
          <View style={styles.replyContainer}>
            <TextInput style={styles.replyInput} value={replyText} onChangeText={setReplyText} placeholder="Reply..." placeholderTextColor="#999" autoFocus />
            <TouchableOpacity onPress={() => { setReplyText(''); setShowReply(false); }}>
              <Text style={styles.sendBtn}>📤</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setShowReply(true)}>
              <Text style={styles.actionText}>↩️ Reply</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => setShowReactions(!showReactions)}>
              <Text style={styles.actionText}>😊 React</Text>
            </TouchableOpacity>
            <Text style={styles.viewsText}>👁️ {currentStatus.viewCount || 0}</Text>
          </>
        )}
      </View>

      {/* Reactions Picker */}
      {showReactions && (
        <View style={styles.reactionsBar}>
          {REACTIONS.map(emoji => (
            <TouchableOpacity key={emoji} style={styles.reactionBtn} onPress={() => handleReaction(emoji)}>
              <Text style={styles.reactionEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 100 },
  progressContainer: { flexDirection: 'row', paddingTop: 50, paddingHorizontal: 4, gap: 3, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  progressBar: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#FFF', borderRadius: 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, paddingHorizontal: SPACING.md, paddingBottom: SPACING.md, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 },
  headerInfo: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  userName: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  timestamp: { color: 'rgba(255,255,255,0.7)', fontSize: FONTS.sizes.xs },
  headerActions: { flexDirection: 'row', gap: SPACING.md, alignItems: 'center' },
  headerIcon: { fontSize: 18 }, headerClose: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
  content: { flex: 1 },
  leftTap: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '30%', zIndex: 5 },
  rightTap: { position: 'absolute', right: 0, top: 0, bottom: 0, width: '70%', zIndex: 5 },
  textStatus: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.xl },
  textContent: { fontSize: FONTS.sizes.xxl, textAlign: 'center', fontWeight: '500', lineHeight: 36 },
  media: { width: SCREEN_WIDTH, height: SCREEN_HEIGHT },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 30, paddingHorizontal: SPACING.md, position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10 },
  actionBtn: { padding: SPACING.sm }, actionText: { color: '#FFF', fontSize: FONTS.sizes.sm },
  viewsText: { color: 'rgba(255,255,255,0.6)', fontSize: FONTS.sizes.xs },
  replyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: SPACING.md, flex: 1 },
  replyInput: { flex: 1, color: '#FFF', padding: SPACING.sm }, sendBtn: { fontSize: 20 },
  reactionsBar: { flexDirection: 'row', justifyContent: 'center', gap: SPACING.sm, paddingBottom: 80, paddingHorizontal: SPACING.md, position: 'absolute', bottom: 40, left: 0, right: 0, zIndex: 10 },
  reactionBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  reactionEmoji: { fontSize: 22 },
});

export default StatusViewer;
