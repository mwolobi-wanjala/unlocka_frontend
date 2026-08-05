// services/chat/privacyService.ts - Privacy features
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PrivacySettings {
  hideReadReceipts: boolean;
  hideOnlineStatus: boolean;
  hideLastSeen: boolean;
  hideTyping: boolean;
  incognitoMode: boolean;
  screenshotProtection: boolean;
  autoLockTimer: number; // seconds, 0 = off
  lockCode: string | null;
}

const PRIVACY_KEY = '@privacy_settings';

const DEFAULT_SETTINGS: PrivacySettings = {
  hideReadReceipts: false,
  hideOnlineStatus: false,
  hideLastSeen: false,
  hideTyping: false,
  incognitoMode: false,
  screenshotProtection: false,
  autoLockTimer: 0,
  lockCode: null,
};

/**
 * Get privacy settings
 */
export const getPrivacySettings = async (): Promise<PrivacySettings> => {
  const data = await AsyncStorage.getItem(PRIVACY_KEY);
  return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
};

/**
 * Update privacy settings
 */
export const updatePrivacySettings = async (
  settings: Partial<PrivacySettings>
): Promise<PrivacySettings> => {
  const current = await getPrivacySettings();
  const updated = { ...current, ...settings };
  await AsyncStorage.setItem(PRIVACY_KEY, JSON.stringify(updated));
  return updated;
};

/**
 * Toggle incognito mode
 */
export const toggleIncognitoMode = async (): Promise<boolean> => {
  const settings = await getPrivacySettings();
  settings.incognitoMode = !settings.incognitoMode;
  await AsyncStorage.setItem(PRIVACY_KEY, JSON.stringify(settings));
  return settings.incognitoMode;
};

/**
 * Set chat lock code
 */
export const setLockCode = async (code: string): Promise<void> => {
  const settings = await getPrivacySettings();
  settings.lockCode = code;
  await AsyncStorage.setItem(PRIVACY_KEY, JSON.stringify(settings));
};

/**
 * Verify lock code
 */
export const verifyLockCode = async (code: string): Promise<boolean> => {
  const settings = await getPrivacySettings();
  return settings.lockCode === code;
};

/**
 * Check if app should be locked
 */
export const shouldLockApp = async (): Promise<boolean> => {
  const settings = await getPrivacySettings();
  if (settings.autoLockTimer <= 0) return false;
  
  const lastActive = await AsyncStorage.getItem('@last_active');
  if (!lastActive) return false;
  
  const elapsed = Date.now() - parseInt(lastActive);
  return elapsed > settings.autoLockTimer * 1000;
};

/**
 * Update last active timestamp
 */
export const updateLastActive = async (): Promise<void> => {
  await AsyncStorage.setItem('@last_active', Date.now().toString());
};

/**
 * Hide sensitive content in notifications
 */
export const shouldHideNotificationContent = async (): Promise<boolean> => {
  const settings = await getPrivacySettings();
  return settings.incognitoMode || settings.hideReadReceipts;
};
