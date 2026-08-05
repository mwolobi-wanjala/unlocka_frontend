// services/api.ts - Complete API Service with Mock Data
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  TEST_ACCOUNTS, mockLogin, mockSignup,
  MOCK_CHATS, MOCK_MESSAGES, MOCK_VIEW_ONCE,
  MOCK_WALLET, MOCK_TRANSACTIONS, MOCK_REFERRAL,
  MOCK_STATUSES, MOCK_CREATOR_VIDEOS,
} from './localMockData';

const API_URL = 'http://localhost:8000/api/v1';
const USE_MOCK = true; // Set false when backend running

// ============================================
// AUTH
// ============================================
export const loginUser = async (data: { email: string; password: string }): Promise<any> => {
  if (USE_MOCK) return mockLogin(data.email, data.password);
  try {
    const fd = new FormData();
    fd.append('username', data.email);
    fd.append('password', data.password);
    fd.append('remember_me', 'true');
    const res = await fetch(`${API_URL}/login`, { method: 'POST', body: fd });
    return await res.json();
  } catch { return mockLogin(data.email, data.password); }
};

export const signupUser = async (data: any): Promise<any> => {
  if (USE_MOCK) return mockSignup(data);
  return mockSignup(data);
};

export const validateSession = async (token: string): Promise<any> => {
  return { success: !!token, valid: !!token, user: TEST_ACCOUNTS.user };
};

export const isAdminUser = (email: string): boolean => {
  return ['mwolobijavanson@gmail.com', 'javansonwanjala@gmail.com', 'admintest@unlocka.app'].includes(email.toLowerCase());
};

// ============================================
// WALLET
// ============================================
export const getWalletInfo = async (userId: number) => MOCK_WALLET;
export const getTransactions = async (userId: number) => MOCK_TRANSACTIONS;
export const getReferralInfo = async (userId: number) => MOCK_REFERRAL;
export const requestWithdrawal = async (userId: number, amount: number, mpesa: string) => ({
  success: true, message: 'Withdrawal processed', withdrawal: { id: 'w_123', amount, status: 'completed' }
});

// ============================================
// VIEW ONCE
// ============================================
export const getViewOnceList = async (userId: number) => MOCK_VIEW_ONCE;
export const createViewOnce = async (data: any) => ({ success: true, message: 'View once created' });
export const viewOncePayment = async (id: string, mpesa: string) => ({ success: true, checkout_request_id: 'ws_CO_test' });
export const checkViewOncePayment = async (id: string) => ({ success: true, status: 'completed' });

// ============================================
// CHATS
// ============================================
export const getChats = async (userId: number) => MOCK_CHATS;
export const getMessages = async (chatId: string) => MOCK_MESSAGES;
export const sendMessage = async (data: any) => ({ success: true });

// ============================================
// STATUS
// ============================================
export const getStatuses = async (userId: number) => MOCK_STATUSES;
export const createStatus = async (data: any) => ({ success: true });

// ============================================
// CREATORS
// ============================================
export const getCreatorVideos = async (userId: number) => MOCK_CREATOR_VIDEOS;
export const likeVideo = async (videoId: string) => ({ success: true });
export const followCreator = async (creatorId: number) => ({ success: true, following: true });

// ============================================
// ADMIN
// ============================================
export const getAdminStats = async () => ({
  totalUsers: 1250, activeUsers: 890, totalRevenue: 45000,
  totalViewOnce: 340, totalPaidMedia: 120, pendingReports: 5,
  newUsersToday: 23, revenueToday: 2500,
});
export const getAdminUsers = async () => ({ users: [TEST_ACCOUNTS.user, TEST_ACCOUNTS.admin], total: 2 });
export const toggleUserStatus = async (userId: number, action: string) => ({ success: true });
export const broadcastMessage = async (msg: string) => ({ success: true });

// ============================================
// SETTINGS
// ============================================
export const getSettings = async (userId: number) => ({
  theme: 'light', language: 'en', notifications: true,
  darkMode: false, dataSaver: false,
});
export const updateSettings = async (userId: number, settings: any) => ({ success: true });

// ============================================
// HELPERS
// ============================================
export const uploadMedia = async (file: any, type: string) => ({
  success: true, url: 'https://picsum.photos/400/400', thumbnail: 'https://picsum.photos/200/200'
});
