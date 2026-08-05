// services/appLockService.ts - App Lock
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

export const setPasscode = async (passcode: string): Promise<void> => {
  await AsyncStorage.setItem('@app_passcode', passcode);
  await AsyncStorage.setItem('@app_lock_enabled', 'true');
};

export const verifyPasscode = async (passcode: string): Promise<boolean> => {
  const stored = await AsyncStorage.getItem('@app_passcode');
  return stored === passcode;
};

export const isLockEnabled = async (): Promise<boolean> => {
  const enabled = await AsyncStorage.getItem('@app_lock_enabled');
  return enabled === 'true';
};

export const authenticateWithBiometric = async (): Promise<boolean> => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Un-locka',
      fallbackLabel: 'Enter passcode',
    });
    return result.success;
  } catch { return false; }
};

export const updateLastActive = async (): Promise<void> => {
  await AsyncStorage.setItem('@last_active', Date.now().toString());
};

export const shouldLockApp = async (): Promise<boolean> => {
  const enabled = await isLockEnabled();
  if (!enabled) return false;
  
  const lastActive = await AsyncStorage.getItem('@last_active');
  if (!lastActive) return false;
  
  const elapsed = (Date.now() - parseInt(lastActive)) / 1000;
  return elapsed > 60; // Lock after 60 seconds
};
