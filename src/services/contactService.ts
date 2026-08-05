// services/contactService.ts - Contact sync service
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:8000/api/v1/contacts';

/**
 * Sync phone contacts with server
 */
export const syncContacts = async (userId: number): Promise<any> => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      return { success: false, message: 'Contact permission denied' };
    }

    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
    });

    const contacts = data
      .filter(c => c.phoneNumbers && c.phoneNumbers.length > 0)
      .map(c => ({
        name: c.name || 'Unknown',
        phone: c.phoneNumbers![0].number?.replace(/\D/g, '') || '',
      }));

    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('contacts', JSON.stringify(contacts));

    const response = await fetch(`${API_URL}/sync`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Failed to sync contacts' };
  }
};

/**
 * Get mutual contacts
 */
export const getMutualContacts = async (userId: number): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/mutual?sender_id=${userId}`);
    const data = await response.json();
    return data.contacts || [];
  } catch {
    return [];
  }
};

/**
 * Check if can interact with user
 */
export const canInteract = async (
  userId: number,
  targetUserId: number,
  type: 'chat' | 'view_once' | 'status'
): Promise<{ canInteract: boolean; reason?: string }> => {
  try {
    const response = await fetch(
      `${API_URL}/can-interact?user_id=${userId}&target_user_id=${targetUserId}&interaction_type=${type}`
    );
    return await response.json();
  } catch {
    return { canInteract: false, reason: 'Failed to check' };
  }
};

/**
 * Block contact
 */
export const blockContact = async (userId: number, blockedUserId: number): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('blocked_user_id', blockedUserId.toString());
    
    const response = await fetch(`${API_URL}/block`, { method: 'POST', body: formData });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get blocked contacts
 */
export const getBlockedContacts = async (userId: number): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/blocked?user_id=${userId}`);
    const data = await response.json();
    return data.blocked || [];
  } catch {
    return [];
  }
};
