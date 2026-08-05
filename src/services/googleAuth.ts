// services/googleAuth.ts - Google Sign-in Service
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthResponse } from '../types';

// Register for browser redirect
WebBrowser.maybeCompleteAuthSession();

// Google OAuth Configuration
const GOOGLE_CONFIG = {
  androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
};

const BASE_URL = 'http://localhost:8000/api/v1';

/**
 * Initialize Google Sign-in
 */
export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: GOOGLE_CONFIG.androidClientId,
    iosClientId: GOOGLE_CONFIG.iosClientId,
    webClientId: GOOGLE_CONFIG.webClientId,
    expoClientId: GOOGLE_CONFIG.expoClientId,
    scopes: ['profile', 'email'],
  });

  return { request, response, promptAsync };
};

/**
 * Send Google token to backend for verification
 */
export const sendGoogleTokenToBackend = async (
  accessToken: string,
  userInfo: any
): Promise<GoogleAuthResponse> => {
  try {
    const formData = new FormData();
    formData.append('google_token', accessToken);
    formData.append('email', userInfo.email);
    formData.append('full_name', userInfo.name || 'Google User');
    formData.append('google_id', userInfo.id);

    const response = await fetch(`${BASE_URL}/auth/google`, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return await response.json();
  } catch (error) {
    return {
      success: false,
      message: 'Failed to connect to server',
    };
  }
};

/**
 * Get Google user info from access token
 */
export const getGoogleUserInfo = async (accessToken: string) => {
  try {
    const response = await fetch(
      'https://www.googleapis.com/userinfo/v2/me',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return await response.json();
  } catch (error) {
    return null;
  }
};
