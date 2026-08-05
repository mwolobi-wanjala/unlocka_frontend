// types/wallet.ts - Wallet system types

export interface WalletInfo {
  balance: number;
  totalEarned: number;
  totalWithdrawn: number;
  pendingBalance: number;
  currency: string;
  lastUpdated: string;
}

export interface Transaction {
  id: string;
  type: 'earning' | 'withdrawal' | 'referral' | 'view_once' | 'paid_media' | 'signup_bonus';
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  description: string;
  reference?: string;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
  source?: string;
  receiptNumber?: string;
}

export interface WithdrawalRequest {
  id: string;
  amount: number;
  mpesaNumber: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedAt: string;
  processedAt?: string;
  receiptNumber?: string;
  fee: number;
  netAmount: number;
}

export interface ReferralInfo {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  totalEarnings: number;
  recentReferrals: ReferralUser[];
}

export interface ReferralUser {
  id: number;
  name: string;
  joinedAt: string;
  earnings: number;
  status: 'active' | 'pending';
}

export interface SharingOption {
  id: string;
  name: string;
  icon: string;
  color: string;
  platform: 'whatsapp' | 'sms' | 'email' | 'telegram';
}

export const SHARING_OPTIONS: SharingOption[] = [
  { id: 'whatsapp', name: 'WhatsApp', icon: '💬', color: '#25D366', platform: 'whatsapp' },
  { id: 'sms', name: 'SMS', icon: '💬', color: '#2196F3', platform: 'sms' },
  { id: 'email', name: 'Email', icon: '📧', color: '#EA4335', platform: 'email' },
  { id: 'telegram', name: 'Telegram', icon: '✈️', color: '#0088cc', platform: 'telegram' },
];

export const MIN_WITHDRAWAL = 50;
export const MAX_WITHDRAWAL = 50000;
export const WITHDRAWAL_FEE_PERCENT = 2; // 2% fee
