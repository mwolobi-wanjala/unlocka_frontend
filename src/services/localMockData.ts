// services/localMockData.ts - Local mock data (No backend required)
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// TEST ACCOUNTS
// ============================================
export const TEST_ACCOUNTS = {
  user: {
    id: 1,
    fullName: 'User Test',
    username: 'user_test',
    email: 'usertest@unlocka.app',
    password: 'Test1234',
    phone: '0712345678',
    referralCode: 'USER1234',
    walletBalance: 500,
    totalEarned: 1200,
    hasPaid: true,
    isVerified: true,
    isAdmin: false,
  },
  admin: {
    id: 2,
    fullName: 'Admin Test',
    username: 'admin_test',
    email: 'admintest@unlocka.app',
    password: 'Test1234',
    phone: '0798765432',
    referralCode: 'ADMIN123',
    walletBalance: 999999,
    totalEarned: 5000,
    hasPaid: true,
    isVerified: true,
    isAdmin: true,
  },
};

// ============================================
// MOCK CHAT DATA
// ============================================
export const MOCK_CHATS = [
  {
    id: 'chat_1',
    type: 'individual',
    name: 'Admin Test',
    participants: [
      { id: 2, name: 'Admin Test', isOnline: true, isAdmin: true },
    ],
    lastMessage: {
      id: 'msg_6',
      type: 'text',
      content: "That's cool! I'll try it out 🚀",
      status: 'read',
      timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    unreadCount: 0,
    muted: false,
    pinned: false,
    archived: false,
  },
];

export const MOCK_MESSAGES = [
  { id: 'msg_1', chatId: 'chat_1', senderId: 2, senderName: 'Admin Test', type: 'text', content: "Hey! Welcome to Un-locka! 👋", status: 'read', timestamp: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: 'msg_2', chatId: 'chat_1', senderId: 1, senderName: 'User Test', type: 'text', content: "Thanks! This app looks amazing! 🔥", status: 'read', timestamp: new Date(Date.now() - 25 * 60000).toISOString() },
  { id: 'msg_3', chatId: 'chat_1', senderId: 2, senderName: 'Admin Test', type: 'text', content: "Have you tried View Once yet?", status: 'read', timestamp: new Date(Date.now() - 20 * 60000).toISOString() },
  { id: 'msg_4', chatId: 'chat_1', senderId: 1, senderName: 'User Test', type: 'text', content: "Not yet, how does it work? 💎", status: 'read', timestamp: new Date(Date.now() - 15 * 60000).toISOString() },
  { id: 'msg_5', chatId: 'chat_1', senderId: 2, senderName: 'Admin Test', type: 'text', content: "You can send photos/videos that people pay to view!", status: 'read', timestamp: new Date(Date.now() - 10 * 60000).toISOString() },
  { id: 'msg_6', chatId: 'chat_1', senderId: 1, senderName: 'User Test', type: 'text', content: "That's cool! I'll try it out 🚀", status: 'read', timestamp: new Date(Date.now() - 5 * 60000).toISOString() },
];

// ============================================
// MOCK VIEW ONCE DATA
// ============================================
export const MOCK_VIEW_ONCE = [
  {
    id: 'vo_1',
    senderId: 2,
    senderName: 'Admin Test',
    recipientId: 1,
    recipientName: 'User Test',
    recipientPhone: '0712345678',
    type: 'image',
    content: '🔒 Pay to view',
    caption: 'Check out this exclusive photo! 📸',
    amount: 50,
    senderCut: 45,
    platformCut: 5,
    status: 'pending',
    direction: 'received',
    isEncrypted: true,
    expiresAt: new Date(Date.now() + 48 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 60 * 60000).toISOString(),
  },
  {
    id: 'vo_2',
    senderId: 1,
    senderName: 'User Test',
    recipientId: 2,
    recipientName: 'Admin Test',
    recipientPhone: '0798765432',
    type: 'video',
    content: '🔒 Pay to view',
    caption: 'Behind the scenes footage 🎬',
    amount: 100,
    senderCut: 90,
    platformCut: 10,
    status: 'paid',
    direction: 'sent',
    isEncrypted: true,
    expiresAt: new Date(Date.now() + 24 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 120 * 60000).toISOString(),
  },
  {
    id: 'vo_3',
    senderId: 2,
    senderName: 'Admin Test',
    recipientId: 1,
    recipientName: 'User Test',
    recipientPhone: '0712345678',
    type: 'image',
    content: '🔒 Pay to view',
    caption: 'Premium content 💎',
    amount: 200,
    senderCut: 180,
    platformCut: 20,
    status: 'viewed',
    direction: 'received',
    isEncrypted: true,
    expiresAt: new Date(Date.now() + 12 * 3600000).toISOString(),
    createdAt: new Date(Date.now() - 180 * 60000).toISOString(),
  },
];

// ============================================
// MOCK WALLET DATA
// ============================================
export const MOCK_WALLET = {
  balance: 500,
  totalEarned: 1200,
  totalWithdrawn: 700,
  pendingBalance: 0,
  currency: 'KSH',
  lastUpdated: new Date().toISOString(),
};

export const MOCK_TRANSACTIONS = [
  { id: 'txn_1', type: 'signup_fee', amount: 40, balanceBefore: 0, balanceAfter: 0, description: 'Signup fee payment', status: 'completed', createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'txn_2', type: 'referral', amount: 20, balanceBefore: 0, balanceAfter: 20, description: 'Referral bonus - Jane Doe', status: 'completed', createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: 'txn_3', type: 'view_once', amount: 45, balanceBefore: 20, balanceAfter: 65, description: 'View once earnings', status: 'completed', createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'txn_4', type: 'view_once', amount: 90, balanceBefore: 65, balanceAfter: 155, description: 'View once earnings', status: 'completed', createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
];

// ============================================
// MOCK STATUS DATA
// ============================================
export const MOCK_STATUSES = {
  myStatuses: [
    {
      id: 'status_1',
      userId: 1,
      userName: 'User Test',
      type: 'text',
      content: 'Testing out Un-locka Status! 📊',
      backgroundColor: '#6C63FF',
      textColor: '#FFFFFF',
      viewCount: 5,
      isViewed: false,
      expiresAt: new Date(Date.now() + 20 * 3600000).toISOString(),
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    },
  ],
  friendsStatuses: [
    {
      userId: 2,
      userName: 'Admin Test',
      isOnline: true,
      statuses: [
        {
          id: 'status_2',
          userId: 2,
          userName: 'Admin Test',
          type: 'image',
          content: 'https://picsum.photos/400/400',
          caption: 'Welcome to Un-locka! 🎉',
          viewCount: 12,
          isViewed: false,
          expiresAt: new Date(Date.now() + 20 * 3600000).toISOString(),
          createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        },
      ],
      hasUnviewed: true,
      latestTimestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    },
  ],
};

// ============================================
// MOCK CREATOR DATA
// ============================================
export const MOCK_CREATOR_VIDEOS = [
  {
    id: 'cv_1',
    creatorId: 2,
    creatorName: 'Admin Test',
    videoUrl: 'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4',
    thumbnailUrl: 'https://picsum.photos/400/300',
    caption: 'Welcome to Un-locka Creators! 🎬 #unlocka',
    hashtags: ['unlocka', 'creators'],
    duration: 15,
    views: 150,
    likes: 45,
    comments: 12,
    shares: 8,
    isLiked: false,
    isSaved: false,
    isFollowing: false,
    category: 'tech',
    musicTitle: 'Omoka Anthem',
    musicArtist: 'Mwolobi',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'cv_2',
    creatorId: 1,
    creatorName: 'User Test',
    videoUrl: 'https://sample-videos.com/video321/mp4/240/big_buck_bunny_240p_1mb.mp4',
    thumbnailUrl: 'https://picsum.photos/400/301',
    caption: 'Testing out Creators tab! 🔥 #omoka',
    hashtags: ['omoka', 'unlocka'],
    duration: 10,
    views: 89,
    likes: 23,
    comments: 5,
    shares: 3,
    isLiked: true,
    isSaved: false,
    isFollowing: true,
    category: 'comedy',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
];

// ============================================
// MOCK REFERRAL DATA
// ============================================
export const MOCK_REFERRAL = {
  referralCode: 'USER1234',
  referralLink: 'https://unlocka.app/ref/USER1234',
  totalReferrals: 3,
  totalEarnings: 60,
  recentReferrals: [
    { id: 3, name: 'Jane Doe', joinedAt: new Date(Date.now() - 5 * 86400000).toISOString(), earnings: 20, status: 'active' },
    { id: 4, name: 'John Smith', joinedAt: new Date(Date.now() - 3 * 86400000).toISOString(), earnings: 20, status: 'active' },
    { id: 5, name: 'Alice Wanjiku', joinedAt: new Date(Date.now() - 1 * 86400000).toISOString(), earnings: 20, status: 'pending' },
  ],
};

// ============================================
// MOCK LOGIN FUNCTION
// ============================================
export const mockLogin = async (email: string, password: string): Promise<any> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const accounts = [TEST_ACCOUNTS.user, TEST_ACCOUNTS.admin];
  const account = accounts.find(a => a.email === email && a.password === password);
  
  if (account) {
    const sessionToken = `mock_session_${account.id}_${Date.now()}`;
    await AsyncStorage.setItem('session_token', sessionToken);
    await AsyncStorage.setItem('user_data', JSON.stringify(account));
    
    return {
      success: true,
      data: {
        user: account,
        tokens: { session_token: sessionToken },
      },
      message: `Welcome back, ${account.fullName}!`,
    };
  }
  
  return {
    success: false,
    message: 'Invalid credentials. Try usertest@unlocka.app / Test1234',
  };
};

// ============================================
// MOCK SIGNUP FUNCTION
// ============================================
export const mockSignup = async (data: any): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const newUser = {
    id: Math.floor(Math.random() * 1000) + 10,
    fullName: data.full_name,
    username: data.username,
    email: data.email,
    phone: data.phone,
    referralCode: 'NEW' + Math.random().toString(36).substring(2, 8).toUpperCase(),
    walletBalance: 0,
    totalEarned: 0,
    hasPaid: false,
    isVerified: false,
    isAdmin: false,
  };
  
  return {
    success: true,
    user: newUser,
    message: 'Account created! Omoka!!!',
  };
};

// Initialize local mock data
export const initLocalMockData = async (): Promise<void> => {
  const initialized = await AsyncStorage.getItem('@mock_data_initialized');
  if (!initialized) {
    await AsyncStorage.setItem('@mock_data_initialized', 'true');
    console.log('✅ Local mock data initialized');
  }
};

// Mock Status Data
export const MOCK_STATUSES_DATA = {
  myStatuses: [
    {
      id: 'my_status_1',
      userId: 1,
      userName: 'You',
      type: 'text',
      content: 'Hello Un-locka! 👋',
      backgroundColor: '#6C63FF',
      textColor: '#FFFFFF',
      viewCount: 5,
      isViewed: false,
      privacy: 'all',
      views: [],
      reactions: [],
      duration: 30,
      expiresAt: new Date(Date.now() + 20 * 3600000).toISOString(),
      createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
    },
  ],
  friendsStatuses: [
    {
      userId: 2,
      userName: 'Admin Test',
      isOnline: true,
      hasUnviewed: true,
      latestTimestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
      statuses: [
        {
          id: 'status_1',
          userId: 2,
          userName: 'Admin Test',
          type: 'image',
          content: 'https://picsum.photos/400/400',
          caption: 'Welcome to Un-locka! 🎉',
          viewCount: 12,
          isViewed: false,
          privacy: 'all',
          views: [],
          reactions: [],
          duration: 30,
          expiresAt: new Date(Date.now() + 20 * 3600000).toISOString(),
          createdAt: new Date(Date.now() - 2 * 3600000).toISOString(),
        },
        {
          id: 'status_2',
          userId: 2,
          userName: 'Admin Test',
          type: 'text',
          content: 'New features coming soon! 🚀',
          backgroundColor: '#FF6584',
          textColor: '#FFFFFF',
          viewCount: 8,
          isViewed: false,
          privacy: 'all',
          views: [],
          reactions: [],
          duration: 30,
          expiresAt: new Date(Date.now() + 18 * 3600000).toISOString(),
          createdAt: new Date(Date.now() - 6 * 3600000).toISOString(),
        },
      ],
    },
    {
      userId: 3,
      userName: 'Jane Doe',
      isOnline: false,
      hasUnviewed: false,
      latestTimestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
      statuses: [
        {
          id: 'status_3',
          userId: 3,
          userName: 'Jane Doe',
          type: 'image',
          content: 'https://picsum.photos/400/401',
          caption: 'Beautiful day! ☀️',
          viewCount: 3,
          isViewed: true,
          privacy: 'all',
          views: [],
          reactions: [],
          duration: 30,
          expiresAt: new Date(Date.now() + 4 * 3600000).toISOString(),
          createdAt: new Date(Date.now() - 20 * 3600000).toISOString(),
        },
      ],
    },
  ],
};
