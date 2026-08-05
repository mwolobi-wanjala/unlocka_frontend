// types/admin.ts - Admin dashboard types

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalRevenue: number;
  platformFees: number;
  totalViewOnce: number;
  totalPaidMedia: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  totalReferrals: number;
  dailyActiveUsers: number;
  newUsersToday: number;
  revenueToday: number;
}

export interface AdminUser {
  id: number;
  fullName: string;
  username: string;
  email: string;
  phone: string;
  walletBalance: number;
  totalEarned: number;
  hasPaid: boolean;
  isVerified: boolean;
  isAdmin: boolean;
  isActive: boolean;
  referralCode: string;
  referralCount: number;
  createdAt: string;
  lastLogin: string;
}

export interface AdminTransaction {
  id: string;
  userId: number;
  userName: string;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
}

export interface AdminWithdrawal {
  id: string;
  userId: number;
  userName: string;
  amount: number;
  fee: number;
  netAmount: number;
  mpesaNumber: string;
  status: string;
  requestedAt: string;
  processedAt?: string;
}

export interface AdminViewOnce {
  id: string;
  senderId: number;
  senderName: string;
  recipientId: number;
  recipientName: string;
  amount: number;
  senderCut: number;
  platformCut: number;
  status: string;
  createdAt: string;
}

export interface RevenueData {
  daily: { date: string; amount: number }[];
  weekly: { week: string; amount: number }[];
  monthly: { month: string; amount: number }[];
}

export type AdminTab = 'dashboard' | 'users' | 'transactions' | 'withdrawals' | 'viewOnce' | 'settings';

export const ADMIN_EMAILS = [
  'mwolobijavanson@gmail.com',
  'javansonwanjala@gmail.com',
];

// Additional Admin Types
export interface AdminRevenueBreakdown {
  viewOnce: number;
  paidMedia: number;
  signupFees: number;
  referralCommissions: number;
  total: number;
}

export interface AdminUserGrowth {
  daily: { date: string; count: number }[];
  weekly: { week: string; count: number }[];
  monthly: { month: string; count: number }[];
}

export interface AdminContentStats {
  totalViewOnceSent: number;
  totalViewOnceViewed: number;
  totalPaidMedia: number;
  totalPaidMediaUnlocked: number;
  avgViewOncePrice: number;
  avgPaidMediaPrice: number;
}

export interface AdminSystemHealth {
  apiStatus: 'healthy' | 'degraded' | 'down';
  databaseSize: string;
  uptime: string;
  activeConnections: number;
  errorRate: number;
  lastBackup: string;
}

export interface AdminAuditLog {
  id: string;
  action: string;
  performedBy: string;
  targetUser?: string;
  details: string;
  ipAddress: string;
  timestamp: string;
}

export interface AdminReport {
  id: string;
  type: 'user' | 'content' | 'payment';
  reportedBy: string;
  targetId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
  resolvedAt?: string;
}

export interface AdminNotification {
  id: string;
  type: 'withdrawal' | 'report' | 'signup' | 'system';
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  read: boolean;
  createdAt: string;
}

export interface AdminBackup {
  id: string;
  filename: string;
  size: string;
  type: 'full' | 'incremental';
  status: 'completed' | 'in_progress' | 'failed';
  createdAt: string;
}

// Super Admin Privileges
export interface AdminPrivilege {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: 'users' | 'content' | 'finance' | 'system' | 'security';
}

export interface AdminRole {
  id: string;
  name: string;
  permissions: string[];
  createdAt: string;
}

export interface BlockedIP {
  id: string;
  ipAddress: string;
  reason: string;
  blockedBy: string;
  blockedAt: string;
  expiresAt?: string;
}

export interface SuspiciousActivity {
  id: string;
  userId: number;
  userName: string;
  activity: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  details: string;
  detectedAt: string;
  status: 'pending' | 'investigating' | 'resolved';
}

export interface ContentModeration {
  id: string;
  contentId: string;
  contentType: 'view_once' | 'paid_media' | 'status' | 'chat';
  reportedBy: string;
  reason: string;
  status: 'pending' | 'approved' | 'removed';
  createdAt: string;
}

export interface FinancialReport {
  id: string;
  period: string;
  totalRevenue: number;
  totalWithdrawals: number;
  totalFees: number;
  netProfit: number;
  transactionCount: number;
  generatedAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  type: 'signup_bonus' | 'discount' | 'free_view';
  value: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
}

export interface AppVersion {
  id: string;
  version: string;
  platform: 'android' | 'ios' | 'both';
  updateType: 'major' | 'minor' | 'patch';
  changelog: string;
  isMandatory: boolean;
  releaseDate: string;
  downloadUrl: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}

export interface SupportTicket {
  id: string;
  userId: number;
  userName: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  targetUsers: 'all' | 'active' | 'new' | 'inactive';
  priority: 'normal' | 'important' | 'urgent';
  scheduledAt?: string;
  expiresAt?: string;
  isActive: boolean;
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'welcome' | 'verification' | 'reset_password' | 'withdrawal' | 'promo';
  lastUpdated: string;
}

// Updated Admin Privileges - No withdrawal management
export interface AdminContentAction {
  contentId: string;
  contentType: 'view_once' | 'paid_media' | 'status' | 'chat' | 'message';
  action: 'remove' | 'warn' | 'flag';
  reason: string;
  contentOwnerId: number;
  contentOwnerName: string;
  contentPreview: string;
  reportedBy?: string;
  reportReason?: string;
  status: 'pending' | 'removed' | 'warned' | 'flagged';
  createdAt: string;
}

export interface ContentWarning {
  id: string;
  userId: number;
  userName: string;
  contentId: string;
  contentType: string;
  warningType: 'first' | 'second' | 'final';
  reason: string;
  issuedBy: string;
  issuedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface RemovedContent {
  id: string;
  originalContentId: string;
  contentType: string;
  contentOwnerId: number;
  contentOwnerName: string;
  removedBy: string;
  reason: string;
  removedAt: string;
  canBeRestored: boolean;
}

export interface FlaggedContent {
  id: string;
  contentId: string;
  contentType: string;
  flagReason: string;
  flaggedBy: string;
  flaggedAt: string;
  status: 'active' | 'reviewed' | 'dismissed';
}
