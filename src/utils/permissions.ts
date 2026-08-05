// utils/permissions.ts - All App Permissions
import { Platform, Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import * as Camera from 'expo-camera';
import * as Audio from 'expo-av';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// PERMISSION TYPES
// ============================================
export type PermissionType = 
  | 'camera' 
  | 'gallery' 
  | 'microphone' 
  | 'contacts' 
  | 'location' 
  | 'notifications'
  | 'storage'
  | 'mediaLibrary';

export interface PermissionStatus {
  type: PermissionType;
  granted: boolean;
  canAskAgain: boolean;
  expires?: string;
}

// ============================================
// CHECK ALL PERMISSIONS
// ============================================
export const checkAllPermissions = async (): Promise<PermissionStatus[]> => {
  const permissions: PermissionStatus[] = [];
  
  // Camera
  const cameraStatus = await Camera.getCameraPermissionsAsync();
  permissions.push({ type: 'camera', granted: cameraStatus.granted, canAskAgain: cameraStatus.canAskAgain });
  
  // Gallery/Media Library
  const mediaStatus = await MediaLibrary.getPermissionsAsync();
  permissions.push({ type: 'gallery', granted: mediaStatus.granted, canAskAgain: mediaStatus.canAskAgain });
  
  // Microphone
  const micStatus = await Audio.getPermissionsAsync();
  permissions.push({ type: 'microphone', granted: micStatus.granted, canAskAgain: micStatus.canAskAgain });
  
  // Contacts
  const contactsStatus = await Contacts.getPermissionsAsync();
  permissions.push({ type: 'contacts', granted: contactsStatus.granted, canAskAgain: contactsStatus.canAskAgain });
  
  // Location
  const locationStatus = await Location.getForegroundPermissionsAsync();
  permissions.push({ type: 'location', granted: locationStatus.granted, canAskAgain: locationStatus.canAskAgain });
  
  // Notifications
  const notifStatus = await Notifications.getPermissionsAsync();
  permissions.push({ type: 'notifications', granted: notifStatus.granted, canAskAgain: notifStatus.canAskAgain });
  
  return permissions;
};

// ============================================
// REQUEST PERMISSIONS
// ============================================

// Request Camera Permission
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Camera.requestCameraPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
};

// Request Gallery/Media Library Permission
export const requestGalleryPermission = async (): Promise<boolean> => {
  try {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
};

// Request Microphone Permission
export const requestMicrophonePermission = async (): Promise<boolean> => {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
};

// Request Contacts Permission
export const requestContactsPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Contacts.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
};

// Request Location Permission
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
};

// Request Notification Permission
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
};

// ============================================
// REQUEST ALL PERMISSIONS AT ONCE
// ============================================
export const requestAllPermissions = async (): Promise<PermissionStatus[]> => {
  const results: PermissionStatus[] = [];
  
  // Request each permission
  const camera = await requestCameraPermission();
  results.push({ type: 'camera', granted: camera, canAskAgain: true });
  
  const gallery = await requestGalleryPermission();
  results.push({ type: 'gallery', granted: gallery, canAskAgain: true });
  
  const microphone = await requestMicrophonePermission();
  results.push({ type: 'microphone', granted: microphone, canAskAgain: true });
  
  const contacts = await requestContactsPermission();
  results.push({ type: 'contacts', granted: contacts, canAskAgain: true });
  
  const location = await requestLocationPermission();
  results.push({ type: 'location', granted: location, canAskAgain: true });
  
  const notifications = await requestNotificationPermission();
  results.push({ type: 'notifications', granted: notifications, canAskAgain: true });
  
  return results;
};

// ============================================
// PERMISSION-SPECIFIC ACTIONS
// ============================================

// Open Camera
export const openCamera = async (): Promise<string | null> => {
  const hasPermission = await requestCameraPermission();
  if (!hasPermission) {
    showPermissionAlert('camera');
    return null;
  }
  
  try {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
      videoMaxDuration: 60,
    });
    
    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.log('Camera error:', error);
    return null;
  }
};

// Open Gallery
export const openGallery = async (mediaType: 'photo' | 'video' | 'all' = 'all'): Promise<string | null> => {
  const hasPermission = await requestGalleryPermission();
  if (!hasPermission) {
    showPermissionAlert('gallery');
    return null;
  }
  
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: mediaType === 'video' ? ImagePicker.MediaTypeOptions.Videos :
                  mediaType === 'photo' ? ImagePicker.MediaTypeOptions.Images :
                  ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
      videoMaxDuration: 60,
    });
    
    if (!result.canceled && result.assets[0]) {
      return result.assets[0].uri;
    }
    return null;
  } catch (error) {
    console.log('Gallery error:', error);
    return null;
  }
};

// Pick Document
export const pickDocument = async (): Promise<any | null> => {
  try {
    const DocumentPicker = require('expo-document-picker');
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });
    
    if (!result.canceled && result.assets[0]) {
      return result.assets[0];
    }
    return null;
  } catch (error) {
    console.log('Document picker error:', error);
    return null;
  }
};

// Get Contacts
export const getDeviceContacts = async (): Promise<any[]> => {
  const hasPermission = await requestContactsPermission();
  if (!hasPermission) {
    showPermissionAlert('contacts');
    return [];
  }
  
  try {
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
    });
    
    return data
      .filter(c => c.phoneNumbers && c.phoneNumbers.length > 0)
      .map(c => ({
        name: c.name || 'Unknown',
        phone: c.phoneNumbers![0].number?.replace(/\D/g, '') || '',
      }));
  } catch (error) {
    console.log('Contacts error:', error);
    return [];
  }
};

// Get Current Location
export const getCurrentLocation = async (): Promise<{ latitude: number; longitude: number } | null> => {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) {
    showPermissionAlert('location');
    return null;
  }
  
  try {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.log('Location error:', error);
    return null;
  }
};

// ============================================
// PERMISSION ALERT
// ============================================
export const showPermissionAlert = (type: string): void => {
  const titles: Record<string, string> = {
    camera: 'Camera Access Required',
    gallery: 'Gallery Access Required',
    microphone: 'Microphone Access Required',
    contacts: 'Contacts Access Required',
    location: 'Location Access Required',
    notifications: 'Notification Access Required',
    storage: 'Storage Access Required',
  };
  
  const messages: Record<string, string> = {
    camera: 'Un-locka needs camera access to take photos and record videos for View Once, Status, and Creators.',
    gallery: 'Un-locka needs gallery access to select photos and videos from your device.',
    microphone: 'Un-locka needs microphone access to record voice notes and videos.',
    contacts: 'Un-locka needs contacts access to find friends who are also using the app.',
    location: 'Un-locka needs location access to share your location in chats.',
    notifications: 'Un-locka needs notification access to alert you of new messages and updates.',
    storage: 'Un-locka needs storage access to save media to your device.',
  };
  
  Alert.alert(
    titles[type] || 'Permission Required',
    messages[type] || `Un-locka needs ${type} access to function properly.`,
    [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Open Settings', 
        onPress: () => {
          if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
          } else {
            Linking.openSettings();
          }
        }
      },
    ]
  );
};

// ============================================
// CHECK IF ALL CRITICAL PERMISSIONS GRANTED
// ============================================
export const areCriticalPermissionsGranted = async (): Promise<boolean> => {
  const permissions = await checkAllPermissions();
  const critical = ['camera', 'microphone', 'contacts'];
  return permissions
    .filter(p => critical.includes(p.type))
    .every(p => p.granted);
};

// ============================================
// SAVE PERMISSION STATE
// ============================================
export const savePermissionState = async (): Promise<void> => {
  const permissions = await checkAllPermissions();
  await AsyncStorage.setItem('@permissions', JSON.stringify(permissions));
};

export const getSavedPermissionState = async (): Promise<PermissionStatus[]> => {
  const data = await AsyncStorage.getItem('@permissions');
  return data ? JSON.parse(data) : [];
};
