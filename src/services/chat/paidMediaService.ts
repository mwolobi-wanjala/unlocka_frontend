// services/chat/paidMediaService.ts - Paid media service
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:8000/api/v1/chat';

/**
 * Request STK Push to pay for media
 */
export const requestMediaPayment = async (
  messageId: string,
  mpesaNumber: string,
  userId: number
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('message_id', messageId);
    formData.append('mpesa_number', mpesaNumber.replace(/\D/g, ''));
    formData.append('user_id', userId.toString());

    const response = await fetch(`${API_URL}/media/pay`, {
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
export const checkMediaPayment = async (
  checkoutRequestId: string
): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/media/check-payment/${checkoutRequestId}`);
    return await response.json();
  } catch {
    return { success: false, status: 'pending' };
  }
};

/**
 * Unlock media after payment
 */
export const unlockMedia = async (messageId: string): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/media/unlock/${messageId}`, {
      method: 'POST',
    });
    return await response.json();
  } catch {
    return { success: false };
  }
};

/**
 * Send media with optional pay wall
 */
export const sendPaidMedia = async (
  chatId: string,
  senderId: number,
  mediaUri: string,
  type: 'image' | 'video',
  isPaid: boolean = false,
  amount: number = 0,
  caption?: string
): Promise<any> => {
  try {
    const formData = new FormData();
    formData.append('chat_id', chatId);
    formData.append('sender_id', senderId.toString());
    formData.append('type', type);
    formData.append('is_paid', isPaid.toString());
    if (isPaid) formData.append('amount', amount.toString());
    if (caption) formData.append('caption', caption);

    // Append media file
    const filename = mediaUri.split('/').pop() || 'media.jpg';
    formData.append('media', {
      uri: mediaUri,
      name: filename,
      type: type === 'video' ? 'video/mp4' : 'image/jpeg',
    } as any);

    const response = await fetch(`${API_URL}/media/send`, {
      method: 'POST',
      body: formData,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return await response.json();
  } catch {
    return { success: false };
  }
};
