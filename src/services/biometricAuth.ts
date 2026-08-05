// services/biometricAuth.ts - Fingerprint/Face ID Authentication
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Check if device supports biometric authentication
 */
export const checkBiometricSupport = async (): Promise<{
  available: boolean;
  type: string;
  error?: string;
}> => {
  try {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    if (!compatible) {
      return { available: false, type: 'none', error: 'Device does not support biometrics' };
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      return { available: false, type: 'none', error: 'No fingerprints/face enrolled' };
    }

    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const typeNames = types.map(t => {
      switch (t) {
        case LocalAuthentication.AuthenticationType.FINGERPRINT: return 'Fingerprint';
        case LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION: return 'Face ID';
        case LocalAuthentication.AuthenticationType.IRIS: return 'Iris';
        default: return 'Biometric';
      }
    });

    return { available: true, type: typeNames.join(', ') };
  } catch (error) {
    return { available: false, type: 'none', error: 'Error checking biometrics' };
  }
};

/**
 * Authenticate using biometrics
 */
export const authenticateWithBiometrics = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Unlock Un-locka',
      fallbackLabel: 'Use password instead',
      disableDeviceFallback: false,
      cancelLabel: 'Cancel',
    });

    if (result.success) {
      return { success: true, message: 'Authenticated successfully!' };
    } else {
      return { success: false, message: result.error || 'Authentication failed' };
    }
  } catch (error) {
    return { success: false, message: 'Biometric authentication failed' };
  }
};

/**
 * Save biometric preference
 */
export const enableBiometricLogin = async (sessionToken: string): Promise<void> => {
  await AsyncStorage.setItem('biometric_enabled', 'true');
  await AsyncStorage.setItem('biometric_session', sessionToken);
};

/**
 * Disable biometric login
 */
export const disableBiometricLogin = async (): Promise<void> => {
  await AsyncStorage.removeItem('biometric_enabled');
  await AsyncStorage.removeItem('biometric_session');
};

/**
 * Check if biometric login is enabled
 */
export const isBiometricEnabled = async (): Promise<boolean> => {
  const enabled = await AsyncStorage.getItem('biometric_enabled');
  return enabled === 'true';
};
