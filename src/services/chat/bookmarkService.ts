// services/chat/bookmarkService.ts - Message bookmarks
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Bookmark {
  id: string;
  messageId: string;
  chatId: string;
  chatName: string;
  content: string;
  note?: string;
  category: string;
  createdAt: string;
}

const BOOKMARKS_KEY = '@message_bookmarks';

const CATEGORIES = ['General', 'Important', 'Ideas', 'Tasks', 'Links', 'Custom'];

/**
 * Add bookmark
 */
export const addBookmark = async (
  messageId: string,
  chatId: string,
  chatName: string,
  content: string,
  category: string = 'General',
  note?: string
): Promise<Bookmark> => {
  const bookmarks = await getBookmarks();
  const bookmark: Bookmark = {
    id: `bkm_${Date.now()}`,
    messageId,
    chatId,
    chatName,
    content: content.slice(0, 100),
    note,
    category,
    createdAt: new Date().toISOString(),
  };
  bookmarks.push(bookmark);
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
  return bookmark;
};

/**
 * Get all bookmarks
 */
export const getBookmarks = async (): Promise<Bookmark[]> => {
  const data = await AsyncStorage.getItem(BOOKMARKS_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Get bookmarks by category
 */
export const getBookmarksByCategory = async (category: string): Promise<Bookmark[]> => {
  const bookmarks = await getBookmarks();
  return bookmarks.filter(b => b.category === category);
};

/**
 * Search bookmarks
 */
export const searchBookmarks = async (query: string): Promise<Bookmark[]> => {
  const bookmarks = await getBookmarks();
  return bookmarks.filter(b =>
    b.content.toLowerCase().includes(query.toLowerCase()) ||
    b.chatName.toLowerCase().includes(query.toLowerCase()) ||
    b.note?.toLowerCase().includes(query.toLowerCase())
  );
};

/**
 * Delete bookmark
 */
export const deleteBookmark = async (id: string): Promise<void> => {
  const bookmarks = await getBookmarks();
  const filtered = bookmarks.filter(b => b.id !== id);
  await AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(filtered));
};

/**
 * Get categories
 */
export const getCategories = (): string[] => CATEGORIES;
