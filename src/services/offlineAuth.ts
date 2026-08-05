// services/offlineAuth.ts - Offline login support
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

interface CachedCredentials {
  username: string;
  passwordHash: string;
  lastOnlineLogin: string;
}

/**
 * Save credentials for offline login
 */
export const cacheCredentials = async (username: string, password: string): Promise<void> => {
  const data: CachedCredentials = {
    username,
    passwordHash: btoa(password), // Simple encoding (use proper encryption in production)
    lastOnlineLogin: new Date().toISOString(),
  };
  await AsyncStorage.setItem('cached_creds', JSON.stringify(data));
};

/**
 * Attempt offline login
 */
export const offlineLogin = async (username: string, password: string): Promise<boolean> => {
  try {
    const cached = await AsyncStorage.getItem('cached_creds');
    if (!cached) return false;
    
    const creds: CachedCredentials = JSON.parse(cached);
    const encodedPassword = btoa(password);
    
    // Check network status
    const netState = await NetInfo.fetch();
    
    if (!netState.isConnected) {
      // Offline - check against cached credentials
      return creds.username === username && creds.passwordHash === encodedPassword;
    }
    
    return false; // Online - use normal login
  } catch {
    return false;
  }
};

/**
 * Check if offline login is available
 */
export const isOfflineLoginAvailable = async (): Promise<boolean> => {
  const cached = await AsyncStorage.getItem('cached_creds');
  return !!cached;
};

/**
 * Get last online login time
 */
export const getLastOnlineLogin = async (): Promise<string | null> => {
  const cached = await AsyncStorage.getItem('cached_creds');
  if (!cached) return null;
  const creds: CachedCredentials = JSON.parse(cached);
  return creds.lastOnlineLogin;
};
