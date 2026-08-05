// services/chat/themeService.ts - Chat wallpapers and themes
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ChatTheme {
  chatId?: string; // undefined = global theme
  wallpaper?: string;
  wallpaperOpacity?: number;
  bubbleStyle?: 'rounded' | 'square';
  fontSize?: 'small' | 'medium' | 'large';
  nightMode?: boolean;
}

const THEME_KEY = '@chat_themes';

// Default wallpapers
export const WALLPAPERS = [
  { id: 'default', name: 'Default', color: '#E5DDD5' },
  { id: 'dark', name: 'Dark', color: '#1a1a2e' },
  { id: 'ocean', name: 'Ocean', color: '#0077b6' },
  { id: 'forest', name: 'Forest', color: '#2d6a4f' },
  { id: 'sunset', name: 'Sunset', color: '#ff6b6b' },
  { id: 'purple', name: 'Purple', color: '#6c63ff' },
  { id: 'gradient1', name: 'Gradient Blue', color: 'linear-gradient(#667eea, #764ba2)' },
  { id: 'gradient2', name: 'Gradient Warm', color: 'linear-gradient(#ff6b6b, #feca57)' },
];

/**
 * Set theme for a chat
 */
export const setChatTheme = async (theme: ChatTheme): Promise<void> => {
  const themes = await getAllThemes();
  const existing = themes.findIndex(t => 
    t.chatId === theme.chatId || (!theme.chatId && !t.chatId)
  );
  
  if (existing >= 0) {
    themes[existing] = theme;
  } else {
    themes.push(theme);
  }
  
  await AsyncStorage.setItem(THEME_KEY, JSON.stringify(themes));
};

/**
 * Get theme for a specific chat
 */
export const getChatTheme = async (chatId?: string): Promise<ChatTheme> => {
  const themes = await getAllThemes();
  const chatTheme = themes.find(t => t.chatId === chatId);
  const globalTheme = themes.find(t => !t.chatId);
  
  return chatTheme || globalTheme || { bubbleStyle: 'rounded', fontSize: 'medium' };
};

/**
 * Get all themes
 */
export const getAllThemes = async (): Promise<ChatTheme[]> => {
  const data = await AsyncStorage.getItem(THEME_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Reset theme to default
 */
export const resetTheme = async (chatId?: string): Promise<void> => {
  const themes = await getAllThemes();
  const filtered = themes.filter(t => 
    chatId ? t.chatId !== chatId : t.chatId !== undefined
  );
  await AsyncStorage.setItem(THEME_KEY, JSON.stringify(filtered));
};
