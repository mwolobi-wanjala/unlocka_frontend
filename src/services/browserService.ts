// services/browserService.ts - In-App Browser for Links
import * as WebBrowser from 'expo-web-browser';

/**
 * Open link in-app
 */
export const openInAppBrowser = async (url: string): Promise<void> => {
  try {
    await WebBrowser.openBrowserAsync(url, {
      toolbarColor: '#6C63FF',
      controlsColor: '#FFFFFF',
      showTitle: true,
      enableBarCollapsing: true,
    });
  } catch (error) {
    console.log('Browser error:', error);
  }
};

/**
 * Open link externally
 */
export const openExternally = async (url: string): Promise<void> => {
  const { Linking } = require('react-native');
  await Linking.openURL(url);
};
