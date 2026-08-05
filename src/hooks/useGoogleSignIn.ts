// hooks/useGoogleSignIn.ts - Shared Google Sign-in hook
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useGoogleAuth, getGoogleUserInfo, sendGoogleTokenToBackend } from '../services/googleAuth';
import { useToast } from '../../App';

/**
 * Shared Google Sign-in hook - Works on both Home and Login screens
 */
export const useGoogleSignIn = (onSuccess?: (user: any) => void) => {
  const { showToast, showLoading, hideLoading } = useToast();
  const { request, response, promptAsync } = useGoogleAuth();

  // Handle Google response
  useEffect(() => {
    if (response?.type === 'success') {
      handleGoogleResponse(response);
    } else if (response?.type === 'error') {
      showToast('Google Sign-in cancelled');
      hideLoading();
    }
  }, [response]);

  const handleGoogleResponse = async (res: any) => {
    try {
      showLoading('Verifying with Google...');
      
      const { authentication } = res;
      
      if (!authentication?.accessToken) {
        showToast('Failed to get Google access token');
        hideLoading();
        return;
      }

      // Get user info from Google
      const userInfo = await getGoogleUserInfo(authentication.accessToken);
      
      if (!userInfo) {
        showToast('Failed to get Google user info');
        hideLoading();
        return;
      }

      // Send to backend
      const backendResponse = await sendGoogleTokenToBackend(
        authentication.accessToken,
        userInfo
      );

      if (backendResponse.success && backendResponse.user) {
        // Save session
        await AsyncStorage.setItem('session_token', backendResponse.session_token || '');
        await AsyncStorage.setItem('user_data', JSON.stringify(backendResponse.user));
        
        showToast(`Welcome, ${backendResponse.user.full_name}!`);
        
        if (onSuccess) {
          setTimeout(() => onSuccess(backendResponse.user), 1000);
        }
      } else {
        showToast(backendResponse.message || 'Google Sign-in failed');
      }
    } catch (error) {
      showToast('Error processing Google Sign-in');
    }
    hideLoading();
  };

  const handleGoogleSignIn = async () => {
    try {
      showLoading('Connecting to Google...');
      await promptAsync();
    } catch (error) {
      showToast('Failed to start Google Sign-in');
      hideLoading();
    }
  };

  return {
    handleGoogleSignIn,
    isReady: !!request,
  };
};
