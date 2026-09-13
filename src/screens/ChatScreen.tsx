
// screens/ChatScreen.tsx - Complete WhatsApp-Style Chat with ALL Features
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  Dimensions, Alert, Modal, Vibration, Image, Share,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Location from 'expo-location';
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, SHADOWS } from '../constants/theme';
import { MOCK_MESSAGES } from '../services/localMockData';
import { chatSocket } from '../services/chat/socketService';
import MediaSendModal from "../components/MediaSendModal";
import { PAID_MEDIA } from "../types/chat";
import CallOptionsModal from "../components/chat/CallOptionsModal";
import { useToast } from '../../App';

const { width, height } = Dimensions.get('window');

interface ChatScreenProps {
  chat: any;
  onBack: () => void;
  userId: number;
}

const REACTIONS = ['❤️', '😂', '😮', '😢', '😡', '👍', '👏', '🎉', '🔥', '💯'];
const MESSAGE_FORMATS = ['**Bold**', '*Italic*', '~Strike~', '`Code`'];

const ChatScreen: React.FC<ChatScreenProps> = ({ chat, onBack, userId }) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [typingName, setTypingName] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showCallOptions, setShowCallOptions] = useState(false);
  const [mediaToSend, setMediaToSend] = useState<any>(null);
  const [showMediaSendModal, setShowMediaSendModal] = useState(false);
  
  // New feature states
  const [starredMessages, setStarredMessages] = useState<Set<string>>(new Set());
  const [showReactions, setShowReactions] = useState(false);
  const [reactionTarget, setReactionTarget] = useState<any>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [showChatInfo, setShowChatInfo] = useState(false);
  const [disappearingTime, setDisappearingTime] = useState(0); // 0 = off
  const [wallpaper, setWallpaper] = useState<string | null>(null);
  const [showFormatting, setShowFormatting] = useState(false);
  const [pinnedMessage, setPinnedMessage] = useState<any>(null);
  const [scheduledMessages, setScheduledMessages] = useState<any[]>([]);
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduledText, setScheduledText] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  
  const recordingTimer = useRef<NodeJS.Timeout | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const pressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_RECORDING = 1800;
  const WARN_5_MIN = 1500;
  const WARN_1_MIN = 1740;

  useEffect(() => {
    let mounted = true;
    const loadMessages = async () => {
      try {
        const stored = await AsyncStorage.getItem(`@messages_${chat.id}`);
        const initialMessages = stored ? JSON.parse(stored) : MOCK_MESSAGES.filter(message => message.chatId === chat.id);
        if (mounted) setMessages(initialMessages.length ? initialMessages : MOCK_MESSAGES);
      } catch {
        if (mounted) setMessages(MOCK_MESSAGES);
      }
    };

    const handleNewMessage = (message: any) => {
      if (message.chatId !== chat.id) return;
      setMessages(prev => prev.some(item => item.id === message.id) ? prev : [...prev, message]);
      if (message.senderId !== userId) chatSocket.markAsRead(chat.id, [message.id]);
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
    };
    const handleMessageStatus = (data: { messageId: string; status: string }) => {
      setMessages(prev => prev.map(message => message.id === data.messageId ? { ...message, status: data.status } : message));
    };
    const handleMessageUpdated = (message: any) => {
      if (message.chatId === chat.id) setMessages(prev => prev.map(item => item.id === message.id ? message : item));
    };
    const handleMessageDeleted = (data: { chatId: string; messageId: string }) => {
      if (data.chatId === chat.id) setMessages(prev => prev.filter(message => message.id !== data.messageId));
    };
    const handleTyping = (data: { chatId: string; userId: number; name: string }) => {
      if (data.chatId !== chat.id || data.userId === userId) return;
      setTypingName(data.name);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => setTypingName(null), 2500);
    };
    const handleStopTyping = (data: { chatId: string; userId: number }) => {
      if (data.chatId === chat.id && data.userId !== userId) setTypingName(null);
    };
    const handleConnectionStatus = (status: string) => setIsConnected(status === 'online');

    loadMessages();
    loadChatSettings();
    chatSocket.connect(String(userId));
    setIsConnected(chatSocket.isConnected());
    chatSocket.on('new_message', handleNewMessage);
    chatSocket.on('message_status', handleMessageStatus);
    chatSocket.on('message_updated', handleMessageUpdated);
    chatSocket.on('message_deleted', handleMessageDeleted);
    chatSocket.on('typing', handleTyping);
    chatSocket.on('stop_typing', handleStopTyping);
    chatSocket.on('status', handleConnectionStatus);

    return () => {
      mounted = false;
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      chatSocket.off('new_message', handleNewMessage);
      chatSocket.off('message_status', handleMessageStatus);
      chatSocket.off('message_updated', handleMessageUpdated);
      chatSocket.off('message_deleted', handleMessageDeleted);
      chatSocket.off('typing', handleTyping);
      chatSocket.off('stop_typing', handleStopTyping);
      chatSocket.off('status', handleConnectionStatus);
    };
  }, [chat.id, userId]);

  useEffect(() => {
    if (messages.length) AsyncStorage.setItem(`@messages_${chat.id}`, JSON.stringify(messages)).catch(() => undefined);
  }, [chat.id, messages]);

  const loadChatSettings = async () => {
    const saved = await AsyncStorage.getItem(`@chat_${chat.id}`);
    if (saved) {
      const settings = JSON.parse(saved);
      if (settings.wallpaper) setWallpaper(settings.wallpaper);
      if (settings.disappearing) setDisappearingTime(settings.disappearing);
    }
  };

  const saveChatSettings = async (settings: any) => {
    const saved = await AsyncStorage.getItem(`@chat_${chat.id}`);
    const current = saved ? JSON.parse(saved) : {};
    await AsyncStorage.setItem(`@chat_${chat.id}`, JSON.stringify({ ...current, ...settings }));
  };

  const publishMessage = (message: any) => {
    setMessages(prev => [...prev, message]);
    chatSocket.sendMessage(message);
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  // ============================================
  // RECORDING
  // ============================================
  const formatRecordingTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startRecording = () => {
    setIsRecording(true); setRecordingTime(0);
    Vibration.vibrate(50);
    recordingTimer.current = setInterval(() => {
      setRecordingTime(prev => {
        const newTime = prev + 1;
        if (newTime === WARN_5_MIN) showToast('⚠️ 5 min remaining');
        if (newTime === WARN_1_MIN) showToast('⚠️ 1 min remaining');
        if (newTime >= MAX_RECORDING) { stopRecordingAndSend(); return 0; }
        return newTime;
      });
    }, 1000);
  };

  const stopRecordingAndSend = () => {
    if (recordingTimer.current) { clearInterval(recordingTimer.current); recordingTimer.current = null; }
    if (isRecording && recordingTime >= 1) {
      const voiceMsg = { id: `msg_${Date.now()}`, chatId: chat.id, senderId: userId, senderName: 'You', type: 'audio', content: '🎤 Voice note', duration: recordingTime, status: 'sent', timestamp: new Date().toISOString() };
      publishMessage(voiceMsg);
    }
    setIsRecording(false); setRecordingTime(0);
    Vibration.vibrate(30);
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const handleMicPressIn = () => {
    isLongPressRef.current = false;
    pressTimerRef.current = setTimeout(() => { isLongPressRef.current = true; startRecording(); }, 200);
  };

  const handleMicPressOut = () => {
    if (pressTimerRef.current) { clearTimeout(pressTimerRef.current); pressTimerRef.current = null; }
    if (isRecording) stopRecordingAndSend();
  };

  // ============================================
  // ATTACHMENTS
  // ============================================
  const handleAttachment = async (type: string) => {
    setShowAttachmentMenu(false);
    switch (type) {
      case 'camera': try {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permission', 'Camera access needed'); return; }
        const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, allowsEditing: true, quality: 0.8, videoMaxDuration: 60 });
        if (!result.canceled && result.assets[0]) setMediaToSend({ uri: result.assets[0].uri, type: result.assets[0].type === "video" ? "video" : "image" });
              setShowMediaSendModal(true);
      } catch { showToast('Camera failed'); } break;
      case 'gallery': try {
        const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.All, allowsEditing: true, quality: 0.8 });
        if (!result.canceled && result.assets[0]) setMediaToSend({ uri: result.assets[0].uri, type: result.assets[0].type === "video" ? "video" : "image" });
              setShowMediaSendModal(true);
      } catch { showToast('Gallery failed'); } break;
      case 'document': try {
        const result = await DocumentPicker.getDocumentAsync({ type: '*/*', copyToCacheDirectory: true });
        if (!result.canceled && result.assets?.[0]) {
          const doc = result.assets[0];
          publishMessage({ id: `msg_${Date.now()}`, chatId: chat.id, senderId: userId, senderName: 'You', type: 'document', content: `📄 ${doc.name}`, fileName: doc.name, fileSize: doc.size, status: 'sent', timestamp: new Date().toISOString() });
          showToast('📄 Document sent');
        }
      } catch { showToast('Document failed'); } break;
      case 'location': try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permission', 'Location access needed'); return; }
        const location = await Location.getCurrentPositionAsync({});
        publishMessage({ id: `msg_${Date.now()}`, chatId: chat.id, senderId: userId, senderName: 'You', type: 'location', content: '📍 Location', location: { latitude: location.coords.latitude, longitude: location.coords.longitude }, status: 'sent', timestamp: new Date().toISOString() });
        showToast('📍 Location shared');
      } catch { showToast('Location failed'); } break;
      case 'contact': try {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permission', 'Contacts access needed'); return; }
        const { data } = await Contacts.getContactsAsync({ fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers] });
        if (data.length > 0) {
          const c = data[0];
          publishMessage({ id: `msg_${Date.now()}`, chatId: chat.id, senderId: userId, senderName: 'You', type: 'contact', content: '👤 Contact', contact: { name: c.name, phone: c.phoneNumbers?.[0]?.number }, status: 'sent', timestamp: new Date().toISOString() });
          showToast('👤 Contact shared');
        }
      } catch { showToast('Contact failed'); } break;
      case 'poll':
        publishMessage({ id: `msg_${Date.now()}`, chatId: chat.id, senderId: userId, senderName: 'You', type: 'poll', content: '📊 Poll', poll: { question: 'What do you think?', options: [{ id: '1', text: '👍 Great!', votes: 0 }, { id: '2', text: '👎 Not great', votes: 0 }], totalVotes: 0 }, status: 'sent', timestamp: new Date().toISOString() });
        showToast('📊 Poll created');
        break;
      case 'schedule':
        setShowScheduler(true);
        break;
    }
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const sendMediaMessage = (uri: string, type: 'image' | 'video') => {
  const handleMediaSend = (data: any) => {
    const mediaMsg = {
      id: `msg_${Date.now()}`, chatId: chat.id, senderId: userId,
      senderName: "You", type: data.type,
      content: data.isPaid ? `🔒 Paid ${data.type === "video" ? "Video" : "Photo"} - KSH ${data.amount}` : `${data.type === "video" ? "🎥 Video" : "📷 Photo"}`,
      mediaUrl: data.uri, thumbnailUrl: data.uri,
      isPaid: data.isPaid, amount: data.amount,
      paidMedia: data.isPaid ? { isPaid: true, amount: data.amount, status: "locked", senderCut: data.amount * 0.85, platformCut: data.amount * 0.15 } : null,
      caption: data.caption, status: "sent", timestamp: new Date().toISOString(),
    };
    publishMessage(mediaMsg);
    showToast(data.isPaid ? `💰 Paid media sent! Earn KSH ${(data.amount * 0.85).toFixed(0)}` : "📤 Media sent!");
    setShowMediaSendModal(false);
    setMediaToSend(null);
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };
    publishMessage({ id: `msg_${Date.now()}`, chatId: chat.id, senderId: userId, senderName: 'You', type, content: type === 'image' ? '📷 Photo' : '🎥 Video', mediaUrl: uri, thumbnailUrl: uri, status: 'sent', timestamp: new Date().toISOString() });
    showToast(`${type === 'image' ? '📷 Photo' : '🎥 Video'} sent`);
  };

  // ============================================
  // MESSAGE ACTIONS
  // ============================================
  const handleMessageLongPress = (message: any) => {
    Vibration.vibrate(30);
    const isStarred = starredMessages.has(message.id);
    
    Alert.alert('Message', '', [
      { text: '↩️ Reply', onPress: () => setReplyingTo(message) },
      { text: '😊 React', onPress: () => { setReactionTarget(message); setShowReactions(true); } },
      { text: isStarred ? '⭐ Unstar' : '⭐ Star', onPress: () => {
        setStarredMessages(prev => {
          const newSet = new Set(prev);
          isStarred ? newSet.delete(message.id) : newSet.add(message.id);
          return newSet;
        });
        showToast(isStarred ? 'Unstarred' : '⭐ Starred!');
      }},
      { text: '📋 Copy', onPress: () => showToast('📋 Copied!') },
      { text: '↪️ Forward', onPress: () => showToast('Forward - Coming soon') },
      { text: '📌 Pin', onPress: () => { setPinnedMessage(message); showToast('📌 Pinned'); } },
      { text: 'ℹ️ Info', onPress: () => showToast(`Sent: ${new Date(message.timestamp).toLocaleString()}`) },
      { text: '🗑️ Delete', style: 'destructive', onPress: () => {
        setMessages(prev => prev.filter(m => m.id !== message.id));
        showToast('🗑️ Deleted');
      }},
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const handleReaction = (emoji: string) => {
    if (reactionTarget) {
      setMessages(prev => prev.map(m => 
        m.id === reactionTarget.id ? { ...m, reaction: m.reaction === emoji ? null : emoji } : m
      ));
    }
    setShowReactions(false);
    setReactionTarget(null);
  };

  // ============================================
  // SEARCH
  // ============================================
  const handleSearch = () => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const results = messages.filter(m => 
      m.content?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(results);
  };

  // ============================================
  // SCHEDULE MESSAGE
  // ============================================
  const handleScheduleMessage = () => {
    if (!scheduledText.trim()) { showToast('Enter message'); return; }
    setScheduledMessages(prev => [...prev, { text: scheduledText, time: scheduledTime }]);
    showToast('⏰ Message scheduled');
    setShowScheduler(false);
    setScheduledText('');
    setScheduledTime('');
  };

  // ============================================
  // DISAPPEARING MESSAGES
  // ============================================
  const handleDisappearing = () => {
    const options = [0, 86400, 604800, 7776000]; // Off, 24h, 7d, 90d
    const labels = ['Off', '24 Hours', '7 Days', '90 Days'];
    Alert.alert('Disappearing Messages', 'Messages will auto-delete after:', 
      labels.map((label, i) => ({
        text: label + (disappearingTime === options[i] ? ' ✓' : ''),
        onPress: () => {
          setDisappearingTime(options[i]);
          saveChatSettings({ disappearing: options[i] });
          showToast(options[i] === 0 ? 'Disappearing messages off' : `Messages will disappear after ${label}`);
        }
      }))
    );
  };

  // ============================================
  // WALLPAPER
  // ============================================
  const handleWallpaper = () => {
    Alert.alert('Chat Wallpaper', 'Choose wallpaper', [
      { text: 'Default', onPress: () => { setWallpaper(null); saveChatSettings({ wallpaper: null }); } },
      { text: 'Dark', onPress: () => { setWallpaper('#1a1a2e'); saveChatSettings({ wallpaper: '#1a1a2e' }); } },
      { text: 'Ocean', onPress: () => { setWallpaper('#0077b6'); saveChatSettings({ wallpaper: '#0077b6' }); } },
      { text: 'Forest', onPress: () => { setWallpaper('#2d6a4f'); saveChatSettings({ wallpaper: '#2d6a4f' }); } },
      { text: 'Sunset', onPress: () => { setWallpaper('#ff6b6b'); saveChatSettings({ wallpaper: '#ff6b6b' }); } },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // ============================================
  // CALLS
  // ============================================



  // ============================================
  // SEND MESSAGE
  // ============================================
  const sendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg = {
      id: `msg_${Date.now()}`, chatId: chat.id, senderId: userId,
      senderName: 'You', type: 'text', content: inputText.trim(),
      status: 'sending', timestamp: new Date().toISOString(),
      ...(replyingTo && { replyTo: { id: replyingTo.id, senderName: replyingTo.senderName, content: replyingTo.content, type: replyingTo.type } }),
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText(''); setReplyingTo(null);
    chatSocket.sendMessage(newMsg);
    chatSocket.stopTyping(chat.id);
    if (!chatSocket.isConnected()) {
      setMessages(prev => prev.map(message => message.id === newMsg.id ? { ...message, status: 'sent' } : message));
    }
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  const handleInputChange = (value: string) => {
    setInputText(value);
    if (value.trim()) {
      chatSocket.sendTyping(chat.id);
    } else {
      chatSocket.stopTyping(chat.id);
    }
  };

  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const getStatus = (s: string) => s === 'read' ? '✓✓' : s === 'delivered' ? '✓✓' : '✓';
  const formatDuration = (d: number): string => {
    if (d >= 3600) return `${Math.floor(d/3600)}h ${Math.floor((d%3600)/60)}m`;
    if (d >= 60) return `${Math.floor(d/60)}:${(d%60).toString().padStart(2,'0')}`;
    return `${d}s`;
  };

  const renderMessage = ({ item, index }: { item: any; index: number }) => {
    const isMine = item.senderId === userId;
    const showAvatar = !isMine && (index === 0 || messages[index-1]?.senderId !== item.senderId);

    // Call message
    if (item.type === 'call') return (
      <View style={styles.callContainer}><View style={styles.callPill}>
        <Text style={styles.callIcon}>{item.callType === 'video' ? '📹' : '📞'}</Text>
        <Text style={styles.callText}>{isMine ? 'You' : item.senderName} started a call</Text>
        <Text style={styles.callTime}>{formatTime(item.timestamp)}</Text>
      </View></View>
    );

    // Poll message
    if (item.type === 'poll' && item.poll) return (
      <View style={[styles.msgContainer, isMine ? styles.myMsg : styles.theirMsg]}>
        {!isMine && showAvatar && <View style={styles.msgAvatar}><Text style={styles.msgAvatarText}>{item.senderName?.charAt(0)}</Text></View>}
        <View style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]}>
          <Text style={styles.pollQ}>{item.poll.question}</Text>
          {item.poll.options.map((opt: any) => (
            <TouchableOpacity key={opt.id} style={styles.pollOpt} onPress={() => showToast('Vote recorded!')}>
              <Text style={styles.pollOptText}>{opt.text}</Text>
              <Text style={styles.pollVotes}>{opt.votes}</Text>
            </TouchableOpacity>
          ))}
          <Text style={styles.pollTotal}>{item.poll.totalVotes} votes</Text>
        </View>
      </View>
    );

    // Audio message
    if (item.type === 'audio') return (
      <View style={[styles.msgContainer, isMine ? styles.myMsg : styles.theirMsg]}>
        {!isMine && showAvatar && <View style={styles.msgAvatar}><Text style={styles.msgAvatarText}>{item.senderName?.charAt(0)}</Text></View>}
        <TouchableOpacity style={[styles.bubble, styles.audioBubble, isMine ? styles.myBubble : styles.theirBubble]} onPress={() => showToast('▶️ Playing...')}>
          <Text style={styles.audioIcon}>🎤</Text>
          <View style={styles.audioWave}>{[8,12,20,14,22,10,18].map((h,i) => <View key={i} style={[styles.waveBar,{height:h}]} />)}</View>
          <Text style={styles.audioDur}>{formatDuration(item.duration||0)}</Text>
        </TouchableOpacity>
      </View>
    );

    // Image message
    if (item.type === 'image' && item.mediaUrl) return (
      <View style={[styles.msgContainer, isMine ? styles.myMsg : styles.theirMsg]}>
        {!isMine && showAvatar && <View style={styles.msgAvatar}><Text style={styles.msgAvatarText}>{item.senderName?.charAt(0)}</Text></View>}
        <TouchableOpacity style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble]} onLongPress={() => handleMessageLongPress(item)}>
          <Image source={{ uri: item.mediaUrl }} style={styles.mediaImg} resizeMode="cover" />
          {item.reaction && <Text style={styles.msgReaction}>{item.reaction}</Text>}
          <View style={styles.msgFooter}><Text style={styles.msgTime}>{formatTime(item.timestamp)}</Text>{isMine && <Text style={[styles.msgStatus, item.status === 'read' && styles.readStatus]}>{getStatus(item.status)}</Text>}</View>
        </TouchableOpacity>
      </View>
    );

    // Text message
    return (
      <TouchableOpacity style={[styles.msgContainer, isMine ? styles.myMsg : styles.theirMsg]} onLongPress={() => handleMessageLongPress(item)} activeOpacity={0.8}>
        {!isMine && showAvatar && <View style={styles.msgAvatar}><Text style={styles.msgAvatarText}>{item.senderName?.charAt(0)}</Text></View>}
        <View style={[styles.bubble, isMine ? styles.myBubble : styles.theirBubble, { maxWidth: width * 0.7 }]}>
          {item.replyTo && (<View style={styles.replyPreview}><View style={styles.replyBar} /><View style={styles.replyContent}><Text style={styles.replyName}>{item.replyTo.senderName}</Text><Text style={styles.replyText} numberOfLines={1}>{item.replyTo.content}</Text></View></View>)}
          <Text style={[styles.msgText, isMine ? styles.myMsgText : styles.theirMsgText]}>{item.content}</Text>
          {item.reaction && <Text style={styles.msgReaction}>{item.reaction}</Text>}
          {starredMessages.has(item.id) && <Text style={styles.starIndicator}>⭐</Text>}
          <View style={styles.msgFooter}><Text style={styles.msgTime}>{formatTime(item.timestamp)}</Text>{isMine && <Text style={[styles.msgStatus, item.status === 'read' && styles.readStatus]}>{getStatus(item.status)}</Text>}</View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView style={[styles.container, wallpaper && { backgroundColor: wallpaper }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <LinearGradient colors={[COLORS.primary, COLORS.primaryDark]} style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}><Text style={styles.backText}>←</Text></TouchableOpacity>
        <TouchableOpacity style={styles.headerInfo} onPress={() => setShowChatInfo(true)}>
          <View style={styles.headerAvatar}><Text style={styles.headerAvatarText}>{chat.name?.charAt(0)}</Text></View>
          <View><Text style={styles.headerName}>{chat.name}</Text>
            <Text style={styles.headerStatus}>
              {typingName ? `${typingName} is typing...` : disappearingTime > 0 ? '⏳ Disappearing' : isConnected ? 'online' : 'offline'}
            </Text>
          </View>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setShowSearch(!showSearch)}><Text style={styles.headerIcon}>🔍</Text></TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setShowCallOptions(true)}><Text style={styles.headerIcon}>📞</Text></TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => setShowCallOptions(true)}><Text style={styles.headerIcon}>📹</Text></TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn} onPress={() => {
            Alert.alert('Chat Options', '', [
              { text: '🖼️ Wallpaper', onPress: handleWallpaper },
              { text: '⏳ Disappearing Messages', onPress: handleDisappearing },
              { text: '⭐ Starred Messages', onPress: () => showToast(`Starred: ${starredMessages.size}`) },
              { text: '📊 Media Gallery', onPress: () => setShowMediaGallery(true) },
              { text: '📤 Export Chat', onPress: () => showToast('Export coming soon') },
              { text: 'Cancel', style: 'cancel' },
            ]);
          }}><Text style={styles.headerIcon}>⋮</Text></TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Search Bar */}
      {showSearch && (
        <View style={styles.searchBar}>
          <TextInput style={styles.searchInput} value={searchQuery} onChangeText={(t) => { setSearchQuery(t); handleSearch(); }} placeholder="Search messages..." placeholderTextColor="#999" />
          <TouchableOpacity onPress={() => { setShowSearch(false); setSearchQuery(''); setSearchResults([]); }}><Text style={styles.closeSearch}>✕</Text></TouchableOpacity>
        </View>
      )}

      {/* Pinned Message */}
      {pinnedMessage && (
        <TouchableOpacity style={styles.pinnedBar} onPress={() => showToast(pinnedMessage.content)}>
          <Text style={styles.pinnedIcon}>📌</Text>
          <Text style={styles.pinnedText} numberOfLines={1}>{pinnedMessage.content}</Text>
          <TouchableOpacity onPress={() => setPinnedMessage(null)}><Text style={styles.unpinBtn}>✕</Text></TouchableOpacity>
        </TouchableOpacity>
      )}

      {/* Recording Banner */}
      {isRecording && (
        <View style={styles.recBanner}>
          <View style={styles.recDot} /><Text style={styles.recText}>Recording... {formatRecordingTime(recordingTime)}</Text>
          <TouchableOpacity onPress={stopRecordingAndSend}><Text style={styles.recStop}>⏹ Send</Text></TouchableOpacity>
        </View>
      )}

      {/* Messages */}
      <FlatList ref={flatListRef} data={searchResults.length > 0 ? searchResults : messages} renderItem={renderMessage} keyExtractor={item => item.id} style={styles.msgList} contentContainerStyle={styles.msgContent} onContentSizeChange={() => flatListRef.current?.scrollToEnd()} />

      {/* Reactions Bar */}
      {showReactions && (
        <View style={styles.reactBar}>
          {REACTIONS.map(emoji => (
            <TouchableOpacity key={emoji} onPress={() => handleReaction(emoji)} style={styles.reactBtn}>
              <Text style={styles.reactEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => { setShowReactions(false); setReactionTarget(null); }}><Text style={styles.reactClose}>✕</Text></TouchableOpacity>
        </View>
      )}

      {/* Reply Bar */}
      {replyingTo && (
        <View style={styles.replyBar}>
          <View style={styles.replyBarContent}><Text style={styles.replyingTo}>Replying to {replyingTo.senderName}</Text><Text style={styles.replyPreview} numberOfLines={1}>{replyingTo.content}</Text></View>
          <TouchableOpacity onPress={() => setReplyingTo(null)}><Text style={styles.cancelReply}>✕</Text></TouchableOpacity>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputArea}>
        <TouchableOpacity style={styles.attachBtn} onPress={() => setShowAttachmentMenu(true)}><Text style={styles.attachIcon}>📎</Text></TouchableOpacity>
        <TextInput style={styles.input} value={inputText} onChangeText={handleInputChange} placeholder="Message" placeholderTextColor="#999" multiline maxLength={5000} />
        {inputText.trim() ? (
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}><Text style={styles.sendIcon}>📤</Text></TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.micBtn, isRecording && styles.micRec]} onPressIn={handleMicPressIn} onPressOut={handleMicPressOut}>
            <Text style={styles.micIcon}>{isRecording ? '🔴' : '🎤'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Attachment Modal */}
      <Modal visible={showAttachmentMenu} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.attMenu}>
            <Text style={styles.attTitle}>📎 Attach</Text>
            <View style={styles.attGrid}>
              {[{ icon: '📷', label: 'Camera', type: 'camera' },{ icon: '🖼️', label: 'Gallery', type: 'gallery' },{ icon: '📄', label: 'Document', type: 'document' },{ icon: '📍', label: 'Location', type: 'location' },{ icon: '👤', label: 'Contact', type: 'contact' },{ icon: '📊', label: 'Poll', type: 'poll' },{ icon: '⏰', label: 'Schedule', type: 'schedule' }].map(item => (
                <TouchableOpacity key={item.type} style={styles.attItem} onPress={() => handleAttachment(item.type)}>
                  <View style={styles.attIcon}><Text style={styles.attEmoji}>{item.icon}</Text></View>
                  <Text style={styles.attLabel}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAttachmentMenu(false)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Media Send Modal */}
      {mediaToSend && (
        <MediaSendModal
          visible={showMediaSendModal}
          mediaUri={mediaToSend.uri}
          mediaType={mediaToSend.type}
          onSend={handleMediaSend}
          onCancel={() => { setShowMediaSendModal(false); setMediaToSend(null); }}
        />
      )}

      {/* Scheduler Modal */}
      <Modal visible={showScheduler} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.attMenu}>
            <Text style={styles.attTitle}>⏰ Schedule Message</Text>
            <TextInput style={styles.schedInput} value={scheduledText} onChangeText={setScheduledText} placeholder="Message to schedule..." placeholderTextColor="#999" multiline />
            <TextInput style={styles.schedInput} value={scheduledTime} onChangeText={setScheduledTime} placeholder="Time (e.g., 14:30)" placeholderTextColor="#999" />
            <TouchableOpacity style={styles.schedBtn} onPress={handleScheduleMessage}><Text style={styles.schedBtnText}>Schedule</Text></TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowScheduler(false)}><Text style={styles.cancelText}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      {/* Media Send Modal */}
      {mediaToSend && (
        <MediaSendModal
          visible={showMediaSendModal}
          mediaUri={mediaToSend.uri}
          mediaType={mediaToSend.type}
          onSend={handleMediaSend}
          onCancel={() => { setShowMediaSendModal(false); setMediaToSend(null); }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E5DDD5' },
  header: { flexDirection: 'row', alignItems: 'center', paddingTop: 50, paddingBottom: 10, paddingHorizontal: SPACING.sm },
  backBtn: { padding: SPACING.xs, marginRight: SPACING.sm }, backText: { color: '#FFF', fontSize: 24 },
  headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center' },
  headerAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginRight: SPACING.sm },
  headerAvatarText: { color: '#FFF', fontWeight: 'bold' },
  headerName: { color: '#FFF', fontSize: FONTS.sizes.md, fontWeight: 'bold' },
  headerStatus: { color: 'rgba(255,255,255,0.7)', fontSize: 10 },
  headerActions: { flexDirection: 'row', gap: 2 }, headerBtn: { padding: 4 }, headerIcon: { fontSize: 16, color: '#FFF' },
  // Search
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: SPACING.sm, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  searchInput: { flex: 1, fontSize: FONTS.sizes.sm }, closeSearch: { fontSize: 18, color: COLORS.gray, padding: SPACING.xs },
  // Pinned
  pinnedBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF9C4', padding: SPACING.xs, paddingHorizontal: SPACING.md },
  pinnedIcon: { marginRight: SPACING.xs }, pinnedText: { flex: 1, fontSize: 12, color: COLORS.dark },
  unpinBtn: { fontSize: 14, color: COLORS.gray, padding: SPACING.xs },
  // Recording
  recBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F44336', padding: SPACING.sm, paddingHorizontal: SPACING.md },
  recDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#FFF', marginRight: SPACING.sm },
  recText: { flex: 1, color: '#FFF', fontWeight: '600' }, recStop: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },
  // Messages
  msgList: { flex: 1 }, msgContent: { paddingVertical: SPACING.sm },
  msgContainer: { flexDirection: 'row', marginVertical: 1, paddingHorizontal: SPACING.sm },
  myMsg: { justifyContent: 'flex-end' }, theirMsg: { justifyContent: 'flex-start' },
  msgAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.xs, alignSelf: 'flex-end' },
  msgAvatarText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  bubble: { padding: SPACING.sm, borderRadius: 12, ...SHADOWS.small },
  myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 2 },
  theirBubble: { backgroundColor: '#FFF', borderTopLeftRadius: 2 },
  replyPreview: { flexDirection: 'row', marginBottom: 4 }, replyBar: { width: 3, backgroundColor: COLORS.primary, borderRadius: 2, marginRight: SPACING.xs },
  replyContent: { flex: 1 }, replyName: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary }, replyText: { fontSize: 12, color: COLORS.gray },
  msgText: { fontSize: FONTS.sizes.sm, lineHeight: 22 }, myMsgText: { color: COLORS.dark }, theirMsgText: { color: COLORS.dark },
  msgFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 2 },
  msgTime: { fontSize: 10, color: '#6B7B6B', marginRight: 2 }, msgStatus: { fontSize: 12, color: COLORS.gray }, readStatus: { color: '#34B7F1' },
  msgReaction: { position: 'absolute', bottom: -8, right: 4, fontSize: 14, backgroundColor: '#FFF', borderRadius: 10, padding: 2 },
  starIndicator: { position: 'absolute', top: -4, right: 4, fontSize: 10 },
  // Audio
  audioBubble: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, paddingHorizontal: SPACING.md, minWidth: 150 },
  audioIcon: { fontSize: 24, marginRight: SPACING.sm },
  audioWave: { flex: 1, flexDirection: 'row', alignItems: 'flex-end', height: 30, gap: 2 },
  waveBar: { width: 3, backgroundColor: COLORS.primary, borderRadius: 2, height: 8 },
  audioDur: { fontSize: 12, color: COLORS.gray, marginLeft: SPACING.sm },
  // Poll
  pollQ: { fontSize: FONTS.sizes.sm, fontWeight: 'bold', color: COLORS.dark, marginBottom: SPACING.sm },
  pollOpt: { flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.sm, backgroundColor: '#F5F5F5', borderRadius: 8, marginBottom: 4 },
  pollOptText: { fontSize: FONTS.sizes.sm }, pollVotes: { fontSize: FONTS.sizes.xs, color: COLORS.gray },
  pollTotal: { fontSize: 10, color: COLORS.gray, textAlign: 'center', marginTop: 4 },
  // Call
  callContainer: { alignItems: 'center', marginVertical: SPACING.sm },
  callPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E1F3FB', paddingHorizontal: SPACING.md, paddingVertical: SPACING.xs, borderRadius: 12, gap: SPACING.sm },
  callIcon: { fontSize: 14 }, callText: { fontSize: FONTS.sizes.xs, color: '#4A90D9' }, callTime: { fontSize: 10, color: COLORS.gray },
  // Media
  mediaImg: { width: width * 0.55, height: width * 0.55, borderRadius: 8, marginBottom: 4 },
  // Reactions
  reactBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', padding: SPACING.sm, borderTopWidth: 1, borderTopColor: '#E0E0E0', gap: 8 },
  reactBtn: { padding: 4 }, reactEmoji: { fontSize: 24 }, reactClose: { fontSize: 18, color: COLORS.gray, marginLeft: SPACING.sm },
  // Reply
  replyBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', padding: SPACING.sm, borderTopWidth: 1, borderTopColor: '#DDD' },
  replyBarContent: { flex: 1 }, replyingTo: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary }, cancelReply: { fontSize: 18, color: COLORS.gray, padding: SPACING.xs },
  // Input
  inputArea: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs },
  attachBtn: { padding: SPACING.xs }, attachIcon: { fontSize: 24 },
  input: { flex: 1, backgroundColor: '#FFF', borderRadius: 20, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginHorizontal: SPACING.sm, fontSize: FONTS.sizes.md, maxHeight: 100 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' }, sendIcon: { fontSize: 18, color: '#FFF' },
  micBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#25D366', justifyContent: 'center', alignItems: 'center' },
  micRec: { backgroundColor: '#F44336' }, micIcon: { fontSize: 20, color: '#FFF' },
  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  attMenu: { backgroundColor: '#FFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: SPACING.lg },
  attTitle: { fontSize: FONTS.sizes.lg, fontWeight: 'bold', textAlign: 'center', marginBottom: SPACING.lg },
  attGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md, marginBottom: SPACING.lg },
  attItem: { width: (width - SPACING.lg * 2 - SPACING.md * 2) / 3, alignItems: 'center', padding: SPACING.sm },
  attIcon: { width: 56, height: 56, borderRadius: 16, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  attEmoji: { fontSize: 24 }, attLabel: { fontSize: FONTS.sizes.xs, color: COLORS.dark, textAlign: 'center' },
  cancelBtn: { padding: SPACING.md, alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 10 },
  cancelText: { fontSize: FONTS.sizes.md, color: COLORS.gray, fontWeight: '600' },
  // Scheduler
  schedInput: { borderWidth: 1, borderColor: '#E0E0E0', borderRadius: 10, padding: SPACING.md, marginBottom: SPACING.sm, fontSize: FONTS.sizes.sm },
  schedBtn: { backgroundColor: COLORS.primary, padding: SPACING.md, borderRadius: 10, alignItems: 'center', marginBottom: SPACING.sm },
  schedBtnText: { color: '#FFF', fontWeight: 'bold' },
});

export default ChatScreen;

// Add these inside the ChatScreen component
const handleVoiceCallStart = () => {
  const callMsg = { id: `msg_${Date.now()}`, chatId: chat.id, senderId: userId, senderName: 'You', type: 'call', content: '📞 Voice call', callType: 'voice', status: 'sent', timestamp: new Date().toISOString() };
  setMessages(prev => [...prev, callMsg]);
  showToast('📞 Starting voice call...');
};

const handleVideoCallStart = () => {
  const callMsg = { id: `msg_${Date.now()}`, chatId: chat.id, senderId: userId, senderName: 'You', type: 'call', content: '📹 Video call', callType: 'video', status: 'sent', timestamp: new Date().toISOString() };
  setMessages(prev => [...prev, callMsg]);
  showToast('📹 Starting video call...');
};

const handleConferenceCallStart = (title: string, sendCode: boolean) => {
  const roomCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  const callMsg = { id: `msg_${Date.now()}`, chatId: chat.id, senderId: userId, senderName: 'You', type: 'call', content: `👥 Conference: ${title}`, callType: 'conference', roomCode, status: 'sent', timestamp: new Date().toISOString() };
  setMessages(prev => [...prev, callMsg]);
  
  if (sendCode) {
    showToast(`📤 Conference code sent: ${roomCode}`);
  } else {
    showToast(`👥 Conference created! Code: ${roomCode}`);
  }
};

// Add CallOptionsModal at the end of the return statement (before the last closing tag)
// <CallOptionsModal
//   visible={showCallOptions}
//   chatName={chat.name}
//   onClose={() => setShowCallOptions(false)}
//   onVoiceCall={handleVoiceCallStart}
//   onVideoCall={handleVideoCallStart}
//   onConferenceCall={handleConferenceCallStart}
// />
