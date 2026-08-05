// services/i18nService.ts - Multi-language
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'en' | 'sw' | 'fr';

const translations: Record<string, Record<string, string>> = {
  en: { home: 'Home', chats: 'Chats', status: 'Status', viewOnce: 'View Once', creators: 'Creators', wallet: 'Wallet', settings: 'Settings', login: 'Sign In', signup: 'Create Account', logout: 'Logout', help: 'Help', about: 'About', search: 'Search', send: 'Send', cancel: 'Cancel', save: 'Save', delete: 'Delete', withdraw: 'Withdraw', balance: 'Balance', welcome: 'Welcome', omoka: 'Omoka!!!' },
  sw: { home: 'Nyumbani', chats: 'Mazungumzo', status: 'Hali', viewOnce: 'Tazama Mara Moja', creators: 'Waumbaji', wallet: 'Mkoba', settings: 'Mipangilio', login: 'Ingia', signup: 'Fungua Akaunti', logout: 'Toka', help: 'Msaada', about: 'Kuhusu', search: 'Tafuta', send: 'Tuma', cancel: 'Ghairi', save: 'Hifadhi', delete: 'Futa', withdraw: 'Toa Fedha', balance: 'Salio', welcome: 'Karibu', omoka: 'Omoka!!!' },
};

export const getLanguage = async (): Promise<Language> => {
  const lang = await AsyncStorage.getItem('@language');
  return (lang as Language) || 'en';
};

export const setLanguage = async (lang: Language): Promise<void> => {
  await AsyncStorage.setItem('@language', lang);
};

export const translate = async (key: string): Promise<string> => {
  const lang = await getLanguage();
  return translations[lang]?.[key] || translations.en[key] || key;
};

export const getAvailableLanguages = () => [
  { code: 'en' as Language, name: 'English', flag: '🇬🇧' },
  { code: 'sw' as Language, name: 'Kiswahili', flag: '🇰🇪' },
];
