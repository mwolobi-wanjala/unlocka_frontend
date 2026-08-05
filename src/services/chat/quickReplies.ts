// services/chat/quickReplies.ts - Quick reply templates
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface QuickReply {
  id: string;
  text: string;
  shortcut: string;
  category: string;
}

const QUICK_REPLIES_KEY = '@quick_replies';

// Default quick replies
const DEFAULT_QUICK_REPLIES: QuickReply[] = [
  { id: '1', text: '👍 Ok, sounds good!', shortcut: '/ok', category: 'General' },
  { id: '2', text: 'I\'ll be there in 5 minutes', shortcut: '/otw', category: 'General' },
  { id: '3', text: 'Can\'t talk right now, busy', shortcut: '/busy', category: 'General' },
  { id: '4', text: '😂 Haha that\'s funny', shortcut: '/lol', category: 'Reactions' },
  { id: '5', text: 'Thank you so much! 🙏', shortcut: '/thanks', category: 'Reactions' },
  { id: '6', text: 'Where are you?', shortcut: '/where', category: 'Location' },
  { id: '7', text: 'Call me when you can', shortcut: '/call', category: 'General' },
  { id: '8', text: 'See you tomorrow! 👋', shortcut: '/bye', category: 'General' },
];

/**
 * Get all quick replies
 */
export const getQuickReplies = async (): Promise<QuickReply[]> => {
  const data = await AsyncStorage.getItem(QUICK_REPLIES_KEY);
  if (!data) {
    await AsyncStorage.setItem(QUICK_REPLIES_KEY, JSON.stringify(DEFAULT_QUICK_REPLIES));
    return DEFAULT_QUICK_REPLIES;
  }
  return JSON.parse(data);
};

/**
 * Add custom quick reply
 */
export const addQuickReply = async (reply: Omit<QuickReply, 'id'>): Promise<QuickReply> => {
  const replies = await getQuickReplies();
  const newReply: QuickReply = {
    ...reply,
    id: `qr_${Date.now()}`,
  };
  replies.push(newReply);
  await AsyncStorage.setItem(QUICK_REPLIES_KEY, JSON.stringify(replies));
  return newReply;
};

/**
 * Delete quick reply
 */
export const deleteQuickReply = async (id: string): Promise<void> => {
  const replies = await getQuickReplies();
  const filtered = replies.filter(r => r.id !== id);
  await AsyncStorage.setItem(QUICK_REPLIES_KEY, JSON.stringify(filtered));
};

/**
 * Search quick replies
 */
export const searchQuickReplies = async (query: string): Promise<QuickReply[]> => {
  const replies = await getQuickReplies();
  return replies.filter(r =>
    r.text.toLowerCase().includes(query.toLowerCase()) ||
    r.shortcut.toLowerCase().includes(query.toLowerCase())
  );
};

/**
 * Get replies by category
 */
export const getRepliesByCategory = async (category: string): Promise<QuickReply[]> => {
  const replies = await getQuickReplies();
  return replies.filter(r => r.category === category);
};
