// utils/cameraPermissions.ts - Camera permissions helper
import { Camera } from 'expo-camera';
import { Alert, Linking } from 'react-native';

/**
 * Check and request camera permissions
 */
export const checkCameraPermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Camera.getCameraPermissionsAsync();
    
    if (status === 'granted') {
      return true;
    }
    
    if (status === 'denied') {
      const { status: newStatus } = await Camera.requestCameraPermissionsAsync();
      return newStatus === 'granted';
    }
    
    if (status === 'undetermined') {
      const { status: newStatus } = await Camera.requestCameraPermissionsAsync();
      return newStatus === 'granted';
    }
    
    return false;
  } catch (error) {
    return false;
  }
};

/**
 * Check and request microphone permissions (for video)
 */
export const checkMicrophonePermissions = async (): Promise<boolean> => {
  try {
    const { status } = await Camera.getMicrophonePermissionsAsync();
    
    if (status === 'granted') {
      return true;
    }
    
    const { status: newStatus } = await Camera.requestMicrophonePermissionsAsync();
    return newStatus === 'granted';
  } catch (error) {
    return false;
  }
};

/**
 * Show permission denied alert
 */
export const showPermissionDeniedAlert = (type: 'camera' | 'microphone'): void => {
  Alert.alert(
    `${type === 'camera' ? 'Camera' : 'Microphone'} Permission Required`,
    `Please enable ${type} access in your device settings to use this feature.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Open Settings', onPress: () => Linking.openSettings() },
    ]
  );
};

/**
 * Ensure all permissions for video recording
 */
export const ensureVideoPermissions = async (): Promise<boolean> => {
  const hasCamera = await checkCameraPermissions();
  if (!hasCamera) {
    showPermissionDeniedAlert('camera');
    return false;
  }
  
  const hasMic = await checkMicrophonePermissions();
  if (!hasMic) {
    showPermissionDeniedAlert('microphone');
    return false;
  }
  
  return true;
};
