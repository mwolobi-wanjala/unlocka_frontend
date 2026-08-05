// services/themeService.ts - Dark Mode & Theme
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

export const getThemeMode = async (): Promise<ThemeMode> => {
  const mode = await AsyncStorage.getItem('@theme_mode');
  return (mode as ThemeMode) || 'light';
};

export const setThemeMode = async (mode: ThemeMode): Promise<void> => {
  await AsyncStorage.setItem('@theme_mode', mode);
  // Sync with backend
  const userId = await AsyncStorage.getItem('@user_id');
  if (userId) {
    const formData = new FormData();
    formData.append('theme', mode);
    await fetch(`http://localhost:8000/api/v1/settings/${userId}`, {
      method: 'PUT',
      body: formData,
    });
  }
};
