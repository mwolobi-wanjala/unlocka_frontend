// services/walletService.ts - Wallet API service
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WalletInfo, Transaction, WithdrawalRequest, ReferralInfo } from '../types/wallet';
import * as Linking from 'expo-linking';

const API_URL = 'http://localhost:8000/api/v1/wallet';

/**
 * Get wallet balance & info
 */
export const getWalletInfo = async (userId: number): Promise<WalletInfo> => {
  try {
    const response = await fetch(`${API_URL}/info?user_id=${userId}`);
    return await response.json();
  } catch {
    return {
      balance: 0, totalEarned: 0, totalWithdrawn: 0,
      pendingBalance: 0, currency: 'KSH', lastUpdated: new Date().toISOString()
    };
  }
};

/**
 * Get transaction history
 */
export const getTransactions = async (userId: number, page: number = 1): Promise<Transaction[]> => {
  try {
    const response = await fetch(`${API_URL}/transactions?user_id=${userId}&page=${page}`);
    const data = await response.json();
    return data.transactions || [];
  } catch {
    return [];
  }
};

/**
 * Request withdrawal
 */
export const requestWithdrawal = async (
  userId: number,
  amount: number,
  mpesaNumber: string
): Promise<{ success: boolean; message: string; withdrawal?: WithdrawalRequest }> => {
  try {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('amount', amount.toString());
    formData.append('mpesa_number', mpesaNumber.replace(/\D/g, ''));

    const response = await fetch(`${API_URL}/withdraw`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch {
    return { success: false, message: 'Withdrawal request failed' };
  }
};

/**
 * Get withdrawal history
 */
export const getWithdrawalHistory = async (userId: number): Promise<WithdrawalRequest[]> => {
  try {
    const response = await fetch(`${API_URL}/withdrawals?user_id=${userId}`);
    const data = await response.json();
    return data.withdrawals || [];
  } catch {
    return [];
  }
};

/**
 * Get referral info
 */
export const getReferralInfo = async (userId: number): Promise<ReferralInfo> => {
  try {
    const response = await fetch(`${API_URL}/referral?user_id=${userId}`);
    return await response.json();
  } catch {
    return {
      referralCode: 'UNLOCKA00',
      referralLink: 'https://unlocka.app/ref/UNLOCKA00',
      totalReferrals: 0,
      totalEarnings: 0,
      recentReferrals: [],
    };
  }
};

/**
 * Share referral via platform
 */
export const shareReferral = async (
  referralCode: string,
  platform: 'whatsapp' | 'sms' | 'email' | 'telegram'
): Promise<void> => {
  const referralLink = `https://unlocka.app/ref/${referralCode}`;
  const message = `🔓 Join Un-locka and earn KSH 20 per referral!\n\nUse my referral code: ${referralCode}\nOr click: ${referralLink}\n\nSign up today and start earning! 💰`;
  
  switch (platform) {
    case 'whatsapp':
      Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}`);
      break;
    case 'sms':
      Linking.openURL(`sms:?body=${encodeURIComponent(message)}`);
      break;
    case 'email':
      Linking.openURL(`mailto:?subject=Join Un-locka&body=${encodeURIComponent(message)}`);
      break;
    case 'telegram':
      Linking.openURL(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('Join Un-locka!')}`);
      break;
  }
};

/**
 * Copy referral code to clipboard
 */
export const copyReferralCode = async (referralCode: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(referralCode);
  } catch {
    // Fallback
    const Clipboard = require('expo-clipboard');
    await Clipboard.setStringAsync(referralCode);
  }
};
