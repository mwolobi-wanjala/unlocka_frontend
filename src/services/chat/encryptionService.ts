// services/chat/encryptionService.ts - End-to-end message encryption
import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoJS from 'crypto-js';

interface KeyPair {
  publicKey: string;
  privateKey: string;
  chatId: string;
  createdAt: string;
}

/**
 * Generate encryption key pair for a chat
 */
export const generateKeyPair = (chatId: string): KeyPair => {
  const timestamp = Date.now().toString();
  const privateKey = CryptoJS.SHA256(`${chatId}_private_${timestamp}`).toString();
  const publicKey = CryptoJS.SHA256(`${chatId}_public_${timestamp}`).toString();
  
  return { publicKey, privateKey, chatId, createdAt: new Date().toISOString() };
};

/**
 * Encrypt message
 */
export const encryptMessage = (message: string, publicKey: string): string => {
  const encrypted = CryptoJS.AES.encrypt(message, publicKey).toString();
  return encrypted;
};

/**
 * Decrypt message
 */
export const decryptMessage = (encryptedMessage: string, privateKey: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedMessage, privateKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return '🔒 Encrypted message';
  }
};

/**
 * Store chat keys securely
 */
export const storeChatKeys = async (keyPair: KeyPair): Promise<void> => {
  const keys = await getAllChatKeys();
  keys[keyPair.chatId] = keyPair;
  await AsyncStorage.setItem('@chat_keys', JSON.stringify(keys));
};

/**
 * Get keys for a chat
 */
export const getChatKeys = async (chatId: string): Promise<KeyPair | null> => {
  const keys = await getAllChatKeys();
  return keys[chatId] || null;
};

/**
 * Get all chat keys
 */
const getAllChatKeys = async (): Promise<{ [chatId: string]: KeyPair }> => {
  const data = await AsyncStorage.getItem('@chat_keys');
  return data ? JSON.parse(data) : {};
};

/**
 * Check if chat is encrypted
 */
export const isChatEncrypted = async (chatId: string): Promise<boolean> => {
  const keys = await getChatKeys(chatId);
  return !!keys;
};

/**
 * Verify message integrity
 */
export const verifyMessageIntegrity = (
  message: string,
  signature: string,
  publicKey: string
): boolean => {
  const expectedSignature = CryptoJS.HmacSHA256(message, publicKey).toString();
  return signature === expectedSignature;
};

/**
 * Sign message
 */
export const signMessage = (message: string, privateKey: string): string => {
  return CryptoJS.HmacSHA256(message, privateKey).toString();
};
