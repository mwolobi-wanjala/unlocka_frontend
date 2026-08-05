// screens/VideoConferenceScreen.tsx - Video Conference
import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList,
  TextInput, Alert, Dimensions, Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import Button from '../components/Button';
import { useToast } from '../../App';

const { width } = Dimensions.get('window');

interface Participant {
  userId: number;
  userName: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
}

interface VideoConferenceScreenProps {
  onClose: () => void;
  userId: number;
  userName: string;
}

const VideoConferenceScreen: React.FC<VideoConferenceScreenProps> = ({ onClose, userId, userName }) => {
  const { showToast } = useToast();
  const [inCall, setInCall] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [title, setTitle] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [showInvite, setShowInvite] = useState(false);
  const [conferenceId, setConferenceId] = useState('');

  // Mock participants
  useEffect(() => {
    if (inCall) {
      setParticipants([
        { userId: 1, userName: 'You (Host)', isMuted: false, isVideoOff: false, isScreenSharing: false },
        { userId: 2, userName: 'Admin Test', isMuted: true, isVideoOff: false, isScreenSharing: false },
        { userId: 3, userName: 'Jane Doe', isMuted: false, isVideoOff: true, isScreenSharing: false },
      ]);
    }
  }, [inCall]);

  const handleCreateConference = async () => {
    if (!title.trim()) {
      showToast('Enter a meeting title');
      return;
    }
    
    // Generate room code
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    setRoomCode(code);
    setConferenceId(`conf_${Date.now()}`);
    setInCall(true);
    showToast('✅ Meeting created!');
  };

  const handleJoinConference = async () => {
    if (!roomCode.trim()) {
      showToast('Enter room code');
      return;
    }
    setInCall(true);
    showToast('✅ Joined meeting!');
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    showToast(isMuted ? '🔊 Unmuted' : '🔇 Muted');
  };

  const handleToggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    showToast(isVideoOff ? '📹 Camera on' : '📷 Camera off');
  };

  const handleToggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    showToast(isScreenSharing ? '📺 Screen share stopped' : '📺 Screen sharing');
  };

  const handleEndCall = () => {
    Alert.alert('End Meeting', 'End this meeting for everyone?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'End for All', style: 'destructive', onPress: () => {
        setInCall(false);
        onClose();
      }},
      { text: 'Leave Quietly', onPress: () => {
        setInCall(false);
        onClose();
      }},
    ]);
  };

  const handleInvite = () => {
    Alert.alert(
      'Invite to Meeting',
      `Share this code: ${roomCode}\nOr link: https://meet.unlocka.app/${roomCode}`,
      [
        { text: '📋 Copy Code', onPress: () => showToast('Code copied!') },
        { text: '📤 Share', onPress: () => showToast('Sharing...') },
        { text: 'OK' },
      ]
    );
  };

  // Pre-call screen
  if (!inCall) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
          <TouchableOpacity onPress={onClose}><Text style={styles.backBtn}>←</Text></TouchableOpacity>
          <Text style={styles.headerTitle}>Video Conference</Text>
          <View style={{ width: 40 }} />
        </LinearGradient>

        <View style={styles.preCallContent}>
          <Text style={styles.preCallIcon}>📹</Text>
          <Text style={styles.preCallTitle}>Start or Join a Meeting</Text>
          <Text style={styles.preCallSubtitle}>Up to 50 participants • Screen sharing • Recording</Text>

          {/* Create Meeting */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🎯 Create Meeting</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Meeting title..."
              placeholderTextColor="#999"
            />
            <Button title="Create Meeting" icon="📹" onPress={handleCreateConference} variant="primary" />
          </View>

          {/* Join Meeting */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🔗 Join Meeting</Text>
            <TextInput
              style={styles.input}
              value={roomCode}
              onChangeText={setRoomCode}
              placeholder="Enter room code..."
              placeholderTextColor="#999"
              autoCapitalize="characters"
            />
            <Button title="Join Meeting" icon="🚪" onPress={handleJoinConference} variant="success" />
          </View>
        </View>
      </View>
    );
  }

  // In-call screen
  return (
    <View style={styles.callContainer}>
      {/* Main Video Area */}
      <View style={styles.videoGrid}>
        {participants.map((p, i) => (
          <View key={i} style={[styles.videoTile, i === 0 && styles.mainVideo]}>
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoAvatar}>{p.userName.charAt(0)}</Text>
              {p.isVideoOff && <Text style={styles.videoOffBadge}>📷 Off</Text>}
            </View>
            <View style={styles.videoLabel}>
              <Text style={styles.videoName}>{p.userName}</Text>
              {p.isMuted && <Text style={styles.mutedIcon}>🔇</Text>}
              {p.isScreenSharing && <Text style={styles.sharingIcon}>📺</Text>}
            </View>
          </View>
        ))}
      </View>

      {/* Meeting Info */}
      <View style={styles.meetingInfo}>
        <Text style={styles.meetingTitle}>{title || 'Meeting'}</Text>
        <Text style={styles.roomCode}>Code: {roomCode} • {participants.length} participants</Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={[styles.controlBtn, isMuted && styles.controlActive]} onPress={handleToggleMute}>
          <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🎤'}</Text>
          <Text style={styles.controlLabel}>Mute</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlBtn, isVideoOff && styles.controlActive]} onPress={handleToggleVideo}>
          <Text style={styles.controlIcon}>{isVideoOff ? '📷' : '📹'}</Text>
          <Text style={styles.controlLabel}>Video</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlBtn, isScreenSharing && styles.controlActive]} onPress={handleToggleScreenShare}>
          <Text style={styles.controlIcon}>📺</Text>
          <Text style={styles.controlLabel}>Share</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.controlBtn} onPress={handleInvite}>
          <Text style={styles.controlIcon}>👥</Text>
          <Text style={styles.controlLabel}>Invite</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.controlBtn, styles.endCallBtn]} onPress={handleEndCall}>
          <Text style={styles.controlIcon}>📞</Text>
          <Text style={styles.controlLabel}>End</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 50, padding: SPACING.md },
  backBtn: { color: '#FFF', fontSize: 22 }, headerTitle: { color: '#FFF', fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  preCallContent: { padding: SPACING.lg, alignItems: 'center' },
  preCallIcon: { fontSize: 60, marginBottom: SPACING.md },
  preCallTitle: { fontSize: FONTS.sizes.xl, fontWeight: 'bold', color: COLORS.dark },
  preCallSubtitle: { fontSize: FONTS.sizes.sm, color: COLORS.gray, marginBottom: SPACING.lg },
  card: { width: '100%', backgroundColor: '#FFF', borderRadius: 16, padding: SPACING.lg, marginBottom: SPACING.md, ...SHADOWS.medium },
  cardTitle: { fontSize: FONTS.sizes.md, fontWeight: 'bold', marginBottom: SPACING.sm },
  input: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: SPACING.md, marginBottom: SPACING.sm },
  
  // In-call
  callContainer: { flex: 1, backgroundColor: '#1A1A2E' },
  videoGrid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', padding: 4 },
  videoTile: { width: '48%', height: '30%', margin: '1%', borderRadius: 12, overflow: 'hidden', backgroundColor: '#2A2A3E' },
  mainVideo: { width: '98%', height: '40%' },
  videoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  videoAvatar: { color: '#FFF', fontSize: 40, fontWeight: 'bold' },
  videoOffBadge: { color: '#FFF', fontSize: 12, marginTop: 4 },
  videoLabel: { position: 'absolute', bottom: 8, left: 8, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  videoName: { color: '#FFF', fontSize: 12 }, mutedIcon: { fontSize: 12 }, sharingIcon: { fontSize: 12 },
  
  meetingInfo: { padding: SPACING.md, alignItems: 'center' },
  meetingTitle: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  roomCode: { color: '#999', fontSize: FONTS.sizes.xs, marginTop: 2 },
  
  controls: { flexDirection: 'row', justifyContent: 'space-around', padding: SPACING.md, paddingBottom: 30, backgroundColor: '#16213E' },
  controlBtn: { alignItems: 'center', padding: SPACING.sm },
  controlActive: { backgroundColor: 'rgba(244,67,54,0.3)', borderRadius: 12 },
  controlIcon: { fontSize: 24, color: '#FFF' },
  controlLabel: { color: '#FFF', fontSize: 10, marginTop: 4 },
  endCallBtn: { backgroundColor: '#F44336', borderRadius: 25, paddingHorizontal: SPACING.md },
});

export default VideoConferenceScreen;
