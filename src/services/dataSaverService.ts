// services/dataSaverService.ts - Data Saver Mode
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DataSaverSettings {
  enabled: boolean;
  autoPlayVideos: boolean;
  downloadOverWifiOnly: boolean;
  imageQuality: 'low' | 'medium' | 'high';
  videoQuality: 'low' | 'medium' | 'high';
  preloadContent: boolean;
}

const DEFAULT_SETTINGS: DataSaverSettings = {
  enabled: false,
  autoPlayVideos: true,
  downloadOverWifiOnly: true,
  imageQuality: 'medium',
  videoQuality: 'medium',
  preloadContent: true,
};

/**
 * Get data saver settings
 */
export const getDataSaverSettings = async (): Promise<DataSaverSettings> => {
  const data = await AsyncStorage.getItem('@data_saver');
  return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : DEFAULT_SETTINGS;
};

/**
 * Update data saver settings
 */
export const updateDataSaverSettings = async (settings: Partial<DataSaverSettings>): Promise<void> => {
  const current = await getDataSaverSettings();
  await AsyncStorage.setItem('@data_saver', JSON.stringify({ ...current, ...settings }));
};

/**
 * Check if should load high quality
 */
export const shouldLoadHighQuality = async (): Promise<boolean> => {
  const settings = await getDataSaverSettings();
  return !settings.enabled;
};
