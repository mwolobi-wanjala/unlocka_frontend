// services/chat/translateService.ts - In-chat message translation
import AsyncStorage from '@react-native-async-storage/async-storage';

const TRANSLATE_API = 'https://translate.googleapis.com/translate_a/single';

interface TranslationCache {
  [key: string]: { translated: string; timestamp: number };
}

// Cache translations for 24 hours
const CACHE_DURATION = 86400000;

/**
 * Translate text to target language
 */
export const translateText = async (
  text: string,
  targetLang: string = 'en'
): Promise<string> => {
  // Check cache first
  const cache = await getTranslationCache();
  const cacheKey = `${text}_${targetLang}`;
  
  if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_DURATION) {
    return cache[cacheKey].translated;
  }
  
  try {
    const response = await fetch(
      `${TRANSLATE_API}?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
    );
    const data = await response.json();
    const translated = data[0]?.map((item: any[]) => item[0]).join('') || text;
    
    // Cache result
    cache[cacheKey] = { translated, timestamp: Date.now() };
    await AsyncStorage.setItem('@translations', JSON.stringify(cache));
    
    return translated;
  } catch {
    return text;
  }
};

/**
 * Get supported languages
 */
export const getSupportedLanguages = (): { code: string; name: string }[] => [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'fr', name: 'French' },
  { code: 'es', name: 'Spanish' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'hi', name: 'Hindi' },
];

/**
 * Get translation cache
 */
const getTranslationCache = async (): Promise<TranslationCache> => {
  const data = await AsyncStorage.getItem('@translations');
  return data ? JSON.parse(data) : {};
};

/**
 * Auto-translate setting
 */
export const setAutoTranslate = async (
  chatId: string,
  enabled: boolean,
  language: string = 'en'
): Promise<void> => {
  const settings = await getAutoTranslateSettings();
  settings[chatId] = { enabled, language };
  await AsyncStorage.setItem('@auto_translate', JSON.stringify(settings));
};

export const getAutoTranslateSettings = async (): Promise<{
  [chatId: string]: { enabled: boolean; language: string }
}> => {
  const data = await AsyncStorage.getItem('@auto_translate');
  return data ? JSON.parse(data) : {};
};
