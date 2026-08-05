// services/notificationService.ts - Push Notifications
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:8000/api/v1/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const registerForPushNotifications = async (userId: number): Promise<string | null> => {
  if (!Device.isDevice) return null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') return null;

  const token = (await Notifications.getExpoPushTokenAsync()).data;
  
  const formData = new FormData();
  formData.append('user_id', userId.toString());
  formData.append('token', token);
  formData.append('device_type', Platform.OS);
  
  await fetch(`${API_URL}/register`, { method: 'POST', body: formData });
  return token;
};

export const getNotificationHistory = async (userId: number): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/history?user_id=${userId}`);
    const data = await response.json();
    return data.notifications || [];
  } catch { return []; }
};
