// services/chat/scheduledMessages.ts - Schedule messages for later
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ScheduledMessage {
  id: string;
  chatId: string;
  content: string;
  scheduledTime: string;
  createdAt: string;
  status: 'pending' | 'sent' | 'cancelled';
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly';
}

const SCHEDULED_KEY = '@scheduled_messages';

/**
 * Schedule a message
 */
export const scheduleMessage = async (
  chatId: string,
  content: string,
  scheduledTime: Date,
  repeat?: 'none' | 'daily' | 'weekly' | 'monthly'
): Promise<ScheduledMessage> => {
  const message: ScheduledMessage = {
    id: `sched_${Date.now()}`,
    chatId,
    content,
    scheduledTime: scheduledTime.toISOString(),
    createdAt: new Date().toISOString(),
    status: 'pending',
    repeat: repeat || 'none',
  };

  const messages = await getScheduledMessages();
  messages.push(message);
  await AsyncStorage.setItem(SCHEDULED_KEY, JSON.stringify(messages));

  return message;
};

/**
 * Get all scheduled messages
 */
export const getScheduledMessages = async (): Promise<ScheduledMessage[]> => {
  const data = await AsyncStorage.getItem(SCHEDULED_KEY);
  return data ? JSON.parse(data) : [];
};

/**
 * Cancel scheduled message
 */
export const cancelScheduledMessage = async (id: string): Promise<void> => {
  const messages = await getScheduledMessages();
  const updated = messages.map(m =>
    m.id === id ? { ...m, status: 'cancelled' as const } : m
  );
  await AsyncStorage.setItem(SCHEDULED_KEY, JSON.stringify(updated));
};

/**
 * Get pending messages that should be sent now
 */
export const getDueMessages = async (): Promise<ScheduledMessage[]> => {
  const messages = await getScheduledMessages();
  const now = new Date();
  
  return messages.filter(m =>
    m.status === 'pending' && new Date(m.scheduledTime) <= now
  );
};

/**
 * Mark message as sent
 */
export const markAsSent = async (id: string): Promise<void> => {
  const messages = await getScheduledMessages();
  const updated = messages.map(m =>
    m.id === id ? { ...m, status: 'sent' as const } : m
  );
  await AsyncStorage.setItem(SCHEDULED_KEY, JSON.stringify(updated));
};
