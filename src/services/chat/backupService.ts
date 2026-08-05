// services/chat/backupService.ts - Chat backup and restore
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { ChatMessage, ChatConversation } from '../../types/chat';

const BACKUP_KEY = '@chat_backups';

interface ChatBackup {
  id: string;
  date: string;
  size: number;
  conversations: number;
  messages: number;
}

/**
 * Create backup of all chats
 */
export const createBackup = async (
  conversations: ChatConversation[],
  messages: Record<string, ChatMessage[]>
): Promise<ChatBackup> => {
  const backupData = {
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    conversations,
    messages,
  };

  const backupJSON = JSON.stringify(backupData);
  const backupId = `backup_${Date.now()}`;
  const filePath = `${FileSystem.documentDirectory}${backupId}.json`;

  await FileSystem.writeAsStringAsync(filePath, backupJSON);

  const backup: ChatBackup = {
    id: backupId,
    date: new Date().toLocaleDateString(),
    size: backupJSON.length,
    conversations: conversations.length,
    messages: Object.values(messages).flat().length,
  };

  // Save backup metadata
  const backups = await getBackups();
  backups.push(backup);
  await AsyncStorage.setItem(BACKUP_KEY, JSON.stringify(backups));

  return backup;
};

/**
 * Get list of backups
 */
export const getBackups = async (): Promise<ChatBackup[]> => {
  const data = await AsyncStorage.getItem(BACKUP_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Restore from backup
 */
export const restoreFromBackup = async (
  backupId: string
): Promise<{
  conversations: ChatConversation[];
  messages: Record<string, ChatMessage[]>;
} | null> => {
  try {
    const filePath = `${FileSystem.documentDirectory}${backupId}.json`;
    const data = await FileSystem.readAsStringAsync(filePath);
    const backup = JSON.parse(data);
    return {
      conversations: backup.conversations,
      messages: backup.messages,
    };
  } catch (error) {
    return null;
  }
};

/**
 * Share backup file
 */
export const shareBackup = async (backupId: string): Promise<void> => {
  const filePath = `${FileSystem.documentDirectory}${backupId}.json`;
  const exists = await FileSystem.getInfoAsync(filePath);
  
  if (exists.exists) {
    await Sharing.shareAsync(filePath, {
      mimeType: 'application/json',
      dialogTitle: 'Share Chat Backup',
    });
  }
};

/**
 * Delete a backup
 */
export const deleteBackup = async (backupId: string): Promise<void> => {
  const filePath = `${FileSystem.documentDirectory}${backupId}.json`;
  await FileSystem.deleteAsync(filePath, { idempotent: true });
  
  const backups = await getBackups();
  const filtered = backups.filter(b => b.id !== backupId);
  await AsyncStorage.setItem(BACKUP_KEY, JSON.stringify(filtered));
};
