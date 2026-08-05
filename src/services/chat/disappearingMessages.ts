// services/chat/disappearingMessages.ts - Auto-delete messages
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DisappearingConfig {
  chatId: string;
  duration: number; // seconds
  enabled: boolean;
}

const DEFAULT_DURATIONS = {
  OFF: 0,
  HOURS_24: 86400,
  DAYS_7: 604800,
  DAYS_90: 7776000,
};

/**
 * Set disappearing messages for a chat
 */
export const setDisappearingMessages = async (
  chatId: string,
  duration: number
): Promise<void> => {
  const config: DisappearingConfig = {
    chatId,
    duration,
    enabled: duration > 0,
  };
  await AsyncStorage.setItem(`disappear_${chatId}`, JSON.stringify(config));
};

/**
 * Get disappearing config for a chat
 */
export const getDisappearingConfig = async (
  chatId: string
): Promise<DisappearingConfig | null> => {
  const data = await AsyncStorage.getItem(`disappear_${chatId}`);
  return data ? JSON.parse(data) : null;
};

/**
 * Calculate when message will disappear
 */
export const getMessageExpiryTime = (
  sentTime: string,
  duration: number
): Date => {
  const sent = new Date(sentTime);
  return new Date(sent.getTime() + duration * 1000);
};

/**
 * Check if message should be deleted
 */
export const shouldDeleteMessage = (
  sentTime: string,
  duration: number
): boolean => {
  const expiry = getMessageExpiryTime(sentTime, duration);
  return new Date() > expiry;
};

/**
 * Format remaining time
 */
export const formatRemainingTime = (expiryTime: Date): string => {
  const now = new Date();
  const diff = expiryTime.getTime() - now.getTime();
  
  if (diff <= 0) return 'Deleting...';
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) return `${Math.floor(hours / 24)}d remaining`;
  if (hours > 0) return `${hours}h ${minutes}m remaining`;
  return `${minutes}m remaining`;
};

export { DEFAULT_DURATIONS };
