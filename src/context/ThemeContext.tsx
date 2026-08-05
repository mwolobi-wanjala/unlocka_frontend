// context/ThemeContext.tsx - Dark/Light Theme Context
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark';

interface ThemeColors {
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  primary: string;
  border: string;
  card: string;
  input: string;
  inputBg: string;
  headerBg: string;
  bottomNav: string;
  chatBg: string;
  myBubble: string;
  theirBubble: string;
  tabBar: string;
}

export const lightTheme: ThemeColors = {
  background: '#F5F5F5',
  surface: '#FFFFFF',
  text: '#212529',
  textSecondary: '#6C757D',
  primary: '#6C63FF',
  border: '#E0E0E0',
  card: '#FFFFFF',
  input: '#FFFFFF',
  inputBg: '#FFFFFF',
  headerBg: '#6C63FF',
  bottomNav: '#FFFFFF',
  chatBg: '#E5DDD5',
  myBubble: '#DCF8C6',
  theirBubble: '#FFFFFF',
  tabBar: '#FFFFFF',
};

export const darkTheme: ThemeColors = {
  background: '#121212',
  surface: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#AAAAAA',
  primary: '#8B85FF',
  border: '#333333',
  card: '#2A2A2A',
  input: '#333333',
  inputBg: '#2A2A2A',
  headerBg: '#1A1A2E',
  bottomNav: '#1E1E1E',
  chatBg: '#0D0D0D',
  myBubble: '#005C4B',
  theirBubble: '#2A2A2A',
  tabBar: '#1E1E1E',
};

interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  colors: lightTheme,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<ThemeMode>('light');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem('@app_theme');
      if (saved) {
        setTheme(saved as ThemeMode);
      }
    } catch {}
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    AsyncStorage.setItem('@app_theme', newTheme);
  };

  const setThemeMode = (mode: ThemeMode) => {
    setTheme(mode);
    AsyncStorage.setItem('@app_theme', mode);
  };

  const colors = theme === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
