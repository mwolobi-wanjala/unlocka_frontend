// types/chat.ts - Chat system type definitions

// User status
export type UserStatus = 'online' | 'offline' | 'typing' | 'recording' | 'last_seen';

// Message types
export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'document' | 'location' | 'contact' | 'sticker' | 'gif' | 'poll';

// Message status
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

// Chat types
export type ChatType = 'individual' | 'group' | 'broadcast';

// Media preview
export interface MediaPreview {
  uri: string;
  type: 'image' | 'video';
  duration?: number;
  size?: number;
}

// Chat message
export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  type: MessageType;
  content: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  duration?: number;
  fileSize?: number;
  fileName?: string;
  mimeType?: string;
  location?: {
    latitude: number;
    longitude: number;
    name?: string;
  };
  contact?: {
    name: string;
    phone: string;
    avatar?: string;
  };
  poll?: {
    question: string;
    options: { id: string; text: string; votes: number; }[];
    totalVotes: number;
    voted?: string;
  };
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
    type: MessageType;
  };
  forwardFrom?: string;
  status: MessageStatus;
  timestamp: string;
  editedAt?: string;
  deletedAt?: string;
  starred?: boolean;
  reactions?: { [emoji: string]: number[] };
}

// Chat conversation
export interface ChatConversation {
  id: string;
  type: ChatType;
  name: string;
  avatar?: string;
  participants: ChatParticipant[];
  lastMessage?: ChatMessage;
  unreadCount: number;
  muted: boolean;
  pinned: boolean;
  archived: boolean;
  wallpaper?: string;
  encryptionKey?: string;
  createdAt: string;
  updatedAt: string;
}

// Chat participant
export interface ChatParticipant {
  id: number;
  name: string;
  avatar?: string;
  status: UserStatus;
  lastSeen?: string;
  isAdmin: boolean;
  isOnline: boolean;
  typing?: boolean;
}

// Chat state
export interface ChatState {
  conversations: ChatConversation[];
  activeChat: string | null;
  messages: Record<string, ChatMessage[]>;
  loading: boolean;
  error: string | null;
  searchQuery: string;
  filterType: 'all' | 'unread' | 'groups' | 'archived';
}

// Chat actions
export type ChatAction =
  | { type: 'SET_CONVERSATIONS'; payload: ChatConversation[] }
  | { type: 'SET_ACTIVE_CHAT'; payload: string | null }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: ChatMessage } }
  | { type: 'UPDATE_MESSAGE'; payload: { chatId: string; messageId: string; updates: Partial<ChatMessage> } }
  | { type: 'DELETE_MESSAGE'; payload: { chatId: string; messageId: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'SET_FILTER'; payload: ChatState['filterType'] };

// Media upload progress
export interface UploadProgress {
  messageId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
}

// ============================================
// PAID MEDIA IN CHAT
// ============================================
export interface PaidMedia {
  isPaid: boolean;
  amount: number;
  senderCut: number;  // 85%
  platformCut: number; // 15%
  status: 'locked' | 'unlocked';
  paymentRef?: string;
  checkoutRequestId?: string;
  mpesaReceipt?: string;
  paidBy?: number;
  paidAt?: string;
}

export interface PaidMediaConfig {
  enabled: boolean;
  amount: number;
  currency: string;
}

export const PAID_MEDIA = {
  MIN_AMOUNT: 10,
  MAX_AMOUNT: 1000,
  SENDER_PERCENTAGE: 85,
  PLATFORM_PERCENTAGE: 15,
  CURRENCY: 'KSH',
};

