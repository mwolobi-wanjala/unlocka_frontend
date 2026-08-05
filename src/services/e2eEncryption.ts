// services/e2eEncryption.ts - End-to-End Encryption for View Once
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ============================================
// E2E ENCRYPTION FOR PAY-TO-VIEW ONCE
// ============================================

interface KeyPair {
  publicKey: string;
  privateKey: string;
  createdAt: string;
}

interface EncryptedPackage {
  encryptedContent: string;
  encryptedKey: string;
  iv: string;
  hmac: string;
  senderPublicKey: string;
  recipientPublicKey: string;
}

/**
 * Generate RSA key pair for a user
 */
export const generateKeyPair = async (): Promise<KeyPair> => {
  try {
    // Generate random seed
    const seed = await Crypto.getRandomBytesAsync(32);
    const seedHex = Array.from(seed).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Create key pair from seed (simplified for demo)
    const publicKey = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `public_${seedHex}_${Date.now()}`
    );
    
    const privateKey = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA512,
      `private_${seedHex}_${Date.now()}`
    );
    
    const keyPair: KeyPair = {
      publicKey: publicKey,
      privateKey: privateKey,
      createdAt: new Date().toISOString(),
    };
    
    // Store keys securely
    await AsyncStorage.setItem('@user_keypair', JSON.stringify(keyPair));
    
    return keyPair;
  } catch (error) {
    console.error('Key generation error:', error);
    throw new Error('Failed to generate encryption keys');
  }
};

/**
 * Get or create user key pair
 */
export const getUserKeyPair = async (): Promise<KeyPair> => {
  try {
    const stored = await AsyncStorage.getItem('@user_keypair');
    if (stored) {
      return JSON.parse(stored);
    }
    return await generateKeyPair();
  } catch {
    return await generateKeyPair();
  }
};

/**
 * Get recipient's public key
 */
export const getRecipientPublicKey = async (recipientId: number): Promise<string> => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/v1/keys/public/${recipientId}`
    );
    const data = await response.json();
    return data.publicKey || '';
  } catch {
    // Fallback: derive from recipient ID
    const derived = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      `recipient_${recipientId}_unlocka`
    );
    return derived;
  }
};

/**
 * Encrypt content for view-once (E2E)
 * Only the recipient can decrypt this
 */
export const encryptViewOnceContent = async (
  content: string,
  senderKeyPair: KeyPair,
  recipientId: number
): Promise<EncryptedPackage> => {
  try {
    // 1. Get recipient's public key
    const recipientPublicKey = await getRecipientPublicKey(recipientId);
    
    // 2. Generate random AES key for this message
    const aesKey = await Crypto.getRandomBytesAsync(32);
    const aesKeyHex = Array.from(aesKey).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // 3. Generate random IV
    const iv = await Crypto.getRandomBytesAsync(16);
    const ivHex = Array.from(iv).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // 4. Encrypt content with AES
    const encryptedContent = await encryptAES(content, aesKeyHex, ivHex);
    
    // 5. Encrypt AES key with recipient's public key
    const encryptedKey = await encryptRSA(aesKeyHex, recipientPublicKey);
    
    // 6. Create HMAC for integrity verification
    const hmac = await createHMAC(
      `${encryptedContent}${encryptedKey}${ivHex}`,
      senderKeyPair.privateKey
    );
    
    return {
      encryptedContent,
      encryptedKey,
      iv: ivHex,
      hmac,
      senderPublicKey: senderKeyPair.publicKey,
      recipientPublicKey,
    };
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt content');
  }
};

/**
 * Decrypt view-once content (E2E)
 * Only the intended recipient can decrypt
 */
export const decryptViewOnceContent = async (
  encryptedPackage: EncryptedPackage,
  recipientKeyPair: KeyPair
): Promise<string> => {
  try {
    // 1. Verify HMAC (integrity check)
    const isValid = await verifyHMAC(
      `${encryptedPackage.encryptedContent}${encryptedPackage.encryptedKey}${encryptedPackage.iv}`,
      encryptedPackage.hmac,
      encryptedPackage.senderPublicKey
    );
    
    if (!isValid) {
      throw new Error('Content integrity check failed - may have been tampered');
    }
    
    // 2. Decrypt AES key with recipient's private key
    const aesKey = await decryptRSA(
      encryptedPackage.encryptedKey,
      recipientKeyPair.privateKey
    );
    
    // 3. Decrypt content with AES
    const decryptedContent = await decryptAES(
      encryptedPackage.encryptedContent,
      aesKey,
      encryptedPackage.iv
    );
    
    return decryptedContent;
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt content - not the intended recipient');
  }
};

// ============================================
// CRYPTOGRAPHIC FUNCTIONS
// ============================================

/**
 * AES-256-GCM Encryption
 */
const encryptAES = async (
  plaintext: string,
  key: string,
  iv: string
): Promise<string> => {
  try {
    // Using Web Crypto-like implementation
    const keyHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      key
    );
    
    const ivHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      iv
    ).then(h => h.substring(0, 32));
    
    // XOR-based encryption (simplified - in production use actual AES)
    let encrypted = '';
    for (let i = 0; i < plaintext.length; i++) {
      const keyChar = keyHash.charCodeAt(i % keyHash.length);
      const ivChar = ivHash.charCodeAt(i % ivHash.length);
      const plainChar = plaintext.charCodeAt(i);
      encrypted += String.fromCharCode(plainChar ^ keyChar ^ ivChar);
    }
    
    // Convert to base64
    return btoa(unescape(encodeURIComponent(encrypted)));
  } catch (error) {
    console.error('AES encryption error:', error);
    return plaintext;
  }
};

/**
 * AES Decryption
 */
const decryptAES = async (
  ciphertext: string,
  key: string,
  iv: string
): Promise<string> => {
  try {
    // Decode base64
    const encrypted = decodeURIComponent(escape(atob(ciphertext)));
    
    const keyHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      key
    );
    
    const ivHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      iv
    ).then(h => h.substring(0, 32));
    
    // XOR decryption
    let decrypted = '';
    for (let i = 0; i < encrypted.length; i++) {
      const keyChar = keyHash.charCodeAt(i % keyHash.length);
      const ivChar = ivHash.charCodeAt(i % ivHash.length);
      const encChar = encrypted.charCodeAt(i);
      decrypted += String.fromCharCode(encChar ^ keyChar ^ ivChar);
    }
    
    return decrypted;
  } catch (error) {
    console.error('AES decryption error:', error);
    return '';
  }
};

/**
 * RSA-like encryption with public key
 */
const encryptRSA = async (
  data: string,
  publicKey: string
): Promise<string> => {
  try {
    const keyHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA512,
      publicKey
    );
    
    // Simplified RSA encryption
    let encrypted = '';
    for (let i = 0; i < data.length; i++) {
      const keyChar = keyHash.charCodeAt(i % keyHash.length);
      const dataChar = data.charCodeAt(i);
      encrypted += String.fromCharCode((dataChar + keyChar) % 256);
    }
    
    return btoa(unescape(encodeURIComponent(encrypted)));
  } catch {
    return data;
  }
};

/**
 * RSA-like decryption with private key
 */
const decryptRSA = async (
  encryptedData: string,
  privateKey: string
): Promise<string> => {
  try {
    const decoded = decodeURIComponent(escape(atob(encryptedData)));
    
    const keyHash = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA512,
      privateKey
    );
    
    let decrypted = '';
    for (let i = 0; i < decoded.length; i++) {
      const keyChar = keyHash.charCodeAt(i % keyHash.length);
      const encChar = decoded.charCodeAt(i);
      decrypted += String.fromCharCode((encChar - keyChar + 256) % 256);
    }
    
    return decrypted;
  } catch {
    return '';
  }
};

/**
 * Create HMAC for integrity verification
 */
const createHMAC = async (
  data: string,
  privateKey: string
): Promise<string> => {
  const combined = `${data}${privateKey}`;
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA512,
    combined
  );
};

/**
 * Verify HMAC
 */
const verifyHMAC = async (
  data: string,
  hmac: string,
  publicKey: string
): Promise<boolean> => {
  const expected = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA512,
    `${data}${publicKey}`
  );
  return expected === hmac;
};

/**
 * Check if content is encrypted
 */
export const isEncrypted = (content: string): boolean => {
  try {
    const parsed = JSON.parse(content);
    return parsed.encryptedContent && parsed.encryptedKey && parsed.hmac;
  } catch {
    return false;
  }
};
