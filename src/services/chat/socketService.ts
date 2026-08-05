// services/chat/socketService.ts - WebSocket chat service
import { io, Socket } from 'socket.io-client';
import { ChatMessage, ChatConversation } from '../../types/chat';

const SOCKET_URL = 'http://localhost:8000';
const API_URL = 'http://localhost:8000/api/v1';

class ChatSocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(token: string) {
    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 10,
    });

    this.socket.on('connect', () => {
      console.log('🔗 Chat connected');
      this.emit('status', 'online');
    });

    this.socket.on('disconnect', () => {
      console.log('🔌 Chat disconnected');
    });

    // Message events
    this.socket.on('new_message', (message: ChatMessage) => {
      this.notify('new_message', message);
    });

    this.socket.on('message_status', (data: { messageId: string; status: string }) => {
      this.notify('message_status', data);
    });

    // Typing indicators
    this.socket.on('typing', (data: { chatId: string; userId: number; name: string }) => {
      this.notify('typing', data);
    });

    this.socket.on('stop_typing', (data: { chatId: string; userId: number }) => {
      this.notify('stop_typing', data);
    });

    // Presence
    this.socket.on('user_online', (data: { userId: number }) => {
      this.notify('user_online', data);
    });

    this.socket.on('user_offline', (data: { userId: number }) => {
      this.notify('user_offline', data);
    });

    // Conversation updates
    this.socket.on('conversation_updated', (conversation: ChatConversation) => {
      this.notify('conversation_updated', conversation);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Send message
  sendMessage(message: Partial<ChatMessage>) {
    this.socket?.emit('send_message', message);
  }

  // Typing indicator
  sendTyping(chatId: string) {
    this.socket?.emit('typing', { chatId });
  }

  stopTyping(chatId: string) {
    this.socket?.emit('stop_typing', { chatId });
  }

  // Message status
  markAsRead(chatId: string, messageIds: string[]) {
    this.socket?.emit('mark_read', { chatId, messageIds });
  }

  // Delete message
  deleteMessage(chatId: string, messageId: string, forEveryone: boolean = false) {
    this.socket?.emit('delete_message', { chatId, messageId, forEveryone });
  }

  // Edit message
  editMessage(chatId: string, messageId: string, newContent: string) {
    this.socket?.emit('edit_message', { chatId, messageId, content: newContent });
  }

  // Star message
  starMessage(messageId: string, starred: boolean) {
    this.socket?.emit('star_message', { messageId, starred });
  }

  // React to message
  reactToMessage(messageId: string, emoji: string) {
    this.socket?.emit('react_message', { messageId, emoji });
  }

  // Forward message
  forwardMessage(messageId: string, targetChatIds: string[]) {
    this.socket?.emit('forward_message', { messageId, targetChatIds });
  }

  // Reply to message
  replyToMessage(chatId: string, replyToId: string, content: string) {
    this.socket?.emit('reply_message', { chatId, replyToId, content });
  }

  // Listen for events
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  // Remove listener
  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      this.listeners.set(event, eventListeners.filter(cb => cb !== callback));
    }
  }

  // Notify all listeners
  private notify(event: string, data: any) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Emit event
  private emit(event: string, data: any) {
    this.socket?.emit(event, data);
  }
}

export const chatSocket = new ChatSocketService();

// REST API calls
export const chatAPI = {
  // Get conversations
  getConversations: async (): Promise<ChatConversation[]> => {
    const response = await fetch(`${API_URL}/chats`);
    const data = await response.json();
    return data.conversations;
  },

  // Get messages for a chat
  getMessages: async (chatId: string, page: number = 1): Promise<ChatMessage[]> => {
    const response = await fetch(`${API_URL}/chats/${chatId}/messages?page=${page}`);
    const data = await response.json();
    return data.messages;
  },

  // Search messages
  searchMessages: async (query: string): Promise<ChatMessage[]> => {
    const response = await fetch(`${API_URL}/chats/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data.messages;
  },

  // Get starred messages
  getStarredMessages: async (): Promise<ChatMessage[]> => {
    const response = await fetch(`${API_URL}/chats/starred`);
    const data = await response.json();
    return data.messages;
  },

  // Create group
  createGroup: async (name: string, participantIds: number[], avatar?: string): Promise<ChatConversation> => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('participants', JSON.stringify(participantIds));
    if (avatar) formData.append('avatar', avatar);
    
    const response = await fetch(`${API_URL}/chats/group`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  // Upload media
  uploadMedia: async (file: any, type: string): Promise<{ url: string; thumbnail?: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await fetch(`${API_URL}/chats/upload`, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.json();
  },
};
