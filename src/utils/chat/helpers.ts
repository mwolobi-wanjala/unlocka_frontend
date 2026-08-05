// utils/chat/helpers.ts - Chat utility functions
import { ChatMessage, MessageType } from '../../types/chat';

// Format timestamp like WhatsApp
export const formatMessageTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return 'Yesterday';
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });
  }
};

// Format chat list time
export const formatChatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (days < 7) {
    return date.toLocaleDateString([], { weekday: 'short' });
  } else {
    return date.toLocaleDateString([], { day: 'numeric', month: 'numeric', year: '2-digit' });
  }
};

// Group messages by date
export const groupMessagesByDate = (messages: ChatMessage[]): { date: string; messages: ChatMessage[] }[] => {
  const groups: { [key: string]: ChatMessage[] } = {};
  
  messages.forEach(msg => {
    const date = new Date(msg.timestamp).toLocaleDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
  });
  
  return Object.entries(groups).map(([date, msgs]) => ({
    date,
    messages: msgs,
  }));
};

// Get message status icon
export const getMessageStatusIcon = (status: string): string => {
  switch (status) {
    case 'sending': return '🕐';
    case 'sent': return '✓';
    case 'delivered': return '✓✓';
    case 'read': return '✓✓';
    case 'failed': return '⚠️';
    default: return '';
  }
};

// Get message type icon for chat list
export const getMessageTypePreview = (message: ChatMessage): string => {
  switch (message.type) {
    case 'image': return '📷 Photo';
    case 'video': return '🎥 Video';
    case 'audio': return '🎵 Audio';
    case 'document': return '📄 Document';
    case 'location': return '📍 Location';
    case 'contact': return '👤 Contact';
    case 'sticker': return '🎯 Sticker';
    case 'gif': return 'GIF';
    case 'poll': return '📊 Poll';
    default: return message.content;
  }
};

// Generate message ID
export const generateMessageId = (): string => {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Check if message is from same sender as previous
export const isSameSender = (messages: ChatMessage[], index: number): boolean => {
  if (index === 0) return false;
  return messages[index].senderId === messages[index - 1].senderId;
};

// Check if message should show timestamp
export const shouldShowTimestamp = (messages: ChatMessage[], index: number): boolean => {
  if (index === messages.length - 1) return true;
  const current = new Date(messages[index].timestamp);
  const next = new Date(messages[index + 1].timestamp);
  return (next.getTime() - current.getTime()) > 300000; // 5 minutes
};
