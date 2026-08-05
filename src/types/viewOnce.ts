// types/viewOnce.ts - View Once Types

export interface ViewOnceContent {
  id: string;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  recipientId: number;
  recipientName: string;
  recipientPhone: string;
  type: 'image' | 'video';
  content: string;
  thumbnail?: string;
  caption?: string;
  amount: number;
  senderCut: number;
  platformCut: number;
  status: 'pending' | 'paid' | 'viewed' | 'expired';
  direction: 'received' | 'sent';
  mpesaNumber?: string;
  paymentRef?: string;
  checkoutRequestId?: string;
  mpesaReceipt?: string;
  viewedAt?: string;
  expiresAt: string;
  createdAt: string;
  isEncrypted: boolean;
  decrypted?: boolean;
}

export interface ViewOncePayment {
  id: string;
  viewOnceId: string;
  amount: number;
  senderCut: number;
  platformCut: number;
  mpesaNumber: string;
  paymentRef: string;
  mpesaReceipt?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
}

export const VIEW_ONCE_MIN_AMOUNT = 20;
export const VIEW_ONCE_MAX_AMOUNT = 500;
