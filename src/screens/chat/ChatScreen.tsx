// screens/chat/ChatScreen.tsx - Main chat conversation screen
import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, Dimensions, Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import ChatBubble from '../../components/chat/ChatBubble';
import { ChatMessage, MediaPreview } from '../../types/chat';
import { groupMessagesByDate, generateMessageId } from '../../utils/chat/helpers';
import { chatSocket, chatAPI } from '../../services/chat/socketService';

const { width } = Dimensions.get('window');

interface ChatScreenProps {
  chatId: string;
  chatName: string;
  onBack: () => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ chatId, chatName, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
  const flatListRef = useRef<FlatList>(null);

  // Load messages
  useEffect(() => {
    loadMessages();
    
    // Listen for new messages
    chatSocket.on('new_message', handleNewMessage);
    chatSocket.on('message_status', handleMessageStatus);
    
    return () => {
      chatSocket.off('new_message', handleNewMessage);
      chatSocket.off('message_status', handleMessageStatus);
    };
  }, [chatId]);

  const loadMessages = async () => {
    try {
      const msgs = await chatAPI.getMessages(chatId);
      setMessages(msgs);
    } catch (error) {
      console.error('Failed to load messages');
    }
  };

  const handleNewMessage = useCallback((message: ChatMessage) => {
    if (message.chatId === chatId) {
      setMessages(prev => [...prev, message]);
      setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
    }
  }, [chatId]);

  const handleMessageStatus = useCallback((data: { messageId: string; status: string }) => {
    setMessages(prev => prev.map(msg =>
      msg.id === data.messageId ? { ...msg, status: data.status as any } : msg
    ));
  }, []);

  // Send text message
  const sendMessage = () => {
    if (!inputText.trim()) return;

    const message: ChatMessage = {
      id: generateMessageId(),
      chatId,
      senderId: 1, // Current user ID
      senderName: 'You',
      type: 'text',
      content: inputText.trim(),
      status: 'sending',
      timestamp: new Date().toISOString(),
      ...(replyingTo && { replyTo: { id: replyingTo.id, senderName: replyingTo.senderName, content: replyingTo.content, type: replyingTo.type } }),
    };

    setMessages(prev => [...prev, message]);
    setInputText('');
    setReplyingTo(null);
    
    chatSocket.sendMessage(message);
    setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
  };

  // Send media
  const sendMedia = async (type: 'image' | 'video' | 'document') => {
    try {
      let result;
      
      if (type === 'document') {
        result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
      } else {
        const mediaResult = await ImagePicker.launchImageLibraryAsync({
          mediaType: type === 'video' ? 'videos' : 'images',
          quality: 0.8,
        });
        if (!mediaResult.canceled) result = mediaResult.assets[0];
      }

      if (result) {
        // Upload and send media message
        const uploadResult = await chatAPI.uploadMedia(result, type);
        
        const message: ChatMessage = {
          id: generateMessageId(),
          chatId,
          senderId: 1,
          senderName: 'You',
          type,
          content: '',
          mediaUrl: uploadResult.url,
          thumbnailUrl: uploadResult.thumbnail,
          status: 'sending',
          timestamp: new Date().toISOString(),
        };

        setMessages(prev => [...prev, message]);
        chatSocket.sendMessage(message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send media');
    }
  };

  // Delete message
  const deleteMessage = (messageId: string) => {
    Alert.alert('Delete Message', 'Delete for everyone or just for me?', [
      { text: 'Delete for me', onPress: () => {
        setMessages(prev => prev.filter(m => m.id !== messageId));
        chatSocket.deleteMessage(chatId, messageId, false);
      }},
      { text: 'Delete for everyone', onPress: () => {
        setMessages(prev => prev.filter(m => m.id !== messageId));
        chatSocket.deleteMessage(chatId, messageId, true);
      }},
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  // Forward message
  const forwardMessage = (message: ChatMessage) => {
    // Show contact picker to select recipients
    Alert.alert('Forward Message', 'Select contacts to forward to');
  };

  // Message actions
  const handleLongPress = (message: ChatMessage) => {
    Alert.alert('Message Options', '', [
      { text: 'Reply', onPress: () => setReplyingTo(message) },
      { text: 'Forward', onPress: () => forwardMessage(message) },
      { text: 'Copy', onPress: () => {/* Copy to clipboard */} },
      { text: 'Star', onPress: () => chatSocket.starMessage(message.id, true) },
      { text: 'Delete', onPress: () => deleteMessage(message.id), style: 'destructive' },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const groupedMessages = groupMessagesByDate(messages);

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{chatName}</Text>
          <Text style={styles.headerStatus}>online</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerBtn}>
            <Text>📞</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Text>📹</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Text>⋮</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={groupedMessages}
        keyExtractor={(item) => item.date}
        renderItem={({ item: group }) => (
          <View>
            {/* Date separator */}
            <View style={styles.dateSeparator}>
              <Text style={styles.dateText}>{group.date}</Text>
            </View>
            
            {group.messages.map((msg, idx) => (
              <ChatBubble
                key={msg.id}
                message={msg}
                isMine={msg.senderId === 1}
                showAvatar={!msg.senderId}
                onLongPress={handleLongPress}
                onReply={setReplyingTo}
                onForward={forwardMessage}
              />
            ))}
          </View>
        )}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
      />

      {/* Reply preview */}
      {replyingTo && (
        <View style={styles.replyBar}>
          <View style={styles.replyBarContent}>
            <Text style={styles.replyingTo}>Replying to {replyingTo.senderName}</Text>
            <Text style={styles.replyPreview} numberOfLines={1}>{replyingTo.content}</Text>
          </View>
          <TouchableOpacity onPress={() => setReplyingTo(null)}>
            <Text style={styles.cancelReply}>✕</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputArea}>
        <TouchableOpacity style={styles.attachBtn} onPress={() => {
          Alert.alert('Attach', '', [
            { text: '📷 Camera', onPress: () => sendMedia('image') },
            { text: '🖼️ Gallery', onPress: () => sendMedia('image') },
            { text: '📄 Document', onPress: () => sendMedia('document') },
            { text: '📍 Location', onPress: () => {} },
            { text: '👤 Contact', onPress: () => {} },
            { text: '📊 Poll', onPress: () => {} },
            { text: 'Cancel', style: 'cancel' },
          ]);
        }}>
          <Text style={styles.attachIcon}>📎</Text>
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Message"
          placeholderTextColor="#999"
          multiline
          maxLength={5000}
        />

        {inputText.trim() ? (
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendIcon}>📤</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.micBtn} onPress={() => setIsRecording(!isRecording)}>
            <Text style={styles.micIcon}>{isRecording ? '🔴' : '🎤'}</Text>
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#E5DDD5' },
  
  // Header
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.primary, paddingTop: 45, paddingBottom: 10, paddingHorizontal: SPACING.md },
  backBtn: { padding: SPACING.xs },
  backText: { color: COLORS.white, fontSize: 24 },
  headerInfo: { flex: 1, marginLeft: SPACING.sm },
  headerName: { color: COLORS.white, fontSize: FONTS.sizes.lg, fontWeight: 'bold' },
  headerStatus: { color: 'rgba(255,255,255,0.8)', fontSize: FONTS.sizes.xs },
  headerActions: { flexDirection: 'row', gap: SPACING.sm },
  headerBtn: { padding: SPACING.xs },
  
  // Messages
  messagesList: { paddingVertical: SPACING.sm },
  dateSeparator: { alignItems: 'center', marginVertical: SPACING.sm },
  dateText: { backgroundColor: '#E1F3FB', color: '#4A90D9', paddingHorizontal: SPACING.md, paddingVertical: 4, borderRadius: 8, fontSize: FONTS.sizes.xs, fontWeight: '600' },
  
  // Reply bar
  replyBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', padding: SPACING.sm, borderTopWidth: 1, borderTopColor: '#DDD' },
  replyBarContent: { flex: 1 },
  replyingTo: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary },
  replyPreview: { fontSize: 12, color: COLORS.gray },
  cancelReply: { fontSize: 18, color: COLORS.gray, padding: SPACING.xs },
  
  // Input
  inputArea: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', paddingHorizontal: SPACING.sm, paddingVertical: SPACING.xs },
  attachBtn: { padding: SPACING.xs },
  attachIcon: { fontSize: 24 },
  input: { flex: 1, backgroundColor: COLORS.white, borderRadius: 20, paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, marginHorizontal: SPACING.sm, fontSize: FONTS.sizes.md, maxHeight: 100 },
  sendBtn: { backgroundColor: COLORS.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  sendIcon: { fontSize: 18, color: COLORS.white },
  micBtn: { backgroundColor: COLORS.primary, width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  micIcon: { fontSize: 20 },
});

export default ChatScreen;
