// utils/mediaDownloader.ts - Media Download Utility
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DOWNLOAD_DIR = FileSystem.documentDirectory + 'downloads/';

// Ensure download directory exists
export const ensureDownloadDir = async (): Promise<void> => {
  const dirInfo = await FileSystem.getInfoAsync(DOWNLOAD_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(DOWNLOAD_DIR, { intermediates: true });
  }
};

// Track downloads
interface DownloadRecord {
  id: string;
  url: string;
  fileName: string;
  fileType: 'video' | 'image' | 'audio' | 'document';
  downloadedAt: string;
  size: number;
}

// ============================================
// DOWNLOAD MEDIA
// ============================================
export const downloadMedia = async (
  url: string,
  fileName: string,
  fileType: 'video' | 'image' | 'audio' | 'document' = 'video',
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; filePath?: string; message: string }> => {
  try {
    // Request permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Storage permission is needed to save media to your device.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => {
            if (Platform.OS === 'ios') {
              const { Linking } = require('react-native');
              Linking.openURL('app-settings:');
            } else {
              const { Linking } = require('react-native');
              Linking.openSettings();
            }
          }},
        ]
      );
      return { success: false, message: 'Storage permission denied' };
    }

    await ensureDownloadDir();

    const fileExtension = getFileExtension(url, fileType);
    const fullFileName = `${fileName.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}.${fileExtension}`;
    const filePath = DOWNLOAD_DIR + fullFileName;

    // Download with progress tracking
    const downloadResumable = FileSystem.createDownloadResumable(
      url,
      filePath,
      {},
      (downloadProgress) => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        if (onProgress) onProgress(progress);
      }
    );

    const result = await downloadResumable.downloadAsync();
    
    if (!result || !result.uri) {
      return { success: false, message: 'Download failed' };
    }

    // Save to media library (for images/videos)
    if (fileType === 'image' || fileType === 'video') {
      try {
        const asset = await MediaLibrary.createAssetAsync(result.uri);
        if (asset) {
          // Create album if needed
          const album = await MediaLibrary.getAlbumAsync('Un-locka');
          if (album) {
            await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          } else {
            await MediaLibrary.createAlbumAsync('Un-locka', asset, false);
          }
        }
      } catch (mediaError) {
        console.log('Media library save error:', mediaError);
        // File still saved to downloads folder
      }
    }

    // Save download record
    const record: DownloadRecord = {
      id: `dl_${Date.now()}`,
      url,
      fileName: fullFileName,
      fileType,
      downloadedAt: new Date().toISOString(),
      size: 0,
    };
    await saveDownloadRecord(record);

    return {
      success: true,
      filePath: result.uri,
      message: `✅ Saved to Downloads/Un-locka/${fullFileName}`,
    };
  } catch (error: any) {
    console.log('Download error:', error);
    return { success: false, message: 'Download failed: ' + error.message };
  }
};

// ============================================
// DOWNLOAD CREATOR VIDEO
// ============================================
export const downloadCreatorVideo = async (
  videoUrl: string,
  caption: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; message: string }> => {
  const fileName = `Creator_Video_${caption.slice(0, 30) || 'Untitled'}`;
  return downloadMedia(videoUrl, fileName, 'video', onProgress);
};

// ============================================
// DOWNLOAD CHAT MEDIA
// ============================================
export const downloadChatMedia = async (
  mediaUrl: string,
  mediaType: 'image' | 'video' | 'audio' | 'document',
  fileName?: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; message: string }> => {
  const name = fileName || `Chat_${mediaType}_${Date.now()}`;
  return downloadMedia(mediaUrl, name, mediaType, onProgress);
};

// ============================================
// SHARE MEDIA
// ============================================
export const shareMedia = async (filePath: string): Promise<void> => {
  try {
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(filePath);
    }
  } catch (error) {
    console.log('Share error:', error);
  }
};

// ============================================
// GET DOWNLOAD HISTORY
// ============================================
export const getDownloadHistory = async (): Promise<DownloadRecord[]> => {
  try {
    const data = await AsyncStorage.getItem('@download_history');
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

// ============================================
// SAVE DOWNLOAD RECORD
// ============================================
const saveDownloadRecord = async (record: DownloadRecord): Promise<void> => {
  try {
    const history = await getDownloadHistory();
    history.unshift(record);
    // Keep only last 100 downloads
    const trimmed = history.slice(0, 100);
    await AsyncStorage.setItem('@download_history', JSON.stringify(trimmed));
  } catch {}
};

// ============================================
// CLEAR DOWNLOADS
// ============================================
export const clearAllDownloads = async (): Promise<void> => {
  try {
    await FileSystem.deleteAsync(DOWNLOAD_DIR, { idempotent: true });
    await AsyncStorage.removeItem('@download_history');
    await ensureDownloadDir();
  } catch (error) {
    console.log('Clear downloads error:', error);
  }
};

// ============================================
// GET STORAGE USAGE
// ============================================
export const getDownloadStorageUsage = async (): Promise<string> => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(DOWNLOAD_DIR);
    if (dirInfo.exists && dirInfo.isDirectory) {
      const files = await FileSystem.readDirectoryAsync(DOWNLOAD_DIR);
      let totalSize = 0;
      for (const file of files) {
        const fileInfo = await FileSystem.getInfoAsync(DOWNLOAD_DIR + file);
        if (fileInfo.exists) {
          totalSize += (fileInfo as any).size || 0;
        }
      }
      return formatFileSize(totalSize);
    }
    return '0 MB';
  } catch {
    return '0 MB';
  }
};

// ============================================
// HELPERS
// ============================================
const getFileExtension = (url: string, fileType: string): string => {
  // Try to get extension from URL
  const match = url.match(/\.(\w+)(?:\?.*)?$/);
  if (match) return match[1];
  
  // Default extensions based on type
  const defaults: Record<string, string> = {
    video: 'mp4',
    image: 'jpg',
    audio: 'mp3',
    document: 'pdf',
  };
  return defaults[fileType] || 'file';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};
