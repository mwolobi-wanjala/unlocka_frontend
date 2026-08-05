// components/chat/ChatBubble.tsx - WhatsApp-style message bubble
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { COLORS, FONTS, SPACING, SHADOWS } from '../../constants/theme';
import { ChatMessage } from '../../types/chat';
import { formatMessageTime, getMessageStatusIcon } from '../../utils/chat/helpers';

const { width } = Dimensions.get('window');
const MAX_BUBBLE_WIDTH = width * 0.75;

interface ChatBubbleProps {
  message: ChatMessage;
  isMine: boolean;
  showAvatar: boolean;
  onLongPress: (message: ChatMessage) => void;
  onReply: (message: ChatMessage) => void;
  onForward: (message: ChatMessage) => void;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isMine,
  showAvatar,
  onLongPress,
  onReply,
  onForward,
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleLongPress = () => {
    setShowActions(true);
    onLongPress(message);
  };

  // Render different message types
  const renderContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <TouchableOpacity onLongPress={handleLongPress}>
            <Image
              source={{ uri: message.mediaUrl }}
              style={styles.imageMessage}
              resizeMode="cover"
            />
            {message.content && (
              <Text style={[styles.messageText, isMine ? styles.myText : styles.theirText]}>
                {message.content}
              </Text>
            )}
          </TouchableOpacity>
        );

      case 'video':
        return (
          <TouchableOpacity onLongPress={handleLongPress} style={styles.videoContainer}>
            <Image source={{ uri: message.thumbnailUrl }} style={styles.videoThumb} />
            <View style={styles.playButton}>
              <Text style={styles.playIcon}>▶️</Text>
            </View>
          </TouchableOpacity>
        );

      case 'audio':
        return (
          <View style={styles.audioContainer}>
            <Text>🎵 Voice Message</Text>
            <Text style={styles.audioDuration}>{message.duration}s</Text>
          </View>
        );

      case 'location':
        return (
          <View style={styles.locationContainer}>
            <Text>📍 {message.location?.name || 'Location'}</Text>
          </View>
        );

      case 'contact':
        return (
          <View style={styles.contactCard}>
            <Text>👤 {message.contact?.name}</Text>
            <Text style={styles.contactPhone}>{message.contact?.phone}</Text>
          </View>
        );

      case 'document':
        return (
          <View style={styles.documentContainer}>
            <Text>📄 {message.fileName}</Text>
            <Text style={styles.fileSize}>{message.fileSize} bytes</Text>
          </View>
        );

      case 'poll':
        return (
          <View style={styles.pollContainer}>
            <Text style={styles.pollQuestion}>{message.poll?.question}</Text>
            {message.poll?.options.map(option => (
              <View key={option.id} style={styles.pollOption}>
                <Text>{option.text}</Text>
                <Text>{option.votes} votes</Text>
              </View>
            ))}
          </View>
        );

      default:
        return (
          <TouchableOpacity onLongPress={handleLongPress}>
            {/* Reply preview */}
            {message.replyTo && (
              <View style={styles.replyPreview}>
                <View style={styles.replyBar} />
                <View style={styles.replyContent}>
                  <Text style={styles.replyName}>{message.replyTo.senderName}</Text>
                  <Text style={styles.replyText} numberOfLines={1}>
                    {message.replyTo.content}
                  </Text>
                </View>
              </View>
            )}
            
            <Text style={[styles.messageText, isMine ? styles.myText : styles.theirText]}>
              {message.content}
            </Text>
          </TouchableOpacity>
        );
    }
  };

  return (
    <View style={[styles.container, isMine ? styles.myContainer : styles.theirContainer]}>
      {/* Avatar */}
      {!isMine && showAvatar && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {message.senderName.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}

      {/* Bubble */}
      <View style={[
        styles.bubble,
        isMine ? styles.myBubble : styles.theirBubble,
        { maxWidth: MAX_BUBBLE_WIDTH },
      ]}>
        {renderContent()}

        {/* Footer */}
        <View style={styles.footer}>
          {/* Edited indicator */}
          {message.editedAt && (
            <Text style={styles.editedText}>edited</Text>
          )}
          
          <Text style={[styles.timestamp, isMine ? styles.myTimestamp : styles.theirTimestamp]}>
            {formatMessageTime(message.timestamp)}
          </Text>
          
          {isMine && (
            <Text style={[styles.statusIcon, message.status === 'read' && styles.readIcon]}>
              {getMessageStatusIcon(message.status)}
            </Text>
          )}
        </View>

        {/* Reactions */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <View style={styles.reactions}>
            {Object.entries(message.reactions).map(([emoji, users]) => (
              <Text key={emoji} style={styles.reactionEmoji}>
                {emoji} {users.length}
              </Text>
            ))}
          </View>
        )}
      </View>

      {/* Forward indicator */}
      {message.forwardFrom && (
        <Text style={styles.forwardedText}>↪️ Forwarded</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', marginVertical: 2, paddingHorizontal: SPACING.sm },
  myContainer: { justifyContent: 'flex-end' },
  theirContainer: { justifyContent: 'flex-start' },
  
  avatar: { width: 30, height: 30, borderRadius: 15, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginRight: SPACING.xs, alignSelf: 'flex-end' },
  avatarText: { color: COLORS.white, fontWeight: 'bold', fontSize: 14 },
  
  bubble: { padding: SPACING.sm, borderRadius: 12, ...SHADOWS.small },
  myBubble: { backgroundColor: '#DCF8C6', borderTopRightRadius: 2 },
  theirBubble: { backgroundColor: COLORS.white, borderTopLeftRadius: 2 },
  
  messageText: { fontSize: FONTS.sizes.sm, lineHeight: 22 },
  myText: { color: COLORS.dark },
  theirText: { color: COLORS.dark },
  
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginTop: 2 },
  timestamp: { fontSize: 10, marginRight: 2 },
  myTimestamp: { color: '#6B7B6B' },
  theirTimestamp: { color: COLORS.gray },
  editedText: { fontSize: 10, color: COLORS.gray, fontStyle: 'italic', marginRight: 4 },
  
  statusIcon: { fontSize: 12, color: COLORS.gray },
  readIcon: { color: '#34B7F1' },
  
  imageMessage: { width: 200, height: 200, borderRadius: 8 },
  videoContainer: { position: 'relative' },
  videoThumb: { width: 200, height: 200, borderRadius: 8 },
  playButton: { position: 'absolute', top: '50%', left: '50%', marginLeft: -20, marginTop: -20 },
  playIcon: { fontSize: 40 },
  
  audioContainer: { flexDirection: 'row', alignItems: 'center', padding: SPACING.sm },
  audioDuration: { fontSize: 12, color: COLORS.gray, marginLeft: SPACING.sm },
  
  locationContainer: { padding: SPACING.sm, backgroundColor: '#E3F2FD', borderRadius: 8 },
  
  contactCard: { padding: SPACING.sm, backgroundColor: '#F5F5F5', borderRadius: 8 },
  contactPhone: { fontSize: 12, color: COLORS.gray },
  
  documentContainer: { padding: SPACING.sm, backgroundColor: '#F5F5F5', borderRadius: 8, flexDirection: 'row', alignItems: 'center' },
  fileSize: { fontSize: 10, color: COLORS.gray, marginLeft: SPACING.sm },
  
  pollContainer: { padding: SPACING.sm },
  pollQuestion: { fontWeight: 'bold', marginBottom: SPACING.xs },
  pollOption: { flexDirection: 'row', justifyContent: 'space-between', padding: SPACING.xs, backgroundColor: '#F5F5F5', borderRadius: 4, marginBottom: 2 },
  
  replyPreview: { flexDirection: 'row', marginBottom: 4 },
  replyBar: { width: 3, backgroundColor: COLORS.primary, borderRadius: 2, marginRight: SPACING.xs },
  replyContent: { flex: 1 },
  replyName: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary },
  replyText: { fontSize: 12, color: COLORS.gray },
  
  reactions: { flexDirection: 'row', position: 'absolute', bottom: -10, right: 0, backgroundColor: COLORS.white, borderRadius: 10, padding: 2, paddingHorizontal: 4, ...SHADOWS.small },
  reactionEmoji: { fontSize: 12, marginHorizontal: 2 },
  
  forwardedText: { fontSize: 10, color: COLORS.gray, fontStyle: 'italic', marginLeft: SPACING.sm },
});

export default ChatBubble;
