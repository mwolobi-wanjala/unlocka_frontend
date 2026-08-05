// services/viewOnceService.ts - Unified View Once service
import { ViewOnceContent, VIEW_ONCE_MIN_AMOUNT, VIEW_ONCE_MAX_AMOUNT } from '../types/viewOnce';
import { 
  encryptViewOnceContent, 
  decryptViewOnceContent,
  getUserKeyPair,
  isEncrypted 
} from './e2eEncryption';

const API_URL = 'http://localhost:8000/api/v1/view-once';

/**
 * Get ALL view once messages (both received AND sent) in one unified inbox
 */
export const getUnifiedInbox = async (userId: number): Promise<ViewOnceContent[]> => {
  try {
    const response = await fetch(`${API_URL}/inbox?user_id=${userId}`);
    const data = await response.json();
    return data.viewOnce || [];
  } catch {
    return [];
  }
};

/**
 * Get received view once (pending payment)
 */
export const getReceivedViewOnce = async (userId: number): Promise<ViewOnceContent[]> => {
  try {
    const response = await fetch(`${API_URL}/received?user_id=${userId}`);
    const data = await response.json();
    return data.viewOnce || [];
  } catch {
    return [];
  }
};

/**
 * Get sent view once
 */
export const getSentViewOnce = async (userId: number): Promise<ViewOnceContent[]> => {
  try {
    const response = await fetch(`${API_URL}/sent?user_id=${userId}`);
    const data = await response.json();
    return data.viewOnce || [];
  } catch {
    return [];
  }
};

/**
 * Create view-once content WITH E2E encryption
 * Amount must be between 20-500 KSH
 */
export const createViewOnce = async (
  senderId: number,
  senderName: string,
  recipientId: number,
  recipientPhone: string,
  type: 'image' | 'video' | 'text',
  content: string,
  amount: number,
  caption?: string
): Promise<any> => {
  // Validate amount limits
  if (amount < VIEW_ONCE_MIN_AMOUNT) {
    return { success: false, message: `Minimum amount is KSH ${VIEW_ONCE_MIN_AMOUNT}` };
  }
  if (amount > VIEW_ONCE_MAX_AMOUNT) {
    return { success: false, message: `Maximum amount is KSH ${VIEW_ONCE_MAX_AMOUNT}` };
  }

  try {
    // 🔐 E2E ENCRYPTION
    const senderKeys = await getUserKeyPair();
    const encryptedPackage = await encryptViewOnceContent(content, senderKeys, recipientId);
    const encryptedContent = JSON.stringify(encryptedPackage);
    
    const formData = new FormData();
    formData.append('sender_id', senderId.toString());
    formData.append('sender_name', senderName);
    formData.append('recipient_id', recipientId.toString());
    formData.append('recipient_phone', recipientPhone);
    formData.append('type', type);
    formData.append('content', encryptedContent);
    formData.append('amount', amount.toString());
    formData.append('is_encrypted', 'true');
    if (caption) formData.append('caption', caption);

    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch (error) {
    return { success: false, message: 'Failed to create view once' };
  }
};

/**
 * Request STK Push to pay for view-once
 */
export const requestViewOncePayment = async (
  viewOnceId: string,
  mpesaNumber: string,
  userId: number
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('view_once_id', viewOnceId);
    formData.append('mpesa_number', mpesaNumber);
    formData.append('user_id', userId.toString());

    const response = await fetch(`${API_URL}/pay`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch {
    return { success: false, message: 'Payment request failed' };
  }
};

/**
 * Check payment status
 */
export const checkViewOncePayment = async (
  checkoutRequestId: string
): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/check-payment/${checkoutRequestId}`);
    return await response.json();
  } catch {
    return { success: false, status: 'pending' };
  }
};

/**
 * Open view-once content WITH E2E decryption
 */
export const openViewOnce = async (viewOnceId: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/open/${viewOnceId}`);
    const data = await response.json();
    
    if (!data.success || !data.content) return null;
    
    // 🔐 E2E DECRYPTION
    if (data.content.content && isEncrypted(data.content.content)) {
      const encryptedPackage = JSON.parse(data.content.content);
      const recipientKeys = await getUserKeyPair();
      
      try {
        const decryptedContent = await decryptViewOnceContent(
          encryptedPackage,
          recipientKeys
        );
        data.content.content = decryptedContent;
        data.content.decrypted = true;
      } catch {
        data.content.content = '🔒 Cannot decrypt - you are not the intended recipient';
        data.content.decrypted = false;
      }
    }
    
    return data.content;
  } catch {
    return null;
  }
};

/**
 * Get sender earnings
 */
export const getSenderEarnings = async (userId: number): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/earnings/${userId}`);
    return await response.json();
  } catch {
    return { totalEarned: 0, totalSent: 0, totalViewed: 0 };
  }
};

/**
 * Delete view once
 */
export const deleteViewOnce = async (viewOnceId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/${viewOnceId}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data.success;
  } catch {
    return false;
  }
};
