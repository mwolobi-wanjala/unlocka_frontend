// services/adminService.ts - Admin Service (No withdrawal management)
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AdminStats, AdminUser, AdminTransaction,
  AdminContentAction, ContentWarning, RemovedContent, FlaggedContent,
} from '../types/admin';

const API_URL = 'http://localhost:8000/api/v1/admin';

// ============================================
// CORE ADMIN FUNCTIONS
// ============================================

export const verifyAdminAccess = async (email: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/verify?email=${encodeURIComponent(email)}`);
    const data = await response.json();
    return data.isAdmin === true;
  } catch {
    return false;
  }
};

export const getAdminStats = async (): Promise<AdminStats> => {
  try {
    const response = await fetch(`${API_URL}/stats`);
    return await response.json();
  } catch {
    return getDefaultStats();
  }
};

export const getAdminUsers = async (page: number = 1, search?: string, filter?: string): Promise<{ users: AdminUser[]; total: number }> => {
  try {
    let url = `${API_URL}/users?page=${page}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (filter) url += `&filter=${filter}`;
    const response = await fetch(url);
    return await response.json();
  } catch {
    return { users: [], total: 0 };
  }
};

export const toggleUserStatus = async (userId: number, action: 'activate' | 'deactivate' | 'suspend'): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('action', action);
    const response = await fetch(`${API_URL}/users/toggle-status`, { method: 'POST', body: formData });
    return response.ok;
  } catch {
    return false;
  }
};

export const getAdminTransactions = async (page: number = 1, type?: string): Promise<{ transactions: AdminTransaction[]; total: number }> => {
  try {
    let url = `${API_URL}/transactions?page=${page}`;
    if (type) url += `&type=${type}`;
    const response = await fetch(url);
    return await response.json();
  } catch {
    return { transactions: [], total: 0 };
  }
};

// ============================================
// CONTENT MODERATION (REMOVE/WARN ONLY)
// ============================================

/**
 * Get content moderation queue
 */
export const getModerationQueue = async (): Promise<AdminContentAction[]> => {
  try {
    const response = await fetch(`${API_URL}/moderation/queue`);
    const data = await response.json();
    return data.items || [];
  } catch {
    return [];
  }
};

/**
 * Remove content
 */
export const removeContent = async (contentId: string, contentType: string, reason: string): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('content_id', contentId);
    formData.append('content_type', contentType);
    formData.append('action', 'remove');
    formData.append('reason', reason);
    
    const response = await fetch(`${API_URL}/moderation/action`, { method: 'POST', body: formData });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Warn user about content
 */
export const warnContent = async (contentId: string, contentType: string, userId: number, reason: string): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('content_id', contentId);
    formData.append('content_type', contentType);
    formData.append('user_id', userId.toString());
    formData.append('action', 'warn');
    formData.append('reason', reason);
    
    const response = await fetch(`${API_URL}/moderation/action`, { method: 'POST', body: formData });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Flag content for review
 */
export const flagContent = async (contentId: string, contentType: string, reason: string): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('content_id', contentId);
    formData.append('content_type', contentType);
    formData.append('action', 'flag');
    formData.append('reason', reason);
    
    const response = await fetch(`${API_URL}/moderation/action`, { method: 'POST', body: formData });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get content warnings for a user
 */
export const getUserWarnings = async (userId: number): Promise<ContentWarning[]> => {
  try {
    const response = await fetch(`${API_URL}/moderation/warnings/${userId}`);
    const data = await response.json();
    return data.warnings || [];
  } catch {
    return [];
  }
};

/**
 * Get removed content history
 */
export const getRemovedContent = async (): Promise<RemovedContent[]> => {
  try {
    const response = await fetch(`${API_URL}/moderation/removed`);
    const data = await response.json();
    return data.removed || [];
  } catch {
    return [];
  }
};

/**
 * Restore removed content
 */
export const restoreContent = async (contentId: string): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('content_id', contentId);
    
    const response = await fetch(`${API_URL}/moderation/restore`, { method: 'POST', body: formData });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get flagged content
 */
export const getFlaggedContent = async (): Promise<FlaggedContent[]> => {
  try {
    const response = await fetch(`${API_URL}/moderation/flagged`);
    const data = await response.json();
    return data.flagged || [];
  } catch {
    return [];
  }
};

// ============================================
// BROADCAST & ANNOUNCEMENTS
// ============================================

export const broadcastMessage = async (message: string, target: 'all' | 'active' | 'inactive'): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('message', message);
    formData.append('target', target);
    const response = await fetch(`${API_URL}/broadcast`, { method: 'POST', body: formData });
    return response.ok;
  } catch {
    return false;
  }
};

// ============================================
// FORCE ACTIONS
// ============================================

export const forceLogoutUser = async (userId: number): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    const response = await fetch(`${API_URL}/force/logout`, { method: 'POST', body: formData });
    return response.ok;
  } catch {
    return false;
  }
};

export const deleteUserAccount = async (userId: number, reason: string): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('reason', reason);
    const response = await fetch(`${API_URL}/force/delete-user`, { method: 'POST', body: formData });
    return response.ok;
  } catch {
    return false;
  }
};

const getDefaultStats = (): AdminStats => ({
  totalUsers: 0, activeUsers: 0, totalRevenue: 0,
  platformFees: 0, totalViewOnce: 0, totalPaidMedia: 0,
  totalWithdrawals: 0, pendingWithdrawals: 0,
  totalReferrals: 0, dailyActiveUsers: 0,
  newUsersToday: 0, revenueToday: 0,
});

// ============================================
// USER IMPERSONATION
// ============================================

/**
 * Impersonate a user (view app as that user)
 */
export const impersonateUser = async (userId: number): Promise<{ success: boolean; token?: string }> => {
  try {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    
    const response = await fetch(`${API_URL}/impersonate`, {
      method: 'POST',
      body: formData,
    });
    return await response.json();
  } catch {
    return { success: false };
  }
};

/**
 * End impersonation
 */
export const endImpersonation = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/impersonate/end`, { method: 'POST' });
    return response.ok;
  } catch {
    return false;
  }
};

// ============================================
// BULK OPERATIONS
// ============================================

/**
 * Bulk activate/deactivate users
 */
export const bulkUserAction = async (
  userIds: number[],
  action: 'activate' | 'deactivate' | 'delete'
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('user_ids', JSON.stringify(userIds));
    formData.append('action', action);
    
    const response = await fetch(`${API_URL}/users/bulk-action`, {
      method: 'POST',
      body: formData,
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Bulk send notification
 */
export const bulkNotifyUsers = async (
  userIds: number[],
  title: string,
  message: string
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('user_ids', JSON.stringify(userIds));
    formData.append('title', title);
    formData.append('message', message);
    
    const response = await fetch(`${API_URL}/users/bulk-notify`, {
      method: 'POST',
      body: formData,
    });
    return response.ok;
  } catch {
    return false;
  }
};

// ============================================
// RATE LIMITING
// ============================================

/**
 * Set rate limits for user
 */
export const setUserRateLimit = async (
  userId: number,
  maxRequests: number,
  windowMinutes: number
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('max_requests', maxRequests.toString());
    formData.append('window_minutes', windowMinutes.toString());
    
    const response = await fetch(`${API_URL}/security/rate-limit`, {
      method: 'POST',
      body: formData,
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Remove rate limit
 */
export const removeUserRateLimit = async (userId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/security/rate-limit/${userId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch {
    return false;
  }
};

// ============================================
// FEATURE FLAGS
// ============================================

/**
 * Toggle feature for specific user
 */
export const toggleFeatureForUser = async (
  userId: number,
  feature: string,
  enabled: boolean
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    formData.append('feature', feature);
    formData.append('enabled', enabled.toString());
    
    const response = await fetch(`${API_URL}/features/toggle`, {
      method: 'POST',
      body: formData,
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Toggle global feature
 */
export const toggleGlobalFeature = async (
  feature: string,
  enabled: boolean
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('feature', feature);
    formData.append('enabled', enabled.toString());
    
    const response = await fetch(`${API_URL}/features/global-toggle`, {
      method: 'POST',
      body: formData,
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get feature flags
 */
export const getFeatureFlags = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/features/list`);
    const data = await response.json();
    return data.features || [];
  } catch {
    return [];
  }
};

// ============================================
// DATA RETENTION
// ============================================

/**
 * Set data retention period
 */
export const setDataRetention = async (
  dataType: string,
  days: number
): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('data_type', dataType);
    formData.append('days', days.toString());
    
    const response = await fetch(`${API_URL}/settings/retention`, {
      method: 'POST',
      body: formData,
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Purge old data
 */
export const purgeOldData = async (dataType: string): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('data_type', dataType);
    
    const response = await fetch(`${API_URL}/settings/purge`, {
      method: 'POST',
      body: formData,
    });
    return response.ok;
  } catch {
    return false;
  }
};

// ============================================
// API KEYS
// ============================================

/**
 * Generate API key for user
 */
export const generateUserAPIKey = async (userId: number): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('user_id', userId.toString());
    
    const response = await fetch(`${API_URL}/api-keys/generate`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data.apiKey || null;
  } catch {
    return null;
  }
};

/**
 * Revoke API key
 */
export const revokeUserAPIKey = async (userId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/api-keys/revoke/${userId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch {
    return false;
  }
};

// ============================================
// SESSION MANAGEMENT
// ============================================

/**
 * View all active sessions
 */
export const getActiveSessions = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/sessions/active`);
    const data = await response.json();
    return data.sessions || [];
  } catch {
    return [];
  }
};

/**
 * Terminate specific session
 */
export const terminateSession = async (sessionId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/sessions/terminate/${sessionId}`, {
      method: 'DELETE',
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Terminate all sessions except current
 */
export const terminateAllSessions = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/sessions/terminate-all`, {
      method: 'POST',
    });
    return response.ok;
  } catch {
    return false;
  }
};

// ============================================
// ADVANCED SEARCH
// ============================================

/**
 * Search all content
 */
export const searchAllContent = async (
  query: string,
  type?: string,
  dateFrom?: string,
  dateTo?: string
): Promise<any[]> => {
  try {
    let url = `${API_URL}/search/content?q=${encodeURIComponent(query)}`;
    if (type) url += `&type=${type}`;
    if (dateFrom) url += `&date_from=${dateFrom}`;
    if (dateTo) url += `&date_to=${dateTo}`;
    
    const response = await fetch(url);
    const data = await response.json();
    return data.results || [];
  } catch {
    return [];
  }
};

/**
 * Search users by criteria
 */
export const searchUsersByCriteria = async (criteria: {
  minBalance?: number;
  maxBalance?: number;
  joinedAfter?: string;
  joinedBefore?: string;
  hasReferrals?: boolean;
  isVerified?: boolean;
}): Promise<any[]> => {
  try {
    const params = new URLSearchParams();
    Object.entries(criteria).forEach(([key, value]) => {
      if (value !== undefined) params.append(key, value.toString());
    });
    
    const response = await fetch(`${API_URL}/search/users?${params.toString()}`);
    const data = await response.json();
    return data.users || [];
  } catch {
    return [];
  }
};

// ============================================
// SYSTEM LOGS
// ============================================

/**
 * Get system logs
 */
export const getSystemLogs = async (
  level?: 'info' | 'warning' | 'error' | 'critical',
  limit: number = 100
): Promise<any[]> => {
  try {
    let url = `${API_URL}/logs?limit=${limit}`;
    if (level) url += `&level=${level}`;
    
    const response = await fetch(url);
    const data = await response.json();
    return data.logs || [];
  } catch {
    return [];
  }
};

/**
 * Clear old logs
 */
export const clearOldLogs = async (daysOld: number): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('days_old', daysOld.toString());
    
    const response = await fetch(`${API_URL}/logs/clear`, {
      method: 'POST',
      body: formData,
    });
    return response.ok;
  } catch {
    return false;
  }
};

// ============================================
// PERFORMANCE
// ============================================

/**
 * Get performance metrics
 */
export const getPerformanceMetrics = async (): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/performance/metrics`);
    return await response.json();
  } catch {
    return {};
  }
};

/**
 * Clear cache
 */
export const clearAppCache = async (cacheType: 'all' | 'users' | 'content' | 'sessions'): Promise<boolean> => {
  try {
    const formData = new FormData();
    formData.append('cache_type', cacheType);
    
    const response = await fetch(`${API_URL}/performance/clear-cache`, {
      method: 'POST',
      body: formData,
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Optimize database
 */
export const optimizeDatabase = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/performance/optimize-db`, {
      method: 'POST',
    });
    return response.ok;
  } catch {
    return false;
  }
};
